import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/accidentdashboard/Sidebar3"; // Ensure paths are correct
import StatsCard from "../../components/accidentdashboard/StatsCard";
import RecentAccidents from "../../components/accidentdashboard/RecentAccidents"; // This is your "Recent accidents" card
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
  
  // State for the live-updating time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // Cleanup function to stop the timer
    return () => clearInterval(timer);
  }, []);

  // Format the date and time for display
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div className="flex h-screen w-full font-sans bg-slate-800 text-white">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-400">
            NGOs Dashboard
          </h1>
          <p className="text-gray-400">{formattedDateTime}</p>
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
        
        {/* --- THIS IS THE FIX --- */}
        {/* Pass the 'listPageUrl' prop to the RecentAccidents component */}
        <RecentAccidents 
            accidents={accidents} 
            loading={loading} 
            onUpdate={refreshAccidents}
            listPageUrl="/ngos/list" 
        />
      </aside>
    </div>
  );
}