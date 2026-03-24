import { useState, useEffect } from "react";
import { identifyHash } from "./identify-hash"; 
import { FiHash, FiCopy, FiTerminal, FiShield, FiCode, FiZap, FiClock } from "react-icons/fi";

export default function HashIdentifierPage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [useRules, setUseRules] = useState(false);
  const [history, setHistory] = useState<{name: string, mode: string}[]>([]);
  
  const result = identifyHash(input);

  // Update history when a new hash is identified
  useEffect(() => {
    if (result.name !== "Unknown" && !history.find(h => h.mode === result.mode)) {
      setHistory(prev => [{name: result.name, mode: result.mode}, ...prev].slice(0, 5));
    }
  }, [result]);

  const handleCopy = (text: string) => {
    if (!text || text === "???") return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Logic for Rule-based commands
  const hashcatCmd = `hashcat -m ${result.mode} hash.txt /usr/share/wordlists/rockyou.txt ${useRules ? "-r /usr/share/hashcat/rules/best64.rule" : ""}`;
  const johnCmd = `john --format=${result.john} --wordlist=/usr/share/wordlists/rockyou.txt ${useRules ? "--rules " : ""}hash.txt`;

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mt-4 mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
          <FiHash className="text-3xl text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
          Hash <span className="text-blue-500">Identifier</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base tracking-wide italic">"Precision is the difference between a crack and a timeout."</p>
      </div>

      <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          
          {/* Input Field */}

          {/* Input Field Area */}
          <div className="relative group mb-6">
            <div className="flex items-center bg-gray-950 rounded-xl border border-gray-700 p-2 focus-within:border-blue-500 transition-all duration-300 shadow-inner">
              <FiTerminal className="ml-3 text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Paste your hash here..."
                className="w-full p-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {/* NEW: Clear Button */}
              {input && (
                <button 
                  onClick={() => setInput("")}
                  className="mx-3 px-3 py-1 bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 rounded-md text-[10px] font-bold transition-all border border-gray-700"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className={`space-y-6 transition-all duration-300 ${input ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
            
            {/* Header Row: Algorithm + Rule Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800 w-full md:w-auto">
                <FiShield className={`${result.color} text-xl`} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Detected</p>
                  <h3 className={`text-lg font-bold ${result.color}`}>{result.name}</h3>
                </div>
              </div>

              {/* Rule Toggle Switch */}
              <button 
                onClick={() => setUseRules(!useRules)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 w-full md:w-auto justify-center ${useRules ? "bg-orange-500/10 border-orange-500 text-orange-500" : "bg-gray-950 border-gray-800 text-gray-500"}`}
              >
                <FiZap className={useRules ? "animate-pulse" : ""} />
                <span className="text-xs font-bold uppercase tracking-tighter">{useRules ? "Rules Enabled" : "Enable Rules"}</span>
              </button>
            </div>

            {/* Cracking Commands Section */}
            <div className="space-y-4 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/50">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <FiCode />
                <span className="text-xs font-bold uppercase tracking-widest">Automatic Commands</span>
              </div>

              {/* Hashcat */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-bold ml-1">HASHCAT</p>
                <div className="flex items-center justify-between bg-gray-950 p-4 rounded-lg border border-gray-800 font-mono text-xs text-blue-400 group overflow-hidden">
                  <span className="truncate whitespace-nowrap">{hashcatCmd}</span>
                  <button onClick={() => handleCopy(hashcatCmd)} className="ml-2 p-2 bg-gray-900 rounded-md hover:text-white transition-colors flex-shrink-0">
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>

              {/* John */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-bold ml-1">JOHN THE RIPPER</p>
                <div className="flex items-center justify-between bg-gray-950 p-4 rounded-lg border border-gray-800 font-mono text-xs text-purple-400 group overflow-hidden">
                  <span className="truncate whitespace-nowrap">{johnCmd}</span>
                  <button onClick={() => handleCopy(johnCmd)} className="ml-2 p-2 bg-gray-900 rounded-md hover:text-white transition-colors flex-shrink-0">
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {!input && (
            <div className="mt-12 text-center py-10 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center gap-2">
               <FiTerminal className="text-gray-700 text-2xl" />
               <p className="text-gray-600 text-sm font-medium font-mono">
                [ Waiting for hex/string input... ]
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Chips (Only shown if history exists) */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-3 text-gray-500 px-2">
            <FiClock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Recent Identifications</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 px-3 py-2 rounded-full flex items-center gap-2">
                <span className="text-xs text-blue-400 font-bold">{h.name}</span>
                <span className="text-[10px] text-gray-600">Mode: {h.mode}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mt-10 p-4 bg-blue-900/10 border border-blue-800/20 rounded-2xl">
        <h4 className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
          <FiShield /> Quick Cracking Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-gray-400 font-mono">
          <div className="bg-gray-950 p-2 rounded border border-gray-800">
            <span className="text-white font-bold"># Pass-the-Hash:</span> No need to crack NTLM! Use <span className="text-green-500">evil-winrm -H [HASH]</span>.
          </div>
          <div className="bg-gray-950 p-2 rounded border border-gray-800">
            <span className="text-white font-bold"># Wordlists:</span> Always check <span className="text-yellow-500">/usr/share/wordlists/rockyou.txt</span>.
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-8 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-50">
          Copied to clipboard! 🚀
        </div>
      )}
    </div>
  );
}