"use client";

import { useState, useEffect } from "react";
import { TruthLensWidget } from "./TruthLensWidget";
import { MarketGrid } from "./MarketGrid";
import { AIStatusPanel } from "./AIStatusPanel";
import { SystemHealthPanel } from "./SystemHealthPanel";
import { marketService } from "../lib/api";
import { MarketData } from "../types/oracle";
import { useSystemStatus } from "../hooks/useSystemStatus";
import { useAnalytics } from "../hooks/useAnalytics";
import {
  Bell,
  Search,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Target,
  Eye,
  Shield,
} from "lucide-react";
import { BlockchainIcon, getMarketSymbol } from "./BlockchainIcon";

export function DashboardContent() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const systemStatus = useSystemStatus();
  const { analytics } = useAnalytics();

  // Helper function to get status display
  const getStatusDisplay = (
    status: "online" | "offline" | "degraded" | boolean | undefined
  ) => {
    if (status === "online" || status === true) {
      return {
        text: "Online",
        color: "text-green-600",
        icon: CheckCircle,
      };
    } else if (status === "degraded") {
      return {
        text: "Degraded",
        color: "text-yellow-600",
        icon: AlertCircle,
      };
    } else if (status === "offline" || status === false) {
      return {
        text: "Offline",
        color: "text-red-600",
        icon: XCircle,
      };
    } else {
      return {
        text: "Unknown",
        color: "text-muted-foreground",
        icon: Clock,
      };
    }
  };

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const data = await marketService.getMarkets();
      setMarkets(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch markets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              Total Markets
            </div>
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {markets.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Active prediction markets
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              Success Rate
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {analytics?.success_rate
              ? `${(analytics.success_rate * 100).toFixed(1)}%`
              : "--"}
          </div>
          <div className="text-sm text-muted-foreground">Analysis accuracy</div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              Avg Confidence
            </div>
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {analytics?.avg_confidence
              ? `${(analytics.avg_confidence * 100).toFixed(0)}%`
              : "--"}
          </div>
          <div className="text-sm text-muted-foreground">
            AI confidence level
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground">
              System Status
            </div>
            {systemStatus?.status === "healthy" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div
            className={`text-2xl font-bold ${
              systemStatus?.status === "healthy"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {systemStatus?.status === "healthy" ? "Online" : "Offline"}
          </div>
          <div className="text-sm text-muted-foreground">
            {systemStatus?.status === "healthy"
              ? "All systems operational"
              : "System issues detected"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Market Widgets */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-card-foreground">
              Live Market Analysis
            </h2>
            <select className="px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>All Markets</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
              <option>Low Risk</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl border p-6 animate-pulse"
                >
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : markets.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-card rounded-xl border p-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No Markets Available
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start monitoring prediction markets by connecting to data
                  sources or wait for markets to become available.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Real-time Analysis
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Monitor market sentiment and credibility scores
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mb-2" />
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Risk Assessment
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        AI-powered manipulation risk detection
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchMarkets}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check for Markets
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.slice(0, 4).map((market) => (
                <div
                  key={market.market_id}
                  className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <BlockchainIcon
                        symbol={getMarketSymbol(market.market_id)}
                        size="sm"
                        className="flex-shrink-0 mt-1"
                      />
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {market.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {market.question}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        market.change_24h >= 0
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {market.change_24h >= 0 ? "+" : ""}
                      {market.change_24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Price
                      </span>
                      <span className="font-medium text-card-foreground">
                        ${market.current_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Market Cap
                      </span>
                      <span className="font-medium">
                        ${(market.market_cap / 1e9).toFixed(2)}B
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {markets.length > 0 ? (
                <>
                  {markets.slice(0, 3).map((market, index) => (
                    <div
                      key={market.market_id}
                      className="flex items-start space-x-3"
                    >
                      <BlockchainIcon
                        symbol={getMarketSymbol(market.market_id)}
                        size="sm"
                        className="flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {market.name} Analysis
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {lastUpdated
                            ? `${Math.floor(
                                (Date.now() - lastUpdated.getTime()) / 60000
                              )} minutes ago`
                            : "Recently updated"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Price: ${market.current_price.toLocaleString()} •
                          {market.change_24h >= 0
                            ? " Trending Up"
                            : " Trending Down"}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4">
                  <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <p className="text-xs text-gray-400">
                    Market data will appear here when available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced System Monitoring */}
          <div className="space-y-6">
            <AIStatusPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
