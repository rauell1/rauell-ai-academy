import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, RefreshCw, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  isFallback?: boolean;
}

interface AITutorDrawerProps {
  courseSlug?: string;
  lessonTitle?: string;
  pathwayTitle?: string;
  keyTakeaway?: string;
}

export function AITutorDrawer({
  courseSlug,
  lessonTitle,
  pathwayTitle,
  keyTakeaway,
}: AITutorDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am your **Academy AI Mentor**. I am here to help you unpack concepts, review code, or explore practical examples for **${lessonTitle || "this lesson"}**.\n\nWhat would you like to explore?`,
      model: "meta/llama-3.2-90b-vision-instruct",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Explain this concept with a Kenyan workplace example",
    "What are common mistakes or hallucinations to watch out for?",
    "Give me an edge-case test scenario for this lesson",
    "How does this connect to real-world infrastructure operations?",
  ];

  async function handleSend(customText?: string) {
    const textToSend = (customText || input).trim();
    if (!textToSend || busy) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setBusy(true);

    try {
      const history = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiRequest<{
        message: string;
        provider: string;
        model: string;
        isFallback: boolean;
        latencyMs: number;
      }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: history.slice(-6),
          context: {
            courseSlug,
            lessonTitle,
            pathwayTitle,
            keyTakeaway,
          },
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.message,
          provider: res.provider,
          model: res.model,
          isFallback: res.isFallback,
          latencyMs: res.latencyMs,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a momentary connection hiccup. However, remember the golden rule: always verify primary constraints and validate runtime schemas.",
          isFallback: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-xl hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-label="Open AI Mentor"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <span className="font-medium text-sm">Ask AI Mentor</span>
          <span className="rounded bg-emerald-800/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-emerald-200">
            NVIDIA NIM
          </span>
        </button>
      )}

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-zinc-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
                    Academy AI Mentor
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-medium text-emerald-800">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 truncate max-w-[230px]">
                    {lessonTitle || "Socratic Lesson Guidance"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Context Banner */}
            {keyTakeaway && (
              <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-900 flex items-start gap-2">
                <span className="font-semibold shrink-0 text-emerald-700">Focus:</span>
                <span className="line-clamp-2 text-zinc-700">{keyTakeaway}</span>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-xs"
                        : "bg-zinc-100 text-zinc-800 rounded-bl-xs border border-zinc-200/60"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {m.content.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx} className="mb-2 last:mb-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {m.role === "assistant" && (m.model || m.latencyMs) && (
                    <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-zinc-400">
                      <span>
                        {m.model?.includes("90b")
                          ? "Llama 3.2 (90B Free Endpoint)"
                          : m.model?.includes("11b")
                          ? "Llama 3.2 (11B Free Endpoint)"
                          : m.model?.includes("llama")
                          ? "Llama 3.2"
                          : m.model || "Academy Mentor"}
                      </span>
                      {m.latencyMs && <span>• {(m.latencyMs / 1000).toFixed(2)}s</span>}
                      {m.isFallback && <span className="text-amber-600 font-medium">• Offline Mode</span>}
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 py-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>Thinking with Llama 3.2 90B...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 5 && (
              <div className="border-t border-zinc-100 bg-zinc-50/50 p-2.5">
                <p className="text-[11px] font-medium text-zinc-400 mb-1.5 px-1">Suggested inquiries:</p>
                <div className="flex flex-col gap-1">
                  {quickPrompts.slice(0, 2).map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(prompt)}
                      disabled={busy}
                      className="text-left text-xs text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50/80 rounded-md px-2 py-1.5 transition-colors flex items-center justify-between group border border-transparent hover:border-emerald-200"
                    >
                      <span className="truncate">{prompt}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="border-t border-zinc-200 p-3 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this lesson..."
                  disabled={busy}
                  className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
