import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, UploadCloud, CheckCircle2, Play, Trash2, Copy } from 'lucide-react';
import portsDataRaw from './ports.json'; 

interface PortEntry {
  number: number;
  service: string;
  enu: string[];
  tools: string;
}

interface PortsData {
  title: string;
  ports: PortEntry[];
}

const portsData = portsDataRaw as PortsData;

const PortMasterList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoMatchedPorts, setAutoMatchedPorts] = useState<PortEntry[]>([]);
  const [hasPasted, setHasPasted] = useState<boolean>(false);
  const [mode, setMode] = useState<'paste' | 'upload'>('paste');
  const [rawText, setRawText] = useState<string>('');
  const pasteInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (hasPasted) {
      const timer = setTimeout(() => setHasPasted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasPasted]);

  const processScan = () => {
    if (!rawText.trim()) return;

    // Capture Port and Service Name (e.g., 9999/tcp open  http)
    const portRegex = /(\d+)\/(?:tcp|udp|sctp)?\s*open\s+(\S+)/g;
    
    let match;
    const rawMatches: {num: number, svc: string}[] = [];
    
    while ((match = portRegex.exec(rawText)) !== null) {
      rawMatches.push({ num: parseInt(match[1]), svc: match[2].toLowerCase() });
    }

    const finalMatches = rawMatches.map(found => {
      // 1. Check for exact port number
      const exact = portsData.ports.find(p => p.number === found.num);
      if (exact) return exact;

      // 2. Fallback: Search for generic Port 0 entry using the service name
      const generic = portsData.ports.find(p => 
        p.number === 0 && found.svc.includes(p.service.toLowerCase())
      );

      if (generic) {
        return { ...generic, number: found.num, service: `${found.svc.toUpperCase()} (Port ${found.num})` };
      }

      // 3. Absolute Fallback for unknown services
      return {
        number: found.num,
        service: found.svc.toUpperCase(),
        enu: ["Unknown service detected", "Run: nmap -sC -sV -p" + found.num + " <target>", "Perform banner grabbing (nc/telnet)"],
        tools: "nmap, nc, telnet"
      };
    });

    setAutoMatchedPorts(finalMatches);
    if (finalMatches.length > 0) setHasPasted(true);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setRawText(content);
          setMode('paste');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearScanner = () => {
    setRawText('');
    setAutoMatchedPorts([]);
  };

  const displayList = autoMatchedPorts.length > 0 
    ? autoMatchedPorts.filter(p => 
        p.number.toString().includes(searchTerm) || 
        p.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : portsData.ports.filter(p => 
        p.number.toString().includes(searchTerm) || 
        p.service.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto my-10 bg-slate-900 p-6 rounded-xl shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8 border-b border-slate-700 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                <Terminal size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">PortMaster <span className="text-emerald-500">v2.1</span></h2>
                <p className="text-slate-500 text-xs font-mono">Status: Connected</p>
              </div>
            </div>
            
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-3 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search ports or services..." 
                className="w-full bg-black/40 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-mono"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Scanner UI */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
              <div className="flex gap-4">
                <button 
                  onClick={() => setMode('paste')} 
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${mode === 'paste' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Paste Scan
                </button>
                <button 
                  onClick={() => setMode('upload')} 
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${mode === 'upload' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Upload File
                </button>
              </div>
              <button onClick={clearScanner} className="p-1 hover:text-red-400 text-slate-600 transition-colors" title="Reset All">
                <Trash2 size={14}/>
              </button>
            </div>

            <div className="p-4">
              {mode === 'paste' ? (
                <div className="flex flex-col gap-3">
                  <textarea 
                    ref={pasteInputRef}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste Nmap output here..."
                    className="w-full h-40 bg-black/40 border border-slate-800 rounded-lg p-4 text-xs font-mono text-emerald-500 focus:border-emerald-500/50 outline-none resize-none"
                  />
                  <button 
                    onClick={processScan}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    {hasPasted ? <CheckCircle2 size={16}/> : <Play size={16}/>}
                    {hasPasted ? "Parsed Successfully" : "Analyze Nmap Output"}
                  </button>
                </div>
              ) : (
                <div className="relative h-52 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-lg flex flex-col items-center justify-center group cursor-pointer">
                   <UploadCloud size={32} className="text-slate-700 group-hover:text-emerald-500 mb-2 transition-colors"/>
                   <p className="text-xs font-mono text-slate-500 uppercase">Drop Nmap output here</p>
                   <input type="file" onChange={handleFileInput} className="absolute inset-0 opacity-0 cursor-pointer" accept=".nmap,.txt"/>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
             {autoMatchedPorts.length > 0 ? `Targeted: ${autoMatchedPorts.length} Matches Found` : "Reference: All Common Ports"}
           </h3>
           {autoMatchedPorts.length > 0 && (
             <button onClick={() => setAutoMatchedPorts([])} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase">
               Clear Filter [x]
             </button>
           )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="p-4 border-b border-slate-700">Port</th>
                <th className="p-4 border-b border-slate-700">Service</th>
                <th className="p-4 border-b border-slate-700 w-1/2">Recon Workflow</th>
                <th className="p-4 border-b border-slate-700">Toolkit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayList.map((item) => (
                <tr key={item.number} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="p-4 font-mono font-bold text-xl text-orange-400">{item.number}</td>
                  <td className="p-4 font-bold text-slate-200 uppercase text-sm">{item.service}</td>
                  <td className="p-4 text-xs text-slate-400">
                    <ul className="space-y-1">
                      {item.enu.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-emerald-500">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tools.split(', ').map((tool, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => copyToClipboard(tool)}
                          className="flex items-center gap-1 bg-black/50 hover:bg-emerald-500 hover:text-black text-emerald-400/80 px-2 py-0.5 rounded border border-emerald-500/10 text-[9px] font-mono transition-all"
                          title={`Copy ${tool}`}
                        >
                          {tool} <Copy size={8} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortMasterList;