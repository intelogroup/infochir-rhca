
export const prepareTypeData = (downloadStats: any) => {
  if (!downloadStats?.byType) return [];
  
  return downloadStats.byType.map((item: any) => ({
    name: item.document_type.toUpperCase().replace('INDEX-MEDICUS', 'INDEX'),
    downloads: item.count,
    status: item.status
  }));
};

export const prepareDailyData = (downloadStats: any) => {
  if (!downloadStats?.daily) return [];
  
  return downloadStats.daily.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    total: Number(item.total_downloads),
    success: Number(item.successful_downloads),
    failed: Number(item.failed_downloads)
  }));
};

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
