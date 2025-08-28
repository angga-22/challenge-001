"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import PortfolioSummary from "./PortfolioSummary";
import RefreshControls from "./RefreshControls";
import PerformanceComparison from "./PerformanceComparison";
import TokenBalance from "./TokenBalance";

// Mock token addresses for demonstration
const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000", // Native ETH
    decimals: 18,
    price: 3200,
    color: "bg-blue-500",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x1234567890123456789012345678901234567890",
    decimals: 6,
    price: 1,
    color: "bg-green-500",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2345678901234567890123456789012345678901",
    decimals: 8,
    price: 95000,
    color: "bg-orange-500",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    address: "0x3456789012345678901234567890123456789012",
    decimals: 18,
    price: 0.85,
    color: "bg-purple-500",
  },
];

export interface TokenData {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  usdValue: number;
  price: number;
  decimals: number;
  color: string;
}

export const PortfolioDashboard: React.FC = () => {
  const { address: userAddress } = useAccount();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Get contract info
  const { data: contractData } = useDeployedContractInfo("your-contract");

  // Get native ETH balance
  const { data: ethBalance } = useBalance({
    address: userAddress,
  });

  const fetchTokenBalances = useCallback(
    async (useBatching = true) => {
      if (!userAddress || !contractData) return;

      setIsLoading(true);

      try {
        const tokenBalances: TokenData[] = [];

        // Add ETH balance
        tokenBalances.push({
          symbol: "ETH",
          name: "Ethereum",
          address: "0x0000000000000000000000000000000000000000",
          balance: ethBalance ? formatEther(ethBalance.value) : "0",
          usdValue: ethBalance ? parseFloat(formatEther(ethBalance.value)) * 3200 : 0,
          price: 3200,
          decimals: 18,
          color: "bg-blue-500",
        });

        // Get mock token balances (in a real app, these would come from the contract)
        for (const token of TOKENS.slice(1)) {
          // Skip ETH as we handled it above
          const balance = "100"; // Mock balance for demo
          tokenBalances.push({
            ...token,
            balance,
            usdValue: parseFloat(balance) * token.price,
          });
        }

        setTokens(tokenBalances);
        setLastRefresh(new Date());
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userAddress, contractData, ethBalance],
  );

  const runPerformanceComparison = async () => {
    // Mock performance comparison
    const batchedTime = Math.random() * 200 + 50; // 50-250ms
    const individualTime = Math.random() * 800 + 400; // 400-1200ms

    return {
      batchedTime,
      individualTime,
      batchedCalls: 1,
      individualCalls: TOKENS.length,
      timeSaved: individualTime - batchedTime,
      percentImprovement: ((individualTime - batchedTime) / individualTime) * 100,
    };
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => fetchTokenBalances(true), refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchTokenBalances]);

  // Initial load
  useEffect(() => {
    if (userAddress) {
      fetchTokenBalances();
    }
  }, [userAddress, fetchTokenBalances]);

  const totalPortfolioValue = tokens.reduce((sum, token) => sum + token.usdValue, 0);

  if (!userAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-base-200 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Portfolio Dashboard</h2>
        <p className="text-base-content/70">Please connect your wallet to view your portfolio</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <div className="text-sm text-base-content/70">
          Contract: {contractData?.address?.slice(0, 6)}...{contractData?.address?.slice(-4)}
        </div>
      </div>

      <RefreshControls
        onRefresh={fetchTokenBalances}
        isLoading={isLoading}
        lastRefresh={lastRefresh}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={setRefreshInterval}
      />

      <PortfolioSummary tokens={tokens} totalValue={totalPortfolioValue} isLoading={isLoading} />

      <PerformanceComparison onRunComparison={runPerformanceComparison} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tokens.map(token => (
          <TokenBalance key={token.address} token={token} isLoading={isLoading} />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default PortfolioDashboard;
