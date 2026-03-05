import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import NotePage from "./NotePage";
import { FaHighlighter, FaEraser, FaTools, FaRobot } from "react-icons/fa";

interface Highlight {
  id: string;
  element: HTMLElement;
}

export default function NotePageWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [mode, setMode] = useState<"highlight" | "none">("none");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  if (!slug) return null;

  // Highlight selection
  const handleHighlight = () => {
    if (mode !== "highlight") return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !noteRef.current) return;
    const range = selection.getRangeAt(0);
    if (!noteRef.current.contains(range.commonAncestorContainer)) return;
    const mark = document.createElement("mark");
    mark.style.backgroundColor = "yellow";
    mark.className = "rounded";
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
    setHighlights((prev) => [...prev, { id: Date.now().toString(), element: mark }]);
    selection.removeAllRanges();
  };

  const clearHighlights = () => {
    highlights.forEach((h) => h.element.replaceWith(...Array.from(h.element.childNodes)));
    setHighlights([]);
  };

  // Global mouseup to trigger highlighting
  useEffect(() => {
    const handleMouseUp = () => handleHighlight();
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [mode]);

  // Frontend-only AI Query Handler
  const askAI = async () => {
    if (!aiQuery.trim() || !noteRef.current) return;

    const noteText = noteRef.current.innerText;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an assistant that answers questions based on the provided note content." },
            { role: "user", content: `Note content: ${noteText}` },
            { role: "user", content: `Question: ${aiQuery}` },
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      console.log("OpenAI Response:", data);
      const answer = data.choices?.[0]?.message?.content ?? "No answer available.";
      setAiAnswer(answer);
      setAiQuery("");
    } catch (error) {
      console.error(error);
      setAiAnswer("Error getting AI response.");
    }
  };

  return (
    <div className="relative w-full" style={{ cursor: mode === "highlight" ? "text" : "auto" }}>
      <div ref={noteRef} className="relative">
        <NotePage key={slug} slug={slug} />
      </div>

      {/* FAB Drawer */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
        <div
          className="flex flex-col items-center group"
          onMouseEnter={() => setDrawerOpen(true)}
          onMouseLeave={() => setDrawerOpen(false)}
        >
          <div
            className={`flex flex-col mb-3 space-y-3 transition-all duration-300 ${
              drawerOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 -translate-y-4 pointer-events-none"
            }`}
          >
            {/* Highlight button */}
            <button
              onClick={() => setMode("highlight")}
              className="w-14 h-14 rounded-full bg-yellow-400 text-gray-900 shadow-lg hover:bg-yellow-500 hover:scale-110 flex items-center justify-center animate-float"
            >
              <FaHighlighter className="w-7 h-7" />
            </button>

            {/* Erase highlights */}
            <button
              onClick={clearHighlights}
              className="w-14 h-14 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 hover:scale-110 flex items-center justify-center animate-float"
              style={{ animationDelay: "0.1s" }}
            >
              <FaEraser className="w-7 h-7" />
            </button>
          </div>

          {/* Main Tools Button */}
          <button
            className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 animate-float"
            title="Tools"
          >
            <FaTools size={28} />
          </button>
        </div>
      </div>

      {/* Floating AI Button Bottom-Right */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-600 text-white shadow-2xl flex items-center justify-center hover:bg-green-700 hover:scale-110 animate-float z-50"
        title="Ask AI"
        onClick={() => setAiOpen((prev) => !prev)}
      >
        <FaRobot size={28} />
      </button>

      {/* AI Input Panel */}
      {aiOpen && (
        <div className="fixed bottom-24 right-6 w-80 p-4 rounded-lg bg-white shadow-2xl z-50 flex flex-col space-y-2">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ask AI about this note..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") askAI(); }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={askAI}
          >
            Ask
          </button>
          {aiAnswer && (
            <div className="mt-2 p-2 border rounded bg-gray-50 text-gray-800">
              <strong>Answer:</strong> {aiAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}