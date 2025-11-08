"use client";

import { useState, useEffect } from "react";
import { marketService } from "../lib/api";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

interface AnalyticsData {
  total_analyses: number;
  success_rate: number;
  avg_confidence: number;
  avg_response_time: number;
  cache_hit_rate: number;
  total_markets: number;
  active_analyses: number;
  blockchain_attestations: number;
  processing_speed: number;
  error_rate: number;
}

interface HistoryData {
  analyses: Array<{
    id: string;
    market_name: string;
    credibility_score: number;
    risk_index: number;
    confidence: number;
    timestamp: number;
    status: string;
    tx_hash?: string;
  }>;
  total_count: number;
}

interface BlockchainData {
  transactions: Array<{
    hash: string;
    market_id: string;
    credibility: number;
    risk: number;
    timestamp: number;
    status: string;
    gas_used: number;
  }>;
  total_transactions: number;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [blockchain, setBlockchain] = useState<BlockchainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, historyData, blockchainData] = await Promise.all([
        marketService.getAnalytics(),
        marketService.getAnalysisHistory(),
        marketService.getBlockchainData(),
      ]);

      setAnalytics(analyticsData);
      setHistory(historyData);
      setBlockchain(blockchainData);
      setError(null);
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
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-4 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, j) => (
                      <div key={j} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Analytics Error
          </h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Performance Analytics
            </h2>
            <button
              onClick={fetchAnalytics}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {analytics.total_analyses > 100
                    ? "100+"
                    : analytics.total_analyses}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {(analytics.success_rate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">Success Rate</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  AVG
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {(analytics.avg_confidence * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-green-700">Avg Confidence</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  MS
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {(analytics.avg_response_time * 1000).toFixed(0)}
              </div>
              <div className="text-sm text-purple-700">Response Time</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Database className="w-6 h-6 text-orange-600" />
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  CACHE
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {(analytics.cache_hit_rate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-orange-700">Hit Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Analysis History */}
      {history && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Analysis History ({history.total_count} total)
          </h3>

          {history.analyses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Market</th>
                    <th className="text-left py-2">Credibility</th>
                    <th className="text-left py-2">Risk</th>
                    <th className="text-left py-2">Confidence</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.analyses.slice(0, 10).map((analysis) => (
                    <tr
                      key={analysis.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 font-medium text-gray-900">
                        {analysis.market_name}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            analysis.credibility_score >= 70
                              ? "bg-green-100 text-green-700"
                              : analysis.credibility_score >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {analysis.credibility_score}/100
                        </span>
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            analysis.risk_index <= 30
                              ? "bg-green-100 text-green-700"
                              : analysis.risk_index <= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {analysis.risk_index}/100
                        </span>
                      </td>
                      <td className="py-2">
                        {(analysis.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-2">
                        <span
                          className={`flex items-center space-x-1 ${
                            analysis.status === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {analysis.status === "completed" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="capitalize">{analysis.status}</span>
                        </span>
                      </td>
                      <td className="py-2 text-gray-500">
                        {new Date(
                          analysis.timestamp * 1000
                        ).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No analysis history available
            </div>
          )}
        </div>
      )}

      {/* Blockchain Transactions */}
      {blockchain && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Blockchain Attestations ({blockchain.total_transactions} total)
          </h3>

          {blockchain.transactions.length > 0 ? (
            <div className="space-y-3">
              {blockchain.transactions.slice(0, 5).map((tx) => (
                <div key={tx.hash} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {tx.market_id}
                      </div>
                      <div className="text-xs text-gray-500 font-mono truncate">
                        {tx.hash}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Credibility:</span>
                      <div className="font-medium">{tx.credibility}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk:</span>
                      <div className="font-medium">{tx.risk}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gas:</span>
                      <div className="font-medium">
                        {tx.gas_used.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <div className="font-medium">
                        {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No blockchain transactions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
