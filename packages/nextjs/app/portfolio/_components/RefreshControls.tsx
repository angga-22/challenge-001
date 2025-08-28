"use client";

import { useState, useEffect } from "react";

interface RefreshControlsProps {
  onRefresh: (useBatching?: boolean) => void;
  isLoading: boolean;
  lastRefresh: Date | null;
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
}

const RefreshControls = ({
  onRefresh,
  isLoading,
  lastRefresh,
  autoRefresh,
  onAutoRefreshChange,
  refreshInterval,
  onRefreshIntervalChange,
}: RefreshControlsProps) => {
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(0);
  const [useBatching, setUseBatching] = useState(true);

  // Countdown timer for next auto refresh
  useEffect(() => {
    if (!autoRefresh) {
      setNextRefreshIn(0);
      return;
    }

    const interval = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    // Initialize countdown
    setNextRefreshIn(refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleManualRefresh = () => {
    onRefresh(useBatching);
    if (autoRefresh) {
      setNextRefreshIn(refreshInterval); // Reset countdown
    }
  };

  const intervalOptions = [
    { value: 5, label: "5 seconds" },
    { value: 10, label: "10 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 300, label: "5 minutes" },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-4">Refresh Controls</h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Manual Refresh Button */}
          <div className="flex items-center gap-3">
            <button onClick={handleManualRefresh} disabled={isLoading} className="btn btn-primary btn-sm">
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Now
                </>
              )}
            </button>

            {autoRefresh && nextRefreshIn > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">Next refresh in {nextRefreshIn}s</div>
            )}

            {lastRefresh && (
              <div className="text-sm text-gray-600 dark:text-gray-400">Last updated: {formatTime(lastRefresh)}</div>
            )}
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-3">
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <span className="label-text text-sm">Auto Refresh</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={autoRefresh}
                  onChange={e => onAutoRefreshChange(e.target.checked)}
                />
              </label>
            </div>

            {/* Refresh Interval Selector */}
            {autoRefresh && (
              <div className="form-control">
                <select
                  className="select select-bordered select-sm w-full max-w-xs"
                  value={refreshInterval}
                  onChange={e => onRefreshIntervalChange(Number(e.target.value))}
                >
                  {intervalOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Batching Controls and Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-sm">Use Batched Calls</span>
              <input
                type="checkbox"
                className="toggle toggle-secondary toggle-sm"
                checked={useBatching}
                onChange={e => setUseBatching(e.target.checked)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className={`badge ${autoRefresh ? "badge-success" : "badge-neutral"}`}>
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </div>

            {autoRefresh && (
              <div className="badge badge-info">
                Every {intervalOptions.find(opt => opt.value === refreshInterval)?.label}
              </div>
            )}

            <div className={`badge ${useBatching ? "badge-success" : "badge-warning"}`}>
              {useBatching ? "Batched" : "Individual"}
            </div>

            <div className={`badge ${isLoading ? "badge-warning" : "badge-success"}`}>
              {isLoading ? "Loading..." : "Ready"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefreshControls;
