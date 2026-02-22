"use client";

/**
 * H3HexMap — Interactive H3 hexagonal grid over Cali, Colombia
 *
 * Shows expert density / request density / demand correlation
 * rendered as colored hexagons at res-7 (neighborhood) or res-9 (block-level).
 *
 * Uses: h3-js (already installed), Leaflet (via react-leaflet)
 */

import { useEffect, useRef, useState } from "react";
import { latLngToCell, gridDisk, cellToBoundary, cellToLatLng } from "h3-js";
import { Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Metric = "expertos" | "solicitudes" | "demanda";

interface HexCell {
    h3Index: string;
    center: [number, number]; // [lat, lng]
    boundary: [number, number][]; // polygon vertices
    expertos: number;
    solicitudes: number;
    demanda: number; // derived score
    topCategory: string;
}

// ─── Synthetic data generator ─────────────────────────────────────────────────
// Cali Centro coordinates
const CALI_CENTER: [number, number] = [3.4516, -76.532];
const CATEGORIES = ["Reparación", "Limpieza", "Construcción", "Belleza", "Tecnología", "Mecánica"];

function generateSyntheticCells(resolution: 7 | 9): HexCell[] {
    // Generate a k-ring from Cali center
    const centerCell = latLngToCell(CALI_CENTER[0], CALI_CENTER[1], resolution);
    const kSize = resolution === 7 ? 4 : 2; // larger ring for res7 (coarser)
    const ring = gridDisk(centerCell, kSize);

    // Assign synthetic data to each cell
    return ring.map((h3Index, i) => {
        const [lat, lng] = cellToLatLng(h3Index);
        const boundary = cellToBoundary(h3Index).map(([lat, lng]) => [lat, lng] as [number, number]);

        // Distance-based density (more density near center)
        const dist = Math.sqrt(
            Math.pow(lat - CALI_CENTER[0], 2) + Math.pow(lng - CALI_CENTER[1], 2)
        );
        const densityFactor = Math.max(0, 1 - dist * 800) + Math.random() * 0.3;

        const expertos = Math.round(densityFactor * 20 + Math.random() * 5);
        const solicitudes = Math.round(densityFactor * 35 + Math.random() * 10);
        const demanda = Math.round((solicitudes / Math.max(1, expertos)) * 10 + Math.random() * 5); // demand pressure

        return {
            h3Index,
            center: [lat, lng],
            boundary,
            expertos,
            solicitudes,
            demanda,
            topCategory: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        };
    });
}

// ─── Color scale ──────────────────────────────────────────────────────────────
function valueToColor(value: number, max: number, metric: Metric): string {
    const ratio = Math.min(1, value / Math.max(1, max));

    if (metric === "expertos") {
        // Green scale
        const g = Math.round(80 + ratio * 130);
        const r = Math.round(80 - ratio * 50);
        return `rgba(${r}, ${g}, 30, ${0.3 + ratio * 0.55})`;
    }
    if (metric === "solicitudes") {
        // Blue scale
        const b = Math.round(120 + ratio * 135);
        const r = Math.round(30 + ratio * 30);
        return `rgba(${r}, 80, ${b}, ${0.3 + ratio * 0.55})`;
    }
    // Demand: orange-red (pressure)
    const r = Math.round(200 + ratio * 55);
    const g = Math.round(150 - ratio * 100);
    return `rgba(${r}, ${g}, 30, ${0.3 + ratio * 0.55})`;
}

function borderColorForMetric(metric: Metric): string {
    return metric === "expertos" ? "#34af00" : metric === "solicitudes" ? "#3b82f6" : "#f97316";
}

// ─── Legend component ─────────────────────────────────────────────────────────
function Legend({ metric }: { metric: Metric }) {
    const colors = {
        expertos: ["rgba(30,80,30,0.35)", "rgba(50,130,30,0.6)", "rgba(80,175,30,0.85)"],
        solicitudes: ["rgba(30,80,120,0.35)", "rgba(30,80,180,0.6)", "rgba(50,80,255,0.85)"],
        demanda: ["rgba(200,130,30,0.35)", "rgba(230,80,30,0.6)", "rgba(255,50,30,0.85)"],
    };
    const labels = metric === "expertos"
        ? ["Baja (0–5)", "Media (6–12)", "Alta (13+)"]
        : metric === "solicitudes"
            ? ["Baja (0–10)", "Media (11–25)", "Alta (26+)"]
            : ["Baja", "Media", "Alta presión"];

    return (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 text-xs border border-slate-100">
            <p className="font-bold text-slate-700 mb-2 uppercase tracking-wide" style={{ fontSize: 10 }}>
                {metric === "expertos" ? "Densidad de expertos" : metric === "solicitudes" ? "Solicitudes" : "Presión de demanda"}
            </p>
            <div className="space-y-1.5">
                {colors[metric].map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-white/50" style={{ background: c }} />
                        <span className="text-slate-600">{labels[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Tooltip card ─────────────────────────────────────────────────────────────
interface TooltipInfo {
    x: number;
    y: number;
    cell: HexCell;
}

function HexTooltip({ info }: { info: TooltipInfo }) {
    return (
        <div
            className="absolute z-[2000] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 text-xs pointer-events-none"
            style={{ left: info.x + 12, top: info.y - 60, minWidth: 200 }}
        >
            <p className="font-bold text-slate-800 text-sm mb-2 truncate font-mono">{info.cell.h3Index}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-slate-500">Expertos</span>
                <span className="font-bold text-[#34af00]">{info.cell.expertos}</span>
                <span className="text-slate-500">Solicitudes</span>
                <span className="font-bold text-blue-600">{info.cell.solicitudes}</span>
                <span className="text-slate-500">Demanda</span>
                <span className="font-bold text-orange-500">{info.cell.demanda}x</span>
                <span className="text-slate-500">Top cat.</span>
                <span className="font-bold text-slate-700 truncate">{info.cell.topCategory}</span>
            </div>
        </div>
    );
}

// ─── H3 Stats bar ─────────────────────────────────────────────────────────────
function H3Stats({ cells, resolution }: { cells: HexCell[]; resolution: 7 | 9 }) {
    const totalExpertos = cells.reduce((s, c) => s + c.expertos, 0);
    const totalSolicitudes = cells.reduce((s, c) => s + c.solicitudes, 0);
    const maxDemanda = cells.reduce((a, c) => a.demanda > c.demanda ? a : c, cells[0]);

    return (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 text-xs border border-slate-100 min-w-[200px]">
            <p className="font-bold text-slate-700 mb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34af00] inline-block" />
                H3 Res-{resolution} · {cells.length} hexágonos
            </p>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-slate-500">Expertos totales</span>
                    <span className="font-bold text-[#34af00]">{totalExpertos}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Solicitudes totales</span>
                    <span className="font-bold text-blue-600">{totalSolicitudes}</span>
                </div>
                {maxDemanda && (
                    <div className="flex justify-between">
                        <span className="text-slate-500">Mayor presión</span>
                        <span className="font-bold text-orange-500 font-mono truncate max-w-[90px]">{maxDemanda.h3Index.slice(0, 10)}...</span>
                    </div>
                )}
                <div className="border-t border-slate-100 pt-1 mt-1 text-[10px] text-slate-400">
                    Cada hex = {resolution === 7 ? "~5.16 km² · 1.4km arista" : "~0.1 km² · 200m arista"}
                </div>
            </div>
        </div>
    );
}

// ─── Main Map Component ───────────────────────────────────────────────────────
interface H3HexMapProps {
    resolution: 7 | 9;
    metric: Metric;
}

export default function H3HexMap({ resolution, metric }: H3HexMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<any>(null);
    const hexLayers = useRef<any[]>([]);
    const [cells, setCells] = useState<HexCell[]>([]);
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Init Leaflet map
    useEffect(() => {
        if (!mapRef.current || leafletMap.current) return;

        import("leaflet").then(L => {
            // Fix default icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current!, {
                center: CALI_CENTER,
                zoom: 12,
                zoomControl: true,
                attributionControl: true,
            });

            // Light map tiles (CartoDB Positron — minimal, premium look)
            L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 19,
            }).addTo(map);

            leafletMap.current = map;
            setMapReady(true);
        });

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, []);

    // Regenerate cells when resolution changes
    useEffect(() => {
        setCells(generateSyntheticCells(resolution));
    }, [resolution]);

    // Render hexagons when cells or metric changes
    useEffect(() => {
        if (!mapReady || !leafletMap.current || cells.length === 0) return;

        import("leaflet").then(L => {
            // Remove old layers
            hexLayers.current.forEach(l => l.remove());
            hexLayers.current = [];

            const maxValue = Math.max(...cells.map(c => c[metric]));
            const borderColor = borderColorForMetric(metric);

            cells.forEach(cell => {
                const fillColor = valueToColor(cell[metric], maxValue, metric);

                // Leaflet expects [lat, lng] pairs
                const polygon = L.polygon(cell.boundary, {
                    color: borderColor,
                    weight: resolution === 7 ? 1.5 : 0.8,
                    opacity: 0.5,
                    fillColor,
                    fillOpacity: 1,
                });

                polygon.on("mouseover", (e: any) => {
                    polygon.setStyle({ weight: 3, opacity: 0.9 });
                    const containerPoint = leafletMap.current!.latLngToContainerPoint(e.latlng);
                    setTooltip({ x: containerPoint.x, y: containerPoint.y, cell });
                });
                polygon.on("mousemove", (e: any) => {
                    const containerPoint = leafletMap.current!.latLngToContainerPoint(e.latlng);
                    setTooltip(prev => prev ? { ...prev, x: containerPoint.x, y: containerPoint.y } : null);
                });
                polygon.on("mouseout", () => {
                    polygon.setStyle({ weight: resolution === 7 ? 1.5 : 0.8, opacity: 0.5 });
                    setTooltip(null);
                });

                // Add label for expert count on res-7 cells (visible at zoom 10+)
                if (resolution === 7 && cell[metric] > 0) {
                    const icon = L.divIcon({
                        html: `<div style="font-size:10px;font-weight:700;color:#1e293b;text-shadow:0 0 4px #fff,0 0 4px #fff;white-space:nowrap;">${cell[metric]}</div>`,
                        className: "",
                        iconSize: [24, 14],
                        iconAnchor: [12, 7],
                    });
                    const marker = L.marker(cell.center as [number, number], { icon, interactive: false });
                    marker.addTo(leafletMap.current!);
                    hexLayers.current.push(marker);
                }

                polygon.addTo(leafletMap.current!);
                hexLayers.current.push(polygon);
            });
        });
    }, [cells, metric, mapReady, resolution]);

    return (
        <div className="relative w-full h-full">
            {/* Leaflet CSS */}
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

            {/* Map container */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Overlays */}
            {mapReady && cells.length > 0 && (
                <>
                    <Legend metric={metric} />
                    <H3Stats cells={cells} resolution={resolution} />
                </>
            )}

            {/* Tooltip */}
            {tooltip && <HexTooltip info={tooltip} />}

            {/* Info badge */}
            <div className="absolute bottom-4 right-4 z-[1000]">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-100 shadow px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Info className="w-3 h-3" />
                    Hover sobre hexágonos para ver datos
                </div>
            </div>
        </div>
    );
}
