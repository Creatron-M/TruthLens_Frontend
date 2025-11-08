"use client";

import { useState, useEffect } from "react";
import { marketService } from "../lib/api";
import type { AIStatus, AIPerformanceMetrics } from "../types/oracle";
import {
  Activity,
  Zap,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

export function AIStatusPanel() {
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [performance, setPerformance] = useState<AIPerformanceMetrics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAIStatus = async () => {
    try {
      setLoading(true);
      const [statusData, perfData] = await Promise.all([
        marketService.getAIStatus(),
        marketService.getAIPerformance().catch(() => null), // Optional
      ]);

      // Transform the backend data to match frontend types
      const transformedStatus = {
        ...statusData,
        queue_status: statusData.queue_status
          ? {
              pending_items: statusData.queue_status.queue_length || 0,
              processing: (statusData.queue_status.queue_length || 0) > 0,
              average_processing_time: 0, // Not provided by backend
            }
          : undefined,
      };

      // Transform performance data if available
      const transformedPerf = perfData?.metrics
        ? {
            response_time_avg: perfData.metrics.avg_response_time || 0,
            cache_hit_rate: perfData.metrics.cache_hit_rate || 0,
            total_requests: perfData.metrics.total_requests || 0,
            error_rate: perfData.metrics.error_rate || 0,
            success_rate: 1 - (perfData.metrics.error_rate || 0),
            queue_size: statusData.queue_status?.queue_length || 0,
            processing_speed: perfData.metrics.avg_response_time
              ? 1 / perfData.metrics.avg_response_time
              : 0,
          }
        : statusData.performance
        ? {
            response_time_avg: statusData.performance.avg_response_time || 0,
            cache_hit_rate: statusData.performance.cache_hit_rate || 0,
            total_requests: statusData.performance.total_requests || 0,
            error_rate: statusData.performance.error_rate || 0,
            success_rate: 1 - (statusData.performance.error_rate || 0),
            queue_size: statusData.queue_status?.queue_length || 0,
            processing_speed: statusData.performance.avg_response_time
              ? 1 / statusData.performance.avg_response_time
              : 0,
          }
        : null;

      setAIStatus(transformedStatus);
      setPerformance(transformedPerf);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch AI status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIStatus();
    const interval = setInterval(fetchAIStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    setActionLoading("clearCache");
    try {
      await marketService.clearAICache();
      await fetchAIStatus(); // Refresh status
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cache");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlushQueue = async () => {
    setActionLoading("flushQueue");
    try {
      await marketService.flushAIQueue();
      await fetchAIStatus(); // Refresh status
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to flush queue");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enhanced_mode":
      case "online":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "basic_mode":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-card dark:bg-card rounded-lg shadow-lg p-6 border">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted dark:bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted dark:bg-muted rounded"></div>
            <div className="h-3 bg-muted dark:bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card dark:bg-card rounded-lg shadow-lg p-6 border">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">
            AI Status Error
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={fetchAIStatus}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-card rounded-lg shadow-lg p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground dark:text-foreground">
          Enhanced AI Status
        </h2>
        <button
          onClick={fetchAIStatus}
          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {aiStatus && (
        <div className="space-y-6">
          {/* AI Status Overview */}
          <div className="flex items-center space-x-3">
            {getStatusIcon(aiStatus.status)}
            <div>
              <div className="font-medium text-foreground dark:text-foreground">
                {aiStatus.enhanced_features_enabled
                  ? "Enhanced AI Active"
                  : "Basic AI Mode"}
              </div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                {aiStatus.message}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {performance && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                    Response Time
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {performance?.response_time_avg?.toFixed(2) ?? "0.00"}s
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-1">
                  <Database className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-900 dark:text-green-300">
                    Cache Hit Rate
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {((performance?.cache_hit_rate ?? 0) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
                    Success Rate
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {((performance?.success_rate ?? 0) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-medium text-orange-900 dark:text-orange-300">
                    Queue Size
                  </span>
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {performance?.queue_size ?? 0}
                </div>
              </div>
            </div>
          )}

          {/* Queue Status */}
          {aiStatus?.queue_status && (
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 border">
              <h3 className="font-medium text-foreground dark:text-foreground mb-2 text-sm">
                Processing Queue
              </h3>
              <div className="flex justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                <span>
                  Pending Items: {aiStatus.queue_status.pending_items ?? 0}
                </span>
                <span>
                  Processing:{" "}
                  {aiStatus.queue_status.processing ? "Active" : "Idle"}
                </span>
                <span>
                  Avg Time:{" "}
                  {aiStatus.queue_status.average_processing_time?.toFixed(2) ??
                    "0.00"}
                  s
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {aiStatus?.enhanced_features_enabled && (
            <div className="flex space-x-3 pt-4 border-t border-border">
              <button
                onClick={handleClearCache}
                disabled={actionLoading === "clearCache"}
                className="flex items-center space-x-2 px-3 py-2 text-xs bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>
                  {actionLoading === "clearCache"
                    ? "Clearing..."
                    : "Clear Cache"}
                </span>
              </button>

              <button
                onClick={handleFlushQueue}
                disabled={actionLoading === "flushQueue"}
                className="flex items-center space-x-2 px-3 py-2 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>
                  {actionLoading === "flushQueue"
                    ? "Flushing..."
                    : "Flush Queue"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
