import pages from "../data/pages.json";
import { useState, useEffect } from "react";
import { FaBook, FaFolder, FaYoutube } from "react-icons/fa"; // make sure to install react-icons

interface Block {
  id: string;
  type: string;
  text?: string;
  code?: string;
  src?: string;
  alt?: string;
  url?: string; // for YouTube block
  items?:string[],
  title?: string,
  fileName?: string;
  size?:any;
}

interface Page {
  slug: string;
  title: string;
  youtubeUrl?: string;
  goodbyeMessage?: string;
  prerequisites?: {
    title: string;
    slug?: string;
    url?: string;
  }[];
  courseMaterials?: {
    title: string;
    url: string;
  }[];
  blocks: Block[];
}

interface NotePageProps {
  slug: string;
}

export default function NotePage({ slug }: NotePageProps) {
  const [page, setPage] = useState<Page | null>(null);
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
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-2 md:px-4">
      {/* Title with YouTube Icon */}
      <div className="flex-1 py-10 space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
          {page.title}
        </h1>

        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors group"
            title="Watch on YouTube"
          >
            <FaYoutube className="text-4xl md:text-5xl" />
          </a>
        )}
      </div>

      {page.prerequisites && page.prerequisites.length > 0 && (
        <div className="mb-8 relative">
          <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <FaBook className="text-purple-500 dark:text-purple-300 text-3xl" />
            Prerequisites
            {/* Info icon */}
            <div className="relative group ml-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 dark:bg-purple-700 text-white text-xs font-bold cursor-pointer">
                i
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Topics you should complete before starting this note.
              </div>
            </div>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {page.prerequisites.map((item, i) => (
              <a
                key={i}
                href={item.slug ? `/notes/${item.slug}` : item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 hover:bg-purple-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-shrink-0 text-purple-600 dark:text-purple-300 group-hover:text-purple-800 transition-colors font-bold text-lg">
                  📘
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {page.courseMaterials && page.courseMaterials.length > 0 && (
        <div className="mb-8 relative">
          <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
            <FaFolder className="text-green-500 dark:text-green-300 text-3xl" />
            Course Material
            {/* Info icon */}
            <div className="relative group ml-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500 dark:bg-green-700 text-white text-xs font-bold cursor-pointer">
                i
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                External and internal resources referenced in this note, such as documents, rooms, or repositories.
              </div>
            </div>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {page.courseMaterials.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 hover:bg-green-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-shrink-0 text-green-600 dark:text-green-300 group-hover:text-green-800 transition-colors font-bold text-lg">
                  📗
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      
      <div className="space-y-8 pr-4">
        {blocks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">No content available.</p>
        ) : (
          blocks.map((block) => {
            switch (block.type) {

              case "download":
                if (!block.url) return null;
                return <DownloadCard key={block.id} block={block} />;
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
                    {renderHighlightedText(block.text!)}
                  </p>
                );
              case "code_block":
                if (!block.code) return null;
                return <CodeBlock key={block.id} code={block.code} />;

              case "order_block":
                if (!block.text) return null;
                return (
                  <div
                    key={block.id}
                    className="flex items-start space-x-4 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md"
                  >
                    {/* Step number or icon */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-400 text-white font-bold">
                        ➤
                      </span>
                    </div>
                    {/* Action text */}
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                      {block.text.split(/(<highlight>.*?<\/highlight>)/g).map((part, i) =>
                        part.startsWith("<highlight>") ? (
                          <span
                            key={i}
                            className="bg-teal-300 dark:bg-teal-700 text-teal-900 dark:text-teal-100 px-1 rounded font-semibold"
                          >
                            {part.replace(/<\/?highlight>/g, "")}
                          </span>
                        ) : (
                          <span key={i} >{part}</span>
                        )
                      )}
                    </p>
                  </div>
                );
              case "output_block":
                if (!block.code) return null;
                return <OutputBlock key={block.id} code={block.code} language="bash" />;
              case "image":
                if (!block.src) return null;
                return <ImageWithLoader key={block.id} src={block.src} alt={block.alt ?? ""} />;

                case "explanation":
                  if (!block.items) return null;
                  return (
                    <div
                      key={block.id}
                      className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm"
                    >
                      {block.title && (
                        <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                          {block.title}
                        </h3>
                      )}
                      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-200">
                        {block.items.map((item, i) => (
                          <li key={i}>
                            {item.split(/(<highlight>.*?<\/highlight>)/g).map((part, j) =>
                              part.startsWith("<highlight>") ? (
                                <span
                                  key={j}
                                  className="bg-teal-300 dark:bg-teal-700 text-teal-900 dark:text-teal-100 px-1 rounded font-semibold"
                                >
                                  {part.replace(/<\/?highlight>/g, "")}
                                </span>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
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

const renderHighlightedText = (text: string) => {
  return text.split(/(<highlight>.*?<\/highlight>)/g).map((part, i) =>
    part.startsWith("<highlight>") ? (
      <span
        key={i}
        className="bg-teal-300 dark:bg-teal-700 text-teal-900 dark:text-teal-100 px-1.5 py-0.5 rounded-md font-semibold shadow-sm"
      >
        {part.replace(/<\/?highlight>/g, "")}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

function OutputBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group my-4">
      {/* Terminal-style box */}
      <pre className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg overflow-x-auto shadow-md whitespace-pre-wrap break-all">
        {code}
      </pre>

      {/* Language badge */}
      {language && (
        <div className="absolute top-2 left-2 bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-bl">
          {language}
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-1 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
function DownloadCard({ block }: { block: Block }) {
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extension = block.fileName?.split(".").pop()?.toUpperCase() || "FILE";

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const response = await fetch(block.url!, { method: "HEAD" });
        const size = response.headers.get("content-length");

        if (size) {
          const sizeInMB = (parseInt(size) / (1024 * 1024)).toFixed(2);
          setFileSize(`${sizeInMB} MB`);
        }
      } catch {
        setFileSize(null);
      }
    };

    fetchSize();
  }, [block.url]);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const a = document.createElement("a");
      a.href = block.url!;
      a.download = block.fileName || "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    const map: Record<string, string> = {
      ZIP: "📦",
      PDF: "📄",
      TXT: "📝",
      DOCX: "📃",
      MP4: "🎬",
      PNG: "🖼️",
      JPG: "🖼️",
      JPEG: "🖼️",
    };
    return map[extension] || "📁";
  };

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">

      <div className="flex items-start justify-between gap-6">

        {/* Left Side */}
        <div className="flex items-start gap-4">

          <div className="bg-indigo-100 dark:bg-indigo-900 text-2xl p-3 rounded-xl">
            {getIcon()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {block.title}
            </h3>

            {block.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {block.text}
              </p>
            )}

            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">

              {block.fileName && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-mono">
                  {block.fileName}
                </span>
              )}

              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-md font-semibold">
                {extension}
              </span>

              {fileSize && (
                <span>{block.size || fileSize}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <a
          href={block.url}
          download={block.fileName || true}
          onClick={handleDownload}
          className="relative shrink-0 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center min-w-[110px]"
        >
          {loading ? (
            <span className="animate-pulse">Downloading...</span>
          ) : (
            "Download"
          )}
        </a>
      </div>
    </div>
  );
}
// ----------------------
// ImageWithLoader component
// ----------------------
function ImageWithLoader({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [isOpen, setIsOpen] = useState(false); // new state for modal

  return (
    <>
      <div className="my-6 flex">
        <div
          className="relative bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow max-w-[600px] w-full cursor-pointer"
          onClick={() => status === "loaded" && setIsOpen(true)}
        >
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

      {/* Modal overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 cursor-zoom-out"
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}
