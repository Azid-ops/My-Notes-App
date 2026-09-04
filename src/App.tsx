import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; 
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import NotePageWrapper from "./pages/NotePageWrapper";
import HashTool from "./components/hash-identifier";
import WordlistPage from "./components/wordlist-identifier";
import ShellGenerator from "./components/shell-generator";
import ReconNotes from "./components/reconNotes"; 
import PortMasterList from "./components/ports";
import FullCPTSReport from "./components/generate-report";

export default function App() {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-950">
        {/* Sidebar Container: Width fix yahan hai */}
        <div className="flex-none w-[320px] bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col justify-between">
          
          <div className="overflow-y-auto flex-1 flex flex-col">
            
            {/* Developer / Owner Profile Badge (Expanded with extra verification details) */}
            <div className="p-4 bg-gray-950 border-b border-gray-800">
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-1">Application Owner & Creator</p>
              <h2 className="text-sm font-bold text-white">Mahad Ali Awan</h2>
              <p className="text-[11px] text-gray-400 font-medium">BS Computer Science | Software Engineer</p>
              
              <div className="mt-3 space-y-1.5 text-xs text-gray-300 border-t border-gray-800/80 pt-2.5">
                <p className="flex items-center gap-1.5 truncate">
                  <span className="text-gray-500 font-medium w-14">Email:</span> 
                  <span className="text-gray-200 truncate">Mahad5063@gmail.com</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium w-14">Phone:</span> 
                  <span className="text-gray-200">+92 316 1897959</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium w-14">Location:</span> 
                  <span className="text-gray-200">Islamabad, Pakistan</span>
                </p>

                <p className="flex items-center gap-1.5 truncate">
                  <span className="text-gray-500 font-medium w-14">LinkedIn:</span> 
                  <a href="https://www.linkedin.com/in/mahad-ali-84137b220/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                    PROFILE
                  </a>
                </p>
              </div>
            </div>

            {/* Top Sidebar Content */}
            <div className="flex-1">
              <Sidebar notesOpen={notesOpen} setNotesOpen={setNotesOpen} />
            </div>

          </div>

          {/* Bottom Footer info */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/50 text-[11px] text-gray-500 text-center">
            CPTS & Cybersecurity Portfolio App
          </div>

        </div>

        {/* Main content */}
        <main className="flex-1 bg-blue-50/50 dark:bg-[#1e293b] overflow-auto relative transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hash-id" element={<HashTool />} />
            <Route path="/wordlists" element={<WordlistPage />} />
            <Route path="/shells" element={<ShellGenerator />} />
            <Route path="/notes/:slug" element={<NotePageWrapper />} />
            <Route path="/portsandtools" element={<PortMasterList />} />
            <Route path="/generate-report" element={<FullCPTSReport />} />
          </Routes>

          {notesOpen && (
            <div className="fixed right-6 bottom-6 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
              <ReconNotes onClose={() => setNotesOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}