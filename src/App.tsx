import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; 
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import NotePageWrapper from "./pages/NotePageWrapper";
import HashTool from "./components/hash-identifier";
import WordlistPage from "./components/wordlist-identifier";
import ShellGenerator from "./components/shell-generator";
import ReconNotes from "./components/reconNotes"; 

export default function App() {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-950">
        {/* Sidebar Container: Width fix yahan hai */}
        <div className="flex-none w-[320px] bg-gray-900 border-r border-gray-800 transition-all duration-300">
          <Sidebar notesOpen={notesOpen} setNotesOpen={setNotesOpen} />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hash-id" element={<HashTool />} />
            <Route path="/wordlists" element={<WordlistPage />} />
            <Route path="/shells" element={<ShellGenerator />} />
            <Route path="/notes/:slug" element={<NotePageWrapper />} />
          </Routes>

          {notesOpen && (
            <div className="fixed right-6 bottom-6 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
              {/* onClose pass kiya taake button kaam kare */}
              <ReconNotes onClose={() => setNotesOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}