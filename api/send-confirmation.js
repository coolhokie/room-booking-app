module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      throw new Error("Missing RESEND_API_KEY or EMAIL_FROM.");
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [payload.to],
        subject: payload.subject,
        text: payload.body,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API failed: ${errorText}`);
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 503, {
      error: "Email sending is not configured.",
      detail: error.message,
    });
  }
};

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
