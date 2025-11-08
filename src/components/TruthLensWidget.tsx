"use client";

import { useState, useEffect } from "react";
import { marketService } from "../lib/api";
import type {
  MarketData,
  AnalysisResult,
  OracleReading,
} from "../types/oracle";

interface Props {
  data: any;
}

export function TruthLensWidget({ data }: Props) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [oracleReading, setOracleReading] = useState<OracleReading | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both analysis and oracle reading
        const [analysisData, oracleData] = await Promise.allSettled([
          marketService.getAnalysis(data.market_id || data.marketId),
          marketService.getOracleReading(data.market_id || data.marketId),
        ]);

        if (analysisData.status === "fulfilled") {
          setAnalysis(analysisData.value);
        }

        if (oracleData.status === "fulfilled") {
          setOracleReading(oracleData.value);
        }

        if (
          analysisData.status === "rejected" &&
          oracleData.status === "rejected"
        ) {
          setError("Failed to load oracle data");
        }
      } catch (err) {
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data.market_id || data.marketId]);

  const getBadgeClass = (score: number, type: "credibility" | "risk") => {
    if (type === "credibility") {
      if (score >= 70) return "bg-green-100 text-green-800";
      if (score >= 40) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    } else {
      if (score >= 70) return "bg-red-100 text-red-800";
      if (score >= 40) return "bg-yellow-100 text-yellow-800";
      return "bg-green-100 text-green-800";
    }
  };

  const getBadgeLabel = (score: number, type: "credibility" | "risk") => {
    if (type === "credibility") {
      if (score >= 70) return "High";
      if (score >= 40) return "Medium";
      return "Low";
    } else {
      if (score >= 70) return "High Risk";
      if (score >= 40) return "Medium Risk";
      return "Low Risk";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-8 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
        <h3 className="font-semibold text-card-foreground mb-2">
          {data.market_id || data.name}
        </h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const credScore =
    analysis?.credibility_score ?? oracleReading?.cred_score ?? 0;
  const riskScore = analysis?.risk_index ?? oracleReading?.risk_index ?? 0;
  const lastUpdate = oracleReading?.timestamp
    ? new Date(oracleReading.timestamp * 1000).toLocaleString()
    : "Unknown";

  return (
    <div className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">
            {(data.market_id || data.name || "")
              .replace("_", " ")
              .toUpperCase()}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full oracle-pulse"></div>
            <span className="text-xs font-medium">Live</span>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-2">
          {data.question || `Analysis for ${data.name}`}
        </p>
      </div>

      {/* Market Data */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-card-foreground">
              {formatPrice(data.current_price)}
            </p>
            <p
              className={`text-sm font-medium ${
                (data.change_24h || 0) >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatChange(data.change_24h || 0)} (24h)
            </p>
          </div>
        </div>

        {/* Oracle Scores */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium">
              Credibility Score
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClass(
                credScore,
                "credibility"
              )}`}
            >
              {credScore}/100 ({getBadgeLabel(credScore, "credibility")})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Risk Index</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClass(
                riskScore,
                "risk"
              )}`}
            >
              {riskScore}/100 ({getBadgeLabel(riskScore, "risk")})
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Sources: {analysis?.links_analyzed || "N/A"}</span>
            <span>Updated: {lastUpdate}</span>
          </div>
          {analysis?.confidence && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Confidence</span>
                <span>{Math.round(analysis.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${analysis.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Link */}
        {analysis?.tx_hash && (
          <div className="mt-4">
            <a
              href={`https://testnet.bscscan.com/tx/${analysis.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View on BSCScan →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
