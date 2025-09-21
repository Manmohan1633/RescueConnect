import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../../config/firebase";

// A smaller, reusable component for displaying details with an icon
const IconDetail = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-300">
    {icon}
    <span className="font-semibold">{text}</span>
  </div>
);

export default function AccidentsDetails({ accident = {}, onUpdate }) {
  // --- THIS IS THE FIX ---
  // The property names now correctly match your actual Firestore data structure.
  const { 
    id, 
    title, 
    location, // Correctly using 'location'
    datetime, // Correctly using 'datetime'
    status 
  } = accident;
  
  const [isLoading, setIsLoading] = useState(false);

  const handleAttendClick = async (e) => {
    // Stop the click from propagating to any parent link/button
    e.stopPropagation(); 
    e.preventDefault();

    if (!id) {
        console.error("Cannot update: Accident ID is missing.");
        return;
    }

    setIsLoading(true);
    const accidentRef = doc(database, "fire", id);
    try {
      await updateDoc(accidentRef, { status: "DONE" });
      console.log("Update successful!");
      // Call the onUpdate function passed from the parent to refresh the list
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Safely format the time using the correct 'datetime' variable
  const formattedTime = datetime 
    ? new Date(datetime.seconds ? datetime.seconds * 1000 : datetime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) 
    : "N/A";
  
  // Safely format the location from the 'location' object
  const locationText = location?.latitude && location?.longitude 
    ? `Lat: ${Number(location.latitude).toFixed(4)}, Lon: ${Number(location.longitude).toFixed(4)}`
    : "Unavailable";

  // Dynamic colors for the status badge
  const statusColors = {
    NEW: "bg-red-600",
    PENDING: "bg-yellow-500",
    DONE: "bg-green-600",
  };

  return (
    <div className="w-full mb-2 text-left">
      <div className="flex flex-col w-full h-full gap-4 border-l-4 border-red-500 rounded-lg p-4 bg-gray-800/80 hover:bg-gray-800 transition-colors shadow-md">
        <div className="flex w-full items-start justify-between">
          
          {/* Title and Status */}
          <div className="flex-grow">
            <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tracking-wide text-white ${statusColors[status] || "bg-gray-500"}`}>
              {status || "NEW"}
            </span>
            <h2 className="mt-1 font-sans text-lg font-bold tracking-wide text-white">
              {title || "Accident"}
            </h2>
          </div>

          {/* Time and Location Details */}
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

        {/* Action Button */}
        <div className="mt-2 flex justify-end">
          <button 
            onClick={handleAttendClick} 
            disabled={isLoading || status === "DONE"}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-500 to-rose-500 p-0.5 text-sm font-medium text-gray-900 transition-all hover:from-red-500 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative rounded-md bg-gray-900 px-5 py-2.5 text-white transition-all duration-75 ease-in group-hover:bg-opacity-0">
              {isLoading ? "Updating..." : (status === "DONE" ? "Attended" : "Attend Incident")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}