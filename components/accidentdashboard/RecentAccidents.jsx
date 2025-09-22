import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { collection, getDocs, getFirestore, query, orderBy, limit } from "firebase/firestore";
import AccidentsDetails from "./accidentDetails"; // This is your individual card component

// --- Custom Hook: To fetch the most recent accidents ---
// This keeps your data logic separate while ensuring the correct sorting.
const useRecentAccidents = (itemLimit = 3) => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccidents = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const q = query(
        collection(db, "fire"), 
        orderBy("datetime", "desc"), // This ensures the newest accidents are always first
        limit(itemLimit)
      );
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

  return { accidents, loading, error, refresh: fetchAccidents };
};

// --- Main Card Component ---
// The UI now matches your original design exactly.
export default function RecentAccidents({ listPageUrl = "#", onUpdate }) { 
  const { accidents, loading, error, refresh } = useRecentAccidents(3);

  // This function handles the display of the accident list or loading/error messages.
  const renderContent = () => {
    if (loading) return <p className="px-6 py-4 text-center text-gray-400">Loading...</p>;
    if (error) return <p className="px-6 py-4 text-center text-red-400">Error loading data.</p>;
    if (accidents.length === 0) return <p className="px-6 py-4 text-center text-gray-400">No recent accidents.</p>;
    
    return accidents.map((accident) => (
      <AccidentsDetails key={accident.id} accident={accident} onUpdate={onUpdate || refresh} />
    ));
  };

  return (
    <div className="flex h-full flex-col gap-y-4 rounded-lg bg-gray-900 p-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold leading-loose text-white">
          Recent accidents
        </h2>
        <button className="flex items-center gap-x-2.5 rounded-lg border border-gray-700 px-4 py-3 text-sm text-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13.3333C9.81 13.3333 9.6206 13.2691 9.46643 13.1399L4.46643 8.97328C4.11309 8.67911 4.06476 8.15328 4.35976 7.79995C4.65393 7.44661 5.17893 7.39911 5.53309 7.69328L10.0089 11.4233L14.4773 7.82745C14.8356 7.53911 15.3606 7.59578 15.6489 7.95411C15.9373 8.31245 15.8806 8.83661 15.5223 9.12578L10.5223 13.1491C10.3698 13.2716 10.1848 13.3333 10 13.3333" fill="white"/>
          </svg>
          <span>Today</span>
        </button>
      </div>
      <hr className="border-gray-700" />
      
      <div className="flex flex-col flex-grow gap-y-2 overflow-y-auto pr-2">
        {renderContent()}
      </div>

      <div className="mt-auto pt-4">
        <Link href={listPageUrl} className="block w-full rounded-lg border border-red-500 py-3.5 text-center text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white">
            View all
        </Link>
      </div>
    </div>
  );
}