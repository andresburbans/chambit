"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, ShieldCheck, Activity } from "lucide-react"

// Dynamic import for Leaflet (crucial for Next.js)
const GeozonesMap = dynamic(() => import("@/components/admin/geozones-map"), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">Loading spatial components...</div>
})

// MOCK DATA for visualization (Cali Urban Centers)
const CALI_SAMPLES = [
    "87668d600ffffff", "87668d601ffffff", "87668d602ffffff",
    "87668d603ffffff", "87668d604ffffff", "87668d605ffffff",
    "87668d606ffffff", "87668bc12ffffff", "87668bc13ffffff"
];

export default function AdminGeozonesPage() {
    const [selectedCity, setSelectedCity] = useState({
        name: "Santiago de Cali",
        center: [3.4372, -76.5225],
        activeExperts: 124,
        coverage: "Urban Core",
        indices: CALI_SAMPLES
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">Geospatial Intelligence</h1>
                    <p className="text-gray-500 mt-1">Manage and visualize authorized operating zones across Colombia.</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-[#34af00]/10 text-[#34af00] border-[#34af00]/20 px-3 py-1">
                        <Activity className="h-3 w-3 mr-2" /> Live Engine
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1">
                        <Globe className="h-3 w-3 mr-2" /> Colombia Active
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#34af00]" /> Current City
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{selectedCity.name}</div>
                            <div className="text-xs text-gray-400 mt-1 uppercase tracking-tighter font-medium">Main Operation Hub</div>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Active Experts</span>
                                    <span className="font-bold text-[#34af00]">{selectedCity.activeExperts}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Coverage</span>
                                    <Badge variant="secondary" className="font-semibold">{selectedCity.coverage}</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">H3 Grids (Res 7)</span>
                                    <span className="font-mono text-xs">{selectedCity.indices.length} Cells</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-[#34af00] to-[#2d9600] text-white">
                        <CardContent className="pt-6">
                            <ShieldCheck className="h-10 w-10 mb-4 opacity-80" />
                            <h3 className="font-bold text-lg leading-tight text-white">Privacy Secured</h3>
                            <p className="text-white/80 text-xs mt-2 leading-relaxed">
                                Exact GPS coordinates are never stored. Only H3 hexagonal indices are used for matching and analytics.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Map View */}
                <div className="lg:col-span-3">
                    <Card className="border-none shadow-xl h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-xl">Network Topology</CardTitle>
                                <CardDescription>Interactive H3 visualization of authorized cells</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="relative group">
                                <GeozonesMap
                                    center={selectedCity.center as [number, number]}
                                    zoom={12}
                                    activeH3Indices={selectedCity.indices}
                                />
                                {/* Map Overlay Legend */}
                                <div className="absolute bottom-6 right-6 z-[400] bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100 pointer-events-none">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Legend</div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-700">
                                        <div className="h-3 w-3 rounded-full bg-[#34af00] shadow-[0_0_8px_rgba(52,175,0,0.5)]"></div>
                                        <span>Authorized Hubs (Res 7)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-700 mt-2">
                                        <div className="h-3 w-3 rounded-full border border-dashed border-gray-400"></div>
                                        <span>Candidate Area</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
