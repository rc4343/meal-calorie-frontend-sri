import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-10 w-28" />
      </div>
      <Card className="bg-primary/10">
        <CardContent className="flex flex-col items-center gap-4 py-10 sm:flex-row sm:justify-around">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </section>
  );
}
