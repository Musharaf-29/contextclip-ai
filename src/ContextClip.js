import { useState, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --accent: #7c6aff;
    --accent2: #ff6a9e;
    --accent3: #6affcf;
    --text: #e8e8f0;
    --text-dim: #7a7a9a;
    --text-dimmer: #3a3a5a;
    --glow: rgba(124, 106, 255, 0.15);
    --radius: 12px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px 48px;
  }

  /* HEADER */
  .header {
    padding: 32px 0 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
  }
  .logo-mark {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 18px;
    color: white; flex-shrink: 0;
    box-shadow: 0 0 20px rgba(124,106,255,0.4);
  }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; }
  .logo-text span { color: var(--accent); }
  .tagline { font-size: 12px; color: var(--text-dim); font-family: 'DM Mono', monospace; margin-left: auto; }
  .badge { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 4px 10px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent3); margin-left: 12px; }

  /* MAIN LAYOUT */
  .main { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }

  /* SIDEBAR */
  .sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .panel:hover { border-color: #3a3a5a; }

  .panel-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .panel-icon { font-size: 14px; }
  .panel-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.3px; text-transform: uppercase; color: var(--text-dim); }
  .panel-body { padding: 16px; }

  /* DROP ZONE */
  .drop-zone {
    border: 2px dashed var(--border);
    border-radius: 10px;
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .drop-zone:hover, .drop-zone.dragging {
    border-color: var(--accent);
    background: var(--glow);
  }
  .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .drop-icon { font-size: 28px; margin-bottom: 8px; }
  .drop-label { font-size: 13px; color: var(--text-dim); }
  .drop-label strong { color: var(--accent); }
  .drop-sub { font-size: 11px; color: var(--text-dimmer); margin-top: 4px; font-family: 'DM Mono', monospace; }

  /* URL INPUT */
  .url-row { display: flex; gap: 8px; }
  .url-input {
    flex: 1; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 9px 12px; color: var(--text);
    font-family: 'DM Mono', monospace; font-size: 12px; outline: none;
    transition: border-color 0.2s;
  }
  .url-input:focus { border-color: var(--accent); }
  .url-input::placeholder { color: var(--text-dimmer); }
  .btn-add {
    background: var(--accent); border: none; border-radius: 8px;
    padding: 9px 14px; color: white; cursor: pointer; font-size: 16px;
    font-weight: 700; transition: opacity 0.2s;
  }
  .btn-add:hover { opacity: 0.85; }

  /* SOURCE LIST */
  .source-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
  .source-item {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 12px;
    display: flex; align-items: center; gap: 10px;
    animation: fadeUp 0.3s ease;
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .source-type {
    font-family: 'DM Mono', monospace; font-size: 10px;
    padding: 2px 7px; border-radius: 4px; font-weight: 500; flex-shrink: 0;
  }
  .source-type.pdf { background: rgba(255,106,158,0.15); color: var(--accent2); }
  .source-type.url { background: rgba(106,255,207,0.15); color: var(--accent3); }
  .source-name { font-size: 12px; color: var(--text-dim); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .source-remove { background: none; border: none; color: var(--text-dimmer); cursor: pointer; font-size: 16px; line-height: 1; padding: 0 2px; transition: color 0.2s; }
  .source-remove:hover { color: var(--accent2); }

  /* ANALYZE BTN */
  .btn-analyze {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, var(--accent), #9b6aff);
    border: none; border-radius: 10px; color: white;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    cursor: pointer; letter-spacing: 0.3px;
    box-shadow: 0 4px 20px rgba(124,106,255,0.35);
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .btn-analyze:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(124,106,255,0.5); }
  .btn-analyze:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-analyze.loading::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

  /* RIGHT PANEL */
  .content-area { display: flex; flex-direction: column; gap: 16px; }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; }
  .tab {
    flex: 1; padding: 9px 12px; border: none; border-radius: 7px;
    background: none; color: var(--text-dim); font-family: 'Syne', sans-serif;
    font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
  }
  .tab.active { background: var(--surface2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
  .tab:hover:not(.active) { color: var(--text); }

  /* BRIEFING */
  .briefing-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .briefing-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .briefing-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; flex: 1; }
  .briefing-meta { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-dim); }
  .briefing-body { padding: 20px; }
  .briefing-section { margin-bottom: 20px; }
  .section-label {
    font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .section-content { font-size: 14px; color: var(--text-dim); line-height: 1.75; }

  .key-points { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .key-point {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--surface2); border-radius: 8px; padding: 10px 14px;
    font-size: 13.5px; color: var(--text-dim); line-height: 1.6;
    border-left: 2px solid var(--accent);
  }
  .point-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); flex-shrink: 0; margin-top: 2px; }

  /* EMPTY STATE */
  .empty-state {
    padding: 60px 20px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .empty-icon { font-size: 48px; opacity: 0.3; }
  .empty-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; color: var(--text-dim); }
  .empty-sub { font-size: 13px; color: var(--text-dimmer); max-width: 280px; line-height: 1.6; }

  /* CHAT */
  .chat-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; }
  .chat-messages { padding: 20px; display: flex; flex-direction: column; gap: 14px; min-height: 200px; max-height: 420px; overflow-y: auto; }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg { display: flex; gap: 10px; animation: fadeUp 0.25s ease; }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }
  .msg.user .msg-avatar { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
  .msg.ai .msg-avatar { background: var(--surface2); border: 1px solid var(--border); }
  .msg-bubble {
    max-width: 80%; padding: 10px 14px; border-radius: 10px;
    font-size: 13.5px; line-height: 1.65;
  }
  .msg.user .msg-bubble { background: var(--accent); color: white; border-radius: 10px 2px 10px 10px; }
  .msg.ai .msg-bubble { background: var(--surface2); color: var(--text-dim); border-radius: 2px 10px 10px 10px; border: 1px solid var(--border); }

  .chat-input-row {
    padding: 14px 16px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; align-items: center;
  }
  .chat-input {
    flex: 1; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; outline: none;
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--text-dimmer); }
  .btn-send {
    background: var(--accent); border: none; border-radius: 8px;
    width: 38px; height: 38px; color: white; cursor: pointer;
    font-size: 16px; transition: opacity 0.2s; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .btn-send:hover:not(:disabled) { opacity: 0.85; }
  .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

  /* TYPING INDICATOR */
  .typing { display: flex; align-items: center; gap: 4px; padding: 4px 0; }
  .typing span {
    width: 6px; height: 6px; background: var(--text-dimmer); border-radius: 50%;
    animation: bounce 1.2s infinite;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  .status-bar {
    display: flex; align-items: center; gap: 8px; padding: 8px 16px;
    background: rgba(124,106,255,0.08); border: 1px solid rgba(124,106,255,0.2);
    border-radius: 8px; font-size: 12px; color: var(--accent);
    font-family: 'DM Mono', monospace;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  @media (max-width: 768px) {
    .main { grid-template-columns: 1fr; }
    .sidebar { position: static; }
  }
`;

// ── helpers ──────────────────────────────────────────────────────────────────

async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(" ") + "\n";
  }
  return text.trim().slice(0, 12000);
}

// OpenRouter + Your Key
// OpenRouter + Your Key (Fixed Model)
async function callClaude(messages, system) {
    
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_KEY;

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "ContextClip"
    },
    body: JSON.stringify({
      // ✅ Fixed & stable model names that work on OpenRouter
      model: "anthropic/claude-sonnet-4.6",     // Best current option (recommended)
      // model: "anthropic/claude-3.5-sonnet",  // Old one causing error - commented out
      max_tokens: 1200,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        ...messages
      ]
    }),
  });

  if (!resp.ok) {
    const errorText = await resp.text().catch(() => "Unknown error");
    console.error("OpenRouter Error:", errorText);
    throw new Error(`OpenRouter API Error (${resp.status}): ${errorText}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "No response from AI.";
}

function parseBriefing(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { summary: raw, keyPoints: [], theme: "Research Briefing" };
  }
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function ContextClip() {
  const [sources, setSources] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState("");
  const [briefing, setBriefing] = useState(null);
  const [tab, setTab] = useState("briefing");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef();
  const chatEndRef = useRef();
  const contextRef = useRef("");

  const addPdf = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") return;
    const id = Date.now();
    setSources((s) => [...s, { id, type: "pdf", name: file.name, file, text: null }]);
    const text = await extractPdfText(file);
    setSources((s) => s.map((src) => src.id === id ? { ...src, text } : src));
  }, []);

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    const id = Date.now();
    setSources((s) => [...s, { id, type: "url", name: u, url: u, text: null }]);
    setUrlInput("");
  };

  const removeSource = (id) => setSources((s) => s.filter((src) => src.id !== id));

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    [...e.dataTransfer.files].forEach(addPdf);
  };

  const analyze = async () => {
    if (sources.length === 0) return;
    setAnalyzing(true); 
    setBriefing(null); 
    setChatMessages([]);
    setStatus("");

    try {
      const parts = [];
      for (const src of sources) {
        if (src.type === "pdf" && src.text) {
          parts.push(`[PDF: ${src.name}]\n${src.text}`);
        } else if (src.type === "url") {
          parts.push(`[URL Reference: ${src.url}]`);
        }
      }

      const combinedContext = parts.join("\n\n---\n\n");
      contextRef.current = combinedContext;

      setStatus("Synthesizing briefing with AI…");

      const system = `You are a research synthesis AI. Given research sources, produce a structured briefing as JSON with these exact keys:
{
  "theme": "short title for the research",
  "summary": "2-3 sentence executive summary",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "insight": "one surprising or non-obvious insight from the material"
}
Return ONLY valid JSON. No markdown, no preamble.`;

      const urlList = sources.filter(s => s.type === "url").map(s => s.url).join(", ");
      const userMsg = combinedContext
        ? `Analyze these research sources and produce a briefing:\n\n${combinedContext}${urlList ? `\n\nAlso consider these URLs: ${urlList}` : ""}`
        : `Produce a research briefing for these URLs: ${urlList}`;

      const raw = await callClaude([{ role: "user", content: userMsg }], system);
      const parsed = parseBriefing(raw);
      setBriefing(parsed);
      setTab("briefing");
      setChatMessages([{
        role: "ai",
        text: `I've analyzed your ${sources.length} source(s) and created a briefing on "${parsed.theme}". Ask me anything about the content!`
      }]);
    } catch (e) {
      console.error(e);
      setBriefing({ 
        theme: "Error", 
        summary: "Failed to generate briefing: " + e.message, 
        keyPoints: [], 
        insight: "" 
      });
    }
    setAnalyzing(false); 
    setStatus("");
  };

  const sendChat = async () => {
    const q = chatInput.trim();
    if (!q || chatLoading) return;

    const newMsgs = [...chatMessages, { role: "user", text: q }];
    setChatMessages(newMsgs); 
    setChatInput(""); 
    setChatLoading(true);

    try {
      const system = `You are a helpful research assistant. Answer based on the provided context. Be concise and accurate.`;

      const history = newMsgs.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text
      }));

      const answer = await callClaude(history, system);
      setChatMessages((m) => [...m, { role: "ai", text: answer }]);
    } catch (e) {
      console.error(e);
      setChatMessages((m) => [...m, { 
        role: "ai", 
        text: "Sorry, I couldn't connect to the AI. Please check your internet or try again." 
      }]);
    }

    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const canAnalyze = sources.length > 0 && !analyzing;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo-mark">CC</div>
          <div>
            <div className="logo-text">Context<span>Clip</span></div>
          </div>
          <div className="tagline">
            Research Synthesis Engine
            <span className="badge">● LIVE</span>
          </div>
        </header>

        <div className="main">
          {/* SIDEBAR - Same as before */}
          <aside className="sidebar">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">📄</span>
                <span className="panel-title">PDF Sources</span>
              </div>
              <div className="panel-body">
                <div
                  className={`drop-zone ${dragging ? "dragging" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef} type="file" accept=".pdf" multiple
                    onChange={(e) => [...e.target.files].forEach(addPdf)}
                    style={{ display: "none" }}
                  />
                  <div className="drop-icon">⬆️</div>
                  <div className="drop-label"><strong>Drop PDFs here</strong> or click</div>
                  <div className="drop-sub">max 15 pages per file</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">🔗</span>
                <span className="panel-title">URL Sources</span>
              </div>
              <div className="panel-body">
                <div className="url-row">
                  <input
                    className="url-input"
                    placeholder="https://example.com/article"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addUrl()}
                  />
                  <button className="btn-add" onClick={addUrl}>+</button>
                </div>
              </div>
            </div>

            {sources.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-icon">📋</span>
                  <span className="panel-title">Queue ({sources.length})</span>
                </div>
                <div className="panel-body">
                  <div className="source-list">
                    {sources.map((src) => (
                      <div className="source-item" key={src.id}>
                        <span className={`source-type ${src.type}`}>{src.type.toUpperCase()}</span>
                        <span className="source-name" title={src.name}>{src.name}</span>
                        <button className="source-remove" onClick={() => removeSource(src.id)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {analyzing && status && (
              <div className="status-bar">
                <div className="status-dot" />
                {status}
              </div>
            )}

            <button
              className={`btn-analyze ${analyzing ? "loading" : ""}`}
              onClick={analyze}
              disabled={!canAnalyze}
            >
              {analyzing ? "Synthesizing…" : `⚡ Analyze ${sources.length > 0 ? `(${sources.length})` : ""} Sources`}
            </button>
          </aside>

          {/* CONTENT AREA */}
          <div className="content-area">
            {briefing && (
              <div className="tabs">
                <button className={`tab ${tab === "briefing" ? "active" : ""}`} onClick={() => setTab("briefing")}>📊 Briefing</button>
                <button className={`tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>💬 Q&A Chat</button>
              </div>
            )}

            {(!briefing || tab === "briefing") && (
              <div className="briefing-panel">
                {!briefing ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔬</div>
                    <div className="empty-title">No briefing yet</div>
                    <div className="empty-sub">Add PDF files or URLs on the left, then click Analyze Sources.</div>
                  </div>
                ) : (
                  <>
                    <div className="briefing-header">
                      <div className="briefing-title">📋 {briefing.theme}</div>
                      <div className="briefing-meta">{sources.length} source{sources.length !== 1 ? "s" : ""} synthesized</div>
                    </div>
                    <div className="briefing-body">
                      <div className="briefing-section">
                        <div className="section-label">Executive Summary</div>
                        <div className="section-content">{briefing.summary}</div>
                      </div>
                      {briefing.keyPoints?.length > 0 && (
                        <div className="briefing-section">
                          <div className="section-label">Key Points</div>
                          <ul className="key-points">
                            {briefing.keyPoints.map((pt, i) => (
                              <li className="key-point" key={i}>
                                <span className="point-num">0{i + 1}</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {briefing.insight && (
                        <div className="briefing-section">
                          <div className="section-label">Key Insight</div>
                          <div className="section-content" style={{ color: "var(--accent3)", fontStyle: "italic" }}>
                            💡 {briefing.insight}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {briefing && tab === "chat" && (
              <div className="chat-panel">
                <div className="chat-messages">
                  {chatMessages.map((m, i) => (
                    <div className={`msg ${m.role}`} key={i}>
                      <div className="msg-avatar">{m.role === "user" ? "👤" : "🤖"}</div>
                      <div className="msg-bubble">{m.text}</div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="msg ai">
                      <div className="msg-avatar">🤖</div>
                      <div className="msg-bubble">
                        <div className="typing"><span /><span /><span /></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder="Ask anything about your research…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  />
                  <button className="btn-send" onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>
                    ➤
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}