import axios from "axios";
import type {
  MarketData,
  OracleReading,
  AnalysisResult,
  OracleStatusData,
  ApiResponse,
  CustomQueryRequest,
  CustomQueryResponse,
} from "../types/oracle";

const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const marketService = {
  async getMarkets(): Promise<MarketData[]> {
    try {
      const response = await api.get<MarketData[]>("/markets");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch markets:", error);
      throw new Error("Failed to fetch markets");
    }
  },

  async getOracleReading(marketId: string): Promise<OracleReading> {
    try {
      const response = await api.get<OracleReading>(`/oracle/${marketId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch oracle reading:", error);
      throw new Error("Failed to fetch oracle reading");
    }
  },

  async getAnalysis(marketId: string): Promise<AnalysisResult> {
    try {
      const response = await api.get<AnalysisResult>(`/analyze/${marketId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch analysis:", error);
      throw new Error("Failed to fetch analysis");
    }
  },

  async getMarketAnalysis(marketId: string): Promise<AnalysisResult> {
    try {
      console.log(
        `🚀 API: Calling ${api.defaults.baseURL}/analyze/${marketId}`
      );
      const response = await api.get<AnalysisResult>(`/analyze/${marketId}`);
      console.log("🎯 API: Market analysis response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API: Failed to fetch market analysis:", error);
      throw error;
    }
  },

  async triggerAnalysis(): Promise<{ message: string; status: string }> {
    try {
      const response = await api.post<{ message: string; status: string }>(
        "/trigger-analysis"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
      throw error;
    }
  },

  async analyzeCustomQuestion(question: string): Promise<CustomQueryResponse> {
    try {
      const aiApi = axios.create({
        baseURL: api.defaults.baseURL,
        timeout: 60000,
        headers: { "Content-Type": "application/json" },
      });

      const response = await aiApi.post<CustomQueryResponse>("/analyze", {
        question: question.trim(),
      });

      return response.data;
    } catch (error: any) {
      if (error?.code === "ECONNABORTED") {
        throw new Error(
          "Request timeout: The AI analysis is taking longer than expected."
        );
      }
      throw new Error(
        `Analysis failed: ${error?.response?.data?.detail || error.message}`
      );
    }
  },

  async getStatus(): Promise<OracleStatusData> {
    try {
      const response = await api.get<OracleStatusData>("/status");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch status:", error);
      throw new Error("Failed to fetch oracle status");
    }
  },

  async getSettings() {
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch settings");
    }
  },

  async updateSettings(settings: any) {
    try {
      const response = await api.post("/settings", settings);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update settings");
    }
  },

  async generateApiKey() {
    try {
      const response = await api.post("/settings/api-key");
      return response.data;
    } catch (error) {
      throw new Error("Failed to generate API key");
    }
  },

  async getAnalytics() {
    try {
      const response = await api.get("/analytics");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch analytics");
    }
  },

  async getSystemAnalytics() {
    try {
      const response = await api.get("/analytics");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch system analytics");
    }
  },

  async getAnalysisHistory() {
    try {
      const response = await api.get("/analytics/history");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getBlockchainData() {
    try {
      const response = await api.get("/analytics/blockchain");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch blockchain data");
    }
  },

  async getMetrics() {
    try {
      const response = await api.get("/metrics");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch metrics");
    }
  },

  async getMarketHistory(marketId: string) {
    try {
      const response = await api.get(`/markets/${marketId}/history`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch market history");
    }
  },

  async getHealth() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch health status");
    }
  },

  async getSystemHealth() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch system health");
    }
  },

  async getAIStatus() {
    try {
      const response = await api.get("/ai/status");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch AI status");
    }
  },

  async getAIPerformance() {
    try {
      const response = await api.get("/ai/performance");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch AI performance");
    }
  },

  async getAIConfig() {
    try {
      const response = await api.get("/ai/config");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch AI config");
    }
  },

  async getAICacheStats() {
    try {
      const response = await api.get("/ai/cache/stats");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch AI cache stats");
    }
  },

  async clearAICache() {
    try {
      const response = await api.post("/ai/cache/clear");
      return response.data;
    } catch (error) {
      throw new Error("Failed to clear AI cache");
    }
  },

  async flushAIQueue() {
    try {
      const response = await api.post("/ai/queue/flush");
      return response.data;
    } catch (error) {
      throw new Error("Failed to flush AI queue");
    }
  },
};

export const {
  getMarkets,
  getOracleReading,
  getAnalysis,
  getMarketAnalysis,
  triggerAnalysis,
  analyzeCustomQuestion,
  getStatus,
  getSettings,
  updateSettings,
  generateApiKey,
  getAnalytics,
  getSystemAnalytics,
  getAnalysisHistory,
  getBlockchainData,
  getMetrics,
  getMarketHistory,
  getHealth,
  getSystemHealth,
  getAIStatus,
  getAIPerformance,
  getAIConfig,
  getAICacheStats,
  clearAICache,
  flushAIQueue,
} = marketService;

export default api;
