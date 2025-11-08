import { ethers } from 'ethers';

export interface WalletInfo {
  name: string;
  icon: string;
  connector: string;
}

// Supported wallets
export const SUPPORTED_WALLETS: Record<string, WalletInfo> = {
  METAMASK: {
    name: 'MetaMask',
    icon: '/icons/metamask.svg',
    connector: 'injected',
  },
  // Can add more wallets like WalletConnect, etc.
};

// Network configurations
export const NETWORK_CONFIG = {
  56: {
    name: 'BSC Mainnet',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com/',
  },
  97: {
    name: 'BSC Testnet',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    blockExplorerUrl: 'https://testnet.bscscan.com/',
  },
  1: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorerUrl: 'https://etherscan.io/',
  },
  5: {
    name: 'Goerli Testnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorerUrl: 'https://goerli.etherscan.io/',
  },
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

/**
 * Get the current wallet accounts
 */
export const getAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw new Error('Failed to get wallet accounts');
  }
};

/**
 * Request account access from the user
 */
export const requestAccounts = async (): Promise<string[]> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts;
  } catch (error: any) {
    console.error('Error requesting accounts:', error);
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw new Error('Failed to connect to wallet');
  }
};

/**
 * Get the current network chain ID
 */
export const getChainId = async (): Promise<number> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Error getting chain ID:', error);
    throw new Error('Failed to get network information');
  }
};

/**
 * Switch to a specific network
 */
export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the network doesn't exist, try to add it
    if (error.code === 4902) {
      await addNetwork(chainId);
    } else {
      throw new Error(`Failed to switch to network: ${error.message}`);
    }
  }
};

/**
 * Add a new network to the wallet
 */
export const addNetwork = async (chainId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  const networkConfig = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG];
  if (!networkConfig) {
    throw new Error(`Network configuration not found for chain ID: ${chainId}`);
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: networkConfig.name,
          nativeCurrency: {
            name: networkConfig.symbol,
            symbol: networkConfig.symbol,
            decimals: networkConfig.decimals,
          },
          rpcUrls: [networkConfig.rpcUrl],
          blockExplorerUrls: [networkConfig.blockExplorerUrl],
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to add network: ${error.message}`);
  }
};

/**
 * Get wallet balance
 */
export const getBalance = async (address: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to get wallet balance');
  }
};

/**
 * Sign a message with the wallet
 */
export const signMessage = async (message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error: any) {
    console.error('Error signing message:', error);
    if (error.code === 4001) {
      throw new Error('User rejected the signing request');
    }
    throw new Error('Failed to sign message');
  }
};

/**
 * Format address for display (0x1234...5678)
 */
export const formatAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  if (address.length <= length * 2 + 2) return address;
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
};

/**
 * Format balance for display
 */
export const formatBalance = (balance: string, decimals: number = 4): string => {
  if (!balance) return '0';
  const num = parseFloat(balance);
  return num.toFixed(decimals);
};

/**
 * Get network name by chain ID
 */
export const getNetworkName = (chainId: number): string => {
  const network = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG];
  return network ? network.name : `Unknown Network (${chainId})`;
};

/**
 * Check if the current network is supported
 */
export const isSupportedNetwork = (chainId: number): boolean => {
  return chainId in NETWORK_CONFIG;
};

/**
 * Create a wallet connection error message
 */
export const getWalletErrorMessage = (error: any): string => {
  if (error.code === 4001) {
    return 'Connection rejected by user';
  } else if (error.code === 4902) {
    return 'Network not supported by wallet';
  } else if (error.code === -32002) {
    return 'Connection request already pending';
  } else if (error.message?.includes('User rejected')) {
    return 'User rejected the request';
  } else {
    return error.message || 'An unknown error occurred';
  }
};