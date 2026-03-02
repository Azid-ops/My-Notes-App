import { Link, useLocation } from "react-router-dom";
import pagesData from "../data/sidebarpages.json";
import { useState, type JSX } from "react";
import { FiChevronDown, FiChevronRight, FiFileText, FiBook, FiCircle, FiHome } from "react-icons/fi";

type SidebarItemType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  children?: SidebarItemType[];
};

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

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const sectionIcons: Record<string, JSX.Element> = {
    Walkthroughs: <FiBook />,
    Notes: <FiFileText />
  };

  const getAlphabeticalGroups = (items: SidebarItemType[]) => {
    const groups: Record<string, SidebarItemType[]> = {};
    items.forEach((item) => {
      const firstLetter = item.title[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(item);
    });
    return groups;
  };

const renderItem = (item: SidebarItemType, level = 0) => {
  const hasChildren = !!item.children?.length;
  const isExpanded = expandedItems[item.id] ?? true;
  const isActive = location.pathname === `/notes/${item.slug}`;

  return (
    <div key={item.id} className="mb-1">
      <div className="flex items-center w-full">
        {hasChildren ? (
          // Parent item (Dropdown only)
          <button
            onClick={() => toggleItem(item.id)}
            style={{ paddingLeft: `${1.5 + level * 1}rem` }}
            className="flex-1 flex items-center justify-between py-2 text-sm rounded-md
              bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <div className="flex items-center">
              {!collapsed && <FiCircle className="mr-2 text-xs" />}
              {!collapsed && item.title}
            </div>

            {!collapsed &&
              (isExpanded ? <FiChevronDown /> : <FiChevronRight />)}
          </button>
        ) : (
          // Leaf item (Navigation)
          <Link
            to={`/notes/${item.slug}`}
            style={{ paddingLeft: `${1.5 + level * 1}rem` }}
            className={`flex-1 flex items-center py-2 text-sm rounded-md transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-md"
                  : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
          >
            {!collapsed && <FiCircle className="mr-2 text-xs" />}
            {!collapsed && item.title}
          </Link>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children!.map((child) => renderItem(child, level + 1))}
        </div>
      )}
    </div>
  );
};
  return (
    <aside
      className={`${collapsed ? "w-20" : "w-82"} bg-gray-900 text-white h-screen p-4 flex flex-col transition-all duration-300 shadow-xl`}
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
      <nav className="flex flex-col flex-1 overflow-auto pr-1">
        {/* Home */}
        <Link
          to="/"
          className={`flex items-center px-3 py-2 mb-1 rounded-md text-sm font-semibold transition-colors duration-200
            ${location.pathname === "/" ? "bg-blue-600 text-white font-medium shadow-md" : "bg-transparent text-gray-200 hover:bg-gray-700 hover:text-white"}`}
        >
          {!collapsed && <FiHome className="mr-2" />}
          {!collapsed && "Home"}
        </Link>

        {pagesData.map((section) => (
          <div key={section.section} className="mb-4">
            <button
              onClick={() => toggleSection(section.section)}
              className={`flex items-center justify-between w-full px-3 py-2 mb-1 rounded-md text-sm font-semibold transition-all duration-200
                ${expandedSections[section.section] ? "bg-gray-700 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"}`}
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

            {expandedSections[section.section] && (
              <div className="ml-0 mt-2">
                {["Walkthroughs", "Notes"].includes(section.section)
                  ? Object.entries(getAlphabeticalGroups(section.items))
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([letter, items]) => (
                        <div key={letter} className="mb-2">
                          {!collapsed && (
                            <div className="px-6 py-1 text-xs font-bold text-gray-400 uppercase">{letter}</div>
                          )}
                          {items.map((item) => renderItem(item))}
                        </div>
                      ))
                  : section.items.map((item) => renderItem(item))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-auto text-gray-400 text-xs text-center py-2 border-t border-gray-700">
          &copy; 2026 My Notes App
        </div>
      )}
    </aside>
  );
}