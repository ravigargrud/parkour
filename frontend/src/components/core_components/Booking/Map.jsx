import React, { useRef, useEffect, useState, useContext } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import ParkingCard from "./ParkingCard";
import UserContext from "../../../store/user-context";
import axios from "axios";
import ParkingContext from "../../../store/parking-lots";

export default function Map() {
  const apiKey = "kycBAmj2IMWpvJzMRN9v"; // Your MapTiler API key

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null); // Single marker reference
  const markersRef = useRef([]);
  const zoom = 15;
  const [mapController, setMapController] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const [nearByLocations, setNearByLocations] = useState([]); // Changed initial state to []

  maptilersdk.config.apiKey = apiKey;
  maptilersdk.config.primaryLanguage = maptilersdk.Language.ENGLISH;

  //contexts
  const userCtx = useContext(UserContext);
  const parkingCtx = useContext(ParkingContext);  

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setShowDialog(true);
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    if (userCtx.location && !userCtx.isLoading) {
      setLocation({
        latitude: userCtx.location.latitude,
        longitude: userCtx.location.longitude,
      });
    }
  }, [userCtx.location, userCtx.isLoading]);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([location.longitude, location.latitude]);
      map.current.setZoom(zoom);
    }
  }, [location.latitude, location.longitude, zoom]);

  useEffect(() => {
    if (mapContainer.current && !userCtx.isLoading) {
      if (!map.current) {
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [location.longitude, location.latitude],
          zoom: zoom,
        });
        setMapController(
          createMapLibreGlMapController(map.current, maptilersdk)
        );
      }

      // Create or update the draggable marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = new maptilersdk.Marker({ draggable: true })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);

      markerRef.current = marker;

      marker.on("dragend", () => {
        const currentLocation = marker.getLngLat();
        setLocation({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng
        });
      });
    }
  }, [location.latitude, location.longitude, zoom, userCtx.isLoading]);

  useEffect(() => {
    if (map.current && nearByLocations.length > 0) { // Check if nearby locations are available
      clearMarkers();
      nearByLocations.forEach((loc) => {
        const marker = new maptilersdk.Marker()
          .setLngLat([loc.longitude, loc.latitude])
          .setPopup(
            new maptilersdk.Popup({ offset: 25 }).setText(loc.address || "No Address") // Handle missing address
          )
          .addTo(map.current);
        marker
          .getElement()
          .addEventListener("click", () => handleMarkerClick(loc));
        markersRef.current.push(marker);
      });
    }
  }, [nearByLocations]); // Dependency should be nearByLocations

  useEffect(() => {
    if (selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: zoom,
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const fetchByLatLng = async () => {
        try {
          const response = await axios.get("http://localhost:8000/parking/get-parking-by-lat-long", {
            params: {
              latitude: location.latitude,
              longitude: location.longitude,
              range_km: 20
            }
          });

          parkingCtx.setNearByLocations(response.data);
          setNearByLocations(response.data); // Set the response data as nearby locations
        } catch (err) {
          setError('Failed to fetch parking data.');
          console.error(err);
        }
      };

      fetchByLatLng();
    }
  }, [location.latitude, location.longitude]);

  return (
    <div className="map-wrap relative">
      {userCtx.isLoading ? (
        <div className="text-center text-2xl justify-center h-full items-center">Loading...</div>
      ) : (
        <div ref={mapContainer} className="map" />
      )}
      {error && <p>Error: {error}</p>}
      {showDialog && selectedLocation && (
        <ParkingCard
          className={`absolute bottom-10 right-4 w-64 h-auto z-20 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          parkingData={{
            id: selectedLocation.id,
            title: selectedLocation.address,
            location: `${selectedLocation.latitude} ${selectedLocation.longitude}`,
            price: `Car: ₹${selectedLocation.car_cost_per_hour}/hr - Scooter: ₹${selectedLocation.scooter_cost_per_hour}/hr`,
          }}
        />
      )}
      {mapController && (
        <GeocodingControl
          apiKey={maptilersdk.config.apiKey}
          mapController={mapController}
        />
      )}
    </div>
  );
}
