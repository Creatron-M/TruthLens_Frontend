"use client";

import { useState, useEffect } from "react";
import { marketService } from "../../../lib/api";
import { OracleStatusData } from "../../../types/oracle";
import {
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Brain,
  ExternalLink,
  Wifi,
  HardDrive,
  Cpu,
} from "lucide-react";

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  successRate: number;
  totalRequests: number;
  errorRate: number;
  apiCalls: {
    openai: number;
    coingecko: number;
    ipfs: number;
    blockchain: number;
  };
}

interface ServiceStatus {
  name: string;
  status: "online" | "offline" | "degraded";
  responseTime: number;
  lastCheck: number;
  description: string;
  icon: any;
}

export default function StatusPage() {
  const [oracleStatus, setOracleStatus] = useState<OracleStatusData | null>(
    null
  );
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchSystemStatus();
  };

  const fetchSystemStatus = async () => {
    try {
      if (loading) setLoading(true);
      if (!loading) setRefreshing(true);

      // Fetch oracle status
      const status = await marketService.getStatus();
      setOracleStatus(status);

      // Only set real system metrics, remove mock data
      // Note: These would need to be added to your backend API
      setSystemMetrics(null);

      // Only show real service status based on API response
      const serviceStatuses: ServiceStatus[] = [
        {
          name: "Oracle API",
          status: "online", // API call succeeded, so it's online
          responseTime: 0, // Would need backend timing data
          lastCheck: Date.now(),
          description: "Main TruthLens API endpoints",
          icon: Server,
        },
        {
          name: "Blockchain (BSC)",
          status: status.blockchain_connected ? "online" : "offline",
          responseTime: 0, // Would need backend timing data
          lastCheck: Date.now(),
          description: "Smart contract interactions",
          icon: Shield,
        },
      ];

      setServices(serviceStatuses);
    } catch (error) {
      console.error("Failed to fetch system status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      case "degraded":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
      case "offline":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4" />;
      case "offline":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatUptime = (days: number) => {
    if (days >= 1) {
      return `${Math.floor(days)}d ${Math.floor((days % 1) * 24)}h`;
    }
    return `${Math.floor(days * 24)}h ${Math.floor(((days * 24) % 1) * 60)}m`;
  };

  const getOverallStatus = () => {
    const onlineServices = services.filter((s) => s.status === "online").length;
    const totalServices = services.length;

    if (onlineServices === totalServices) return "All Systems Operational";
    if (onlineServices >= totalServices * 0.8) return "Minor Service Issues";
    if (onlineServices >= totalServices * 0.5) return "Service Degradation";
    return "Major Outage";
  };

  const getOverallStatusColor = () => {
    const onlineServices = services.filter((s) => s.status === "online").length;
    const totalServices = services.length;

    if (onlineServices === totalServices)
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
    if (onlineServices >= totalServices * 0.8)
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* System Monitoring Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Server Status Grid */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="serverGrid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="80"
                  height="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="2"
                  fill="currentColor"
                  className="animate-pulse"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#serverGrid)" />
          </svg>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-10 right-10 flex flex-col space-y-2 opacity-20">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-600"></div>
        </div>

        {/* Network Topology */}
        <div className="absolute bottom-20 left-20 w-48 h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="3"
              fill="currentColor"
              className="animate-pulse"
            />
            <circle
              cx="100"
              cy="40"
              r="2"
              fill="currentColor"
              className="animate-pulse delay-200"
            />
            <circle
              cx="160"
              cy="100"
              r="2"
              fill="currentColor"
              className="animate-pulse delay-400"
            />
            <circle
              cx="100"
              cy="160"
              r="2"
              fill="currentColor"
              className="animate-pulse delay-600"
            />
            <circle
              cx="40"
              cy="100"
              r="2"
              fill="currentColor"
              className="animate-pulse delay-800"
            />
          </svg>
        </div>

        {/* CPU/Performance Bars */}
        <div className="absolute top-1/4 left-10 w-32 h-24 opacity-15">
          <div className="flex items-end space-x-1 h-full">
            <div
              className="w-3 bg-blue-500 animate-pulse"
              style={{ height: "60%" }}
            ></div>
            <div
              className="w-3 bg-green-500 animate-pulse delay-100"
              style={{ height: "80%" }}
            ></div>
            <div
              className="w-3 bg-purple-500 animate-pulse delay-200"
              style={{ height: "45%" }}
            ></div>
            <div
              className="w-3 bg-cyan-500 animate-pulse delay-300"
              style={{ height: "90%" }}
            ></div>
            <div
              className="w-3 bg-indigo-500 animate-pulse delay-400"
              style={{ height: "70%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 animate-glow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold ai-gradient-text">
              System Status
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors blockchain-card rounded-lg"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time monitoring of all TruthLens services and system health
        </p>
      </div>

      {/* Oracle Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Oracle Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
              Total Markets
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {oracleStatus?.total_markets || (
                <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
              Active Analyses
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {oracleStatus?.active_analyses || (
                <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">
              Total Attestations
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {oracleStatus?.total_attestations || (
                <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
            <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">
              Last Update
            </div>
            <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
              {oracleStatus?.last_update ? (
                new Date(oracleStatus.last_update * 1000).toLocaleTimeString()
              ) : loading ? (
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              ) : (
                "Never"
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Blockchain
            </div>
            <div className="text-lg font-bold flex items-center">
              {oracleStatus?.blockchain_connected !== undefined ? (
                <>
                  {oracleStatus.blockchain_connected ? (
                    <CheckCircle className="w-4 h-4 mr-1 text-green-700 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-1 text-red-700 dark:text-red-400" />
                  )}
                  <span
                    className={
                      oracleStatus.blockchain_connected
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }
                  >
                    {oracleStatus.blockchain_connected
                      ? "Connected"
                      : "Offline"}
                  </span>
                </>
              ) : (
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Service Status
            </h2>
            <div className="space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {service.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Response Time
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {service.responseTime.toFixed(0)}ms
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusIcon(service.status)}
                        <span className="font-medium capitalize">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          {systemMetrics && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      Uptime
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {systemMetrics.uptime}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                      style={{ width: `${systemMetrics.uptime}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">
                      Success Rate
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {systemMetrics.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                      style={{ width: `${systemMetrics.successRate}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Response Time
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {systemMetrics.responseTime.toFixed(0)}ms
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Total Requests
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {systemMetrics.totalRequests.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Usage */}
          {systemMetrics && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                API Usage (24h)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      OpenAI
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {systemMetrics.apiCalls.openai}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      CoinGecko
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {systemMetrics.apiCalls.coingecko}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      IPFS
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {systemMetrics.apiCalls.ipfs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Blockchain
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {systemMetrics.apiCalls.blockchain}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              External Services
            </h3>
            <div className="space-y-3">
              <a
                href="https://testnet.bscscan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    BSC Testnet
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </a>

              <a
                href="https://gateway.pinata.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Pinata IPFS
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </a>

              <a
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    CoinGecko API
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
