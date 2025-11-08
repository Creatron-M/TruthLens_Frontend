"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { formatAddress } from "@/lib/wallet";
import WalletButton from "@/components/WalletButton";
import { verifyWalletAccess } from "@/lib/auth";
import {
  BarChart3,
  MessageCircle,
  TrendingUp,
  Activity,
  Settings,
  HelpCircle,
  Shield,
  Brain,
  Database,
  Globe,
  ChevronLeft,
  ChevronRight,
  Home,
  Zap,
  Wallet,
  LogIn,
} from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isConnected, account, balance, chainId } = useWallet();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navigationItems = [
    {
      section: "Overview",
      items: [
        {
          href: "/dashboard",
          icon: Home,
          label: "Dashboard",
          exact: true,
          description: "Main overview and quick access",
        },
      ],
    },
    {
      section: "Core Features",
      items: [
        {
          href: "/dashboard/markets-hub",
          icon: TrendingUp,
          label: "Markets Hub",
          exact: false,
          description: "Market analysis, queries & risk assessment",
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          href: "/dashboard/status",
          icon: Activity,
          label: "System Status",
          exact: false,
          description: "Oracle health monitoring",
        },
        {
          href: "/dashboard/settings",
          icon: Settings,
          label: "Settings",
          exact: false,
          description: "Configuration and preferences",
        },
      ],
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-background border-r border-border z-30 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 p-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TruthLens
            </span>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {navigationItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.section}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? pathname === item.href
                  : isActive(item.href);

                // Check if this is a dashboard route that requires wallet connection
                const isDashboardRoute = item.href.startsWith("/dashboard");
                const canAccess =
                  !isDashboardRoute || verifyWalletAccess(isConnected, account);

                return canAccess ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center ${
                      isCollapsed ? "px-2 py-3 justify-center" : "px-4 py-2.5"
                    } rounded-lg transition-all duration-200 ${
                      active
                        ? "text-primary bg-accent border border-border font-medium shadow-sm"
                        : isCollapsed
                        ? "text-foreground hover:bg-accent hover:text-foreground hover:scale-105"
                        : "text-foreground hover:bg-accent/50 hover:text-foreground"
                    } ${
                      "highlight" in item && item.highlight === true
                        ? "ring-1 ring-primary/20 bg-primary/5"
                        : ""
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`${isCollapsed ? "w-5 h-5" : "w-7 h-7"} ${
                        active
                          ? "text-primary"
                          : isCollapsed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      } ${isCollapsed ? "mx-auto" : "mr-3"}`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {"highlight" in item && item.highlight === true && (
                            <Zap className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/80 rounded-r-full" />
                    )}
                  </Link>
                ) : (
                  <button
                    key={`${item.href}-disabled`}
                    onClick={() => {
                      alert(
                        "Please connect your wallet to access dashboard features"
                      );
                    }}
                    className={`group relative flex items-center ${
                      isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-2.5"
                    } rounded-lg transition-all duration-200 text-muted-foreground/60 hover:bg-muted/50 cursor-not-allowed opacity-60 w-full text-left`}
                    title={
                      isCollapsed
                        ? `${item.label} (Connect Wallet Required)`
                        : undefined
                    }
                  >
                    <Icon
                      className={`${isCollapsed ? "w-7 h-7" : "w-5 h-5"} ${
                        isCollapsed
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60"
                      } ${isCollapsed ? "mx-auto" : "mr-3"}`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          <Wallet className="w-3 h-3 text-muted-foreground/60" />
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          Connect wallet required
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-4">
        {/* Wallet Status */}
        {!isCollapsed ? (
          <div className="space-y-3">
            {isConnected && account ? (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Wallet Connected
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-mono">
                  {formatAddress(account, 6)}
                </div>
                {balance && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {parseFloat(balance).toFixed(4)}{" "}
                    {chainId === 56 || chainId === 97 ? "BNB" : "ETH"}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-3">
                <WalletButton
                  variant="primary"
                  size="sm"
                  showBalance={false}
                  showNetwork={false}
                  className="w-full justify-center text-sm"
                />
              </div>
            )}

            <Link
              href="/help"
              className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {isConnected && account ? (
              <div
                className="flex justify-center p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg"
                title={`Connected: ${formatAddress(account)}`}
              >
                <Wallet className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <div className="flex justify-center p-1" title="Connect Wallet">
                <WalletButton
                  variant="secondary"
                  size="sm"
                  showBalance={false}
                  showNetwork={false}
                  className="w-full"
                />
              </div>
            )}

            <Link
              href="/help"
              className="flex justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
