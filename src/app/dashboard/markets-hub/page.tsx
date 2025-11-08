"use client";

import { useState, useEffect } from "react";
import { DataUnavailable } from "../../../components/DataUnavailable";
import { marketService } from "@/lib/api";
import type { MarketData, CustomQueryResponse } from "@/types/oracle";

interface AnalysisResultDisplay {
  question: string;
  answer?: string;
  credibility_score?: number;
  risk_index?: number;
  confidence?: number;
  sources?: string[];
  tx_hash?: string;
  timestamp: string;
  error?: boolean;
  errorMessage?: string;
}
import {
  TrendingUp,
  MessageCircle,
  Shield,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  Activity,
  AlertTriangle,
  Zap,
  Target,
  Eye,
  Brain,
} from "lucide-react";
import { BlockchainIcon, getMarketSymbol } from "@/components/BlockchainIcon";

type TabType = "analysis" | "risk";

export default function MarketsHub() {
  const [activeTab, setActiveTab] = useState<TabType>("analysis");
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customQuery, setCustomQuery] = useState("");
  const [analyzingMarket, setAnalyzingMarket] = useState<string | null>(null);
  const [analyzingCustomQuery, setAnalyzingCustomQuery] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResultDisplay | null>(null);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketService.getMarkets();
      setMarkets(data);
    } catch (err) {
      console.error("Failed to fetch markets:", err);
      setError("Failed to fetch markets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleRefresh = () => {
    fetchMarkets();
  };

  const handleCustomAnalysis = async () => {
    if (!customQuery.trim()) {
      console.log("❌ Empty query, not proceeding");
      return;
    }

    try {
      console.log(`🤖 Starting custom analysis for: "${customQuery}"`);
      console.log(
        `📡 API Base URL: ${
          typeof window !== "undefined" ? "http://localhost:8000" : "SSR mode"
        }`
      );

      // Clear previous results and start analyzing
      setAnalysisResult(null);
      setAnalyzingCustomQuery(true);
      const result = await marketService.analyzeCustomQuestion(customQuery);

      console.log("✅ Custom analysis result:", result);

      // Store the result to display in the response card
      setAnalysisResult({
        question: customQuery,
        answer: result.answer,
        credibility_score: result.metadata?.credibility_score,
        risk_index: result.metadata?.risk_index,
        confidence: result.confidence,
        sources: result.sources,
        tx_hash: result.metadata?.tx_hash,
        timestamp: new Date().toISOString(),
      });

      // Scroll to result after a short delay
      setTimeout(() => {
        const resultElement = document.getElementById("analysis-result");
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("❌ Custom analysis failed:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        config: err?.config,
      });

      const errorMsg =
        err?.response?.data?.detail || err?.message || "Unknown error";

      // Store error result to display in the response card
      setAnalysisResult({
        question: customQuery,
        error: true,
        errorMessage: errorMsg,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setAnalyzingCustomQuery(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setCustomQuery("");
  };

  const triggerAnalysis = async (marketId: string) => {
    try {
      setAnalyzingMarket(marketId);
      console.log(`🔄 Triggering analysis for market: ${marketId}`);

      // First try to get existing analysis
      try {
        const analysis = await marketService.getMarketAnalysis(marketId);
        console.log("✅ Retrieved existing analysis:", analysis);

        // Show analysis results in a more detailed format for risk tab
        const resultText = `
Risk Analysis Results for ${marketId}:

🎯 Credibility Score: ${analysis.credibility_score}%
⚠️ Risk Index: ${analysis.risk_index}%
🔮 Confidence: ${Math.round(analysis.confidence * 100)}%
📊 Links Analyzed: ${analysis.links_analyzed}

🔗 Transaction: ${analysis.tx_hash?.slice(0, 16) || "Pending"}...
📁 IPFS: ${analysis.ipfs_hash?.slice(0, 16) || "N/A"}...
        `.trim();

        alert(resultText);
        setAnalyzingMarket(null);
        return;
      } catch (analysisError) {
        console.log("No existing analysis found, triggering new analysis...");
      }

      // If no existing analysis, trigger new one
      const result = await marketService.triggerAnalysis();
      console.log("✅ Analysis triggered successfully:", result);

      // Show success feedback
      alert(
        `✅ Risk analysis started for ${marketId}!\n\nAnalysis includes:\n• Manipulation detection\n• Credibility assessment\n• Market sentiment evaluation\n• Price volatility analysis\n\nResults will be available shortly.`
      );

      // Refresh markets after analysis
      setTimeout(() => {
        fetchMarkets();
        setAnalyzingMarket(null);
      }, 3000);
    } catch (err: any) {
      console.error("❌ Failed to trigger analysis:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        config: err?.config,
      });
      setAnalyzingMarket(null);

      const errorMsg =
        err?.response?.data?.detail || err?.message || "Unknown error";
      alert(
        `❌ Failed to perform risk analysis: ${errorMsg}\n\nPlease check:\n1. Backend server is running on port 8000\n2. Network connection\n3. Browser console for details`
      );
    }
  };

  const filteredMarkets = markets.filter((market) =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    {
      id: "analysis" as TabType,
      label: "Custom Analysis",
      icon: MessageCircle,
      description: "AI-powered custom market queries",
    },
    {
      id: "risk" as TabType,
      label: "Risk Assessment",
      icon: Shield,
      description: "Market manipulation detection",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* AI Market Analysis Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Market Data Streams */}
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <div className="absolute top-10 left-10 w-6 h-6 bg-green-400 dark:bg-green-300 rounded animate-pulse"></div>
          <div className="absolute top-20 left-32 w-4 h-4 bg-red-400 dark:bg-red-300 rounded animate-pulse delay-300"></div>
          <div className="absolute top-32 left-20 w-5 h-5 bg-blue-400 dark:bg-blue-300 rounded animate-pulse delay-600"></div>

          {/* Trading Chart Pattern */}
          <svg
            className="absolute top-0 right-0 w-96 h-64 opacity-20 dark:opacity-30"
            viewBox="0 0 400 200"
          >
            <path
              d="M0,100 L50,80 L100,120 L150,60 L200,90 L250,50 L300,70 L350,40 L400,80"
              stroke="url(#chartGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* AI Analysis Nodes */}
        <div className="absolute bottom-20 right-20 w-32 h-32 opacity-10 dark:opacity-20">
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-4 h-4 bg-purple-400 dark:bg-purple-300 rounded-full animate-pulse"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse delay-200"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-pulse delay-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-pulse delay-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-violet-400 dark:bg-violet-300 rounded-full animate-pulse delay-800"></div>
          </div>
        </div>

        {/* Blockchain Hexagon Pattern */}
        <div className="absolute top-1/4 left-10 opacity-8 dark:opacity-15">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="text-gray-600 dark:text-gray-300"
          >
            <polygon
              points="50,5 90,25 90,75 50,95 10,75 10,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="animate-spin-slow"
            />
            <polygon
              points="50,15 80,30 80,70 50,85 20,70 20,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="animate-spin-slow"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 animate-glow">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold ai-gradient-text">
                Markets Hub
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive market analysis, custom queries, and risk assessment
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "analysis" && (
          <>
            {/* Custom Analysis Tab */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  AI-Powered Custom Analysis
                </h2>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ask a question about any market or prediction
                </label>
                <div className="flex space-x-4">
                  <textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="e.g., What's the sentiment around Bitcoin reaching $100k? Is there manipulation in DeFi markets?"
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex space-x-3 mt-3">
                  <button
                    onClick={() => {
                      console.log("🔘 Analyze Question button clicked");
                      console.log("📝 Current query:", customQuery);
                      console.log("⏳ Markets loading:", loading);
                      console.log(
                        "🤖 Custom analysis loading:",
                        analyzingCustomQuery
                      );
                      handleCustomAnalysis();
                    }}
                    disabled={!customQuery.trim() || analyzingCustomQuery}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {analyzingCustomQuery ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Analyze Question</span>
                      </>
                    )}
                  </button>

                  {(customQuery || analysisResult) && (
                    <button
                      onClick={clearAnalysis}
                      disabled={analyzingCustomQuery}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* AI Response Card */}
              {analysisResult && (
                <div
                  id="analysis-result"
                  className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        AI Analysis Result
                      </h3>
                    </div>
                    <button
                      onClick={() => setAnalysisResult(null)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {analysisResult.error ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-300 mb-1">
                            Analysis Failed
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            {analysisResult.errorMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(analysisResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Question */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Question:
                        </p>
                        <p className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 italic">
                          "{analysisResult.question}"
                        </p>
                      </div>

                      {/* Answer */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          AI Analysis:
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                          <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                            {analysisResult.answer}
                          </p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {analysisResult.credibility_score || "N/A"}
                            {analysisResult.credibility_score && "%"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Credibility Score
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {analysisResult.risk_index || "N/A"}
                            {analysisResult.risk_index && "%"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Risk Index
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {analysisResult.confidence
                              ? Math.round(analysisResult.confidence * 100)
                              : "N/A"}
                            {analysisResult.confidence && "%"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Confidence
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {analysisResult.sources &&
                          analysisResult.sources.length > 0 && (
                            <div>
                              <span className="font-medium">Sources:</span>{" "}
                              {analysisResult.sources.join(", ")}
                            </div>
                          )}
                        {analysisResult.tx_hash && (
                          <div>
                            <span className="font-medium">Blockchain TX:</span>{" "}
                            {analysisResult.tx_hash.slice(0, 16)}...
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Analyzed:</span>{" "}
                          {new Date(analysisResult.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Example Queries:
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • "What's the credibility of predictions about Bitcoin
                    reaching $100k?"
                  </li>
                  <li>
                    • "Are there signs of manipulation in Ethereum price
                    predictions?"
                  </li>
                  <li>
                    • "How reliable are current DeFi market sentiment
                    indicators?"
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === "risk" && (
          <>
            {/* Risk Assessment Tab */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Market Risk Assessment
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    AI-powered risk analysis and manipulation detection
                  </p>
                </div>
                <Shield className="w-6 h-6 text-red-500" />
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-600 h-32 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Failed to load risk data
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Risk Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                            High Risk Markets
                          </p>
                          <p className="text-2xl font-bold text-red-800 dark:text-red-100">
                            {
                              filteredMarkets.filter((m) => {
                                // Estimate risk based on price volatility
                                return Math.abs(m.change_24h) > 15;
                              }).length
                            }
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                            Medium Risk
                          </p>
                          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">
                            {
                              filteredMarkets.filter((m) => {
                                const change = Math.abs(m.change_24h);
                                return change > 5 && change <= 15;
                              }).length
                            }
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-yellow-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            Low Risk
                          </p>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                            {
                              filteredMarkets.filter((m) => {
                                return Math.abs(m.change_24h) <= 5;
                              }).length
                            }
                          </p>
                        </div>
                        <Shield className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            Total Markets
                          </p>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                            {filteredMarkets.length}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Market Risk Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Individual Market Risk Analysis
                      </h3>
                      <button
                        onClick={handleRefresh}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Refresh</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMarkets.map((market) => {
                        // Calculate risk level based on available data
                        const change = Math.abs(market.change_24h);
                        let riskLevel = "Low";
                        let riskColor = "green";
                        let riskScore = Math.round(25 + change * 2); // Base risk calculation

                        if (change > 15) {
                          riskLevel = "High";
                          riskColor = "red";
                        } else if (change > 5) {
                          riskLevel = "Medium";
                          riskColor = "yellow";
                        }

                        return (
                          <div
                            key={market.market_id}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3 flex-1">
                                <BlockchainIcon
                                  symbol={getMarketSymbol(market.market_id)}
                                  size="sm"
                                  className="flex-shrink-0 mt-0.5"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    {market.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {market.question}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  riskColor === "red"
                                    ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                    : riskColor === "yellow"
                                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                                    : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                }`}
                              >
                                {riskLevel}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {/* Risk Score */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  Risk Score
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {riskScore}%
                                </span>
                              </div>

                              {/* Price Change */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  24h Change
                                </span>
                                <span
                                  className={`font-medium ${
                                    market.change_24h >= 0
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {market.change_24h > 0 ? "+" : ""}
                                  {market.change_24h.toFixed(2)}%
                                </span>
                              </div>

                              {/* Current Price */}
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  Price
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  ${market.current_price.toFixed(4)}
                                </span>
                              </div>

                              {/* Analysis Button */}
                              <button
                                onClick={() =>
                                  triggerAnalysis(market.market_id)
                                }
                                disabled={analyzingMarket === market.market_id}
                                className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                              >
                                {analyzingMarket === market.market_id ? (
                                  <div className="flex items-center justify-center space-x-2">
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Analyzing...</span>
                                  </div>
                                ) : (
                                  "Deep Analysis"
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Risk Analysis Info */}
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Risk Analysis Features
                    </h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>
                        • <strong>Real-time Risk Scoring:</strong> Based on
                        price volatility, volume patterns, and market sentiment
                      </li>
                      <li>
                        • <strong>Manipulation Detection:</strong> AI-powered
                        analysis of suspicious trading patterns
                      </li>
                      <li>
                        • <strong>Credibility Assessment:</strong> Source
                        verification and content analysis
                      </li>
                      <li>
                        • <strong>Deep Analysis:</strong> Click "Deep Analysis"
                        for comprehensive AI evaluation
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
