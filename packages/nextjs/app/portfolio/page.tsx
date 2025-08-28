"use client";

import type { NextPage } from "next";
import { useState } from "react";
import PortfolioDashboard from "./_components/PortfolioDashboard";
import PerformanceComparison from "./_components/PerformanceComparison";

const Portfolio: NextPage = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "performance">("dashboard");

  // Performance comparison function
  const runPerformanceComparison = async () => {
    // Simulate batched calls
    const batchedStart = performance.now();
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    const batchedEnd = performance.now();
    const batchedTime = batchedEnd - batchedStart;

    // Simulate individual calls
    const individualStart = performance.now();
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
    }
    const individualEnd = performance.now();
    const individualTime = individualEnd - individualStart;

    const timeSaved = individualTime - batchedTime;
    const percentImprovement = (timeSaved / individualTime) * 100;

    return {
      batchedTime,
      individualTime,
      batchedCalls: 1,
      individualCalls: 4,
      timeSaved,
      percentImprovement,
    };
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-base-100 p-1 mt-4 sm:mt-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "dashboard" ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-200"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "performance" ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-200"
              }`}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && <PortfolioDashboard />}
        {activeTab === "performance" && <PerformanceComparison onRunComparison={runPerformanceComparison} />}
      </div>
    </div>
  );
};

export default Portfolio;
