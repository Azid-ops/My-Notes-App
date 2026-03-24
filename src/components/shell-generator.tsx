import { useState } from "react";
import { FiCopy, FiZap, FiWifi, FiServer, FiTerminal } from "react-icons/fi";
import { SHELL_PAYLOADS } from "./shell-payloads";

export default function ShellGenerator() {
  const [ip, setIp] = useState("10.10.10.10");
  const [port, setPort] = useState("4444");
  const [copied, setCopied] = useState("");
  
  // Filtering state
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories from payloads
  const categories = ["All", ...new Set(SHELL_PAYLOADS.map((s: any) => s.category))];

  const handleCopy = (cmd: string, name: string) => {
    const finalCmd = cmd.replace(/{IP}/g, ip).replace(/{PORT}/g, port);
    navigator.clipboard.writeText(finalCmd);
    setCopied(name);
    setTimeout(() => setCopied(""), 2000);
  };

  // Filtered payloads logic
  const filteredPayloads = activeCategory === "All" 
    ? SHELL_PAYLOADS 
    : SHELL_PAYLOADS.filter((s: any) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-red-600/10 border border-red-500/20 rounded-2xl mb-4">
          <FiZap className="text-3xl text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter">Shell <span className="text-red-500">Craft</span></h1>
        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em] mt-2">Instant Reverse Shell Generator</p>
      </div>

      {/* Configuration Box */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
          <FiWifi className="text-red-500" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">LHOST</label>
            <input 
              value={ip} 
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-transparent text-white font-mono outline-none focus:text-red-400 transition-colors" 
            />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
          <FiServer className="text-red-500" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">LPORT</label>
            <input 
              value={port} 
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-transparent text-white font-mono outline-none focus:text-red-400 transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* NEW: Filter Tabs */}
      <div className="w-full max-w-3xl mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === cat 
                ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Payload Cards */}
      <div className="w-full max-w-3xl space-y-4">
        {filteredPayloads.length > 0 ? (
          filteredPayloads.map((shell: any, idx: any) => (
            <div key={idx} className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-red-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`font-bold ${shell.color}`}>{shell.name}</h3>
                  <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">{shell.category}</span>
                </div>
                <button 
                  onClick={() => handleCopy(shell.command, shell.name)}
                  className="p-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-red-600 transition-all active:scale-95"
                >
                  {copied === shell.name ? "COPIED!" : <FiCopy />}
                </button>
              </div>
              <div className="bg-gray-950 p-4 rounded-xl font-mono text-xs text-gray-400 break-all border border-gray-800/50 group-hover:text-gray-200 transition-colors">
                {shell.command.replace(/{IP}/g, ip).replace(/{PORT}/g, port)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 font-mono text-sm py-10 text-center border-2 border-dashed border-gray-900 rounded-3xl">
            No payloads found for this category.
          </div>
        )}
      </div>

      {/* Listener Help */}
      <div className="w-full max-w-3xl mt-10 p-4 bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl flex items-center justify-between">
         <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Quick Listener Command:</p>
            <code className="text-red-400 text-sm font-mono">nc -lvnp {port}</code>
         </div>
         <FiTerminal className="text-gray-800 text-2xl" />
      </div>
    </div>
  );
}