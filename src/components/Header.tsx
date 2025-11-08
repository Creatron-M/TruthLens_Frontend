"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { useWallet } from "@/contexts/WalletContext";
import WalletButton from "@/components/WalletButton";
import {
  Bell,
  Search,
  HelpCircle,
  Menu,
  X,
  Activity,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const systemStatus = useSystemStatus();
  const { isConnected, account } = useWallet();

  const isDashboard = pathname?.startsWith("/dashboard");

  if (!isDashboard) {
    // Simple header for landing page
    return (
      <header className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TruthLens Oracle
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          AI-powered credibility and manipulation risk analysis for crypto
          prediction markets
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <span
            className={`flex items-center px-3 py-2 rounded-full border ${
              systemStatus.status === "healthy"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                : systemStatus.status === "loading"
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
                : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            {systemStatus.status === "healthy"
              ? "Live Analysis"
              : systemStatus.status === "loading"
              ? "Connecting..."
              : "Analysis Offline"}
          </span>
          <span
            className={`flex items-center px-3 py-2 rounded-full border ${
              systemStatus.services?.oracle === "online"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            BSC{" "}
            {systemStatus.services?.oracle === "online"
              ? "Connected"
              : "Disconnected"}
          </span>
          <span className="flex items-center bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-700">
            <Zap className="w-4 h-4 mr-2" />
            AI Powered
          </span>
        </div>
      </header>
    );
  }

  // Enhanced header for dashboard pages
  return (
    <header className="bg-background/95 border-b border-border sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Real Status Indicators */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div
                className={`flex items-center px-3 py-1.5 rounded-full ${
                  systemStatus.status === "healthy"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : systemStatus.status === "unhealthy"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : systemStatus.status === "loading"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {systemStatus.status === "healthy" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    System Online
                  </>
                ) : systemStatus.status === "unhealthy" ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    System Issues
                  </>
                ) : systemStatus.status === "loading" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Offline
                  </>
                )}
              </div>
              <div
                className={`flex items-center px-3 py-1.5 rounded-full ${
                  systemStatus.services?.oracle === "online"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : systemStatus.services?.oracle === "degraded"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    systemStatus.services?.oracle === "online"
                      ? "bg-blue-500 dark:bg-blue-400"
                      : systemStatus.services?.oracle === "degraded"
                      ? "bg-yellow-500 dark:bg-yellow-400"
                      : "bg-gray-400 dark:bg-gray-500"
                  }`}
                ></div>
                BSC{" "}
                {systemStatus.services?.oracle === "online"
                  ? "Connected"
                  : "Disconnected"}
              </div>
              {systemStatus.metrics && (
                <div className="flex items-center text-gray-600 dark:text-gray-300 px-3 py-1.5">
                  <Activity className="w-4 h-4 mr-2" />
                  {systemStatus.metrics.total_markets} Markets
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets, queries..."
                className="pl-10 pr-4 py-2 w-80 border border-border rounded-lg bg-muted focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <h3 className="font-semibold text-popover-foreground">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Analysis Complete
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Bitcoin market analysis finished
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Risk Alert
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            High manipulation risk detected in ETH market
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-border">
                    <button className="text-sm text-primary hover:text-primary/80">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <WalletButton
                variant="secondary"
                size="sm"
                showBalance={true}
                showNetwork={true}
              />
            ) : (
              <WalletButton
                variant="primary"
                size="sm"
                showBalance={false}
                showNetwork={false}
              />
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
