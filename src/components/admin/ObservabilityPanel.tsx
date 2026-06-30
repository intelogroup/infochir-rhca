import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Gauge, Activity, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type VitalKey = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";

const goodThresholds: Record<VitalKey, number> = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800,
};

const formatVital = (key: VitalKey, value: number) =>
  key === "CLS" ? value.toFixed(2) : `${Math.round(value)} ms`;

const p75 = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.75)];
};

const fetchObservability = async () => {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [vitalsRes, errorsRes, recentEventRes, recentDownloadRes] = await Promise.all([
    supabase
      .from("performance_metrics")
      .select("web_vitals, created_at")
      .gte("created_at", since)
      .limit(1000),
    supabase
      .from("error_events")
      .select("id, error_type, message, created_at")
      .gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("user_events")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("download_events")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Aggregate web vitals p75
  const buckets: Record<VitalKey, number[]> = { LCP: [], INP: [], CLS: [], FCP: [], TTFB: [] };
  (vitalsRes.data ?? []).forEach((row: { web_vitals: unknown }) => {
    const v = row.web_vitals as Record<string, { value: number }> | null;
    if (!v) return;
    (Object.keys(buckets) as VitalKey[]).forEach((k) => {
      if (v[k]?.value != null) buckets[k].push(v[k].value);
    });
  });

  const vitals = (Object.keys(buckets) as VitalKey[]).map((k) => {
    const p = p75(buckets[k]);
    return {
      key: k,
      p75: p,
      samples: buckets[k].length,
      good: p != null && p <= goodThresholds[k],
    };
  });

  return {
    vitals,
    errors: errorsRes.data ?? [],
    errorCount: errorsRes.data?.length ?? 0,
    lastEventAt: recentEventRes.data?.created_at as string | undefined,
    lastDownloadAt: recentDownloadRes.data?.created_at as string | undefined,
  };
};

export const ObservabilityPanel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["observability"],
    queryFn: fetchObservability,
    staleTime: 60_000,
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" /> Web Vitals (p75 · 7j)
          </CardTitle>
          <CardDescription>
            Vitesse perçue côté utilisateur. Vert = sous le seuil "Good" de Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {data.vitals.map((v) => (
              <div key={v.key} className="text-center p-3 border rounded">
                <div className="text-xs text-muted-foreground">{v.key}</div>
                <div
                  className={`text-lg font-bold ${
                    v.p75 == null
                      ? "text-muted-foreground"
                      : v.good
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {v.p75 == null ? "—" : formatVital(v.key, v.p75)}
                </div>
                <div className="text-[10px] text-muted-foreground">{v.samples} ech.</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Erreurs JS (24h)
          </CardTitle>
          <CardDescription>
            {data.errorCount === 0 ? "Aucune erreur signalée" : `${data.errorCount} erreur(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.errors.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">RAS ✅</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto">
              {data.errors.map((e) => (
                <li key={e.id} className="text-xs border-l-2 border-orange-400 pl-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{e.error_type}</Badge>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(e.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <div className="truncate text-foreground/80 mt-1">{e.message}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Fraîcheur des données
          </CardTitle>
          <CardDescription>
            Sentinelle : si ces timestamps cessent d'avancer, le tracking est cassé.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Dernier user_event
            </div>
            <div className="font-medium">
              {data.lastEventAt
                ? formatDistanceToNow(new Date(data.lastEventAt), { addSuffix: true, locale: fr })
                : "Aucun"}
            </div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Dernier download_event
            </div>
            <div className="font-medium">
              {data.lastDownloadAt
                ? formatDistanceToNow(new Date(data.lastDownloadAt), {
                    addSuffix: true,
                    locale: fr,
                  })
                : "Aucun"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
