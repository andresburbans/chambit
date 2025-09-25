import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">Your recent notifications.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>No new notifications</CardTitle>
                    <CardDescription>You're all caught up.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                        <Bell className="w-16 h-16 mb-4" />
                        <p>Check back later for new notifications.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
