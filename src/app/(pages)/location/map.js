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

  // Safely load localStorage (avoid SSR crash)
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_info");
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch {
        console.error("Invalid user_info JSON");
      }
    }
  }, []);

  const userId = userInfo?.id;

  // Convert any value to a number safely
  const toNumber = (v) => {
    const num = parseFloat(v);
    return isNaN(num) ? null : num;
  };

  maptilersdk.config.apiKey = "LxnUJW3pVKuNHvMXDiFq";

  useEffect(() => {
    if (!userId) {
      return;
    }

    let initialLocation = null;

    // Initialize map safely
    const initializeMap = (center) => {
      const lng = toNumber(center[0]);
      const lat = toNumber(center[1]);

      if (lng === null || lat === null) {
        console.error("❌ INVALID MAP CENTER:", center);
        return;
      }

      if (!map.current) {
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [lng, lat],
          zoom: 14,
        });

        // CLICK EVENT
        map.current.on("click", async (event) => {
          const lng = toNumber(event.lngLat.lng);
          const lat = toNumber(event.lngLat.lat);

          if (lng === null || lat === null) {
            console.error("Click returned invalid coordinates");
            return;
          }

          setMarkerLong(lng);
          setMarkerLat(lat);

          if (clickMarker.current) clickMarker.current.remove();

          clickMarker.current = new maptilersdk.Marker({ color: "#007AFF" })
            .setLngLat([lng, lat])
            .addTo(map.current);

          try {
            const res = await maptilersdk.geocoding.reverse([lng, lat]);
            if (res?.features?.length > 0) {
              setAddress(res.features[0].place_name);
            } else {
              setAddress("No address found");
            }
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
          }
        });
      }
    };

    // Fetch address from Supabase
    const fetchAddress = async () => {
      try {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (data) {
          const lat = toNumber(data.latitude);
          const lng = toNumber(data.longitude);

          if (lat !== null && lng !== null) {
            setAddress(data.full_location);
            setMarkerLat(lat);
            setMarkerLong(lng);

            initializeMap([lng, lat]);

            clickMarker.current = new maptilersdk.Marker({ color: "#007AFF" })
              .setLngLat([lng, lat])
              .addTo(map.current);

            return;
          } else {
            console.error("Saved coordinates invalid:", data);
          }
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }

      // If user has no saved address → use geolocation
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = toNumber(pos.coords.latitude);
          const lng = toNumber(pos.coords.longitude);

          if (lat === null || lng === null) {
            console.error("Invalid geolocation:", pos.coords);
            initializeMap([139.753, 35.6844]); // fallback
            return;
          }

          initialLocation = { lat, lng };
          initializeMap([lng, lat]);
        },
        () => {
          // fallback if geolocation denied
          initializeMap([139.753, 35.6844]);
        }
      );
    };

    fetchAddress();
  }, [userId]);

  // SAVE TO DATABASE
  const handleConfirm = async () => {
    if (!userId || markerLat === null || markerLong === null) return;

    const newData = {
      user_id: userId,
      full_location: address,
      latitude: markerLat,
      longitude: markerLong,
    };

    // Check if existing address
    const { data: existing } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from("addresses")
        .update(newData)
        .eq("user_id", userId);
    } else {
      result = await supabase.from("addresses").insert(newData);
    }

    console.log("Saved:", result);
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      {/* LOCATION PANEL */}
      <div
        className="
      fixed md:absolute
      z-70
      bottom-0 md:top-12
      left-0 md:left-10
      w-full md:w-80
      bg-white
      border-t md:border
      border-gray-200
      rounded-t-2xl md:rounded-2xl
      shadow-2xl
      p-4 md:p-5
      space-y-4
      max-h-[60vh] md:max-h-none
      overflow-y-auto
    "
      >
        <h2 className="text-lg md:text-xl font-bold text-[#333359]">
          Location Details
        </h2>

        {/* Coordinates */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Latitude, Longitude
          </label>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm">
              {markerLat ? markerLat.toFixed(4) : "none"},
              {markerLong ? markerLong.toFixed(4) : "none"}
            </div>

            <button
              onClick={() =>
                markerLat &&
                markerLong &&
                navigator.clipboard.writeText(
                  `${markerLat.toFixed(4)}, ${markerLong.toFixed(4)}`
                )
              }
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

            <button
              onClick={() => address && navigator.clipboard.writeText(address)}
              className="p-2 border rounded-lg active:scale-95"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <button
          className="
        w-full h-12
        rounded-xl
        bg-green-700 hover:bg-green-800
        text-white font-semibold
        active:scale-95
        transition
      "
          onClick={handleConfirm}
        >
          Confirm Address
        </button>
      </div>

      {/* MAP */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
