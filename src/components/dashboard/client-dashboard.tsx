import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientRequests } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

export function ClientDashboard() {
  const requests = getClientRequests();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
        <CardDescription>
          A list of your recent service requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="hidden sm:table-cell">Expert</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Offer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.serviceTitle}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{request.expertName}</TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300": request.status === "pending",
                      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300": request.status === "accepted" || request.status === "completed",
                      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300": request.status === "rejected",
                    })}
                    variant="secondary"
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{request.date}</TableCell>
                <TableCell className="text-right">${request.offeredPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
