"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { cellToBoundary } from 'h3-js'
import L from 'leaflet'

// Fix for default marker icons in Leaflet
const fixLeafletIcons = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
}

interface GeozoneMapProps {
    center: [number, number]
    zoom: number
    activeH3Indices: string[]
    resoluction?: number
}

// Sub-component to handle map view updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

export default function GeozonesMap({
    center = [3.4516, -76.5320], // Default Cali
    zoom = 13,
    activeH3Indices = []
}: GeozoneMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        fixLeafletIcons()
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
            Loading spatial engine...
        </div>
    )

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} zoom={zoom} />

                {/* Render H3 Hexagons */}
                {activeH3Indices.map((h3Index) => {
                    try {
                        // cellToBoundary returns [lat, lng][]
                        const boundary = cellToBoundary(h3Index)
                        return (
                            <Polygon
                                key={h3Index}
                                positions={boundary}
                                pathOptions={{
                                    fillColor: '#34af00',
                                    fillOpacity: 0.15,
                                    color: '#34af00',
                                    weight: 1,
                                    dashArray: '3',
                                }}
                            >
                                <Popup>
                                    <div className="text-xs font-mono">
                                        <strong>H3 Index:</strong> {h3Index} <br />
                                        <strong>Resolution:</strong> {h3Index.length > 10 ? '9' : '7'}
                                    </div>
                                </Popup>
                            </Polygon>
                        )
                    } catch (e) {
                        console.error(`Error rendering H3 index ${h3Index}:`, e)
                        return null
                    }
                })}
            </MapContainer>
        </div>
    )
}
