import React, { useEffect, useMemo, useRef, useState } from "react";

const BACKEND_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTextMatch(query, text) {
  const q = normalize(query);
  const t = normalize(text);
  if (!q || !t) return 0;
  if (t.includes(q)) return 10;
  const qWords = q.split(" ").filter(Boolean);
  let score = 0;
  for (const w of qWords) {
    if (w.length < 3) continue;
    if (t.includes(w)) score += 2;
  }
  return score;
}

function localBrain({ query, pages, books, currentBook }) {
  const q = normalize(query);
  const actions = [];

  const addNavigate = (title) => {
    const page = pages.find((p) => normalize(p.title) === normalize(title));
    if (page) actions.push({ type: "navigate", title: page.title });
  };

  if (/(bookmark|bookmarks|saved)/.test(q)) addNavigate("Bookmarks");
  if (/(profile|account|my info)/.test(q)) addNavigate("Profile");
  if (/(library|all books|catalog)/.test(q)) addNavigate("Library");
  if (/(dashboard|stats|progress)/.test(q)) addNavigate("Dashboard");

  let bestBook = null;
  let bestScore = 0;
  for (const b of books || []) {
    const s =
      scoreTextMatch(query, b.title) +
      scoreTextMatch(query, b.author) +
      scoreTextMatch(query, b.category);
    if (s > bestScore) {
      bestScore = s;
      bestBook = b;
    }
  }

  const wantsToRead = /(read|open|start|recommend|suggest|give me|looking for)/.test(q);
  if (wantsToRead && bestBook && bestScore >= 2) {
    actions.unshift({ type: "openBook", book: bestBook });
  }

  if (currentBook && /(this book|this|here|in this book)/.test(q)) {
    return {
      reply:
        "Tell me what you’re trying to find and I’ll help. I can also bookmark this moment for you or take you to related books in the Library.",
      actions
    };
  }

  if (actions.some((a) => a.type === "openBook")) {
    const b = actions.find((a) => a.type === "openBook")?.book;
    return {
      reply: `I found something that matches: “${b?.title}”. Want me to open it?`,
      actions
    };
  }

  if (actions.some((a) => a.type === "navigate")) {
    const nav = actions.find((a) => a.type === "navigate");
    return {
      reply: `I can take you to **${nav.title}**. Want to go there?`,
      actions
    };
  }

  return {
    reply:
      "Tell me what you want to read (topic, author, category), or ask where to find something (Library, Bookmarks, Profile).",
    actions
  };
}

async function tryServerBrain({ messages, pages, books, currentBook }) {
  try {
    const res = await fetch("/api/librarian-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        context: {
          pages,
          books: (books || []).slice(0, 50).map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            category: b.category
          })),
          currentBook: currentBook
            ? { id: currentBook.id, title: currentBook.title, author: currentBook.author, category: currentBook.category }
            : null
        }
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data.reply !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export default function AiLibrarianWidget({
  mode = "dashboard",
  currentBook = null,
  onNavigate,
  onOpenBook
}) {
  const pages = useMemo(
    () => [
      { title: "Dashboard" },
      { title: "Library" },
      { title: "Bookmarks" },
      { title: "Profile" }
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [books, setBooks] = useState([]);
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content:
        mode === "reader"
          ? "I’m your AI Librarian. Ask me a question about what you’re looking for and I’ll direct you to the right place."
          : "I’m your AI Librarian. Tell me what you want to read and I’ll open the best match."
    }
  ]);

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/books`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const mapped = (data || []).map((b) => ({
          ...b,
          file: b.file ? `${BACKEND_BASE}${b.file}` : b.file,
          thumbnail: b.thumbnail ? `${BACKEND_BASE}${b.thumbnail}` : null
        }));
        setBooks(mapped);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const runActions = (actions = []) => {
    for (const a of actions) {
      if (a.type === "navigate" && onNavigate) onNavigate(a.title);
      if (a.type === "openBook" && onOpenBook && a.book) onOpenBook(a.book);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    const server = await tryServerBrain({ messages: nextMessages, pages, books, currentBook });
    const result =
      server ||
      localBrain({
        query: text,
        pages,
        books,
        currentBook
      });

    setMessages((prev) => [...prev, { role: "assistant", content: result.reply, actions: result.actions || [] }]);
    setSending(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full shadow-lg bg-[#1F3D2B] text-white px-4 py-3 hover:bg-[#2A4A3A] focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
          aria-label="Open AI librarian"
        >
          AI Librarian
        </button>
      ) : (
        <div className="w-[360px] max-w-[92vw] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#1F3D2B] text-white flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">AI Librarian</div>
              <div className="text-xs text-green-100/80">
                {mode === "reader" ? "Ask, bookmark, and explore" : "Tell me what to read"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white text-xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-[#1F3D2B] text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.role === "assistant" && Array.isArray(m.actions) && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.slice(0, 3).map((a, i) => (
                        <button
                          key={i}
                          onClick={() => runActions([a])}
                          className="text-xs px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                        >
                          {a.type === "navigate" ? `Go to ${a.title}` : a.type === "openBook" ? "Open book" : "Action"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
                placeholder={mode === "reader" ? "Ask about this book…" : "What do you want to read?"}
              />
              <button
                onClick={send}
                disabled={sending}
                className="px-3 py-2 rounded-xl bg-[#C5A64D] text-[#1F3D2B] font-semibold hover:brightness-95 disabled:opacity-60"
              >
                {sending ? "…" : "Send"}
              </button>
            </div>
            <div className="mt-2 text-[11px] text-gray-500">
              Works offline with smart search; improves on Vercel when `OPENAI_API_KEY` is set.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

