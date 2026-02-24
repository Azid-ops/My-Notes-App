import pages from "../data/pages.json";
import { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa"; // make sure to install react-icons

interface Block {
  id: string;
  type: string;
  text?: string;
  code?: string;
  src?: string;
  alt?: string;
  url?: string; // for YouTube block
}

interface NotePageProps {
  slug: string;
}

export default function NotePage({ slug }: NotePageProps) {
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    setPage(null);
    const found = pages.find((p) => p.slug === slug);
    setPage(found || null);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!page) {
    return <p className="text-center text-gray-500 mt-20 text-lg">Loading...</p>;
  }

  const blocks: Block[] = Array.isArray(page.blocks) ? page.blocks : [];

  // Get YouTube link from page or first "youtube" block
  const youtubeFromBlock = blocks.find((b) => b.type === "youtube")?.url;
  const youtubeUrl = page.youtubeUrl || youtubeFromBlock;

  return (
    <div className="w-full max-w-7xl py-10 mx-auto px-4 md:px-6">
      {/* Title with YouTube Icon */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          {page.title}
        </h1>

        {page.category === "walkthrough" && youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 transition-colors"
            title="Watch walkthrough video"
          >
            <FaYoutube className="text-4xl md:text-5xl" />
          </a>
        )}
      </div>

      <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-4">
        {blocks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">No content available.</p>
        ) : (
          blocks.map((block) => {
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
                  <p
                    key={block.id}
                    className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                  >
                    {block.text}
                  </p>
                );
              case "code_block":
                if (!block.code) return null;
                return <CodeBlock key={block.id} code={block.code} />;
              case "image":
                if (!block.src) return null;
                return <ImageWithLoader key={block.id} src={block.src} alt={block.alt ?? ""} />;
              default:
                return null;
            }
          })
        )}

        {page.goodbyeMessage && (
          <div className="mt-8 flex justify-center">
            <div className="max-w-2xl w-full text-center rounded-2xl p-6 md:p-8 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-blue-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🚀</div>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {page.goodbyeMessage}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                End of notes, go build something awesome.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------
// CodeBlock component
// ----------------------
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

// ----------------------
// ImageWithLoader component
// ----------------------
function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className="my-6 flex">
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
