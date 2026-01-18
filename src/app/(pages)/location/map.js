"use client";

import { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { supabase } from "@/app/supabase";
import { Copy } from "lucide-react";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const clickMarker = useRef(null);

  const [markerLong, setMarkerLong] = useState(null);
  const [markerLat, setMarkerLat] = useState(null);
  const [address, setAddress] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_info");
    if (stored) setUserInfo(JSON.parse(stored));
  }, []);

  const userId = userInfo?.id;
  const toNumber = (v) => (isNaN(parseFloat(v)) ? null : parseFloat(v));
  const fallbackCoords = [139.753, 35.6844]; // Tokyo fallback

  maptilersdk.config.apiKey = "LxnUJW3pVKuNHvMXDiFq";

  useEffect(() => {
    if (!userId) return;

    const initializeMap = (center) => {
      const [lng, lat] = center.map(toNumber);
      if (lng === null || lat === null) return console.error("Invalid map center");

      if (!map.current) {
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [lng, lat],
          zoom: 14,
        });

        map.current.on("click", async (event) => {
          const lng = toNumber(event.lngLat.lng);
          const lat = toNumber(event.lngLat.lat);
          if (lng === null || lat === null) return;

          setMarkerLong(lng);
          setMarkerLat(lat);

          if (clickMarker.current) clickMarker.current.remove();

          clickMarker.current = new maptilersdk.Marker({ color: "#007AFF" })
            .setLngLat([lng, lat])
            .addTo(map.current);

          map.current.flyTo({ center: [lng, lat], zoom: 15 });

          try {
            const res = await maptilersdk.geocoding.reverse([lng, lat]);
            setAddress(res?.features?.[0]?.place_name || "No address found");
          } catch (err) {
            console.error(err);
          }
        });
      }
    };

    const fetchAddress = async () => {
      try {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (data?.latitude && data?.longitude) {
          setAddress(data.full_location);
          setMarkerLat(toNumber(data.latitude));
          setMarkerLong(toNumber(data.longitude));

          initializeMap([data.longitude, data.latitude]);

          clickMarker.current = new maptilersdk.Marker({ color: "#007AFF" })
            .setLngLat([data.longitude, data.latitude])
            .addTo(map.current);
          return;
        }
      } catch (err) {
        console.error(err);
      }

      // fallback to geolocation or default
      navigator.geolocation.getCurrentPosition(
        (pos) => initializeMap([pos.coords.longitude, pos.coords.latitude]),
        () => initializeMap(fallbackCoords)
      );
    };

    fetchAddress();
  }, [userId]);

  const handleConfirm = async () => {
    if (!userId || !markerLat || !markerLong) return;
    const newData = { user_id: userId, full_location: address, latitude: markerLat, longitude: markerLong };

    const { data: existing } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) await supabase.from("addresses").update(newData).eq("user_id", userId);
    else await supabase.from("addresses").insert(newData);
    alert("Address saved!");
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      {/* LOCATION PANEL */}
      <div className="fixed md:absolute bottom-0 md:top-12 left-0 md:left-10 w-full md:w-80 bg-white border-t md:border border-gray-200 rounded-t-2xl md:rounded-2xl shadow-2xl p-4 md:p-5 space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto z-50">
        <h2 className="text-lg md:text-xl font-bold text-[#333359]">Location Details</h2>

        {/* Coordinates */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Latitude, Longitude</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm">
              {markerLat ? markerLat.toFixed(4) : "Select a location"},{" "}
              {markerLong ? markerLong.toFixed(4) : "Select a location"}
            </div>
            <button
              onClick={() => markerLat && markerLong && navigator.clipboard.writeText(`${markerLat.toFixed(4)}, ${markerLong.toFixed(4)}`)}
              className="p-2 border rounded-lg active:scale-95"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Address</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm wrap-break-word">
              {address || "Tap on the map"}
            </div>
            <button onClick={() => address && navigator.clipboard.writeText(address)} className="p-2 border rounded-lg active:scale-95">
              <Copy size={16} />
            </button>
          </div>
        </div>

        <button onClick={handleConfirm} className="w-full h-12 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold active:scale-95 transition">
          Confirm Address
        </button>
      </div>

      {/* MAP */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}