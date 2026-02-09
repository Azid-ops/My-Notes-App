import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import NotePage from "./pages/NotePage";

// App.tsx
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes/:slug" element={<NotePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
