import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getDatabase, ref, onValue } from "firebase/database";
import { collection, addDoc, getFirestore } from "firebase/firestore";

import Sidebar from "../sidebar/Sidebar";
import Accidents from "../accidents/accidents1";
import Map from "../map/map";
import { useAuth } from "../../context/AuthContext";
import { db, database } from "../../config/firebase";

// --- Custom Hook to listen to Firebase Realtime DB ---
const useRealtimeValue = (dbPath) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const dbRef = ref(getDatabase(), dbPath);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Realtime data received:", data);
      setValue(data);
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [dbPath]);

  return value;
};

// --- Main Dashboard Component ---
export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Use the custom hook to get the latest temperature
  const tempValue = useRealtimeValue("data/firee");
  
  // Ref to prevent multiple triggers for the same event
  const hasTriggeredRef = useRef(false);

  // Effect to handle the fire detection logic
  useEffect(() => {
    // Check if the temperature is a specific value (e.g., 1 for fire)
    // AND if the alert has NOT been triggered before.
    if (tempValue === 1 && !hasTriggeredRef.current) {
      console.log("Fire detected! Creating alert in Firestore.");
      
      // Prevent this from running again
      hasTriggeredRef.current = true;
      
      const firestore = getFirestore();
      const accidentsCollection = collection(firestore, "accidents");

      const newAccident = {
        title: "Fire accident",
        description: "A big building got large fire",
        intensity: "7",
        location: { latitude: 10.0261, longitude: 76.3125 },
        image: "https://bsmedia.business-standard.com/_media/bs/img/article/2022-05/13/full/1652462127-1638.jpg?im=Resize,width=480",
        datetime: new Date().toISOString(),
        policehelp: true,
        firehelp: true,
        ambulancehelp: false,
        otherhelp: false,
        status: "NEW",
      };

      addDoc(accidentsCollection, newAccident)
        .then(() => console.log("Fire alert successfully created."))
        .catch((error) => {
          console.error("Error creating fire alert:", error);
          // If there was an error, allow the trigger to run again
          hasTriggeredRef.current = false;
        });
    }
  }, [tempValue]);

  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="z-40 flex h-20 w-full items-center border-b bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4">
          <Link href="/">
            <img src="/logof.png" alt="logo" className="h-10 w-auto" />
          </Link>

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
              {/* Notification SVG */}
            </button>
            
            <Link href="/profile" aria-label="Profile">
              <img
                alt="profile"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow flex-col gap-2 p-2 sm:flex-row">
        <div className="w-full sm:w-20">
          <Sidebar />
        </div>
        <div className="flex-1">
          <Accidents />
        </div>
        <div className="relative flex-[1.5] rounded-2xl shadow-md">
          <Map />
        </div>
      </div>
    </main>
  );
}