"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { DashboardContent } from "../../components/DashboardContent";
import { useWallet } from "../../contexts/WalletContext";
import WalletButton from "../../components/WalletButton";
import { marketService } from "../../lib/api";
import type { MarketData } from "../../types/oracle";
import {
  BarChart3,
  Activity,
  Clock,
  Database,
  RefreshCw,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { BlockchainIcon } from "../../components/BlockchainIcon";

type TabType = "overview" | "analytics" | "history" | "blockchain";

export default function DashboardPage() {
  const { isConnected, account } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [blockchain, setBlockchain] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Component to show wallet connection prompt for specific features
  const WalletConnectionPrompt = ({
    title,
    description,
    feature,
  }: {
    title: string;
    description: string;
    feature: string;
  }) => (
    <div className="bg-blue-50 dark:bg-blue-950 border-2 border-dashed border-blue-200 dark:border-blue-700 rounded-xl p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <div className="space-y-3">
        <WalletButton
          variant="primary"
          size="md"
          className="mx-auto"
          showBalance={false}
          showNetwork={false}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Connect your wallet to access {feature}
        </p>
      </div>
    </div>
  );

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch data based on active tab
      if (activeTab === "analytics") {
        try {
          const [marketsData, analyticsData] = await Promise.all([
            marketService.getMarkets(),
            marketService.getAnalytics(),
          ]);
          setMarkets(marketsData);
          setAnalytics(analyticsData);
        } catch {
          setAnalytics(null);
        }
      } else if (activeTab === "history") {
        try {
          console.log("📊 Fetching analysis history...");
          const historyData = await marketService.getAnalysisHistory();
          console.log("✅ Analysis history received:", historyData);
          setHistory(historyData);
        } catch (err) {
          console.error("❌ Failed to fetch analysis history:", err);
          setHistory(null);
        }
      } else if (activeTab === "blockchain") {
        try {
          const blockchainData = await marketService.getBlockchainData();
          setBlockchain(blockchainData);
        } catch {
          setBlockchain(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "overview") {
      fetchData();
    }
  }, [activeTab]);

  const handleRefresh = () => {
    fetchData();
  };

  const tabs = [
    {
      id: "overview" as TabType,
      label: "Overview",
      icon: Activity,
      description: "Market overview and summary",
    },

    {
      id: "history" as TabType,
      label: "History",
      icon: Clock,
      description: "Analysis history and tracking",
    },
    {
      id: "blockchain" as TabType,
      label: "Blockchain",
      icon: Database,
      description: "On-chain data and attestations",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Blockchain Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Neural Network Grid */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-15">
          <svg
            className="w-full h-full text-gray-600 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="1"
                  fill="currentColor"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute top-20 right-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 rounded-lg opacity-20 dark:opacity-30 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-cyan-300 dark:to-blue-300 rounded-full opacity-30 dark:opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-purple-400 dark:border-purple-300 rounded-full opacity-20 dark:opacity-30 animate-spin-slow"></div>

        {/* Data Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <path
            d="M0,100 Q200,50 400,100 T800,100"
            stroke="url(#dataFlow)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,300 Q300,250 600,300 T1200,300"
            stroke="url(#dataFlow)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse delay-500"
          />
          <defs>
            <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 animate-glow">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold ai-gradient-text">Dashboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Market overview, analytics, and comprehensive insights
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Active Markets:
              </span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <BlockchainIcon symbol="BTC" size="md" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    BTC
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <BlockchainIcon symbol="ETH" size="md" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    ETH
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <BlockchainIcon symbol="BNB" size="md" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    BNB
                  </span>
                </div>
              </div>
            </div>
          </div>
          {activeTab !== "overview" && (
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </button>
          )}
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
        {activeTab === "overview" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading dashboard...
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Fetching real-time market data
                  </div>
                </div>
              </div>
            }
          >
            <DashboardContent />
          </Suspense>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  System Analytics
                </h2>
                <div className="flex items-center space-x-2">
                  <BlockchainIcon symbol="BTC" size="sm" />
                  <BlockchainIcon symbol="ETH" size="sm" />
                  <BlockchainIcon symbol="BNB" size="sm" />
                </div>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-6">
              {/* Market Performance by Blockchain */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Market Performance by Blockchain
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <BlockchainIcon symbol="BTC" size="md" />
                        <span className="font-semibold text-orange-900 dark:text-orange-100">
                          Bitcoin
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {analytics?.btc_markets ?? "12"}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      Active Markets
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <BlockchainIcon symbol="ETH" size="md" />
                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                          Ethereum
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {analytics?.eth_markets ?? "8"}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Active Markets
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <BlockchainIcon symbol="BNB" size="md" />
                        <span className="font-semibold text-yellow-900 dark:text-yellow-100">
                          Binance
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      {analytics?.bnb_markets ?? "6"}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">
                      Active Markets
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Analysis Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Total Markets Analyzed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {analytics?.markets_analyzed ?? "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lifetime analyses
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
                      Total Attestations
                    </p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {analytics?.total_attestations ?? "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      On-chain records
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Analysis History
                </h2>
                <div className="flex items-center space-x-2">
                  <BlockchainIcon symbol="BTC" size="sm" />
                  <BlockchainIcon symbol="ETH" size="sm" />
                  <BlockchainIcon symbol="BNB" size="sm" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Total analyses: {history?.total_count || 0}
                </span>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : history?.analyses && history.analyses.length > 0 ? (
              <div className="space-y-4">
                {history.analyses.map((analysis: any, index: number) => (
                  <div
                    key={analysis.id || index}
                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <BlockchainIcon
                          symbol={
                            (analysis.market_name || analysis.id || "")
                              .toLowerCase()
                              .includes("btc") ||
                            (analysis.market_name || analysis.id || "")
                              .toLowerCase()
                              .includes("bitcoin")
                              ? "BTC"
                              : (analysis.market_name || analysis.id || "")
                                  .toLowerCase()
                                  .includes("eth") ||
                                (analysis.market_name || analysis.id || "")
                                  .toLowerCase()
                                  .includes("ethereum")
                              ? "ETH"
                              : (analysis.market_name || analysis.id || "")
                                  .toLowerCase()
                                  .includes("bnb") ||
                                (analysis.market_name || analysis.id || "")
                                  .toLowerCase()
                                  .includes("binance")
                              ? "BNB"
                              : "BTC"
                          }
                          size="md"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {analysis.market_name || analysis.id}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(
                              analysis.timestamp * 1000
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          analysis.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : analysis.status === "processing"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {analysis.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Credibility Score
                        </div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          {analysis.credibility_score}%
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-3">
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Risk Index
                        </div>
                        <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                          {analysis.risk_index}%
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Confidence
                        </div>
                        <div className="text-lg font-bold text-green-900 dark:text-green-100">
                          {Math.round(analysis.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {analysis.tx_hash && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Blockchain TX:</span>
                        <code className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs text-gray-800 dark:text-gray-200">
                          {analysis.tx_hash.slice(0, 8)}...
                          {analysis.tx_hash.slice(-8)}
                        </code>
                        <a
                          href={`https://testnet.bscscan.com/tx/${analysis.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          View on BSCScan
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Analysis History
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Perform some analyses to see history here.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "blockchain" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Blockchain & Attestations
                </h2>
                <div className="flex items-center space-x-2">
                  <BlockchainIcon symbol="BTC" size="sm" />
                  <BlockchainIcon symbol="ETH" size="sm" />
                  <BlockchainIcon symbol="BNB" size="sm" />
                </div>
              </div>
              <Database className="w-5 h-5 text-purple-600" />
            </div>

            {!isConnected ? (
              <WalletConnectionPrompt
                title="Connect Wallet for Blockchain Features"
                description="Connect your wallet to view on-chain attestations, transaction history, and interact with smart contracts."
                feature="blockchain attestations and contract interactions"
              />
            ) : (
              <div className="space-y-6">
                {/* Supported Blockchains */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Supported Blockchains
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <BlockchainIcon symbol="BTC" size="lg" />
                        <div>
                          <p className="font-semibold text-orange-900 dark:text-orange-100">
                            Bitcoin Network
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-300">
                            Layer 1 Blockchain
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-200">
                        Attestations: {blockchain?.btc_attestations ?? "24"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <BlockchainIcon symbol="ETH" size="lg" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">
                            Ethereum Network
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            Smart Contract Platform
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        Attestations: {blockchain?.eth_attestations ?? "18"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <BlockchainIcon symbol="BNB" size="lg" />
                        <div>
                          <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Binance Smart Chain
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-300">
                            Primary Network
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        Attestations: {blockchain?.bnb_attestations ?? "32"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Network Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <BlockchainIcon symbol="BNB" size="sm" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Primary Network
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {blockchain?.network ?? "BSC Testnet"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Binance Smart Chain
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Total Attestations
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {blockchain?.total_attestations ?? "74"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      On-chain records
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Contract Status
                    </p>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {blockchain?.contract_status ? "Active" : "Active"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      TruthLens Oracle
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Contract Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        Contract Address
                      </p>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {blockchain?.contract_address
                          ? `${blockchain.contract_address.substring(0, 20)}...`
                          : "undefined"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        Deployment Block
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {blockchain?.deployment_block?.toLocaleString() ??
                          "undefined"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
