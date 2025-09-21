import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { format } from 'date-fns';

// A smaller, reusable component for displaying details with an icon.
const IconDetail = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-sm text-gray-500">
    {icon}
    <span>{text}</span>
  </div>
);

export default function AccidentsDetails({ accident = {} }) {
  // --- THIS IS THE FIX ---
  // The property names now correctly match your actual Firestore data structure.
  const { 
    id = 'default-id', 
    title = "Accident Report", 
    description = "No description available",
    location = null,             // Correctly named 'location'
    datetime = null,             // Correctly named 'datetime'
    status = "UNKNOWN", 
    imageurl = "https://placehold.co/100x100/e2e8f0/334155?text=No+Image" // Correctly named 'imageurl'
  } = accident;

  // Safely format the time using the correct 'datetime' variable.
  const formattedTime = datetime
    ? format(new Date(datetime.seconds ? datetime.seconds * 1000 : datetime), 'p') // 'p' formats to "7:00 PM"
    : "N/A";
    
  // Safely format location text from the location object.
  const locationText = location?.latitude && location?.longitude 
    ? `Lat: ${Number(location.latitude).toFixed(4)}, Lon: ${Number(location.longitude).toFixed(4)}`
    : "Location Unavailable";

  const statusColors = {
    NEW: "bg-red-500 text-white",
    PENDING: "bg-yellow-500 text-white",
    DONE: "bg-green-500 text-white",
    UNKNOWN: "bg-gray-500 text-white",
  };
  
  // Use the title, but if it's empty, use the description as a fallback.
  const displayTitle = title || description;

  return (
    <Link 
      href={`/accidents/${id}`}
      className="block w-full rounded-xl border bg-slate-50 p-4 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Image */}
        <div className="relative h-20 w-20 shrink-0">
          <Image
            src={imageurl}
            alt={displayTitle}
            className="rounded-full object-cover"
            fill
            sizes="80px"
          />
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <span 
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[status] || statusColors.UNKNOWN}`}
          >
            {status}
          </span>
          <h2 className="mt-2 text-lg font-bold text-slate-800">
            {displayTitle}
          </h2>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
            <IconDetail 
              text={formattedTime}
              icon={
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
              }
            />
            <IconDetail 
              text={locationText}
              icon={
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M10 2a.75.75 0 0 1 .75.75v.518A7 7 0 0 1 18 10a.75.75 0 0 1-1.5 0A5.5 5.5 0 0 0 12 4.75V13.5a.75.75 0 0 1-1.5 0V4.75A5.5 5.5 0 0 0 6.5 10a.75.75 0 0 1-1.5 0 7 7 0 0 1 7.25-6.732V2.75A.75.75 0 0 1 10 2Z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        </div>
        
        {/* Arrow Icon */}
        <div className="flex shrink-0 items-center text-gray-400">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}