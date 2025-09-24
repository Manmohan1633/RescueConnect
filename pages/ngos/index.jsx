import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

// --- THIS IS THE FIX (Part 1) ---
// We now import the single, reusable Sidebar component.
import Sidebar from "../../components/accidentdashboard/Sidebar"; // Ensure this is the correct path to your new reusable sidebar
import StatsCard from "../../components/accidentdashboard/StatsCard";
import RecentAccidents from "../../components/accidentdashboard/RecentAccidents";
import Map from "../../components/map/mapadmin";

// --- Custom Hook to Fetch and Manage All Accident Data ---
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    // We don't set loading to true on refresh for a smoother UI
    try {
      const db = getFirestore();
      const q = query(collection(db, "fire"), orderBy("datetime", "desc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setAccidents(newData);
    } catch (err) {
      console.error("Error fetching accidents:", err);
      setError(err);
    } finally {
      // Only set loading to false on the initial load
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidents();
  }, []);

  const statusCounts = useMemo(() => {
    return accidents.reduce(
      (counts, acc) => {
        const status = acc.status || "NEW";
        if (status in counts) counts[status]++;
        return counts;
      },
      { NEW: 0, PENDING: 0, DONE: 0 }
    );
  }, [accidents]);

  return { accidents, loading, error, statusCounts, refreshAccidents: fetchAccidents };
};

// --- Sub-Component for the Dashboard Header ---
const DashboardHeader = ({ title }) => {
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
        <header>
            <h1 className="text-3xl font-semibold leading-loose text-red-400">{title}</h1>
            <p className="text-gray-400">{formattedDateTime}</p>
        </header>
    );
};

// --- Main NGOs Dashboard Component ---
export default function NGOsDashboard() {
  const { accidents, loading, error, statusCounts, refreshAccidents } = useAccidentsData();
  
  // --- THIS IS THE FIX (Part 2) ---
  // Define the navigation links specifically for the NGOs dashboard
  const ngosMenuItems = [
    {
      name: "NGOs Dashboard",
      href: "/ngos",
      icon: "https://img.icons8.com/ios-glyphs/40/ffffff/home-page--v1.png",
    },
    {
      name: "Accident List",
      href: "/ngos/list",
      icon: "https://img.icons8.com/ios-filled/50/ffffff/traffic-accident.png",
    },
  ];

  // This hook correctly sorts ALL accidents by status priority.
  const sortedAccidentsList = useMemo(() => {
    const statusOrder = { "NEW": 1, "PENDING": 2, "DONE": 3 };
    const sortedAccidents = [...accidents].sort((a, b) => {
      const statusA = statusOrder[a.status || "NEW"] || 99;
      const statusB = statusOrder[b.status || "NEW"] || 99;
      return statusA - statusB;
    });
    return sortedAccidents;
  }, [accidents]);

  return (
    <div className="flex h-screen w-full font-sans bg-slate-800 text-white">
      {/* Pass the ngos-specific links to the reusable Sidebar */}
      <Sidebar menuItems={ngosMenuItems} />

      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        <DashboardHeader title="NGOs Dashboard" />
        
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        
        <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden">
          {/* The map receives the original, date-sorted list of all accidents */}
          <Map accidents={accidents} />
        </div>
      </main>

      <aside className="flex w-[30rem] flex-col gap-y-6 p-6 pr-6">
        {/* The side card receives the status-sorted list */}
        <RecentAccidents 
            accidents={sortedAccidentsList} 
            loading={loading} 
            onUpdate={refreshAccidents}
            listPageUrl="/ngos/list" 
        />
      </aside>
    </div>
  );
}