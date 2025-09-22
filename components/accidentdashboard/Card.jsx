import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { collection, getDocs, getFirestore, query, orderBy, limit } from "firebase/firestore";
import AccidentsDetails from "./accidentDetails"; // Ensure this is the correct path

// --- Custom Hook to fetch recent accidents ---
// This remains the same as it's already well-structured.
const useRecentAccidents = (itemLimit) => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentAccidents = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const accidentsQuery = query(
        collection(db, "fire"), 
        orderBy("datetime", "desc"), 
        limit(itemLimit)
      );
      
      const querySnapshot = await getDocs(accidentsQuery);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setAccidents(newData);
    } catch (err) {
      console.error("Error fetching recent accidents:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentAccidents();
  }, [itemLimit]);

  return { accidents, loading, error, refresh: fetchRecentAccidents };
};


// --- STRUCTURAL IMPROVEMENT 1: Sub-Components ---
// Breaking the UI into smaller pieces makes the main component easier to read.

const CardHeader = ({ title, viewAllUrl }) => (
    <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
        <Link href={viewAllUrl} className="text-sm font-medium text-red-500 hover:underline">
            View all
        </Link>
    </div>
);

const AccidentList = ({ loading, error, accidents, onUpdate }) => {
    if (loading) return <p className="py-4 text-center text-gray-400">Loading reports...</p>;
    if (error) return <p className="py-4 text-center text-red-500">Could not load reports.</p>;
    if (accidents.length === 0) return <p className="py-4 text-center text-gray-400">No recent accidents.</p>;
    
    return accidents.map((accident) => (
      <AccidentsDetails key={accident.id} accident={accident} onUpdate={onUpdate} />
    ));
};


// --- The Main Component (Now much cleaner) ---
export default function RecentAccidentsCard({ listPageUrl = "#", onUpdate }) {
  // Use the custom hook to get the 2 most recent accidents.
  const { accidents, loading, error, refresh } = useRecentAccidents(2);
  
  // This function ensures both this component and the parent can refresh the data
  const handleUpdate = () => {
      refresh();
      if (onUpdate) {
          onUpdate();
      }
  }

  return (
    // The UI container remains exactly the same as you requested.
    <div className="relative flex h-full flex-col rounded-2xl bg-transparent p-2">
      
      <CardHeader title="Recent Accidents" viewAllUrl={listPageUrl} />
      
      <div className="flex-grow overflow-y-auto pt-2">
        <AccidentList 
            loading={loading}
            error={error}
            accidents={accidents}
            onUpdate={handleUpdate}
        />
      </div>

    </div>
  );
}