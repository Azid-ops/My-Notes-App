import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function ScriptBlock({ file, language }: { file: string; language?: string }) {
  const [code, setCode] = useState<string>("Loading...");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScript = () => {
    setLoading(true);
    setError(null);

    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setCode(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setCode("Failed to load script.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchScript();
  }, [file]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // New: Download code as file
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Use the file name from the URL if possible
    const fileName = file.split("/").pop() || "script.txt";
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative my-6 group">
      {/* Window Top Bar */}
      <div className="flex justify-between items-center bg-gray-800 rounded-t-xl px-3 py-1">
        {/* Language badge on left */}
        {language && (
          <span className="text-xs text-gray-200 px-2 py-0.5 rounded bg-gray-900 shadow">
            {language.toUpperCase()}
          </span>
        )}

        {/* Three window dots on right */}
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>

      {/* Copy & Download Buttons */}
      <div className="absolute top-8 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className={`text-xs px-2 py-1 rounded shadow
            ${copied ? "bg-green-600 text-white" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="text-xs px-2 py-1 rounded shadow bg-gray-800 text-gray-200 hover:bg-gray-700"
        >
          Download
        </button>
      </div>

      {/* Code Block */}
      <div className="overflow-auto rounded-b-xl shadow-lg">
        <SyntaxHighlighter
          language={language || "text"}
          style={vscDarkPlus}
          customStyle={{
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            minHeight: "4rem",
            fontFamily: "'Fira Code', monospace",
            background: loading ? "#1e1e1e" : undefined,
          }}
          showLineNumbers
          wrapLines
        >
          {loading ? "Loading..." : code}
        </SyntaxHighlighter>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchScript}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default ScriptBlock;