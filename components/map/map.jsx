import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOMServer from "react-dom/server";

// --- Configuration ---
mapboxgl.accessToken = "pk.eyJ1IjoiYWxhcGFub3NraSIsImEiOiJjbGVxMjhjbmowaTZpNDVvNWQ4NTBsc2JtIn0.LFIPoIEmYQJv5bfRPueMQQ";

// --- Reusable Popup Component for the markers ---
const PopupComponent = ({ accident }) => (
  <div className="p-1 font-sans">
    <h3 className="text-base font-bold text-gray-800">{accident.title || "Accident"}</h3>
    {accident.description && <p className="text-sm text-gray-600">{accident.description}</p>}
    <p className="mt-1 text-xs font-semibold text-gray-500">Status: {accident.status || "NEW"}</p>
  </div>
);

// --- Main Map Component ---
export default function Map({ accidents = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]); // Use a ref to keep track of markers

  // Effect to initialize the map once
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // Keeping your original light theme
      center: [73.0243, 26.2389], // Default center to Jodhpur
      zoom: 11,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }), "bottom-right");
  }, []);

  // --- THIS IS THE FIX ---
  // This effect now filters accidents and applies colors based on their status.
  useEffect(() => {
    if (!map.current) return; // Don't do anything if the map isn't ready

    // 1. Clear any existing markers from the map before adding new ones.
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = []; // Clear the markers array

    // 2. Loop through all accidents and decide which ones to show.
    accidents.forEach((accident) => {
      const status = accident.status || 'NEW'; // Default to NEW if status is missing

      // Only add markers for NEW or PENDING statuses and if a location exists
      if ((status === 'NEW' || status === 'PENDING') && accident.location?.latitude && accident.location?.longitude) {

        // Determine marker color based on the status
        const markerColor = status === 'NEW' ? '#ef4444' : '#f59e0b'; // Red for New, Amber/Yellow for Pending

        const popupHTML = ReactDOMServer.renderToString(
          <PopupComponent accident={accident} />
        );

        const newMarker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([accident.location.longitude, accident.location.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
          .addTo(map.current);

        // Add the new marker to our ref array so we can remove it on the next update.
        markersRef.current.push(newMarker);
      }
    });

  }, [accidents]); // This effect runs whenever the 'accidents' array changes

  return <div ref={mapContainer} className="absolute inset-0 z-0" />;
}