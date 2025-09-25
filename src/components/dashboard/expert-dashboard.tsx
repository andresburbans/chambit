import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getExpertOpportunities } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function ExpertDashboard() {
  const opportunities = getExpertOpportunities();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Opportunities</CardTitle>
        <CardDescription>
          A list of recent job opportunities from clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service / Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Offer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <div className="font-medium">{opportunity.serviceTitle}</div>
                  <div className="text-sm text-muted-foreground">{opportunity.clientName}</div>
                </TableCell>
                <TableCell>
                <Badge
                    className={cn({
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300": opportunity.status === "pending",
                      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300": opportunity.status === "accepted",
                      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300": opportunity.status === "rejected",
                    })}
                    variant="secondary"
                  >
                    {opportunity.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{opportunity.date}</TableCell>
                <TableCell className="hidden sm:table-cell text-right">${opportunity.offeredPrice}</TableCell>
                <TableCell className="text-right">
                    {opportunity.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700">
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <span className="text-sm text-muted-foreground">Responded</span>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
