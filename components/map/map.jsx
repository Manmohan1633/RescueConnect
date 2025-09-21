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
    <p className="mt-1 text-xs text-gray-500">Status: {accident.status || "NEW"}</p>
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
      style: "mapbox://styles/mapbox/streets-v11",
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
  // This effect runs whenever the 'accidents' prop changes, ensuring the map is always up-to-date.
  useEffect(() => {
    if (!map.current) return; // Don't do anything if the map isn't ready

    // 1. Clear any existing markers from the map to prevent duplicates.
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = []; // Clear the markers array

    // 2. Add new markers for each accident in the updated list.
    accidents.forEach((accident) => {
      // Ensure the location data is valid before creating a marker
      if (accident.location?.latitude && accident.location?.longitude) {
        
        const popupHTML = ReactDOMServer.renderToString(
          <PopupComponent accident={accident} />
        );

        const newMarker = new mapboxgl.Marker({ color: "#d9534f" }) // A nice red color
          .setLngLat([accident.location.longitude, accident.location.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
          .addTo(map.current);

        // Add the new marker to our ref array so we can remove it later.
        markersRef.current.push(newMarker);
      }
    });

  }, [accidents]); // The key is to make this effect dependent on the 'accidents' array.

  return <div ref={mapContainer} className="absolute inset-0 z-0" />;
}