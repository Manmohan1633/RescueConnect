import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/accidentdashboard/Sidebar31"; // Ensure this is the correct Sidebar
import StatsCard from "../../components/accidentdashboard/StatsCard";
import RecentAccidents from "../../components/accidentdashboard/RecentAccidents";
import Map from "../../components/map/mapadmin"; // Assuming the admin map is used here

// --- Custom Hook to Fetch and Manage All Accident Data ---
// This centralizes your data fetching logic for this page.
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
      { NEW: 0, PENDING: 0, DONE: 0 }
    );
  }, [accidents]);

  return { accidents, loading, error, statusCounts, refreshAccidents: fetchAccidents };
};

// --- Main Fire Brigade Dashboard Component ---
export default function FireBrigadeDashboard() {
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

  return (
    // --- THIS IS THE CORRECTED LAYOUT ---
    <div className="flex h-screen w-full font-sans bg-gray-800 text-white">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-300">
            FireBrigade Dashboard
          </h1>
          <p className="text-gray-400">{formattedDateTime}</p>
        </header>

        {/* Stats Cards now receive the dynamic counts */}
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        
        {/* The map fills the remaining space and receives live data */}
        <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden">
          {/* We now pass the fetched accidents array to the Map component */}
          <Map accidents={accidents} />
        </div>
      </main>

      {/* Aside for Recent Accidents */}
      <aside className="flex w-96 flex-col gap-y-6 p-6">
        {/* This component receives data, a refresh function, and the correct "View all" link */}
        <RecentAccidents 
            accidents={accidents} 
            loading={loading} 
            onUpdate={refreshAccidents}
            listPageUrl="/fireforce/list"
        />
      </aside>
    </div>
  );
}