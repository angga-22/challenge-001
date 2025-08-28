"use client";

import type { TokenData } from "./PortfolioDashboard";

interface TokenBalanceProps {
  token: TokenData;
  isLoading: boolean;
}

const TokenBalance = ({ token, isLoading }: TokenBalanceProps) => {
  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(decimals)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(decimals)}K`;
    }
    return `$${num.toFixed(decimals)}`;
  };

  const formatBalance = (balance: string, symbol: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M ${symbol}`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K ${symbol}`;
    }
    return `${num.toFixed(6)} ${symbol}`;
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${token.color}`}></div>
            <div>
              <h3 className="font-bold text-lg">{token.symbol}</h3>
              <p className="text-sm text-gray-500">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">${token.price.toFixed(2)}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xl font-semibold">{formatBalance(token.balance, token.symbol)}</p>
            <p className="text-lg text-gray-600">{formatNumber(token.usdValue)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenBalance;
