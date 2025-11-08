"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

interface WalletContextType {
  // State
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToCorrectNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Supported networks - can be expanded
const SUPPORTED_NETWORKS = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  ETHEREUM_MAINNET: 1,
  ETHEREUM_GOERLI: 5,
};

const PREFERRED_NETWORK = SUPPORTED_NETWORKS.BSC_TESTNET; // Default to BSC Testnet

export function WalletProvider({ children }: WalletProviderProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        await initializeWallet(accounts[0]);
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  };

  const initializeWallet = async (account: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setChainId(Number(network.chainId));
      setBalance(ethers.formatEther(balance));
      setIsConnected(true);
      setError(null);

      // Store connection state
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAccount", account);
    } catch (err) {
      console.error("Error initializing wallet:", err);
      setError("Failed to initialize wallet connection");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        await initializeWallet(accounts[0]);
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);

      if (err.code === 4001) {
        setError("Wallet connection rejected by user");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setError(null);

    // Clear stored connection data
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAccount");

    // Redirect to landing page
    router.push("/");
  };

  const switchToCorrectNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${PREFERRED_NETWORK.toString(16)}` }],
      });
    } catch (err: any) {
      // If the network doesn't exist, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${PREFERRED_NETWORK.toString(16)}`,
                chainName: "BSC Testnet",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                blockExplorerUrls: ["https://testnet.bscscan.com/"],
              },
            ],
          });
        } catch (addErr) {
          console.error("Error adding network:", addErr);
          setError("Failed to add BSC Testnet to wallet");
        }
      } else {
        console.error("Error switching network:", err);
        setError("Failed to switch to BSC Testnet");
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      initializeWallet(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const value: WalletContextType = {
    isConnected,
    account,
    balance,
    chainId,
    provider,
    signer,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
