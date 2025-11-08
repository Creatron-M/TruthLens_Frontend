import React from "react";

export interface BlockchainIconProps {
  symbol: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export const BlockchainIcon: React.FC<BlockchainIconProps> = ({
  symbol,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const iconUrls = {
    BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  const getIconUrl = (symbol: string): string => {
    switch (symbol.toUpperCase()) {
      case "BTC":
      case "BITCOIN":
        return iconUrls.BTC;
      case "ETH":
      case "ETHEREUM":
        return iconUrls.ETH;
      case "BNB":
      case "BINANCE":
        return iconUrls.BNB;
      default:
        return iconUrls.BTC; // Default to BTC
    }
  };

  const getFallbackColor = (symbol: string): string => {
    switch (symbol.toUpperCase()) {
      case "BTC":
      case "BITCOIN":
        return "bg-orange-500";
      case "ETH":
      case "ETHEREUM":
        return "bg-blue-500";
      case "BNB":
      case "BINANCE":
        return "bg-yellow-500";
      default:
        return "bg-orange-500";
    }
  };

  return (
    <div className={`${baseClasses} relative`}>
      <img
        src={getIconUrl(symbol)}
        alt={`${symbol} icon`}
        className={`${baseClasses} rounded-full object-cover shadow-lg`}
        onError={(e) => {
          // Hide the broken image and show fallback
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.style.display = "flex";
          }
        }}
      />
      {/* Fallback element */}
      <div
        className={`${baseClasses} ${getFallbackColor(
          symbol
        )} rounded-full flex items-center justify-center text-white font-bold shadow-lg absolute inset-0`}
        style={{ display: "none" }}
      >
        <span className="text-xs">{symbol.toUpperCase().slice(0, 3)}</span>
      </div>
    </div>
  );
};

// Helper function to get market symbol from market ID or name
export const getMarketSymbol = (marketId: string): string => {
  const id = marketId.toLowerCase();
  if (id.includes("bitcoin") || id.includes("btc")) return "BTC";
  if (id.includes("ethereum") || id.includes("eth")) return "ETH";
  if (id.includes("binance") || id.includes("bnb")) return "BNB";
  return marketId.toUpperCase();
};
