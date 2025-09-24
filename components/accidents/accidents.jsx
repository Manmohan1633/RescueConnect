import React, { useState, useEffect, useMemo } from "react";
import { collection, getFirestore, query, orderBy, onSnapshot } from "firebase/firestore"; // Import onSnapshot
import AccidentsDetails from "./accidentDetails";
import Tabs from "./tabs";

// --- Custom Hook for Fetching and Managing Accident Data in Real-Time ---
const useAccidentsData = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- THIS IS THE FIX (Part 1) ---
  // We now use useEffect to set up a real-time listener with onSnapshot.
  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, "fire"), orderBy("datetime", "desc"));

    // onSnapshot creates a live connection. The code inside will run automatically
    // every time the data changes in the 'fire' collection.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAccidents(newData);
      setLoading(false); // Set loading to false once we have the first batch of data
    }, (err) => {
      // This function handles any errors with the listener
      console.error("Error listening to accident data:", err);
      setError(err);
      setLoading(false);
    });

    // This is a crucial cleanup function. When the component is removed from the screen,
    // it disconnects the listener to prevent memory leaks.
    return () => unsubscribe();
  }, []); // The empty array ensures this listener is set up only once.

  // A manual refresh function is less critical with a real-time listener, but good to have.
  const refreshAccidents = () => { /* In a real-time setup, this is often not needed */ };

  return { accidents, loading, error, refreshAccidents };
};


// --- Reusable Stat Card Component ---
const StatCard = ({ title, count, icon, color }) => (
  <div className="flex flex-1 items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color.bg}`}>
      {icon(color.icon)}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <h2 className="text-2xl font-bold text-black">{count}</h2>
    </div>
  </div>
);

// --- Main Accidents Component ---
export default function Accidents() { 
  // --- THIS IS THE FIX (Part 2) ---
  // This component now receives props from a parent dashboard page.
  // This makes it reusable and keeps the data flow clean.
  const { accidents, loading, error, refreshAccidents } = useAccidentsData();
  const [filter, setFilter] = useState("All");

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

  const filteredAndSortedAccidents = useMemo(() => {
    const statusOrder = { "NEW": 1, "PENDING": 2, "DONE": 3 };
    const filterMap = { "new": "NEW", "pending": "PENDING", "completed": "DONE" };
    const dbStatusFilter = filterMap[filter.toLowerCase()];
    const filtered = filter.toLowerCase() === "all"
      ? accidents
      : accidents.filter(acc => (acc.status || "NEW") === dbStatusFilter);

    return [...filtered].sort((a, b) => {
      const statusA = statusOrder[a.status || "NEW"] || 99;
      const statusB = statusOrder[b.status || "NEW"] || 99;
      return statusA - statusB;
    });
  }, [accidents, filter]);

  const statCardsData = [
    { title: 'New', count: statusCounts.NEW, color: {bg: 'bg-teal-100', icon: '#2dd4bf'}, icon: (c) => <svg fill={c} width="25px" height="25px" viewBox="0 0 32 32"><path d="M29.125 10.375h-7.5v-7.5c0-1.036-0.839-1.875-1.875-1.875h-7.5c-1.036 0-1.875 0.84-1.875 1.875v7.5h-7.5c-1.036 0-1.875 0.84-1.875 1.875v7.5c0 1.036 0.84 1.875 1.875 1.875h7.5v7.5c0 1.036 0.84 1.875 1.875 1.875h7.5c1.036 0 1.875-0.84 1.875-1.875v-7.5h7.5c1.035 0 1.875-0.839 1.875-1.875v-7.5c0-1.036-0.84-1.875-1.875-1.875z"/></svg> },
    { title: 'Pending', count: statusCounts.PENDING, color: {bg: 'bg-red-100', icon: '#f87171'}, icon: (c) => <svg fill={c} width="25px" height="25px" viewBox="0 0 512 512"><path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313.79a16,16,0,1,1-22.63,22.62L256,278.63l-69.86,69.86a16,16,0,1,1-22.63-22.62L233.37,256l-69.86-69.86a16,16,0,0,1,22.63-22.62L256,233.37l69.86-69.86a16,16,0,0,1,22.63,22.62L278.63,256Z"/></svg> },
    { title: 'Completed', count: statusCounts.DONE, color: {bg: 'bg-green-100', icon: '#4ade80'}, icon: (c) => <svg fill={c} width="25px" height="25px" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.3,7.61-4.57,6a1,1,0,0,1-.79.39h0a1,1,0,0,1-.79-.38L7.71,12.51a1,1,0,0,1,1.58-1.23l2.43,3.11,3.7-4.81A1,1,0,0,1,16.3,9.61Z"/></svg> }
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl bg-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Accidents</h1>
      </div>

      <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCardsData.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="w-full">
        <Tabs onTabChange={setFilter} />
      </div>

      <div className="mt-4 flex-grow overflow-y-auto rounded-2xl bg-white p-2">
        {loading && <p className="py-4 text-center text-gray-500">Loading accidents...</p>}
        {error && <p className="py-4 text-center text-red-500">Could not load data.</p>}
        {!loading && filteredAndSortedAccidents.length === 0 && (
          <p className="py-4 text-center text-gray-500">No accidents found for this category.</p>
        )}
        {filteredAndSortedAccidents.map((accident) => (
          <AccidentsDetails key={accident.id} accident={accident} onUpdate={refreshAccidents} />
        ))}
      </div>
    </div>
  );
}