import { useState } from "react";
import { FiCopy, FiSearch, FiLayers, FiX, FiGlobe } from "react-icons/fi";
import { WORDLISTS } from "./wordlist";

// [Paste the WORDLISTS array from above here]

export default function WordlistPage() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const filteredLists = WORDLISTS.map(cat => ({
    ...cat,
    lists: cat.lists.filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      cat.category.toLowerCase().includes(search.toLowerCase()) ||
      l.tool.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.lists.length > 0);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mt-4 mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/20">
          <FiGlobe className="text-3xl text-emerald-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Wordlist <span className="text-emerald-500">Navigator</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Certified Pentester Reference</p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-3xl mb-10">
        <div className="relative group">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-2xl p-2 focus-within:border-emerald-500 transition-all duration-300 shadow-2xl">
            <FiSearch className="ml-4 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search Subdomains, LFI, Rockyou..."
              className="w-full p-4 bg-transparent text-white focus:outline-none font-mono text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="mr-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl transition-all">
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="w-full max-w-3xl space-y-10 mb-20">
        {filteredLists.length > 0 ? (
          filteredLists.map((cat, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3 mb-4 ml-2">
                <span className="w-8 h-[1px] bg-emerald-500/30"></span>
                <FiLayers className="text-emerald-500" /> {cat.category}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {cat.lists.map((item, i) => (
                  <div key={i} className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-emerald-500/40 hover:bg-gray-900 transition-all duration-300">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-white font-bold text-sm tracking-tight">{item.name}</span>
                          <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                            {item.tool}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-gray-500 group-hover:text-emerald-400 transition-colors truncate">
                          {item.path}
                        </p>
                      </div>
                      <button onClick={() => handleCopy(item.path)} className="p-3 bg-gray-900 text-gray-500 hover:text-white rounded-xl border border-gray-800 group-hover:border-emerald-500/50 transition-all">
                        <FiCopy size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-gray-600 font-mono text-sm">
             [ No lists found in the database ]
          </div>
        )}
      </div>

      {copied && (
        <div className="fixed bottom-10 px-8 py-4 bg-emerald-600 text-white text-sm font-black rounded-2xl shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300 z-50">
          PATH COPIED 🚀
        </div>
      )}
    </div>
  );
}