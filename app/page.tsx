"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface PriceEntry {
  id: string;
  stationName: string;
  fuelType: string;
  price: string;
  lng: number;
  lat: number;
  timestamp: number;
}

const FUEL_TYPES = ["Petrol", "Diesel", "Premium Petrol", "Premium Diesel"];

const STORAGE_KEY = "petrol-prices";

function loadPrices(): PriceEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePrices(prices: PriceEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [token, setToken] = useState("");
  const [tokenSet, setTokenSet] = useState(false);
  const [prices, setPrices] = useState<PriceEntry[]>([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [clickedLng, setClickedLng] = useState(0);
  const [clickedLat, setClickedLat] = useState(0);
  const [stationName, setStationName] = useState("");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0]);
  const [price, setPrice] = useState("");

  // Load saved token
  useEffect(() => {
    const saved = localStorage.getItem("mapbox-token");
    if (saved) {
      setToken(saved);
      setTokenSet(true);
    }
  }, []);

  // Load prices
  useEffect(() => {
    setPrices(loadPrices());
  }, []);

  const renderMarkers = useCallback(
    (m: mapboxgl.Map, entries: PriceEntry[]) => {
      markersRef.current.forEach((mk) => mk.remove());
      markersRef.current = [];

      entries.forEach((entry) => {
        const el = document.createElement("div");
        el.className = "price-marker";
        el.innerHTML = `<span>\u20AC${entry.price}</span>`;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="font-family:sans-serif;color:#111">
            <strong>${entry.stationName}</strong><br/>
            ${entry.fuelType}: <strong>\u20AC${entry.price}</strong><br/>
            <small style="color:#666">${new Date(entry.timestamp).toLocaleDateString()}</small>
          </div>`
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([entry.lng, entry.lat])
          .setPopup(popup)
          .addTo(m);

        markersRef.current.push(marker);
      });
    },
    []
  );

  // Init map
  useEffect(() => {
    if (!tokenSet || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-7.5, 53.5],
      zoom: 7,
    });

    m.addControl(new mapboxgl.NavigationControl(), "top-right");

    m.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    m.on("click", (e) => {
      setClickedLng(Math.round(e.lngLat.lng * 10000) / 10000);
      setClickedLat(Math.round(e.lngLat.lat * 10000) / 10000);
      setShowForm(true);
    });

    m.on("load", () => {
      renderMarkers(m, loadPrices());
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, [tokenSet, token, renderMarkers]);

  // Re-render markers when prices change
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      renderMarkers(map.current, prices);
    }
  }, [prices, renderMarkers]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stationName.trim() || !price.trim()) return;

    const entry: PriceEntry = {
      id: crypto.randomUUID(),
      stationName: stationName.trim(),
      fuelType,
      price: parseFloat(price).toFixed(2),
      lng: clickedLng,
      lat: clickedLat,
      timestamp: Date.now(),
    };

    const updated = [...prices, entry];
    savePrices(updated);
    setPrices(updated);

    setStationName("");
    setPrice("");
    setFuelType(FUEL_TYPES[0]);
    setShowForm(false);
  }

  // Token entry screen
  if (!tokenSet) {
    return (
      <div className="token-screen">
        <div className="token-card">
          <h1>Petrol Price Map</h1>
          <p>Enter your Mapbox access token to get started.</p>
          <input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            onClick={() => {
              if (token.trim()) {
                localStorage.setItem("mapbox-token", token.trim());
                setTokenSet(true);
              }
            }}
          >
            Launch Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />

      {/* Header bar */}
      <div className="header-bar">
        <h1>Petrol Prices</h1>
        <span className="hint">Click the map to add a price</span>
      </div>

      {/* Price form */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <form
            className="price-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>Add Price</h2>
            <p className="coords">
              {clickedLat}, {clickedLng}
            </p>

            <label>
              Station Name
              <input
                type="text"
                placeholder="e.g. Texaco Main St"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                required
                autoFocus
              />
            </label>

            <label>
              Fuel Type
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                {FUEL_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Price per litre
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="1.65"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <div className="form-buttons">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Price
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
