import React from 'react';
import Map from '../map/mapadmin'; // Ensure this is the correct path to your map component

// --- A Simple Loading Skeleton for the Map ---
// This will be displayed while the accident data is being fetched.
const MapSkeleton = () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center rounded-2xl bg-gray-800">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3" />
            </svg>
            <p className="mt-2 text-sm font-semibold text-gray-500">Loading Map Data...</p>
        </div>
    </div>
);

// --- Reusable Sub-Component for the Card Header ---
const CardHeader = ({ title }) => (
  <div className="flex items-center justify-between pb-4">
    <h2 className="text-xl font-semibold leading-loose text-white">
      {title}
    </h2>
    <button className="flex items-center gap-x-2.5 rounded-lg border border-gray-700 px-4 py-3 text-sm text-white transition-colors hover:bg-gray-800">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.1054...Z" fill="white" /></svg>
      <span className="text-sm text-white">Filter Report</span>
    </button>
  </div>
);

// --- Main Accident Report Map Component ---
// It now accepts 'accidents' and a 'loading' prop.
export default function AccidentReportMap({ accidents = [], loading }) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-gray-900 p-6 shadow-lg">
      <CardHeader title="Accident Report" />

      {/* --- THIS IS THE FIX --- */}
      {/* The component now fills the available space and conditionally renders the skeleton or the map */}
      {/* based on the loading state passed from the parent dashboard. */}
      <div className="relative flex-grow rounded-2xl shadow-md overflow-hidden mt-4">
        {loading ? (
          <MapSkeleton />
        ) : (
          <Map accidents={accidents} />
        )}
      </div>
    </div>
  );
}