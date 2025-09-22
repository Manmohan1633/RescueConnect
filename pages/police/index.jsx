import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/accidentdashboard/Sidebar3"; // Ensure paths are correct
import StatsCard from "../../components/accidentdashboard/StatsCard";
import RecentAccidents from "../../components/accidentdashboard/RecentAccidents";
import Map from "../../components/map/mapadmin";

// --- Custom Hook to Fetch and Manage All Accident Data ---
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    // No need to set loading to true on every refresh for a smoother UI
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

// --- Main Police Dashboard Component ---
export default function PoliceDashboard() {
  const { accidents, loading, error, statusCounts, refreshAccidents } = useAccidentsData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  // --- THIS IS THE FIX (Part 1) ---
  // Create a smaller list of just the most recent accidents.
  // useMemo ensures this only recalculates when the main 'accidents' list changes.
  const recentAccidentsList = useMemo(() => {
      return accidents.slice(0, 3); // Get the first 3 newest items
  }, [accidents]);

  return (
    <div className="flex h-screen w-full font-sans bg-slate-800 text-white">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-400">Police Dashboard</h1>
          <p className="text-gray-400">{formattedDateTime}</p>
        </header>
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden">
          <Map accidents={accidents} />
        </div>
      </main>
      <aside className="flex w-[30rem] flex-col gap-y-6 p-6 pr-6">
        {/* --- THIS IS THE FIX (Part 2) --- */}
        {/* Pass the smaller 'recentAccidentsList' and the 'refreshAccidents' function */}
        <RecentAccidents 
            accidents={recentAccidentsList} 
            loading={loading} 
            onUpdate={refreshAccidents}
            listPageUrl="/police/list" 
        />
      </aside>
    </div>
  );
}