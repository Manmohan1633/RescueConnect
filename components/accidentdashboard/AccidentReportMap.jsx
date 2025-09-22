import React from 'react';
import Map from '../map/mapadmin'; // Ensure this is the correct path to your map component

// --- Reusable Sub-Component for the Card Header ---
const CardHeader = ({ title }) => (
  <div className="flex items-center justify-between pb-4">
    <h2 className="text-xl font-semibold leading-loose text-white">
      {title}
    </h2>
    <button className="flex items-center gap-x-2.5 rounded-lg border border-gray-700 px-4 py-3 text-sm text-white transition-colors hover:bg-gray-800">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.1054 12.227C17.8347 12.227 19.2406 13.6147 19.2406 15.3218C19.2406 17.0279 17.8347 18.4166 16.1054 18.4166C14.376 18.4166 12.9701 17.0279 12.9701 15.3218C12.9701 13.6147 14.376 12.227 16.1054 12.227ZM16.1054 13.6786C15.1867 13.6786 14.4407 14.415 14.4407 15.3218C14.4407 16.2276 15.1867 16.965 16.1054 16.965C17.024 16.965 17.77 16.2276 17.77 15.3218C17.77 14.415 17.024 13.6786 16.1054 13.6786ZM9.33851 14.5957C9.74439 14.5957 10.0738 14.9209 10.0738 15.3215C10.0738 15.7221 9.74439 16.0473 9.33851 16.0473H3.31019C2.90431 16.0473 2.57491 15.7221 2.57491 15.3215C2.57491 14.9209 2.90431 14.5957 3.31019 14.5957H9.33851ZM5.70946 2.58325C7.43884 2.58325 8.8447 3.97195 8.8447 5.67805C8.8447 7.38416 7.43884 8.77286 5.70946 8.77286C3.98106 8.77286 2.57422 7.38416 2.57422 5.67805C2.57422 3.97195 3.98106 2.58325 5.70946 2.58325ZM5.70946 4.03485C4.79183 4.03485 4.04478 4.77226 4.04478 5.67805C4.04478 6.58385 4.79183 7.32126 5.70946 7.32126C6.62807 7.32126 7.37413 6.58385 7.37413 5.67805C7.37413 4.77226 6.62807 4.03485 5.70946 4.03485ZM18.5056 4.95245C18.9115 4.95245 19.2409 5.27761 19.2409 5.67825C19.2409 6.07889 18.9115 6.40405 18.5056 6.40405H12.4763C12.0704 6.40405 11.741 6.07889 11.741 5.67825C11.741 5.27761 12.0704 4.95245 12.4763 4.95245H18.5056Z"
          fill="white"
        />
      </svg>
      <span className="text-sm text-white">Filter Report</span>
    </button>
  </div>
);

// --- Main Accident Report Map Component ---
// It now accepts an 'accidents' prop to pass down to the map.
export default function AccidentReportMap({ accidents = [] }) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-gray-900 p-6 shadow-lg">
      <CardHeader title="Accident Report" />

      {/* --- THIS IS THE FIX --- */}
      {/* The Map component is now wrapped in a container that will fill the available space */}
      <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden">
        {/* We pass the 'accidents' array to the Map so it knows what markers to display */}
        <Map accidents={accidents} />
      </div>
    </div>
  );
}