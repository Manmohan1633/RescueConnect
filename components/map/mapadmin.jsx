import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOMServer from "react-dom/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// --- Configuration ---
mapboxgl.accessToken = "pk.eyJ1IjoiYWxhcGFub3NraSIsImEiOiJjbGVxMjhjbmowaTZpNDVvNWQ4NTBsc2JtIn0.LFIPoIEmYQJv5bfRPueMQQ";

// --- Custom Hook to Fetch Firebase Data ---
const useFirebaseData = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, collectionName));
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(newData);
      } catch (err) {
        setError(err);
        console.error("Error fetching from Firebase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
};

// --- Custom Hook for User Geolocation ---
const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      (err) => {
        setError(`Could not get user location: ${err.message}`);
      }
    );
  }, []);

  return { location, error };
};

// --- Reusable Popup Component ---
function PopupComponent({ data }) {
  // Added optional chaining `?.` to prevent errors if `data.title` is missing
  return (
    <div className="popup flex-col items-center">
      <h3 className="font-sans text-lg">{data.title?.toUpperCase()}</h3>
      <p className="font-sans text-sm">{data.description}</p>
    </div>
  );
}

// --- Main Map Component ---
function Map() {
  const { data: markerData, loading: dataLoading } = useFirebaseData("fire");
  const { location: userLocation, error: locationError } = useUserLocation();

  // Use refs to hold the map instance and container DOM element
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Effect to initialize the map once user location is available
  useEffect(() => {
    // Only run if the map hasn't been initialized and we have the user's location
    if (map.current || !mapContainer.current || !userLocation) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 12,
      attributionControl: false,
    });

    // Add map controls
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "bottom-right"
    );
  }, [userLocation]); // This effect only depends on the user's location

  // Effect to add markers to the map when data is fetched
  useEffect(() => {
    // Only run if the map is initialized and we have marker data
    if (!map.current || !markerData.length) return;

    markerData.forEach((item) => {
      // Ensure the location data is valid before creating a marker
      if (item.location?.latitude && item.location?.longitude) {
        // Create a custom HTML element for the marker for custom styling
        const el = document.createElement("div");
        el.className = "marker"; // Add a 'marker' class for CSS styling

        new mapboxgl.Marker(el)
          .setLngLat([item.location.longitude, item.location.latitude])
          .setPopup(
            new mapboxgl.Popup({ closeOnClick: false }).setHTML(
              ReactDOMServer.renderToString(
                <PopupComponent data={item} key={item.id} />
              )
            )
          )
          .addTo(map.current);
      }
    });
  }, [markerData]); // This effect only depends on the marker data

  if (locationError) {
    return <div className="error-message">{locationError}</div>;
  }

  return <div ref={mapContainer} className="absolute inset-0 m-0 z-10" />;
}

export default Map;