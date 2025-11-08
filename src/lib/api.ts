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

const API_BASE_URL =
  typeof window !== "undefined"
    ? "http://localhost:8000" // Direct connection for testing
    : process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"; // Direct URL for SSR

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased to 15 seconds (cached responses are faster)
  headers: {
    "Content-Type": "application/json",
  },
});

// API response interceptor
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

  async triggerAnalysis(): Promise<{ message: string; status: string }> {
    try {
      console.log(`🚀 API: Calling ${api.defaults.baseURL}/trigger-analysis`);
      const response = await api.post<{ message: string; status: string }>(
        "/trigger-analysis"
      );
      console.log("🎯 API: triggerAnalysis response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API: Failed to trigger analysis:", error);
      console.error("❌ API Error details:", {
        baseURL: api.defaults.baseURL,
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
      throw error; // Re-throw the original error for better debugging
    }
  },

  async analyzeCustomQuestion(question: string): Promise<CustomQueryResponse> {
    try {
      console.log(`🚀 API: Calling ${api.defaults.baseURL}/analyze`);
      console.log(`📝 API: Question payload:`, { question: question.trim() });

      // Create a custom axios instance with longer timeout for AI analysis
      const aiApi = axios.create({
        baseURL: api.defaults.baseURL,
        timeout: 60000, // 60 seconds for AI analysis
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await aiApi.post<CustomQueryResponse>("/analyze", {
        question: question.trim(),
      });

      console.log(`🎯 API: Custom analysis response:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API: Custom analysis error:", error);
      console.error("❌ API Error Details:", {
        baseURL: api.defaults.baseURL,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        timeout:
          error?.code === "ECONNABORTED" ? "Request timed out" : "No timeout",
      });

      if (error?.code === "ECONNABORTED") {
        throw new Error(
          `Request timeout: The AI analysis is taking longer than expected. Please try a simpler question or check if the backend is running properly.`
        );
      }

      if (error?.response?.status) {
        throw new Error(
          `API Error ${error.response.status}: ${
            error?.response?.data?.detail || error.message
          }`
        );
      }

      throw new Error(
        `Network Error: ${
          error?.message || "Failed to analyze custom question"
        }`
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

  // Settings Management
  async getSettings() {
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      throw new Error("Failed to fetch settings");
    }
  },

  async updateSettings(settings: any) {
    try {
      const response = await api.post("/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw new Error("Failed to update settings");
    }
  },

  async generateApiKey() {
    try {
      const response = await api.post("/settings/api-key");
      return response.data;
    } catch (error) {
      console.error("Failed to generate API key:", error);
      throw new Error("Failed to generate API key");
    }
  },

  // Analytics & Insights
  async getAnalytics() {
    try {
      const response = await api.get("/analytics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      throw new Error("Failed to fetch analytics");
    }
  },

  async getAnalysisHistory() {
    try {
      console.log(`📡 API: Calling ${api.defaults.baseURL}/analytics/history`);
      const response = await api.get("/analytics/history");
      console.log("📊 API: Analysis history response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ API: Failed to fetch analysis history:", error);
      console.error("❌ API Error details:", {
        baseURL: api.defaults.baseURL,
        url: error?.config?.url,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      throw error;
    }
  },

  async getBlockchainData() {
    try {
      const response = await api.get("/analytics/blockchain");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch blockchain data:", error);
      throw new Error("Failed to fetch blockchain data");
    }
  },

  async getMetrics() {
    try {
      const response = await api.get("/metrics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      throw new Error("Failed to fetch metrics");
    }
  },

  async getMarketHistory(marketId: string) {
    try {
      const response = await api.get(`/markets/${marketId}/history`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch market history:", error);
      throw new Error("Failed to fetch market history");
    }
  },

  // Health & System Monitoring
  async getHealth() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch health status:", error);
      throw new Error("Failed to fetch health status");
    }
  },

  // Enhanced AI APIs
  async getAIStatus() {
    try {
      const response = await api.get("/ai/status");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch AI status:", error);
      throw new Error("Failed to fetch AI status");
    }
  },

  async getAIPerformance() {
    try {
      const response = await api.get("/ai/performance");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch AI performance:", error);
      throw new Error("Failed to fetch AI performance");
    }
  },

  async getAIConfig() {
    try {
      const response = await api.get("/ai/config");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch AI config:", error);
      throw new Error("Failed to fetch AI config");
    }
  },

  async getAICacheStats() {
    try {
      const response = await api.get("/ai/cache/stats");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch AI cache stats:", error);
      throw new Error("Failed to fetch AI cache stats");
    }
  },

  async clearAICache() {
    try {
      const response = await api.post("/ai/cache/clear");
      return response.data;
    } catch (error) {
      console.error("Failed to clear AI cache:", error);
      throw new Error("Failed to clear AI cache");
    }
  },

  async flushAIQueue() {
    try {
      const response = await api.post("/ai/queue/flush");
      return response.data;
    } catch (error) {
      console.error("Failed to flush AI queue:", error);
      throw new Error("Failed to flush AI queue");
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
      console.error("❌ API Error details:", {
        baseURL: api.defaults.baseURL,
        marketId,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      throw error;
    }
  },
};

export default api;
