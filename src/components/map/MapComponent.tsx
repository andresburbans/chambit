'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, CheckCircle, Zap, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExpertResult {
    id: string; name: string; specialty: string; category: string;
    rating: number; reviews: number; distance: string; price: string;
    avatar: string; avatarUrl?: string; verified: boolean; active: boolean;
    lastActive: string; bio: string; tags: string[]; completedJobs: number;
    priceMin?: number; lat?: number; lng?: number; h3Index?: string;
}

interface MapComponentProps {
    results: ExpertResult[];
    selectedId?: string;
    onSelect?: (expert: ExpertResult) => void;
}

// ─── Price bubble marker ──────────────────────────────────────────────────────

function createPriceIcon(price: string, isSelected: boolean) {
    const label = price.replace('/h', '').replace('$', '').replace('.000', 'k').trim();
    const bg = isSelected ? '#34af00' : '#ffffff';
    const color = isSelected ? '#ffffff' : '#34af00';
    const border = isSelected ? '#2d9600' : '#34af00';
    const shadow = isSelected ? '0 4px 14px rgba(52,175,0,0.45)' : '0 2px 10px rgba(0,0,0,0.18)';
    const scale = isSelected ? 'scale(1.18)' : 'scale(1)';
    const html = `
        <div style="
            background:${bg};color:${color};
            padding:6px 12px;border-radius:20px;
            font-size:12px;font-weight:800;white-space:nowrap;
            box-shadow:${shadow};border:2.5px solid ${border};
            transform:${scale};transition:transform 0.15s;
            cursor:pointer;line-height:1;
        ">$${label}</div>`;
    return L.divIcon({ html, className: '', iconAnchor: [36, 18] });
}

// ─── Floating card tracker (INSIDE MapContainer — has useMap access) ──────────
// Emits pixel positions to a callback so the card can be rendered in the
// parent `<div className="relative">` wrapper — coordinates are CORRECTLY
// relative to that outer wrapper because we subtract the map container offset.

interface TrackerProps {
    expert: ExpertResult | null;
    onPosition: (pos: { x: number; y: number } | null) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const CARD_W = 290;
const CARD_H = 150; // approx card height
const GAP = 16;  // gap above marker top edge

function PositionTracker({ expert, onPosition, containerRef }: TrackerProps) {
    const map = useMap();

    const update = useCallback(() => {
        if (!expert?.lat || !expert?.lng) { onPosition(null); return; }

        const markerLatLng = L.latLng(expert.lat, expert.lng);
        // Pixel position of the marker inside the Leaflet canvas
        const mapPoint = map.latLngToContainerPoint(markerLatLng);

        // Leaflet's container is the inner canvas div; we need coordinates
        // relative to our outer `position:relative` wrapper div.
        const mapEl = map.getContainer();   // the leaflet canvas <div>
        const wrapEl = containerRef.current; // our outer wrapper <div>
        if (!wrapEl) { onPosition(null); return; }

        const mapRect = mapEl.getBoundingClientRect();
        const wrapRect = wrapEl.getBoundingClientRect();

        // Offset of Leaflet canvas inside our wrapper
        const offsetX = mapRect.left - wrapRect.left;
        const offsetY = mapRect.top - wrapRect.top;

        // Card center X, top Y (card appears ABOVE the marker)
        const cardCenterX = mapPoint.x + offsetX;
        const cardTopY = mapPoint.y + offsetY - CARD_H - GAP;

        // Clamp within wrapper
        const wrapW = wrapRect.width;
        const clampedX = Math.max(CARD_W / 2 + 4, Math.min(cardCenterX, wrapW - CARD_W / 2 - 4));
        const clampedY = Math.max(4, cardTopY);

        onPosition({ x: clampedX, y: clampedY });
    }, [expert, map, onPosition, containerRef]);

    useEffect(() => {
        update();
        map.on('move zoom moveend zoomend viewreset', update);
        return () => { map.off('move zoom moveend zoomend viewreset', update); };
    }, [map, update]);

    // Map click closes the card
    useMapEvents({ click: () => onPosition(null) });

    return null;
}

// ─── Auto-fly ────────────────────────────────────────────────────────────────

function MapFlyTo({ expert }: { expert?: ExpertResult }) {
    const map = useMap();
    useEffect(() => {
        if (expert?.lat && expert?.lng) {
            map.flyTo([expert.lat, expert.lng], 15, { animate: true, duration: 0.8 });
        }
    }, [expert, map]);
    return null;
}

// ─── Mini card (rendered outside MapContainer so z-index works cleanly) ───────

interface MiniCardProps {
    expert: ExpertResult;
    pos: { x: number; y: number };
    onClose: () => void;
    onCotizar: () => void;
}

function MiniCard({ expert, pos, onClose, onCotizar }: MiniCardProps) {
    return (
        <div
            style={{
                position: 'absolute',
                left: pos.x - CARD_W / 2,
                top: pos.y,
                width: CARD_W,
                zIndex: 1000,
                pointerEvents: 'all',
                animation: 'cardFadeUp 0.18s ease',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-visible">
                {/* Green strip */}
                <div className="h-1.5 w-full rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#34af00,#2d9600)' }} />
                <div className="p-3.5">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                    >
                        <X className="w-3 h-3 text-slate-500" />
                    </button>

                    <div className="flex items-start gap-2.5 pr-5">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg,#34af00,#2d9600)' }}
                        >
                            {expert.avatarUrl
                                ? <img src={expert.avatarUrl} alt={expert.name} className="w-full h-full object-cover" />
                                : expert.avatar}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{expert.name}</p>
                                {expert.verified && <CheckCircle className="w-3 h-3 text-[#34af00] shrink-0" />}
                            </div>
                            <p className="text-xs text-[#34af00] font-semibold truncate">{expert.specialty}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                                <span className="text-xs font-bold text-slate-700">{expert.rating}</span>
                                <span className="text-xs text-slate-400">· {expert.distance}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <div>
                            <span className="text-base font-extrabold text-[#34af00]">{expert.price}</span>
                            <span className="text-[10px] text-slate-400 ml-1">tarifa aprox.</span>
                        </div>
                        <button
                            onClick={onCotizar}
                            className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-xl"
                            style={{ background: 'linear-gradient(135deg,#34af00,#2d9600)' }}
                        >
                            <Zap className="w-3 h-3" /> Cotizar
                        </button>
                    </div>
                </div>

                {/* Arrow pointing down toward the marker */}
                <div style={{
                    position: 'absolute', bottom: -8,
                    left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '9px solid transparent',
                    borderRight: '9px solid transparent',
                    borderTop: '9px solid white',
                    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.12))',
                }} />
            </div>
        </div>
    );
}

// ─── Main MapComponent ────────────────────────────────────────────────────────

export default function MapComponent({ results, selectedId, onSelect }: MapComponentProps) {
    const defaultCenter: [number, number] = [3.4516, -76.5320];
    const [activeExpert, setActiveExpert] = useState<ExpertResult | null>(null);
    const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const validResults = results.filter(r => r.lat && r.lng);
    const selectedExpert = validResults.find(r => r.id === selectedId);

    // When expert changes (from external), clear active card
    useEffect(() => { setActiveExpert(null); setCardPos(null); }, [selectedId]);

    const handleMarkerClick = (expert: ExpertResult, e: L.LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        setActiveExpert(expert);
        onSelect?.(expert);
    };

    const handleClose = () => { setActiveExpert(null); setCardPos(null); };

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <style>{`
                @keyframes cardFadeUp {
                    from { opacity:0; transform:translateY(6px); }
                    to   { opacity:1; transform:translateY(0); }
                }
            `}</style>

            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapFlyTo expert={selectedExpert} />

                {/* Position tracker — updates cardPos on map move/zoom */}
                <PositionTracker
                    expert={activeExpert}
                    onPosition={(pos) => { if (!pos) setCardPos(null); else setCardPos(pos); }}
                    containerRef={containerRef}
                />

                {validResults.map((expert) =>
                    expert.lat && expert.lng ? (
                        <Marker
                            key={expert.id}
                            position={[expert.lat, expert.lng]}
                            icon={createPriceIcon(expert.price, expert.id === activeExpert?.id)}
                            eventHandlers={{ click: (e) => handleMarkerClick(expert, e) }}
                        />
                    ) : null
                )}
            </MapContainer>

            {/* Card rendered OUTSIDE MapContainer — position is already
                relative to `containerRef` thanks to PositionTracker offset math */}
            {activeExpert && cardPos && (
                <MiniCard
                    expert={activeExpert}
                    pos={cardPos}
                    onClose={handleClose}
                    onCotizar={() => { onSelect?.(activeExpert); handleClose(); }}
                />
            )}
        </div>
    );
}
