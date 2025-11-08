"use client";

import { useState, useEffect } from "react";
import { marketService } from "../lib/api";
import type { OracleStatusData } from "../types/oracle";

export function OracleStatus() {
  const [status, setStatus] = useState<OracleStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await marketService.getStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const triggerAnalysis = async () => {
    try {
      await marketService.triggerAnalysis();
      // Optionally show a toast notification
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Oracle Status
        </h2>
        <button
          onClick={triggerAnalysis}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh Analysis
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {status?.total_markets || 0}
          </div>
          <p className="text-sm text-muted-foreground">Total Markets</p>
          <p className="font-medium text-card-foreground">Monitored</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {status?.active_analyses || 0}
          </div>
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="font-medium text-card-foreground">Analyses</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {status?.total_attestations || 0}
          </div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-medium text-card-foreground">Attestations</p>
        </div>

        <div className="text-center">
          <div
            className={`text-2xl font-bold mb-1 ${
              status?.blockchain_connected
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {status?.blockchain_connected ? "�" : "❌"}
          </div>
          <p className="text-sm text-muted-foreground">Blockchain</p>
          <p className="font-medium text-card-foreground">
            {status?.blockchain_connected ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>

      {status?.last_update && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Last Update: {new Date(status.last_update * 1000).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
