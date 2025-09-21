import React, { useState } from "react";
import clsx from "clsx"; // A utility for conditionally joining class names. Install with: npm install clsx

// An array to hold the tab data. This makes it easy to add or remove tabs.
const tabItems = ["All", "New", "Pending", "Completed"];

export default function Tabs({ onTabChange }) {
  // 'useState' to keep track of the currently active tab.
  // It's initialized to the first item in our array.
  const [activeTab, setActiveTab] = useState(tabItems[0]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // If a function is passed as a prop, call it with the new active tab.
    // This lets the parent component know which tab is selected.
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <nav
      className="flex w-full rounded-lg bg-gray-100 p-1.5 dark:bg-gray-800"
      aria-label="Tabs"
      role="tablist"
    >
      {tabItems.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
            {
              // Active state styles
              "bg-red-600 text-white shadow": activeTab === tab,
              // Inactive state styles
              "text-gray-600 hover:bg-red-200 hover:text-red-700 dark:text-gray-400 dark:hover:bg-gray-700":
                activeTab !== tab,
            }
          )}
          role="tab"
          aria-selected={activeTab === tab}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

