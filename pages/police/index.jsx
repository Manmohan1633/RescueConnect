import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/ambulancedashboard/Sidebar3"; // Ensure paths are correct
import StatsCard from "../../components/ambulancedashboard/StatsCard";
import RecentAccidents from "../../components/ambulancedashboard/MostOrdered"; // This is your "Recent accidents" card
import Map from "../../components/map/mapadmin";

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

  // useMemo efficiently recalculates the counts only when the accidents list changes.
  const statusCounts = useMemo(() => {
    return accidents.reduce(
      (counts, acc) => {
        const status = acc.status || "NEW";
        if (status in counts) {
          counts[status]++;
        }
        return counts;
      },
      { NEW: 0, PENDING: 0, DONE: 0 } // Use the exact status names from your DB
    );
  }, [accidents]);

  return { accidents, loading, error, statusCounts, refreshAccidents: fetchAccidents };
};

// --- Main Police Dashboard Component ---
export default function PoliceDashboard() {
  // Fetch all data and counts using our custom hook
  const { accidents, loading, error, statusCounts, refreshAccidents } = useAccidentsData();
  
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

  // Format the date and time for display
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
  });


  return (
    <div className="flex h-screen w-full font-sans bg-slate-800 text-white">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        
        <header>
          <h1 className="text-3xl ml-1 font-semibold leading-loose text-red-300">
            Police Dashboard
          </h1>
          {/* --- THIS IS THE FIX (Part 2) --- */}
          {/* Display the newly formatted date and live time */}
          <p className="text-gray-400">{`${formattedDate} ${formattedTime}`}</p>
        </header>

        {/* Stats Cards now receive the calculated counts */}
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        
        {/* The map now takes up the remaining space and receives the accident data */}
        <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden">
          <Map accidents={accidents} />
        </div>
      </main>

      {/* Aside for Recent Accidents */}
      <aside className="flex w-[30rem] flex-col gap-y-6 p-6 pr-6">
        {/* The 'Recent Accidents' card now receives the data and a function to refresh */}
        <RecentAccidents 
            accidents={accidents} 
            loading={loading} 
            onUpdate={refreshAccidents}
        />
      </aside>
    </div>
  );
}