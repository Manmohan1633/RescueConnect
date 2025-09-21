import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getDatabase, ref, onValue } from "firebase/database";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";

import Sidebar from "../sidebar/Sidebar";
import Accidents from "../accidents/accidents";
import Map from "../map/map";
import { useAuth } from "../../context/AuthContext";
import { db, database } from "../../config/firebase";

// --- Custom Hook to Fetch Accidents from Firestore ---
const useAccidentsData = () => {
    const [accidents, setAccidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccidents = async () => {
        setLoading(true);
        try {
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, "fire"));
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

    return { accidents, loading, error, refreshAccidents: fetchAccidents };
};

// --- Custom Hook for Firebase Realtime Database Listener (for sensor) ---
const useRealtimeValue = (dbPath) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const dbRef = ref(getDatabase(), dbPath);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setValue(data);
    });
    return () => unsubscribe();
  }, [dbPath]);
  return value;
};


// --- Main Dashboard Component ---
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { accidents, loading, error, refreshAccidents } = useAccidentsData();
  
  // This logic for the real-time sensor remains the same.
  const tempData = useRealtimeValue("data");
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const temperatures = tempData ? Object.values(tempData) : [];
    if (temperatures.includes(1) && !hasTriggeredRef.current) {
      console.log("Fire detected! Adding document to Firestore.");
      hasTriggeredRef.current = true; // Prevent multiple triggers
      
      const firestore = getFirestore();
      const fireCollectionRef = collection(firestore, "fire");

      const newFireAlert = {
        title: "Fire at household",
        description: "Home sensor detected fire",
        intensity: "4",
        location: { latitude: 12.9141, longitude: 74.8560 },
        imageurl: "https://placehold.co/100x100/e2e8f0/334155?text=Fire",
        datetime: new Date().toISOString(),
        policehelp: true,
        firehelp: true,
        ambulancehelp: false,
        otherhelp: false,
        status: "NEW",
      };

      addDoc(fireCollectionRef, newFireAlert)
        .then(() => {
          console.log("Successfully added fire alert.");
          refreshAccidents(); // Refresh the list after adding a new one
        })
        .catch((err) => {
          console.error("Error adding document:", err);
          hasTriggeredRef.current = false; // Allow trying again if it failed
        });
    }
  }, [tempData, refreshAccidents]);

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Sidebar on the left (fixed width) */}
      <div className="w-24 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area that fills the remaining space */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* New Aligned Header */}
        <header className="z-10 flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center">
             <img src="/logof.png" alt="logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button
                className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-red-200 hover:text-red-600"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/signup">Signup</Link>
                <Link href="/login">Login</Link>
              </>
            )}
            <button aria-label="Notifications">
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="#808080" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href="/profile">
              <img
                alt="profile"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Content below the new header (Accidents list and Map) */}
        <div className="flex flex-grow gap-4 p-4 overflow-hidden">
          {/* Accidents Column */}
          <div className="w-full sm:flex-1">
            <Accidents accidents={accidents} loading={loading} error={error} onUpdate={refreshAccidents} />
          </div>
          {/* Map Column */}
          <div className="relative w-full rounded-2xl shadow-md sm:flex-1">
            <Map accidents={accidents} />
          </div>
        </div>

      </div>
    </main>
  );
}