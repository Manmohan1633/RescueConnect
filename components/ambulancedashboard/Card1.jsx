import React, { useState, useEffect } from "react";
import { collection, getDocs, getFirestore, query, orderBy, limit } from "firebase/firestore";
import AccidentsDetails from "./accidentDetails"; // Ensure this is the correct path

// --- Custom Hook to fetch recent accidents ---
const useRecentAccidents = (itemLimit) => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchRecentAccidents();
  }, [itemLimit]);

  return { accidents, loading, error };
};

// --- The Main Component ---
export default function RecentAccidentsCard() {
  const { accidents, loading, error } = useRecentAccidents(2);

  const renderContent = () => {
    if (loading) return <p className="py-4 text-center text-gray-400">Loading reports...</p>;
    if (error) return <p className="py-4 text-center text-red-400">Could not load reports.</p>;
    if (accidents.length === 0) return <p className="py-4 text-center text-gray-400">No recent accidents.</p>;
    
    return accidents.map((accident) => (
      <AccidentsDetails key={accident.id} accident={accident} />
    ));
  };

  return (
    // --- THIS IS THE FIX ---
    // The background is now a semi-transparent dark slate color.
    // This gives it a distinct background that fits the dark theme.
    <div className="relative flex h-full flex-col rounded-2xl bg-slate-800/50 p-2 shadow-lg">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-lg font-bold text-gray-100">Recent Accidents</h3>
        <a href="#" className="text-sm font-medium text-red-500 hover:underline">
          View all
        </a>
      </div>
      
      <div className="flex-grow overflow-y-auto pt-2">
        {renderContent()}
      </div>

      {/* The fade effect now fades from the card's own background color */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none"></div>
    </div>
  );
}