"use client";

import { useState } from "react";

interface PerformanceMetrics {
  batchedTime: number;
  individualTime: number;
  batchedCalls: number;
  individualCalls: number;
  timeSaved: number;
  percentImprovement: number;
}

interface PerformanceComparisonProps {
  onRunComparison: () => Promise<PerformanceMetrics>;
}

const PerformanceComparison = ({ onRunComparison }: PerformanceComparisonProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);

  const runComparison = async () => {
    setIsRunning(true);
    try {
      const newMetrics = await onRunComparison();
      setMetrics(newMetrics);
      setHistory(prev => [...prev.slice(-9), newMetrics]); // Keep last 10 results
    } catch (error) {
      console.error("Performance comparison failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setMetrics(null);
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getAverageMetrics = () => {
    if (history.length === 0) return null;

    const total = history.reduce(
      (acc, metric) => ({
        batchedTime: acc.batchedTime + metric.batchedTime,
        individualTime: acc.individualTime + metric.individualTime,
        timeSaved: acc.timeSaved + metric.timeSaved,
        percentImprovement: acc.percentImprovement + metric.percentImprovement,
      }),
      { batchedTime: 0, individualTime: 0, timeSaved: 0, percentImprovement: 0 },
    );

    return {
      batchedTime: total.batchedTime / history.length,
      individualTime: total.individualTime / history.length,
      timeSaved: total.timeSaved / history.length,
      percentImprovement: total.percentImprovement / history.length,
    };
  };

  const averageMetrics = getAverageMetrics();

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Performance Comparison</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Compare batched vs individual RPC calls</p>
            </div>

            <div className="flex gap-2">
              <button onClick={runComparison} disabled={isRunning} className="btn btn-primary">
                {isRunning ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Running...
                  </>
                ) : (
                  "Run Comparison"
                )}
              </button>

              {history.length > 0 && (
                <button onClick={clearHistory} className="btn btn-outline btn-sm">
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Results */}
      {metrics && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Latest Test Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat">
                <div className="stat-title">Batched Calls</div>
                <div className="stat-value text-success">{formatTime(metrics.batchedTime)}</div>
                <div className="stat-desc">{metrics.batchedCalls} calls</div>
              </div>

              <div className="stat">
                <div className="stat-title">Individual Calls</div>
                <div className="stat-value text-warning">{formatTime(metrics.individualTime)}</div>
                <div className="stat-desc">{metrics.individualCalls} calls</div>
              </div>

              <div className="stat">
                <div className="stat-title">Time Saved</div>
                <div className="stat-value text-primary">{formatTime(metrics.timeSaved)}</div>
                <div className="stat-desc">Absolute difference</div>
              </div>

              <div className="stat">
                <div className="stat-title">Improvement</div>
                <div className="stat-value text-accent">{metrics.percentImprovement.toFixed(1)}%</div>
                <div className="stat-desc">Performance gain</div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Visual Comparison</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Batched Calls</span>
                    <span>{formatTime(metrics.batchedTime)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(metrics.batchedTime / Math.max(metrics.batchedTime, metrics.individualTime)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Individual Calls</span>
                    <span>{formatTime(metrics.individualTime)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(metrics.individualTime / Math.max(metrics.batchedTime, metrics.individualTime)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Average */}
      {averageMetrics && history.length > 1 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Average Results ({history.length} tests)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat">
                <div className="stat-title">Avg Batched</div>
                <div className="stat-value text-success text-lg">{formatTime(averageMetrics.batchedTime)}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Avg Individual</div>
                <div className="stat-value text-warning text-lg">{formatTime(averageMetrics.individualTime)}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Avg Time Saved</div>
                <div className="stat-value text-primary text-lg">{formatTime(averageMetrics.timeSaved)}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Avg Improvement</div>
                <div className="stat-value text-accent text-lg">{averageMetrics.percentImprovement.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test History */}
      {history.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Test History</h3>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Test #</th>
                    <th>Batched</th>
                    <th>Individual</th>
                    <th>Time Saved</th>
                    <th>Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((metric, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-success">{formatTime(metric.batchedTime)}</td>
                      <td className="text-warning">{formatTime(metric.individualTime)}</td>
                      <td className="text-primary">{formatTime(metric.timeSaved)}</td>
                      <td className="text-accent">{metric.percentImprovement.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceComparison;
