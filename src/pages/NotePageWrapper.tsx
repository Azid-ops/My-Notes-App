import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import NotePage from "./NotePage";
import { FaHighlighter, FaEraser, FaTools } from "react-icons/fa";

interface Highlight {
  id: string;
  element: HTMLElement;
}

export default function NotePageWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [mode, setMode] = useState<"highlight" | "none">("none");
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    </div>
  );
}