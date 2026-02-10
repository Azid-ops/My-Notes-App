import { Link, useLocation } from "react-router-dom";
import pagesData from "../data/sidebarpages.json";
import { useState, type JSX } from "react";
import { FiChevronDown, FiChevronRight, FiFileText, FiBook, FiCircle, FiHome } from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () =>
      pagesData.reduce((acc, section) => {
        acc[section.section] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const sectionIcons: Record<string, JSX.Element> = {
    Walkthroughs: <FiBook />,
    Notes: <FiFileText />
  };

  // Group items alphabetically
  const getAlphabeticalGroups = (items: typeof pagesData[0]["items"]) => {
    const groups: Record<string, typeof items> = {};
    items.forEach((item) => {
      const firstLetter = item.title[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(item);
    });
    return groups;
  };

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} bg-gray-900 text-white h-screen p-4 flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            My Notes
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition transform hover:scale-110"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1 overflow-auto pr-1">
        {/* Home */}
        <Link
          to="/"
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200
            ${location.pathname === "/" ? "bg-blue-600 text-white font-medium shadow-md" : "text-gray-200 hover:bg-gray-700 hover:text-white"}`}
        >
          {!collapsed && <FiHome className="mr-2" />}
          {!collapsed && "Home"}
        </Link>

        {/* Sections */}
        {pagesData.map((section) => (
          <div key={section.section} className="mb-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.section)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${expandedSections[section.section] ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              <div className="flex items-center gap-2">
                {sectionIcons[section.section]}
                {!collapsed && section.section}
              </div>
              {!collapsed && (
                <span className="text-gray-400">
                  {expandedSections[section.section] ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              )}
            </button>

            {/* Section Items */}
            {expandedSections[section.section] && (
              <div>
                {/* Alphabetically grouped for Walkthroughs and Notes */}
                {["Walkthroughs", "Notes"].includes(section.section) ? (
                  Object.entries(getAlphabeticalGroups(section.items))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([letter, items]) => (
                      <div key={letter} className="mb-2">
                        {!collapsed && (
                          <div className="px-6 py-1 text-xs font-bold text-gray-400 uppercase">{letter}</div>
                        )}
                        {items.map((item) => {
                          const isActive = location.pathname === `/notes/${item.slug}`;
                          return (
                            <Link
                              key={item.id}
                              to={`/notes/${item.slug}`}
                              className={`flex items-center px-8 py-1 text-sm rounded-md transition-colors duration-200
                                ${isActive ? "bg-blue-600 text-white font-medium shadow-md" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                            >
                              {!collapsed && <FiCircle className="mr-2 text-xs" />}
                              {!collapsed && item.title}
                            </Link>
                          );
                        })}
                      </div>
                    ))
                ) : (
                  // Regular list for other sections
                  section.items.map((item) => {
                    const isActive = location.pathname === `/notes/${item.slug}`;
                    return (
                      <Link
                        key={item.id}
                        to={`/notes/${item.slug}`}
                        className={`flex items-center px-6 py-1 text-sm rounded-md transition-colors duration-200
                          ${isActive ? "bg-blue-600 text-white font-medium shadow-md" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                      >
                        {!collapsed && <FiCircle className="mr-2 text-xs" />}
                        {!collapsed && item.title}
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto text-gray-400 text-xs text-center py-2 border-t border-gray-700">
          &copy; 2026 My Notes App
        </div>
      )}
    </aside>
  );
}
