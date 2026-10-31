export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: "Server env missing" });
  }

  const body = req.body || {};

  const text = [
    "📩 New submission",
    `👤 Name: ${body.name || "-"}`,
    `📧 Email: ${body.email || "-"}`,
    `📱 Phone: ${body.phone || "-"}`,
    `📝 Message: ${body.message || "-"}`,
    `🕒 ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
  ].join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await tg.json();

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Telegram fetch failed" });
  }
}
