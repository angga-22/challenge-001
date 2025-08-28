"use client";

import type { TokenData } from "./PortfolioDashboard";

interface PortfolioSummaryProps {
  totalValue: number;
  tokens: TokenData[];
  isLoading: boolean;
}

const PortfolioSummary = ({ totalValue, tokens, isLoading }: PortfolioSummaryProps) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const getLargestHolding = () => {
    if (tokens.length === 0) return null;
    return tokens.reduce((max, token) => (token.usdValue > max.usdValue ? token : max));
  };

  const largestHolding = getLargestHolding();

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold mb-2">Portfolio Overview</h2>
            {isLoading ? (
              <div className="skeleton h-12 w-48"></div>
            ) : (
              <div className="text-4xl font-bold text-primary">{formatLargeNumber(totalValue)}</div>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-1">Total Portfolio Value</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{tokens.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assets</div>
            </div>

            {largestHolding && !isLoading && (
              <div className="text-center">
                <div className="text-2xl font-bold">{largestHolding.symbol}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Largest Holding</div>
              </div>
            )}

            {!isLoading && totalValue > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(((largestHolding?.usdValue || 0) / totalValue) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Concentration</div>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Allocation Chart */}
        {!isLoading && tokens.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Asset Allocation</h3>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {tokens.map(token => {
                const percentage = totalValue > 0 ? (token.usdValue / totalValue) * 100 : 0;
                return (
                  <div
                    key={token.symbol}
                    className={`${token.color} transition-all duration-300 hover:opacity-80`}
                    style={{ width: `${percentage}%` }}
                    title={`${token.symbol}: ${percentage.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {tokens.map(token => {
                const percentage = totalValue > 0 ? (token.usdValue / totalValue) * 100 : 0;
                return (
                  <div key={token.symbol} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${token.color}`}></div>
                    <span className="text-sm">
                      {token.symbol} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSummary;
