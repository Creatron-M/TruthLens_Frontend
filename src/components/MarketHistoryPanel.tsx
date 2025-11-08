"use client";

import { useState, useEffect } from "react";
import { marketService } from "../lib/api";
import type { MarketHistory } from "../types/oracle";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
// Simple chart implementation without external dependencies

interface MarketHistoryPanelProps {
  marketId: string;
  marketName?: string;
}

export function MarketHistoryPanel({
  marketId,
  marketName,
}: MarketHistoryPanelProps) {
  const [history, setHistory] = useState<MarketHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"price" | "analysis">("price");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const historyData = await marketService.getMarketHistory(marketId);
      setHistory(historyData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch market history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (marketId) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [marketId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriceChangeInfo = () => {
    if (!history?.price_history || history.price_history.length < 2) {
      return { change: 0, percentage: 0, trend: "neutral" };
    }

    const latest = history.price_history[history.price_history.length - 1];
    const previous = history.price_history[0];
    const change = latest.price - previous.price;
    const percentage = (change / previous.price) * 100;
    const trend = change >= 0 ? "up" : "down";

    return { change, percentage, trend };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            History Error
          </h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  const priceChange = getPriceChangeInfo();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {marketName || marketId} History
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">24-hour trend:</span>
            <div className="flex items-center space-x-1">
              {priceChange.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : priceChange.trend === "down" ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Activity className="w-4 h-4 text-gray-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  priceChange.trend === "up"
                    ? "text-green-600"
                    : priceChange.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {priceChange.percentage >= 0 ? "+" : ""}
                {priceChange.percentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("price")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "price"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Price History
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "analysis"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Analysis Trend
        </button>
      </div>

      {/* Data Display */}
      <div className="h-64 overflow-y-auto">
        {activeTab === "price" && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 mb-4">
              Price History (Last 24 Hours)
            </h3>
            {history.price_history.length > 0 ? (
              <div className="space-y-2">
                {history.price_history.slice(-8).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-sm text-gray-600">
                      {formatDate(item.timestamp)} at{" "}
                      {formatTimestamp(item.timestamp)}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Vol: {item.volume?.toLocaleString() || "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No price history available
              </div>
            )}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 mb-4">
              Analysis Trend (Recent Updates)
            </h3>
            {history.analysis_history.length > 0 ? (
              <div className="space-y-2">
                {history.analysis_history.slice(-6).map((item, index) => (
                  <div key={index} className="py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-600">
                        {formatDate(item.timestamp)} at{" "}
                        {formatTimestamp(item.timestamp)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          Credibility: {item.credibility}/100
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Risk: {item.risk}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No analysis history available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-500">Current Price</div>
          <div className="text-lg font-semibold text-gray-900">
            {history.price_history.length > 0 &&
              formatPrice(
                history.price_history[history.price_history.length - 1]
                  ?.price || 0
              )}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">24h Volume</div>
          <div className="text-lg font-semibold text-gray-900">
            {(history.price_history.length > 0 &&
              history.price_history[
                history.price_history.length - 1
              ]?.volume?.toLocaleString()) ||
              "N/A"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Latest Analysis</div>
          <div className="text-lg font-semibold text-gray-900">
            {history.analysis_history.length > 0 &&
              `${
                history.analysis_history[history.analysis_history.length - 1]
                  ?.credibility || 0
              }/100`}
          </div>
        </div>
      </div>
    </div>
  );
}
