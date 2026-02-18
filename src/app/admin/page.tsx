import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, MapPin, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
    const stats = [
        { label: "Total Users", value: "1,284", icon: Users, change: "+12%", color: "text-blue-600" },
        { label: "Active Experts", value: "432", icon: Briefcase, change: "+5%", color: "text-[#34af00]" },
        { label: "Active Geozones", value: "1", icon: MapPin, change: "Cali", color: "text-orange-600" },
        { label: "Success Rate", value: "98.2%", icon: TrendingUp, change: "+2.1%", color: "text-purple-600" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Platform Analytics</h1>
                <p className="text-gray-500 mt-1">Real-time performance across Chambit infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color} opacity-80`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-gray-400 mt-1">
                                <span className={stat.color}>{stat.change}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm min-h-[300px] flex items-center justify-center text-gray-400 italic">
                    Growth Trends Visualization (Coming Soon)
                </Card>
                <Card className="border-none shadow-sm min-h-[300px] flex items-center justify-center text-gray-400 italic">
                    Regional Distribution Map (Coming Soon)
                </Card>
            </div>
        </div>
    )
}
