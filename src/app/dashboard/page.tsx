"use client"
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { ExpertDashboard } from "@/components/dashboard/expert-dashboard";
import { useAuth } from "@/lib/auth.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    
    // A generic overview component
    const Overview = () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Jobs
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
      </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground">Here's a summary of your activity.</p>
            </div>
            
            <Overview />

            <div>
                {user?.role === 'client' && <ClientDashboard />}
                {user?.role === 'expert' && <ExpertDashboard />}
            </div>
        </div>
    );
}
