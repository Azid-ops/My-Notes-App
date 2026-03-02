import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import NotePageWrapper from "./pages/NotePageWrapper";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <div className="flex-none w-[350px] bg-gray-200 dark:bg-gray-800">
    <Sidebar />
  </div>

  {/* Main content */}
  <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notes/:slug" element={<NotePageWrapper />} />
    </Routes>
  </main>
</div>
    </Router>
  );
}
