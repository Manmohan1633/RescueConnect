import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

// --- THIS IS THE FIX (Part 1) ---
// We now import the single, reusable Sidebar component.
import Sidebar from "../../components/accidentdashboard/Sidebar"; // Ensure this is the correct path
import StatsCard from "../../components/accidentdashboard/StatsCard";
import AccidentsDetails from "../../components/accidentdashboard/accidentDetails";
import Tabs from "../../components/accidents/tabs";

// --- Custom Hook to Fetch and Manage All Accident Data ---
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    // No need to set loading to true on refresh for a smoother UI
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
      if(loading) setLoading(false);
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- THIS IS THE FIX (Part 2) ---
  // We define the navigation links specifically for THIS page's sidebar.
  const firebrigadeMenuItems = [
    {
      name: "Police Dashboard",
      href: "/firebrigade", // The link to the main dashboard
      icon: "https://img.icons8.com/ios-glyphs/40/ffffff/home-page--v1.png",
    },
    {
      name: "Accident List",
      href: "/firebrigade/list", // The link to this page itself
      icon: "https://img.icons8.com/ios-filled/50/ffffff/traffic-accident.png",
    },
  ];
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const filteredAndSortedAccidents = useMemo(() => {
    const statusOrder = { "NEW": 1, "PENDING": 2, "DONE": 3 };
    const filterMap = { "new": "NEW", "pending": "PENDING", "completed": "DONE" };
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
    <div className="flex h-screen w-full font-sans bg-gray-800 text-white">
      {/* --- THIS IS THE FIX (Part 3) --- */}
      {/* We pass the firebrigade-specific links to the Sidebar component. */}
      <Sidebar menuItems={firebrigadeMenuItems} />

      <main className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-400">
            Police Accident List
          </h1>
          <p className="text-gray-400">{formattedDateTime}</p>
        </header>
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        <div>
          <Tabs onTabChange={setFilter} />
        </div>
        <div className="flex-grow rounded-2xl bg-gray-900/50 p-2">
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