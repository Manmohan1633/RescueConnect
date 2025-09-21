import React from "react";

// A smaller, reusable component for displaying a piece of information with an icon
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col items-start">
            <h3 className="text-xs font-semibold text-white">{label}</h3>
            <h2 className="text-sm font-light text-white">{value}</h2>
        </div>
    </div>
);

export default function AccidentsDetails({ accident = {} }) {
    // Use a default empty object to prevent crashes if 'accident' prop is missing
    const { 
        id, 
        title = "Accident", 
        loc = "Unavailable", 
        time = null, 
        status = "NEW" 
    } = accident;

    // --- THIS IS THE FIX ---
    // Safely format the time from a Firebase Timestamp or a standard date string
    const formattedTime = time
        ? new Date(time.seconds ? time.seconds * 1000 : time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : "N/A";

    const locationText = Array.isArray(loc) ? `Lat: ${loc[0]}, Lon: ${loc[1]}` : loc;

    return (
        // Use a div for the card structure, the parent component will wrap this in a Link
        <div className="w-full px-3 mt-2">
            <div className="border-l-4 border-teal-300 rounded-lg bg-gray-800/80 p-4 transition-all hover:bg-gray-800">
                <div className="flex w-full items-center justify-between">
                    
                    {/* Left side: Title and Status */}
                    <div className="flex flex-col items-start">
                        <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                            {status}
                        </span>
                        <h2 className="mt-1 font-sans text-left text-lg font-bold tracking-wide text-white">
                            {title}
                        </h2>
                    </div>

                    {/* Right side: Time, Location, and Arrow */}
                    <div className="flex items-center gap-6">
                        <InfoItem
                            label="Time"
                            value={formattedTime} // Use the safely formatted time
                            icon={
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        <InfoItem
                            label="Location"
                            value={locationText}
                            icon={
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 21l-4.95-6.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            }
                        />
                        <div className="text-white">
                             <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}