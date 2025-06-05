
import React from 'react';

export const WelcomeSection: React.FC = () => {
  const stats = [
    { label: "Focus Time Today", value: "2h 45m", color: "text-purple-500" },
    { label: "Tasks Done", value: "8/12", color: "text-blue-500" },
    { label: "Upcoming Events", value: "3", color: "text-green-500" },
    { label: "Notes Count", value: "24", color: "text-orange-500" }
  ];

  return (
    <div className="px-4 md:px-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your productivity overview for today
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-xl md:text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
