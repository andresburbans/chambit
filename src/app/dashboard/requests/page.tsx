import { ClientDashboard } from "@/components/dashboard/client-dashboard";

export default function RequestsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">My Requests</h1>
            <ClientDashboard />
        </div>
    );
}
