"use client";

import { useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Header } from "../../../components/Header";
import { marketService } from "../../../lib/api";
import { CustomQueryResponse } from "../../../types/oracle";
import { Send, Loader2, Brain, AlertTriangle, CheckCircle } from "lucide-react";

export default function CustomQueryPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CustomQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await marketService.analyzeCustomQuestion(query.trim());
      setResult(data);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze question"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const exampleQueries = [
    "What's the current sentiment around Bitcoin?",
    "Is Ethereum a good investment right now?",
    "Are there any manipulation patterns in DeFi markets?",
    "How credible are recent Dogecoin price predictions?",
    "What risks should I consider before investing in altcoins?",
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* AI Analysis Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Brain Neural Network */}
        <div className="absolute top-10 right-10 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="animate-pulse"
            />
            <circle
              cx="70"
              cy="70"
              r="8"
              fill="currentColor"
              className="animate-pulse delay-200"
            />
            <circle
              cx="130"
              cy="70"
              r="8"
              fill="currentColor"
              className="animate-pulse delay-400"
            />
            <circle
              cx="70"
              cy="130"
              r="8"
              fill="currentColor"
              className="animate-pulse delay-600"
            />
            <circle
              cx="130"
              cy="130"
              r="8"
              fill="currentColor"
              className="animate-pulse delay-800"
            />
            <circle
              cx="100"
              cy="100"
              r="12"
              fill="currentColor"
              className="animate-pulse delay-1000"
            />
            <path
              d="M70,70 L100,100 M130,70 L100,100 M70,130 L100,100 M130,130 L100,100"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
              className="neural-line"
            />
          </svg>
        </div>

        {/* Question Mark Pattern */}
        <div className="absolute bottom-20 left-20 opacity-15">
          <div className="text-8xl text-blue-300 animate-pulse">?</div>
        </div>

        {/* AI Processing Dots */}
        <div className="absolute top-1/3 left-10 opacity-20">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce delay-400"></div>
          </div>
        </div>

        {/* Data Stream Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <path
            d="M0,150 Q400,100 800,150 Q1200,200 1600,150"
            stroke="url(#aiStream)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,250 Q300,200 600,250 Q900,300 1200,250"
            stroke="url(#aiStream)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse delay-500"
          />
          <defs>
            <linearGradient id="aiStream" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Header />
      <div className="flex">
        <Sidebar />
        <main className="relative z-10 flex-1 ml-64 pt-4">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-glow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold ai-gradient-text">
                    AI Market Analyst
                  </h1>
                  <p className="text-gray-600">
                    Ask any market-related question and get AI-powered
                    credibility analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Query Form */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
              {/* Quick Examples */}
              {!result && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Try these example questions:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exampleQueries.slice(0, 4).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example)}
                        className="text-left text-sm bg-white/80 hover:bg-white border border-gray-200 hover:border-blue-300 rounded-lg p-2 transition-all duration-200"
                        disabled={loading}
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="query"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3"
                  >
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Ask the AI Market Analyst</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask any market-related question..."
                      className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg placeholder-gray-400"
                      rows={4}
                      disabled={loading}
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                      {query.length}/500
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Credibility scoring</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span>Risk assessment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span>AI insights</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !query.trim() || query.length > 500}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Analyze Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    Analysis Failed
                  </span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="space-y-6">
                {/* Question Echo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Your Question:
                  </h3>
                  <p className="text-blue-800">{query}</p>
                </div>

                {/* Analysis Results */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      AI Analysis
                    </h3>
                  </div>

                  <div className="prose max-w-none text-gray-700 mb-6">
                    {result.answer}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credibility Score */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Credibility Score
                        </span>
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round(result.confidence * 100)}%
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCredibilityColor(
                            result.confidence * 100
                          )}`}
                        >
                          {result.confidence >= 0.7
                            ? "High"
                            : result.confidence >= 0.4
                            ? "Medium"
                            : "Low"}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          style={{
                            width: `${Math.round(result.confidence * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Risk Level
                        </span>
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-gray-900 capitalize">
                          {result.metadata?.risk_index
                            ? result.metadata.risk_index <= 30
                              ? "Low"
                              : result.metadata.risk_index <= 70
                              ? "Medium"
                              : "High"
                            : "Unknown"}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.metadata?.risk_index
                              ? result.metadata.risk_index <= 30
                                ? "text-green-600 bg-green-100"
                                : result.metadata.risk_index <= 70
                                ? "text-yellow-600 bg-yellow-100"
                                : "text-red-600 bg-red-100"
                              : "text-gray-600 bg-gray-100"
                          }`}
                        >
                          {result.metadata?.risk_index
                            ? result.metadata.risk_index <= 30
                              ? "Low"
                              : result.metadata.risk_index <= 70
                              ? "Medium"
                              : "High"
                            : "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Data Sources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.sources.map((source, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Analysis completed at{" "}
                      {result.metadata?.timestamp
                        ? new Date(result.metadata.timestamp).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
