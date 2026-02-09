import { useParams } from "react-router-dom";
import pages from "../data/pages.json";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Block {
  id: string;
  type: string;
  text?: string;
  code?: string;
  src?: string;
  alt?: string;
  goodbyeMessage?: string;
}

export default function NotePage() {
  const { slug } = useParams();
  const page = pages.find((p) => p.slug === slug);

  if (!page)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg">
        Page not found
      </p>
    );

  const blocks: Block[] = Array.isArray(page.blocks) ? page.blocks : [];

  return (
    <div className="w-full max-w-7xl py-10 mx-auto px-4 md:px-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-gray-100 border-b border-gray-300 pb-4">
        {page.title}
      </h1>

      {/* Scrollable Content */}
      {blocks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No content available for this page.
        </p>
      ) : (
        <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
          {blocks.map((block) => {
            switch (block.type) {
              case "section_heading":
                return (
                  <h2
                    key={block.id}
                    className="text-2xl md:text-3xl font-semibold mt-6 text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-2"
                  >
                    {block.text}
                  </h2>
                );

              case "paragraph":
                return (
                  <div
                    key={block.id}
                    className="prose dark:prose-invert max-w-none"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {block.text || ""}
                    </ReactMarkdown>
                  </div>
                );

              case "code_block":
                if (!block.code) return null;
                return <CodeBlock key={block.id} code={block.code} />;

              case "image":
                if (!block.src) return null;
                return (
                  <ImageWithLoader
                    key={block.id}
                    src={block.src}
                    alt={block.alt ?? "image"}
                  />
                );

              default:
                return null;
            }
          })}

          {/* Beautiful Goodbye Section — INSIDE scroller */}
          {page.goodbyeMessage && (
            <div className="mt-14 flex justify-center">
              <div className="max-w-2xl w-full text-center rounded-2xl p-6 md:p-8 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-blue-200 dark:border-gray-700">
                <div className="text-3xl mb-3">🚀</div>
                <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {page.goodbyeMessage}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  End of notes — go build something awesome.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// New CodeBlock component with Copy button
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-green-200 rounded-lg p-4 overflow-x-auto text-sm md:text-base shadow-md">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// Image component with lazy loading, max height, loader, and error handling
function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  return (
    <div className="my-6 flex">
      {/* Box wraps the image and loader */}
      <div className="relative bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow max-w-[600px] w-full">
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 font-semibold">
            Error loading image
          </div>
        )}

        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`rounded-lg w-full object-contain transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
