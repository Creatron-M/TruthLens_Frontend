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

import { getSystemAnalytics } from "../lib/api";

export function useAnalytics(refreshInterval = 60000) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const data = await getSystemAnalytics();
      setAnalytics(data);
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
