
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CHART_COLORS, prepareDailyData, prepareTypeData } from "../ChartUtils";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

interface DownloadsTabProps {
  downloadStats: any;
  isLoading: boolean;
}

export const DownloadsTab: React.FC<DownloadsTabProps> = ({ downloadStats, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <LoadingSpinner text="Chargement des données" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Téléchargements par jour</CardTitle>
          <CardDescription>Les 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={prepareDailyData(downloadStats)} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" name="Réussis" fill="#10b981" />
              <Bar dataKey="failed" name="Échoués" fill="#ef4444" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Téléchargements par type de document</CardTitle>
          <CardDescription>Distribution des téléchargements réussis</CardDescription>
        </CardHeader>
        <CardContent className="h-80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={prepareTypeData(downloadStats).filter((item: any) => item.status === 'success')}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="downloads"
                  nameKey="name"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareTypeData(downloadStats)
                    .filter((item: any) => item.status === 'success')
                    .map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} téléchargements`, 'Quantité']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-col justify-center">
            <h4 className="text-lg font-semibold mb-4">Répartition des téléchargements</h4>
            <ul className="space-y-3">
              {prepareTypeData(downloadStats)
                .filter((item: any) => item.status === 'success')
                .map((item: any, index: number) => (
                  <li key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                    <span className="font-medium">{item.name}: </span>
                    <span className="ml-2">{item.downloads} téléchargements</span>
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
