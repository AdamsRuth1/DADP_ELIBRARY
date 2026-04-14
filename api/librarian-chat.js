export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      reply:
        "AI mode isn’t configured yet. Ask me what you want to read and I’ll still help using smart search. (To enable full AI on Vercel, set OPENAI_API_KEY.)",
      actions: []
    });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const context = body?.context || {};

    const system = [
      "You are an AI librarian inside an eLibrary web app.",
      "Your job: answer briefly, then propose 0-3 actions to help the user navigate or open a book.",
      "You MUST output strict JSON with keys: reply (string), actions (array).",
      "actions items can be:",
      '- {"type":"navigate","title":"Dashboard"|"Library"|"Bookmarks"|"Profile"}',
      '- {"type":"openBook","bookId":<number>,"title":<string>} (only if you are confident it matches)',
      "",
      "Available pages:",
      JSON.stringify(context.pages || []),
      "",
      "Available books (subset):",
      JSON.stringify(context.books || []),
      "",
      "Current book (if any):",
      JSON.stringify(context.currentBook || null)
    ].join("\n");

    const openaiMessages = [
      { role: "system", content: system },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content || "")
      }))
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: openaiMessages,
        response_format: { type: "json_object" }
      })
    });

    if (!r.ok) {
      const text = await r.text();
      res.status(200).json({
        reply: "AI is temporarily unavailable. I can still help using smart search.",
        actions: [],
        debug: text.slice(0, 500)
      });
      return;
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;
    const reply = typeof parsed?.reply === "string" ? parsed.reply : "How can I help you find the right page or book?";
    const actions = Array.isArray(parsed?.actions) ? parsed.actions : [];

    res.status(200).json({ reply, actions });
  } catch (e) {
    res.status(200).json({
      reply: "AI is temporarily unavailable. I can still help using smart search.",
      actions: []
    });
  }
}

