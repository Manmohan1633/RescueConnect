import React, { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import { collection, getDocs, getFirestore, query, orderBy, limit } from "firebase/firestore";
import AccidentsDetails from "./accidentDetails"; // This is your individual card component
import { isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

// --- Custom Hook to fetch recent accidents ---
const useRecentAccidents = (itemLimit = 50) => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    // We don't need to set loading: true on every refresh for a smoother UI
    try {
      const db = getFirestore();
      const q = query(collection(db, "fire"), orderBy("datetime", "desc"), limit(itemLimit));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAccidents(newData);
    } catch (err) {
      console.error("Error fetching recent accidents:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidents();
  }, [itemLimit]);

  // --- THIS IS THE FIX (Part 1) ---
  // Return the refresh function so the component can re-fetch its own data.
  return { accidents, loading, error, refresh: fetchAccidents };
};

// A helper function to safely convert different date formats into a JS Date object.
const getDateFromTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
    }
    try {
        return parseISO(timestamp);
    } catch (e) {
        console.warn("Could not parse date:", timestamp);
        return null;
    }
};


// --- Reusable Sub-Components ---
const CardHeader = ({ title, filter, setFilter }) => (
  <div className="flex items-center justify-between px-6">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    <select 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
    >
        <option value="Today">Today</option>
        <option value="Yesterday">Yesterday</option>
        <option value="This Week">This Week</option>
        <option value="All Time">All Time</option>
    </select>
  </div>
);

const ViewAllButton = ({ href }) => (
    <Link href={href} className="block w-full rounded-lg border border-red-500 py-3.5 text-center text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white">
        View all
    </Link>
);


// --- Main Card Component with Filtering and Sorting Logic ---
export default function RecentAccidents({ listPageUrl = "#", onUpdate }) { 
  // The hook now provides a 'refresh' function
  const { accidents, loading, error, refresh } = useRecentAccidents(50);
  const [filter, setFilter] = useState("Today");

  const filteredAndSortedAccidents = useMemo(() => {
    if (!accidents) return [];
    const statusOrder = { "NEW": 1, "PENDING": 2, "DONE": 3 };
    let dateFilteredAccidents = [];

    switch(filter) {
        case "Today":
            dateFilteredAccidents = accidents.filter(acc => isToday(getDateFromTimestamp(acc.datetime)));
            break;
        case "Yesterday":
            dateFilteredAccidents = accidents.filter(acc => isYesterday(getDateFromTimestamp(acc.datetime)));
            break;
        case "This Week":
            dateFilteredAccidents = accidents.filter(acc => isThisWeek(getDateFromTimestamp(acc.datetime), { weekStartsOn: 1 }));
            break;
        default: // All Time
            dateFilteredAccidents = accidents;
            break;
    }

    return [...dateFilteredAccidents].sort((a, b) => {
        const statusA = statusOrder[a.status || "NEW"] || 99;
        const statusB = statusOrder[b.status || "NEW"] || 99;
        return statusA - statusB;
    });
  }, [accidents, filter]);

  // --- THIS IS THE FIX (Part 2) ---
  // This function will be called from the child card. It refreshes this component's
  // data AND calls the main dashboard's refresh function.
  const handleUpdate = () => {
      console.log("Refreshing RecentAccidents list...");
      refresh(); // Refresh this component's own data
      if (onUpdate) {
          console.log("Refreshing parent dashboard...");
          onUpdate(); // Refresh the main dashboard (stats, map, etc.)
      }
  };

  const renderContent = () => {
    if (loading) return <p className="px-6 py-4 text-center text-gray-400">Loading...</p>;
    if (error) return <p className="px-6 py-4 text-center text-red-400">Error loading data.</p>;
    if (filteredAndSortedAccidents.length === 0) return <p className="px-6 py-4 text-center text-gray-400">No accidents for this period.</p>;
    
    // Pass the new 'handleUpdate' function down to each detail card
    return filteredAndSortedAccidents.map((accident) => (
      <AccidentsDetails key={accident.id} accident={accident} onUpdate={handleUpdate} />
    ));
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-gray-900 p-6 gap-y-4">
      <CardHeader title="Recent Accidents" filter={filter} setFilter={setFilter} />
      <hr className="border-gray-700" />
      
      <div className="flex flex-col flex-grow gap-y-2 overflow-y-auto pr-2">
        {renderContent()}
      </div>

      <ViewAllButton href={listPageUrl} />
    </div>
  );
}