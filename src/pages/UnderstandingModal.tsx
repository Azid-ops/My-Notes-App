import { useState, useEffect, type JSX } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { CodeBracketIcon, ArrowPathIcon, CubeIcon } from "@heroicons/react/24/outline";

interface Keyword {
  name: string;
  desc: string;
  detail: string;
  color: string;
  icon: "CubeIcon" | "ArrowPathIcon" | "CodeBracketIcon";
}

interface UnderstandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanationFile?: string;
  content?: string;
}

const iconMap: Record<Keyword["icon"], JSX.Element> = {
  CubeIcon: <CubeIcon className="w-5 h-5" />,
  ArrowPathIcon: <ArrowPathIcon className="w-5 h-5" />,
  CodeBracketIcon: <CodeBracketIcon className="w-5 h-5" />,
};

export default function UnderstandingModal({
  isOpen,
  onClose,
  explanationFile,
  content
}: UnderstandingModalProps) {

  const [expanded, setExpanded] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [search, setSearch] = useState("");

  /* Load explanation JSON dynamically */
  useEffect(() => {

    if (!explanationFile) {
      setKeywords([]);
      return;
    }

    fetch(explanationFile)
      .then((res) => res.json())
      .then((data) => setKeywords(data))
      .catch(() => setKeywords([]));

  }, [explanationFile]);

  /* Download JSON */
  const handleDownload = () => {

    const blob = new Blob(
      [JSON.stringify(keywords, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "keywords.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  /* Search filter */
  const filteredKeywords = keywords.filter((kw) =>
    kw.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 w-[36rem] max-w-full h-full transform transition-transform duration-300 ease-out pointer-events-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 shadow-2xl rounded-l-3xl p-6 flex flex-col`}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Understanding
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search keywords..."
            className="w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1 p-2 space-y-4">

          {content ? (

            <div dangerouslySetInnerHTML={{ __html: content }} />

          ) : filteredKeywords.length > 0 ? (

            filteredKeywords.map((kw) => {

              const isCardOpen = expanded === kw.name;

              return (
                <div key={kw.name} className="flex flex-col transition-all">

                  {/* Card */}
                  <div
                    onClick={() => setExpanded(isCardOpen ? null : kw.name)}
                    className={`flex items-center p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl cursor-pointer
                      ${isCardOpen ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900" : ""}`}
                  >

                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${kw.color} text-white mr-4`}
                    >
                      {iconMap[kw.icon]}
                    </div>

                    <div>
                      <p className="font-bold text-white">{kw.name}</p>
                      <p className="text-gray-300 text-sm">{kw.desc}</p>
                    </div>

                  </div>

                  {/* Expanded */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isCardOpen ? "max-h-60 mt-2" : "max-h-0"
                    }`}
                  >

                    <p className="text-gray-200 text-sm bg-gray-900 p-3 rounded-xl shadow-inner">
                      {kw.detail}
                    </p>

                    {isCardOpen && (
                      <button
                        onClick={() => navigator.clipboard.writeText(kw.detail)}
                        className="mt-2 px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                      >
                        Copy Detail
                      </button>
                    )}

                  </div>

                </div>
              );
            })

          ) : (

            <div className="text-center text-gray-400 text-sm mt-10">
              No results found for
              {" "}
              <span className="font-semibold text-white">
                {search}
              </span>
            </div>

          )}

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">

          <span className="text-xs text-gray-400">
            Click on a keyword to expand detailed description
          </span>

          <button
            onClick={handleDownload}
            className="px-3 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Download All
          </button>

        </div>

      </div>
    </div>
  );
}