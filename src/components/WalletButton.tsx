"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import {
  formatAddress,
  formatBalance,
  getNetworkName,
  isMetaMaskInstalled,
} from "@/lib/wallet";
import { MetaMaskIcon } from "@/components/icons/MetaMaskIcon";
import {
  Wallet,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  LogOut,
} from "lucide-react";

interface WalletButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  showBalance?: boolean;
  showNetwork?: boolean;
  className?: string;
}

export function WalletButton({
  variant = "primary",
  size = "md",
  showBalance = true,
  showNetwork = true,
  className = "",
}: WalletButtonProps) {
  const {
    isConnected,
    account,
    balance,
    chainId,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
  } = useWallet();

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  // Debug MetaMask detection
  React.useEffect(() => {
    console.log("🔍 WalletButton: MetaMask detection check");
    console.log(
      "  - window.ethereum exists:",
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
    console.log(
      "  - window.ethereum.isMetaMask:",
      typeof window !== "undefined" && window.ethereum?.isMetaMask
    );
    console.log("  - isMetaMaskInstalled():", isMetaMaskInstalled());
    console.log(
      "  - Button text will be:",
      !isMetaMaskInstalled() ? "Install MetaMask" : "Connect Wallet"
    );
  }, []);

  // Style variants
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
    outline: "border-2 border-primary text-primary hover:bg-accent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleCopyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleConnect = async () => {
    console.log("🔘 Wallet button clicked");
    console.log("🔍 MetaMask installed:", isMetaMaskInstalled());

    if (!isMetaMaskInstalled()) {
      console.log("🦊 MetaMask not installed, opening download page...");

      // Try multiple ways to open the link in case of popup blockers
      try {
        const opened = window.open("https://metamask.io/download/", "_blank");
        if (!opened) {
          console.warn("⚠️ Popup blocked, trying alternative method");
          // Fallback: create a temporary link and click it
          const link = document.createElement("a");
          link.href = "https://metamask.io/download/";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.log("✅ MetaMask download page opened successfully");
        }
      } catch (error) {
        console.error("❌ Failed to open MetaMask download page:", error);
        alert("Please visit https://metamask.io/download/ to install MetaMask");
      }
      return;
    }

    console.log("🦊 MetaMask installed, connecting...");
    await connectWallet();
  };

  // If not connected, show connect button
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`
            flex items-center space-x-2 rounded-lg font-medium transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variants[variant]} ${sizes[size]} ${className}
          `}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isMetaMaskInstalled() ? (
            <MetaMaskIcon className="w-4 h-4" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          <span>
            {!isMetaMaskInstalled() ? "Install MetaMask" : "Connect Wallet"}
          </span>
        </button>

        {error && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10 min-w-max">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If connected, show account info
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`
          flex items-center space-x-3 rounded-lg font-medium transition-all duration-200
          ${
            variant === "primary"
              ? "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30"
              : variant === "secondary"
              ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              : "border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20"
          }
          ${sizes[size]} ${className}
        `}
      >
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{formatAddress(account!)}</span>
        </div>

        {showBalance && balance && (
          <div className="hidden sm:block">
            <span className="text-xs text-muted-foreground">
              {formatBalance(balance, 4)}{" "}
              {chainId === 56 || chainId === 97 ? "BNB" : "ETH"}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown content */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-popover rounded-xl shadow-lg border border-border z-20">
            <div className="p-4">
              {/* Account section */}
              <div className="pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-popover-foreground">
                    Account
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {copiedAddress ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-sm text-popover-foreground break-all">
                  {account}
                </div>
              </div>

              {/* Balance section */}
              {balance && (
                <div className="py-3 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground mb-1">
                    Balance
                  </div>
                  <div className="text-lg font-semibold text-popover-foreground">
                    {formatBalance(balance, 6)}{" "}
                    {chainId === 56 || chainId === 97 ? "BNB" : "ETH"}
                  </div>
                </div>
              )}

              {/* Network section */}
              {showNetwork && chainId && (
                <div className="py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-popover-foreground">
                        Network
                      </div>
                      <div className="text-sm text-popover-foreground">
                        {getNetworkName(chainId)}
                      </div>
                    </div>
                    {chainId !== 97 && chainId !== 56 && (
                      <button
                        onClick={switchToCorrectNetwork}
                        className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                      >
                        Switch Network
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    const explorerUrl =
                      chainId === 56
                        ? "https://bscscan.com"
                        : chainId === 97
                        ? "https://testnet.bscscan.com"
                        : chainId === 1
                        ? "https://etherscan.io"
                        : "https://goerli.etherscan.io";
                    window.open(`${explorerUrl}/address/${account}`, "_blank");
                  }}
                  className="flex items-center justify-between w-full p-2 text-sm text-popover-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    disconnectWallet();
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-between w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span>Disconnect</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WalletButton;
