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

const BACKEND_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://truthlens-backend-vj37.onrender.com";

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
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const healthData = await response.json();
        setStatus(healthData);
      } else {
        setStatus({
          status: "unhealthy",
          timestamp: Date.now(),
          services: {
            api: "degraded",
            markets: "offline",
            oracle: "offline",
            analysis: "offline",
          },
          error: `HTTP ${response.status}`,
        });
      }
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
