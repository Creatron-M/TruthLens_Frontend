import { useState, useEffect } from "react";

export interface AnalyticsData {
  markets_analyzed: number;
  success_rate: number;
  avg_confidence: number;
  total_attestations: number;
  performance_metrics: {
    response_time: number;
    uptime: number;
    error_rate: number;
    throughput: number;
  };
  time_series: Array<{
    timestamp: number;
    markets_analyzed: number;
    confidence: number;
    success_rate: number;
  }>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://truthlens-backend-vj37.onrender.com";

export function useAnalytics(refreshInterval = 60000) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/analytics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up periodic refresh
    const interval = setInterval(fetchAnalytics, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
