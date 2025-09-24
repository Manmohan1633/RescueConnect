import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component for optimization
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../config/firebase";

// --- Sub-Component for an Icon Detail (Time or Location) ---
const IconDetail = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-300">
    {icon}
    <span className="font-semibold">{text}</span>
  </div>
);

// --- An Intelligent Action Button Component ---
const ActionButton = ({ id, currentStatus, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusUpdate = async (e, nextStatus) => {
        e.stopPropagation();
        e.preventDefault();
        
        setIsLoading(true);
        const accidentRef = doc(database, "fire", id);
        try {
            await updateDoc(accidentRef, { status: nextStatus });
            if (onUpdate) onUpdate(); // Refresh the parent list
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Failed to update status.");
        } finally {
            setIsLoading(false);
        }
    };

    if (currentStatus === "NEW") {
        return (
            <button 
                onClick={(e) => handleStatusUpdate(e, "PENDING")} 
                disabled={isLoading}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                    {isLoading ? "Attending..." : "Attend Incident"}
                </span>
            </button>
        );
    }

    if (currentStatus === "PENDING") {
        return (
            <button 
                onClick={(e) => handleStatusUpdate(e, "DONE")} 
                disabled={isLoading}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-0.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className="relative rounded-md bg-gray-900 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                    {isLoading ? "Completing..." : "Mark as Completed"}
                </span>
            </button>
        );
    }

    return (
        <button 
            disabled={true}
            className="relative inline-flex items-center justify-center rounded-lg bg-gray-700 p-0.5 text-sm font-medium text-gray-400 cursor-not-allowed"
        >
            <span className="relative rounded-md bg-gray-900 px-5 py-2.5">
                Completed
            </span>
        </button>
    );
};


// --- Main AccidentsDetails Component ---
export default function AccidentsDetails({ accident = {}, onUpdate }) {
  // --- THIS IS THE FIX (Part 1) ---
  // We now destructure 'imageurl' from the accident object.
  const { 
    id, 
    title, 
    location,
    datetime,
    status,
    imageurl = "https://placehold.co/100x100/1e293b/94a3b8?text=No+Image" // Dark placeholder
  } = accident;
  
  // Safely format the time and location data
  const formattedTime = datetime 
    ? new Date(datetime.seconds ? datetime.seconds * 1000 : datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : "N/A";
  
  const locationText = location?.latitude && location?.longitude 
    ? `Lat: ${Number(location.latitude).toFixed(4)}, Lon: ${Number(location.longitude).toFixed(4)}`
    : "Unavailable";

  const statusColors = {
    NEW: "bg-red-600",
    PENDING: "bg-yellow-500",
    DONE: "bg-green-600",
  };

  return (
    <Link href={`/accidents/${id}`} className="block w-full mb-2 text-left">
      <div className="flex flex-col w-full h-full gap-4 border-l-4 border-red-500 rounded-lg p-4 bg-gray-800/80 hover:bg-gray-800 transition-colors shadow-md">
        <div className="flex w-full items-center justify-between">
          
          {/* --- THIS IS THE FIX (Part 2) --- */}
          {/* We've added the Image component here and wrapped the details in a flex container */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                    src={imageurl}
                    alt={title || "Accident Image"}
                    className="rounded-full object-cover"
                    fill
                    sizes="64px"
                />
            </div>
            <div className="flex-grow">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tracking-wide text-white ${statusColors[status] || "bg-gray-500"}`}>
                    {status || "NEW"}
                </span>
                <h2 className="mt-1 font-sans text-lg font-bold tracking-wide text-white">
                    {title || "Accident"}
                </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-gray-300">
            <IconDetail 
              text={formattedTime}
              icon={<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>}
            />
            <IconDetail 
              text={locationText}
              icon={<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 21l-4.95-6.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>}
            />
          </div>
        </div>
        
        <div className="mt-2 flex justify-end">
            <ActionButton id={id} currentStatus={status || "NEW"} onUpdate={onUpdate} />
        </div>
      </div>
    </Link>
  );
}