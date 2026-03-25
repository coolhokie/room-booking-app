$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$stateFile = Join-Path $root "state.json"
$port = 8080
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()

Write-Host "Room reservation app running at http://localhost:$port/"
Write-Host "State file: $stateFile"
Write-Host "Press Ctrl+C to stop."

function Get-ContentType {
  param([string] $Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".css" { return "text/css; charset=utf-8" }
    ".js" { return "application/javascript; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    default { return "application/octet-stream" }
  }
}

function Send-HttpResponse {
  param(
    [Parameter(Mandatory = $true)]
    [System.IO.Stream] $Stream,
    [Parameter(Mandatory = $true)]
    [int] $StatusCode,
    [Parameter(Mandatory = $true)]
    [string] $ContentType,
    [Parameter(Mandatory = $true)]
    [byte[]] $Body
  )

  $statusText = switch ($StatusCode) {
    200 { "OK" }
    404 { "Not Found" }
    500 { "Internal Server Error" }
    default { "OK" }
  }

  $headerText = @(
    "HTTP/1.1 $StatusCode $statusText"
    "Content-Type: $ContentType"
    "Content-Length: $($Body.Length)"
    "Connection: close"
    ""
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerText)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
  $Stream.Flush()
}

function Send-OutlookMail {
  param(
    [Parameter(Mandatory = $true)]
    [pscustomobject] $Payload
  )

  $outlook = New-Object -ComObject Outlook.Application
  $mail = $outlook.CreateItem(0)
  $mail.To = $Payload.to
  $mail.Subject = $Payload.subject
  $mail.Body = $Payload.body
  $mail.Send()
}

function Get-StateJson {
  if (Test-Path $stateFile -PathType Leaf) {
    return Get-Content $stateFile -Raw
  }

  return '{"rooms":[],"bookings":[]}'
}

function Save-StateJson {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Json
  )

  Set-Content -Path $stateFile -Value $Json -Encoding UTF8
}

function Get-ByteIndex {
  param(
    [byte[]] $Buffer,
    [byte[]] $Pattern,
    [int] $Length
  )

  for ($i = 0; $i -le $Length - $Pattern.Length; $i++) {
    $matched = $true
    for ($j = 0; $j -lt $Pattern.Length; $j++) {
      if ($Buffer[$i + $j] -ne $Pattern[$j]) {
        $matched = $false
        break
      }
    }

    if ($matched) {
      return $i
    }
  }

  return -1
}

function Read-HttpRequest {
  param(
    [Parameter(Mandatory = $true)]
    [System.IO.Stream] $Stream
  )

  $headerDelimiter = [byte[]](13, 10, 13, 10)
  $buffer = New-Object byte[] 65536
  $bytesRead = 0
  $headerEnd = -1

  while ($headerEnd -lt 0) {
    $read = $Stream.Read($buffer, $bytesRead, $buffer.Length - $bytesRead)
    if ($read -le 0) {
      throw "Connection closed before request headers were fully received."
    }

    $bytesRead += $read
    $headerEnd = Get-ByteIndex -Buffer $buffer -Pattern $headerDelimiter -Length $bytesRead
  }

  $headerBytes = New-Object byte[] $headerEnd
  [Array]::Copy($buffer, 0, $headerBytes, 0, $headerEnd)
  $headerText = [System.Text.Encoding]::ASCII.GetString($headerBytes)
  $headerLines = $headerText -split "`r`n"

  $requestLine = $headerLines[0]
  $requestParts = $requestLine.Split(" ")
  $method = $requestParts[0]
  $rawPath = $requestParts[1]
  $headers = @{}

  foreach ($line in $headerLines[1..($headerLines.Length - 1)]) {
    if ([string]::IsNullOrWhiteSpace($line)) {
      continue
    }

    $separatorIndex = $line.IndexOf(":")
    if ($separatorIndex -gt 0) {
      $headerName = $line.Substring(0, $separatorIndex).Trim().ToLowerInvariant()
      $headerValue = $line.Substring($separatorIndex + 1).Trim()
      $headers[$headerName] = $headerValue
    }
  }

  $contentLength = 0
  if ($headers.ContainsKey("content-length")) {
    $contentLength = [int] $headers["content-length"]
  }

  $bodyStart = $headerEnd + $headerDelimiter.Length
  $bodyBytes = New-Object byte[] $contentLength
  $bufferedBodyLength = [Math]::Max(0, $bytesRead - $bodyStart)

  if ($bufferedBodyLength -gt 0) {
    [Array]::Copy($buffer, $bodyStart, $bodyBytes, 0, [Math]::Min($bufferedBodyLength, $contentLength))
  }

  $totalBodyRead = [Math]::Min($bufferedBodyLength, $contentLength)
  while ($totalBodyRead -lt $contentLength) {
    $read = $Stream.Read($bodyBytes, $totalBodyRead, $contentLength - $totalBodyRead)
    if ($read -le 0) {
      throw "Connection closed before request body was fully received."
    }
    $totalBodyRead += $read
  }

  return @{
    method = $method
    path = $rawPath.Split("?")[0]
    headers = $headers
    body = [System.Text.Encoding]::UTF8.GetString($bodyBytes, 0, $contentLength)
  }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $null

  try {
    $stream = $client.GetStream()
    $request = Read-HttpRequest -Stream $stream

    if ($request.method -eq "GET" -and $request.path -eq "/api/state") {
      $responseBody = [System.Text.Encoding]::UTF8.GetBytes((Get-StateJson))
      Send-HttpResponse -Stream $stream -StatusCode 200 -ContentType "application/json; charset=utf-8" -Body $responseBody
      $client.Close()
      continue
    }

    if ($request.method -eq "POST" -and ($request.path -eq "/api/state" -or $request.path -eq "/api/send-confirmation")) {
      if ($request.path -eq "/api/state") {
        Save-StateJson -Json $request.body
        $responseBody = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
        Send-HttpResponse -Stream $stream -StatusCode 200 -ContentType "application/json; charset=utf-8" -Body $responseBody
        $client.Close()
        continue
      }

      $payload = $request.body | ConvertFrom-Json
      Send-OutlookMail -Payload $payload
      $responseBody = [System.Text.Encoding]::UTF8.GetBytes('{"ok":true}')
      Send-HttpResponse -Stream $stream -StatusCode 200 -ContentType "application/json; charset=utf-8" -Body $responseBody
      $client.Close()
      continue
    }

    $relativePath = $request.path.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($relativePath)) {
      $relativePath = "index.html"
    }

    $filePath = Join-Path $root $relativePath
    if (-not (Test-Path $filePath -PathType Leaf)) {
      $notFoundBody = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      Send-HttpResponse -Stream $stream -StatusCode 404 -ContentType "text/plain; charset=utf-8" -Body $notFoundBody
      $client.Close()
      continue
    }

    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $contentType = Get-ContentType -Path $filePath
    Send-HttpResponse -Stream $stream -StatusCode 200 -ContentType $contentType -Body $fileBytes
  } catch {
    try {
      $errorMessage = if ($_.Exception.Message) { $_.Exception.Message } else { "Server error" }
      $errorBody = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
      if ($stream) {
        Send-HttpResponse -Stream $stream -StatusCode 500 -ContentType "text/plain; charset=utf-8" -Body $errorBody
      }
    } catch {
    }
  } finally {
    if ($stream) {
      $stream.Dispose()
    }
    if ($client) {
      $client.Close()
    }
  }
}
