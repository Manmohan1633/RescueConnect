import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";

import Sidebar from "../../components/accidentdashboard/Sidebar3"; // Ensure paths are correct
import StatsCard from "../../components/accidentdashboard/StatsCard";
import AccidentsDetails from "../../components/accidentdashboard/accidentDetails"; // The detail card for each accident
import Tabs from "../../components/accidents/tabs"; // The filter tabs

// --- Custom Hook to Fetch and Manage All Accident Data ---
// This keeps your data logic separate and reusable.
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      // Query to get all documents, ordered by the newest first
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

// --- Main Police Accident List Page Component ---
export default function PoliceListPage() {
  const { accidents, loading, error, statusCounts, refreshAccidents } = useAccidentsData();
  const [filter, setFilter] = useState("All");

  // Memoize the filtered list for better performance
  const filteredAccidents = useMemo(() => {
    if (filter === "All") return accidents;
    return accidents.filter((acc) => (acc.status || "NEW") === filter);
  }, [accidents, filter]);

  const formattedDate = new Date().toString();

  return (
    <div className="flex h-screen w-full font-sans bg-gray-900 text-white">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
        
        {/* Corrected Header */}
        <header>
          <h1 className="text-3xl font-semibold leading-loose text-red-400">
            NGOs Accident List
          </h1>
          <p className="text-gray-400">{formattedDate}</p>
        </header>

        {/* Stats Cards */}
        <div>
          <StatsCard counts={statusCounts} />
        </div>
        
        {/* Filtering Tabs */}
        <div>
            <Tabs onTabChange={setFilter} />
        </div>

        {/* --- Corrected Accident List Container --- */}
        <div className="flex-grow rounded-2xl bg-gray-800/50 p-2">
            {loading && <p className="py-4 text-center text-gray-400">Loading incidents...</p>}
            {error && <p className="py-4 text-center text-red-400">Could not load incidents.</p>}
            {!loading && filteredAccidents.length === 0 && (
                <p className="py-4 text-center text-gray-400">No incidents found for this category.</p>
            )}
            {filteredAccidents.map((accident) => (
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