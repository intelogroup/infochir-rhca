
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { defaultStats } from "../../StatsData";

export const OverviewTab = () => {
  const { data: statsData } = useQuery({
    queryKey: ['home-stats'],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé des statistiques</CardTitle>
        <CardDescription>Vue générale de nos activités</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(statsData || defaultStats).map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <stat.icon className={`h-6 w-6 ${stat.iconClassName}`} />
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
