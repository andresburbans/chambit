"use client";

/**
 * GeozonesMap — Mapa Leaflet con grilla H3 para Admin
 *
 * CORRECCIÓN CRÍTICA: cellToBoundary(h3, true) devuelve [lng, lat] en GeoJSON order.
 * Para Leaflet Polygon (que espera [lat, lng]) debemos intercambiar.
 * Esta versión usa cellToBoundary sin el flag GeoJSON y convierte a [lat, lng] explícitamente.
 *
 * Modos:
 *   - "geozone":  celdas en verde uniforme (autorización de zona)
 *   - "heatmap":  celdas coloreadas por demanda de categoría (azul-rojo gradiente)
 *   - "hotspots": celdas con intensidad multi-categoría, las top se resaltan con pulso
 */

import { useEffect, useRef, useState } from "react";
import { cellToBoundary, cellToLatLng } from "h3-js";

type ViewMode = "geozone" | "heatmap" | "hotspots";

interface GeozoneMapProps {
    center: [number, number];
    zoom: number;
    resolution?: 7 | 8 | 9;
    activeH3Indices: string[];
    viewMode?: ViewMode;
    hexScores?: Record<string, number>;          // valor 0-100 por celda
    selectedCategory?: string;
    categoryColor?: string;
}

// ─── Color helpers ────────────────────────────────────────────────────────────
function heatmapColor(score: number, baseHex: string): string {
    // score 0-100 → opacity/saturation gradient on the category color
    const ratio = Math.min(1, score / 100);
    const opacity = 0.12 + ratio * 0.72;
    // Parse hex color to rgb
    const r = parseInt(baseHex.slice(1, 3), 16);
    const g = parseInt(baseHex.slice(3, 5), 16);
    const b = parseInt(baseHex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
}

function hotspotColor(score: number): string {
    // Low → blue, medium → yellow, high → red (demand pressure)
    if (score < 30) return `rgba(59,130,246,${0.15 + score / 100 * 0.3})`;
    if (score < 60) return `rgba(245,158,11,${0.2 + (score - 30) / 70 * 0.4})`;
    return `rgba(239,68,68,${0.3 + (score - 60) / 40 * 0.55})`;
}

function hotspotBorder(score: number): string {
    if (score < 30) return "#3b82f6";
    if (score < 60) return "#f59e0b";
    return "#ef4444";
}

// ─── Build boundary in [lat, lng][] for Leaflet ───────────────────────────────
function getLatLngBoundary(h3Index: string): [number, number][] {
    // cellToBoundary without 2nd arg returns [[lat, lng], ...] — Uber H3 native order
    // This is CORRECT for Leaflet Polygon (which expects [lat, lng])
    const raw = cellToBoundary(h3Index); // [[lat, lng], ...]
    return raw.map(([lat, lng]) => [lat, lng] as [number, number]);
}

// ─── Legend overlay ───────────────────────────────────────────────────────────
function buildLegendHTML(viewMode: ViewMode, categoryColor: string, category: string): string {
    if (viewMode === "geozone") {
        return `<div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Leyenda</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <div style="width:12px;height:12px;border-radius:3px;background:#34af00;opacity:.8"></div>
          <span style="font-size:11px;color:#475569">Zona autorizada</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:12px;height:12px;border-radius:3px;border:1.5px dashed #94a3b8"></div>
          <span style="font-size:11px;color:#475569">Área candidata</span>
        </div>`;
    }
    if (viewMode === "heatmap") {
        const r = parseInt(categoryColor.slice(1, 3), 16);
        const g = parseInt(categoryColor.slice(3, 5), 16);
        const b = parseInt(categoryColor.slice(5, 7), 16);
        return `<div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">${category}</div>
        ${[["Baja (0–30)", 0.18], ["Media (31–60)", 0.45], ["Alta (61–100)", 0.85]].map(([label, op]) =>
            `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <div style="width:12px;height:12px;border-radius:3px;background:rgba(${r},${g},${b},${op})"></div>
              <span style="font-size:11px;color:#475569">${label}</span>
            </div>`
        ).join("")}`;
    }
    // hotspots
    return `<div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Presión de demanda</div>
    ${[["Baja", "#3b82f6", .3], ["Media", "#f59e0b", .5], ["Alta", "#ef4444", .7]].map(([label, color, op]) =>
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <div style="width:12px;height:12px;border-radius:3px;background:${color};opacity:${op}"></div>
          <span style="font-size:11px;color:#475569">${label}</span>
        </div>`
    ).join("")}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GeozonesMap({
    center = [3.4516, -76.5320],
    zoom = 12,
    resolution = 7,
    activeH3Indices = [],
    viewMode = "geozone",
    hexScores,
    selectedCategory = "Reparación",
    categoryColor = "#3b82f6",
}: GeozoneMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<any>(null);
    const hexLayers = useRef<any[]>([]);
    const legendRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState(false);
    const [hoveredCell, setHoveredCell] = useState<{ index: string; score?: number; lat: number; lng: number } | null>(null);

    // ── Init map once ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!mapRef.current || leafletMap.current) return;

        import("leaflet").then(L => {
            const map = L.map(mapRef.current!, {
                center,
                zoom,
                zoomControl: true,
                attributionControl: true,
            });

            // CartoDB Positron — minimal, high contrast pour hexagons
            L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 20,
            }).addTo(map);

            leafletMap.current = map;
            setMapReady(true);
        });

        return () => {
            leafletMap.current?.remove();
            leafletMap.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Re-render hexagons when data changes ──────────────────────────────────
    useEffect(() => {
        if (!mapReady || !leafletMap.current || activeH3Indices.length === 0) return;

        import("leaflet").then(L => {
            // Cleanup previous hex layers
            hexLayers.current.forEach(l => leafletMap.current?.removeLayer(l));
            hexLayers.current = [];

            // Remove old legend
            if (legendRef.current) {
                legendRef.current.remove();
                legendRef.current = null;
            }

            const maxScore = hexScores ? Math.max(...Object.values(hexScores), 1) : 1;
            const bounds: [number, number][] = [];

            activeH3Indices.forEach(h3Index => {
                let boundary: [number, number][];
                try {
                    boundary = getLatLngBoundary(h3Index);
                } catch (e) {
                    console.warn(`H3 boundary error for ${h3Index}:`, e);
                    return;
                }

                // Collect bounds for fitBounds
                boundary.forEach(pt => bounds.push(pt));

                const score = hexScores ? (hexScores[h3Index] ?? 0) : 0;
                const normalizedScore = hexScores ? (score / maxScore) * 100 : 50;

                // Determine style based on viewMode
                let fillColor: string;
                let strokeColor: string;
                let fillOpacity: number;
                let weight: number;

                if (viewMode === "geozone") {
                    fillColor = "#34af00";
                    strokeColor = "#34af00";
                    fillOpacity = 0.18;
                    weight = 1.5;
                } else if (viewMode === "heatmap") {
                    fillColor = heatmapColor(normalizedScore, categoryColor);
                    strokeColor = categoryColor;
                    fillOpacity = 1;
                    weight = 0.8;
                } else {
                    // hotspots
                    fillColor = hotspotColor(normalizedScore);
                    strokeColor = hotspotBorder(normalizedScore);
                    fillOpacity = 1;
                    weight = normalizedScore > 70 ? 2.5 : 1;
                }

                const polygon = L.polygon(boundary, {
                    fillColor,
                    fillOpacity,
                    color: strokeColor,
                    weight,
                    opacity: 0.7,
                });

                // Hover interaction
                polygon.on("mouseover", (e: any) => {
                    polygon.setStyle({ weight: weight + 1.5, opacity: 1, fillOpacity: Math.min(fillOpacity + 0.15, 1) });
                    const [lat, lng] = cellToLatLng(h3Index);
                    setHoveredCell({ index: h3Index, score: normalizedScore, lat, lng });
                });
                polygon.on("mouseout", () => {
                    polygon.setStyle({ weight, opacity: 0.7, fillOpacity });
                    setHoveredCell(null);
                });

                // Popup
                const scoreLabel = hexScores
                    ? `<div style="margin-top:4px;font-size:11px;color:#64748b">Score: <strong style="color:${strokeColor}">${Math.round(normalizedScore)}/100</strong></div>`
                    : "";
                polygon.bindPopup(`
                    <div style="font-family:monospace;font-size:11px;padding:4px">
                        <div style="font-weight:700;color:#1e293b;word-break:break-all">${h3Index}</div>
                        <div style="margin-top:4px;font-size:10px;color:#94a3b8">Modo: ${viewMode}</div>
                        ${scoreLabel}
                        ${viewMode === "heatmap" ? `<div style="font-size:10px;color:#64748b;margin-top:2px">Cat: ${selectedCategory}</div>` : ""}
                    </div>
                `, { className: "h3-popup" });

                polygon.addTo(leafletMap.current!);
                hexLayers.current.push(polygon);

                // Value labels only on Res 7 to avoid visual clutter/perf overhead on higher resolutions.
                if (hexScores && resolution === 7) {
                    const [clat, clng] = cellToLatLng(h3Index);
                    const icon = L.divIcon({
                        html: `<div style="font-size:9px;font-weight:700;color:#1e293b;text-shadow:0 0 3px #fff,0 0 3px #fff;pointer-events:none">${Math.round(normalizedScore)}</div>`,
                        className: "",
                        iconSize: [20, 12],
                        iconAnchor: [10, 6],
                    });
                    const marker = L.marker([clat, clng] as [number, number], { icon, interactive: false });
                    marker.addTo(leafletMap.current!);
                    hexLayers.current.push(marker);
                }
            });

            // Auto fit bounds to rendered hexagons
            if (bounds.length > 0) {
                leafletMap.current!.fitBounds(bounds as any, { padding: [30, 30], maxZoom: zoom });
            }

            // Add legend control
            const legend = new L.Control({ position: "bottomleft" });
            (legend as any).onAdd = () => {
                const div = L.DomUtil.create("div");
                div.style.cssText = "background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;box-shadow:0 4px 24px rgba(0,0,0,.08);pointer-events:none;min-width:160px";
                div.innerHTML = buildLegendHTML(viewMode, categoryColor, selectedCategory);
                return div;
            };
            legend.addTo(leafletMap.current!);
            legendRef.current = legend;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady, activeH3Indices, viewMode, hexScores, categoryColor, selectedCategory, resolution]);

    return (
        <div className="relative">
            {/* Leaflet CSS */}
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

            {/* Map container */}
            <div ref={mapRef} style={{ width: "100%", height: "600px" }} />

            {/* Floating info badge */}
            {hoveredCell && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-100 px-4 py-2.5 text-xs pointer-events-none flex items-center gap-3">
                    <span className="font-mono text-slate-500">{hoveredCell.index}</span>
                    {hoveredCell.score !== undefined && (
                        <span className="font-bold text-slate-800">Score: {Math.round(hoveredCell.score)}/100</span>
                    )}
                    <span className="text-slate-400">{hoveredCell.lat.toFixed(4)}°N {Math.abs(hoveredCell.lng).toFixed(4)}°O</span>
                </div>
            )}

            {/* Info bar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 px-4 py-1.5 text-[10px] font-semibold text-slate-500 pointer-events-none flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34af00] animate-pulse" />
                H3 · {activeH3Indices.length} hexágonos · Cali 3.4516°N 76.5320°O
            </div>
        </div>
    );
}
