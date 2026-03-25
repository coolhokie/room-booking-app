const STATE_KEY = "room-reservation-state";

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const state = await readState();
      return json(res, 200, state);
    }

    if (req.method === "POST") {
      const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      await writeState(payload);
      return json(res, 200, { ok: true });
    }

    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return json(res, 503, {
      error: "Server-backed state is not configured.",
      detail: error.message,
    });
  }
};

async function readState() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error("Missing KV_REST_API_URL or KV_REST_API_TOKEN.");
  }

  const response = await fetch(`${process.env.KV_REST_API_URL}/get/${STATE_KEY}`, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV read failed with status ${response.status}.`);
  }

  const payload = await response.json();
  const value = payload.result;
  if (!value) {
    return { rooms: [], bookings: [] };
  }

  return typeof value === "string" ? JSON.parse(value) : value;
}

async function writeState(state) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error("Missing KV_REST_API_URL or KV_REST_API_TOKEN.");
  }

  const response = await fetch(`${process.env.KV_REST_API_URL}/set/${STATE_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    throw new Error(`KV write failed with status ${response.status}.`);
  }
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
