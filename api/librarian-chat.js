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

  const safeJson = (s, fallback = null) => {
    try {
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  };

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const chunkText = (text, size = 1400, overlap = 200) => {
    const t = String(text || "");
    if (!t) return [];
    const out = [];
    let i = 0;
    while (i < t.length && out.length < 60) {
      out.push(t.slice(i, i + size));
      i += Math.max(1, size - overlap);
    }
    return out;
  };

  const scoreChunk = (query, chunk) => {
    const q = normalize(query);
    const c = normalize(chunk);
    if (!q || !c) return 0;
    if (c.includes(q)) return 100;
    let score = 0;
    const words = q.split(" ").filter((w) => w.length >= 4);
    for (const w of words) if (c.includes(w)) score += 6;
    return score;
  };

  async function fetchBookText(fileUrl) {
    if (!fileUrl || typeof fileUrl !== "string") return null;

    // Basic SSRF mitigation: allow only http(s)
    if (!/^https?:\/\//i.test(fileUrl)) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const r = await fetch(fileUrl, { signal: controller.signal });
      if (!r.ok) return null;

      const contentType = (r.headers.get("content-type") || "").toLowerCase();
      const buf = Buffer.from(await r.arrayBuffer());

      // Hard cap to reduce time/memory in serverless
      if (buf.length > 8 * 1024 * 1024) return null;

      const urlLower = fileUrl.toLowerCase();
      const isPdf = contentType.includes("pdf") || urlLower.endsWith(".pdf");
      const isDocx =
        contentType.includes("officedocument") ||
        urlLower.endsWith(".docx") ||
        urlLower.endsWith(".doc");

      if (isPdf) {
        const pdfParse = (await import("pdf-parse")).default;
        const parsed = await pdfParse(buf, { max: 15 }); // first ~15 pages
        return parsed?.text ? String(parsed.text) : null;
      }

      if (isDocx) {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer: buf });
        return result?.value ? String(result.value) : null;
      }

      return null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  try {
    const body = typeof req.body === "string" ? safeJson(req.body, {}) : req.body;
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const context = body?.context || {};

    const lastUserMessage =
      [...messages].reverse().find((m) => m && m.role === "user" && typeof m.content === "string")?.content || "";

    const currentBook = context.currentBook || null;
    const fileUrl = currentBook?.fileUrl || null;

    // If user is asking about an opened book, try to fetch excerpts.
    const wantsBookAnswer = !!currentBook && /chapter|summar|summary|doctrine|concept|what|explain|where|define|talk about|discuss/i.test(lastUserMessage);
    let excerpts = null;
    if (wantsBookAnswer && fileUrl) {
      const bookText = await fetchBookText(fileUrl);
      if (bookText) {
        const chunks = chunkText(bookText, 1600, 250);
        const scored = chunks
          .map((ch, idx) => ({ idx, score: scoreChunk(lastUserMessage, ch), ch }))
          .sort((a, b) => b.score - a.score);

        const wantsSummary = /summar|summary|overview|outline/i.test(normalize(lastUserMessage));
        const top = wantsSummary ? scored.slice(0, 6) : scored.slice(0, 4);

        excerpts = top
          .filter((x) => x.score > 0 || wantsSummary)
          .map((x) => `--- Excerpt ${x.idx + 1} ---\n${x.ch}`)
          .join("\n\n");
      }
    }

    const system = [
      "You are an AI librarian inside an eLibrary web app.",
      "Your job: answer the user's question. If a currentBook + excerpts are provided, answer using ONLY that content. If the answer isn't in the excerpts, say what keywords to search for in the PDF and what to look for.",
      "When asked to summarize a book, produce a structured summary.",
      "Then propose 0-3 actions to help the user navigate or open a book (optional).",
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
      JSON.stringify(context.currentBook || null),
      "",
      "Book excerpts (if available):",
      excerpts ? excerpts.slice(0, 24000) : "(none)"
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

