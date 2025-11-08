export interface MarketData {
  market_id: string; // Changed to match backend
  name: string; // Added name field
  question: string;
  price_24h: number[]; // Changed from price24h
  volume_24h: number[]; // Changed from volume24h
  current_price: number;
  market_cap: number;
  change_24h: number;
}

export interface OracleReading {
  market_id: string; // Changed from marketId
  cred_score: number; // Changed from credScore
  risk_index: number; // Changed from riskIndex
  meta_uri: string; // Changed from metaURI
  signer: string;
  timestamp: number;
}

export interface AnalysisResult {
  market_id: string; // Changed from marketId
  credibility_score: number; // Changed from credibilityScore
  risk_index: number; // Changed from riskIndex
  confidence: number;
  links_analyzed: number; // Changed from linksAnalyzed
  metadata: Record<string, any>;
  tx_hash?: string; // Changed from txHash
  ipfs_hash?: string; // Changed from ipfsHash
}

// Add custom query types
export interface CustomQueryRequest {
  question: string;
}

export interface CustomQueryResponse {
  answer: string;
  confidence: number;
  sources: string[];
  metadata: Record<string, any>;
}

export interface OracleStatusData {
  total_markets: number;
  active_analyses: number;
  total_attestations: number;
  last_update: number;
  blockchain_connected: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}

// Enhanced AI Types
export interface AIStatus {
  success: boolean;
  enhanced_features_enabled: boolean;
  status: string;
  queue_status?: {
    pending_items: number;
    processing: boolean;
    average_processing_time: number;
  };
  performance?: AIPerformanceMetrics;
  message: string;
}

export interface AIPerformanceMetrics {
  response_time_avg: number;
  cache_hit_rate: number;
  total_requests: number;
  error_rate: number;
  success_rate: number;
  queue_size: number;
  processing_speed: number;
}

export interface AICacheStats {
  hit_rate: number;
  miss_rate: number;
  total_requests: number;
  cache_size: number;
  memory_usage: string;
}

export interface AIConfig {
  enhanced_features_enabled: boolean;
  config: {
    cache?: Record<string, string>;
    performance?: Record<string, string>;
    optimization?: Record<string, string>;
    mode?: string;
    features?: string[];
  };
}

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: number;
  services: {
    api: string;
    markets: string;
    oracle: string;
    analysis: string;
  };
  metrics?: {
    total_markets: number;
    active_analyses: number;
    blockchain_connected: boolean;
    last_update: number;
  };
  error?: string;
}

export interface MarketHistory {
  market_id: string;
  price_history: Array<{
    timestamp: number;
    price: number;
    volume: number;
  }>;
  analysis_history: Array<{
    timestamp: number;
    credibility: number;
    risk: number;
    confidence: number;
  }>;
}
