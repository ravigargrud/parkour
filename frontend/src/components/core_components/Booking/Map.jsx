import React, { useRef, useEffect, useState, useContext } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import ParkingCard from "./ParkingCard";
import UserContext from "../../../store/user-context";

export default function Map() {
  const apiKey = "kycBAmj2IMWpvJzMRN9v"; // Your MapTiler API key

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const zoom = 15;
  const [mapController, setMapController] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  maptilersdk.config.apiKey = apiKey;
  maptilersdk.config.primaryLanguage = maptilersdk.Language.ENGLISH;

  const locations = [
    { id: 1, name: "Tokyo Tower", lng: 77.2867, lat: 28.7276 },
    { id: 2, name: "Shibuya Crossing", lng: 77.2367, lat: 28.7652 },
    { id: 3, name: "Tokyo Skytree", lng: 77.2467, lat: 28.7948 },
  ];

  const userCtx = useContext(UserContext);

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
    if (mapContainer.current && userCtx.isLoading !== true) {
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

        console.log(location);

        const marker = new maptilersdk.Marker({ draggable: true }).setLngLat([location.longitude, location.latitude]).addTo(map.current);

        marker.on("dragend", () => {
          const currentLocation = marker.getLngLat();
          console.log(currentLocation.lng);

          setLocation({ latitude: currentLocation.lat, longitude: currentLocation.lng });
        })
      }
    }
  }, [location.latitude, location.longitude, zoom]);

  useEffect(() => {
    if (map.current) {
      clearMarkers();
      locations.forEach((loc) => {
        const marker = new maptilersdk.Marker()
          .setLngLat([loc.lng, loc.lat])
          .setPopup(
            new maptilersdk.Popup({ offset: 25 }).setText(loc.name)
          )
          .addTo(map.current);
        marker
          .getElement()
          .addEventListener("click", () => handleMarkerClick(loc));
        markersRef.current.push(marker);
      });
    }
  }, [locations]);

  useEffect(() => {
    if (selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: zoom,
      });
    }
  }, [selectedLocation]);

  return (
    <div className="map-wrap relative">
      {userCtx.isLoading ? <div className="text-center text-2xl justify-center h-full items-center">Loading...</div> : <div ref={mapContainer} className="map" />}
      {error && <p>Error: {error}</p>}
      {showDialog && (
        <ParkingCard
          className={`absolute bottom-10 right-4 w-64 h-auto z-20 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          parkingData={{
            id: selectedLocation.id,
            title: selectedLocation.name,
            location: `${selectedLocation.lat} ${selectedLocation.lng}`,
            price: "Free",
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
