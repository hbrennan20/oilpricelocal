"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  photo?: string;
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

type View = "map" | "history";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [token, setToken] = useState(process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "");
  const [tokenSet, setTokenSet] = useState(!!process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [activeView, setActiveView] = useState<View>("map");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [clickedLng, setClickedLng] = useState(0);
  const [clickedLat, setClickedLat] = useState(0);
  const [stationName, setStationName] = useState("");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0]);
  const [price, setPrice] = useState("");

  // Photo state
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History filter
  const [historyFilter, setHistoryFilter] = useState("All");
  const [locatingUser, setLocatingUser] = useState(false);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setClickedLat(Math.round(pos.coords.latitude * 10000) / 10000);
        setClickedLng(Math.round(pos.coords.longitude * 10000) / 10000);
        setLocatingUser(false);
      },
      () => setLocatingUser(false),
      { enableHighAccuracy: true }
    );
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      // Resize to max 800px to save localStorage space
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setPhoto(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

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

  // Metrics
  const metrics = useMemo(() => {
    if (prices.length === 0) return null;
    const vals = prices.map((p) => parseFloat(p.price));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const cheapest = prices[vals.indexOf(min)];
    const stations = new Set(prices.map((p) => p.stationName)).size;

    const petrolPrices = prices.filter((p) => p.fuelType === "Petrol").map((p) => parseFloat(p.price));
    const dieselPrices = prices.filter((p) => p.fuelType === "Diesel").map((p) => parseFloat(p.price));
    const avgPetrol = petrolPrices.length > 0 ? petrolPrices.reduce((a, b) => a + b, 0) / petrolPrices.length : null;
    const avgDiesel = dieselPrices.length > 0 ? dieselPrices.reduce((a, b) => a + b, 0) / dieselPrices.length : null;

    return { avg, min, max, cheapest, stations, total: prices.length, avgPetrol, avgDiesel };
  }, [prices]);

  const renderMarkers = useCallback(
    (m: mapboxgl.Map, entries: PriceEntry[]) => {
      markersRef.current.forEach((mk) => mk.remove());
      markersRef.current = [];

      entries.forEach((entry) => {
        const el = document.createElement("div");
        el.className = "price-marker";
        el.innerHTML = `<span>\u20AC${entry.price}</span>`;

        const photoHtml = entry.photo
          ? `<img src="${entry.photo}" style="width:100%;border-radius:6px;margin-top:6px;max-height:120px;object-fit:cover" />`
          : "";
        const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "220px" }).setHTML(
          `<div style="font-family:sans-serif;color:#111">
            <strong>${entry.stationName}</strong><br/>
            ${entry.fuelType}: <strong>\u20AC${entry.price}</strong><br/>
            <small style="color:#666">${new Date(entry.timestamp).toLocaleDateString()}</small>
            ${photoHtml}
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
      maxBounds: [
        [-12.0, 51.0],  // Southwest: west of Ireland
        [-4.0, 56.0],   // Northeast: north of Ireland
      ],
      minZoom: 6,
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

  // Resize map when switching back to map view
  useEffect(() => {
    if (activeView === "map" && map.current) {
      setTimeout(() => map.current?.resize(), 50);
    }
  }, [activeView]);

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
      ...(photo ? { photo } : {}),
    };

    const updated = [...prices, entry];
    savePrices(updated);
    setPrices(updated);

    setStationName("");
    setPrice("");
    setFuelType(FUEL_TYPES[0]);
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
  }

  function handleDelete(id: string) {
    const updated = prices.filter((p) => p.id !== id);
    savePrices(updated);
    setPrices(updated);
  }

  const filteredHistory = useMemo(() => {
    const sorted = [...prices].sort((a, b) => b.timestamp - a.timestamp);
    if (historyFilter === "All") return sorted;
    return sorted.filter((p) => p.fuelType === historyFilter);
  }, [prices, historyFilter]);

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
    <div className="app-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22V8l9-6 9 6v14" />
            <path d="M12 2v20" />
            <path d="M3 8h18" />
          </svg>
          <span>OilPriceLocal</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeView === "map" ? "active" : ""}`}
            onClick={() => setActiveView("map")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
            Map
          </button>
          <button
            className={`nav-tab ${activeView === "history" ? "active" : ""}`}
            onClick={() => setActiveView("history")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            History
          </button>
        </div>
      </nav>

      {/* Map View */}
      <div className="main-content" style={{ display: activeView === "map" ? "flex" : "none" }}>
        <div className="map-wrapper">
          <div ref={mapContainer} className="map-container" />

          {/* Metrics bar */}
          {metrics && (
            <div className="metrics-bar">
              <div className="metric-card">
                <span className="metric-label">Avg Price</span>
                <span className="metric-value">&euro;{metrics.avg.toFixed(2)}</span>
              </div>
              <div className="metric-card cheapest">
                <span className="metric-label">Cheapest</span>
                <span className="metric-value">&euro;{metrics.min.toFixed(2)}</span>
                <span className="metric-sub">{metrics.cheapest.stationName}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Most Expensive</span>
                <span className="metric-value">&euro;{metrics.max.toFixed(2)}</span>
              </div>
              {metrics.avgPetrol !== null && (
                <div className="metric-card">
                  <span className="metric-label">Avg Petrol</span>
                  <span className="metric-value">&euro;{metrics.avgPetrol.toFixed(2)}</span>
                </div>
              )}
              {metrics.avgDiesel !== null && (
                <div className="metric-card">
                  <span className="metric-label">Avg Diesel</span>
                  <span className="metric-value">&euro;{metrics.avgDiesel.toFixed(2)}</span>
                </div>
              )}
              <div className="metric-card">
                <span className="metric-label">Stations</span>
                <span className="metric-value">{metrics.stations}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Reports</span>
                <span className="metric-value">{metrics.total}</span>
              </div>
            </div>
          )}

          {!metrics && (
            <div className="metrics-bar empty">
              <span>Click the map to add your first fuel price</span>
            </div>
          )}
        </div>
      </div>

      {/* History View */}
      {activeView === "history" && (
        <div className="history-view">
          <div className="history-header">
            <h2>Price History</h2>
            <div className="history-filters">
              {["All", ...FUEL_TYPES].map((ft) => (
                <button
                  key={ft}
                  className={`filter-btn ${historyFilter === ft ? "active" : ""}`}
                  onClick={() => setHistoryFilter(ft)}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="history-empty">
              <p>No price entries yet. Go to the map and click to add prices.</p>
            </div>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Station</th>
                    <th>Fuel Type</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td className="td-photo">
                        {entry.photo ? (
                          <img src={entry.photo} alt="" className="history-thumb" />
                        ) : (
                          <span className="no-photo">--</span>
                        )}
                      </td>
                      <td className="td-station">{entry.stationName}</td>
                      <td>
                        <span className={`fuel-badge ${entry.fuelType.toLowerCase().replace(" ", "-")}`}>
                          {entry.fuelType}
                        </span>
                      </td>
                      <td className="td-price">&euro;{entry.price}</td>
                      <td className="td-date">{new Date(entry.timestamp).toLocaleDateString()}</td>
                      <td className="td-coords">{entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(entry.id)} title="Delete">
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
            <button type="button" className="use-location-btn" onClick={useCurrentLocation} disabled={locatingUser}>
              <span className="location-dot" />
              {locatingUser ? "Locating..." : "Use my current location"}
            </button>

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

            <div className="photo-section">
              <label className="photo-label">Photo (optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="photo-input"
              />
              {!photo && (
                <button
                  type="button"
                  className="photo-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Take Photo
                </button>
              )}
              {photo && (
                <div className="photo-preview">
                  <img src={photo} alt="Price photo" />
                  <button
                    type="button"
                    className="photo-remove"
                    onClick={() => { setPhoto(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

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
