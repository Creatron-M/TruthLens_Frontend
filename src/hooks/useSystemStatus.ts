import { useState, useEffect } from "react";

export interface SystemStatus {
  status: "healthy" | "unhealthy" | "loading" | "error";
  timestamp: number;
  services: {
    api: "online" | "offline" | "degraded";
    markets: "online" | "offline" | "degraded";
    oracle: "online" | "offline" | "degraded";
    analysis: "online" | "offline" | "degraded";
  };
  metrics?: {
    total_markets: number;
    active_analyses: number;
    blockchain_connected: boolean;
    last_update: number;
  };
  error?: string;
}

import { getSystemHealth } from "../lib/api";

export function useSystemStatus(refreshInterval = 30000) {
  const [status, setStatus] = useState<SystemStatus>({
    status: "loading",
    timestamp: Date.now(),
    services: {
      api: "offline",
      markets: "offline",
      oracle: "offline",
      analysis: "offline",
    },
  });

  const checkHealth = async () => {
    try {
      const healthData = await getSystemHealth();
      setStatus(healthData);
    } catch (error) {
      console.error("Health check failed:", error);
      setStatus({
        status: "error",
        timestamp: Date.now(),
        services: {
          api: "offline",
          markets: "offline",
          oracle: "offline",
          analysis: "offline",
        },
        error: error instanceof Error ? error.message : "Connection failed",
      });
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();

    // Set up periodic health checks
    const interval = setInterval(checkHealth, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    ...status,
    refresh: checkHealth,
  };
}
