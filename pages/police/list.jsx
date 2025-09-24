import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/accidentdashboard/Sidebar"; // Ensure paths are correct
import StatsCard from "../../components/accidentdashboard/StatsCard";
import AccidentsDetails from "../../components/accidentdashboard/accidentDetails";
import Tabs from "../../components/accidents/tabs";

// --- Custom Hook to Fetch and Manage All Accident Data ---
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const q = query(collection(db, "fire"), orderBy("datetime", "desc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAccidents(newData);
    } catch (err) {
      console.error("Error fetching accidents:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidents();
  }, []);

  const statusCounts = useMemo(() => {
    return accidents.reduce(
      (counts, acc) => {
        const status = acc.status || "NEW";
        if (status in counts) {
          counts[status]++;
        }
        return counts;
      },
      { NEW: 0, PENDING: 0, DONE: 0 }
    );
  }, [accidents]);

  return { accidents, loading, error, statusCounts, refreshAccidents: fetchAccidents };
};

// --- Main Police Accident List Page Component ---
export default function PoliceListPage() {
  const { accidents, loading, error, statusCounts, refreshAccidents } = useAccidentsData();
  const [filter, setFilter] = useState("All");

  // --- THIS IS THE FIX (Part 1) ---
  // State for the live-updating time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Cleanup function to stop the timer when the component is removed
    return () => clearInterval(timer);
  }, []); // Empty array ensures this effect runs only once on mount

  // Format the date and time for a user-friendly display
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const filteredAndSortedAccidents = useMemo(() => {
    const statusOrder = { "NEW": 1, "PENDING": 2, "DONE": 3 };
    const filterMap = {
        "new": "NEW",
        "pending": "PENDING",
        "completed": "DONE"
    };
    const dbStatusFilter = filterMap[filter.toLowerCase()];
    const filtered = filter.toLowerCase() === 'all'
      ? accidents
      : accidents.filter(acc => (acc.status || "NEW") === dbStatusFilter);

    return [...filtered].sort((a, b) => {
      const statusA = statusOrder[a.status || "NEW"] || 99;
      const statusB = statusOrder[b.status || "NEW"] || 99;
      return statusA - statusB;
    });
  }, [accidents, filter]);

  return (
    <div className="flex h-screen w-full font-sans bg-gray-900 text-white">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-400">
            Police Accident List
          </h1>
          {/* --- THIS IS THE FIX (Part 2) --- */}
          {/* Display the newly formatted, live-updating date and time */}
          <p className="text-gray-400">{formattedDateTime}</p>
        </header>
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        <div>
          <Tabs onTabChange={setFilter} />
        </div>
        <div className="flex-grow rounded-2xl bg-gray-800/50 p-2">
            {loading && <p className="py-4 text-center text-gray-400">Loading incidents...</p>}
            {error && <p className="py-4 text-center text-red-400">Could not load incidents.</p>}
            {!loading && filteredAndSortedAccidents.length === 0 && (
                <p className="py-4 text-center text-gray-400">No incidents found for this category.</p>
            )}
            {filteredAndSortedAccidents.map((accident) => (
                <AccidentsDetails
                    key={accident.id}
                    accident={accident}
                    onUpdate={refreshAccidents}
                />
            ))}
        </div>
      </main>
    </div>
  );
}