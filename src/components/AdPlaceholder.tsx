
import React from 'react';

export const AdPlaceholder: React.FC = () => {
  return (
    <div className="mt-20 mx-6 mb-6 animate-fade-in">
      <div className="h-32 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-3xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
        <span className="text-lg font-bold text-gray-400 dark:text-gray-500 animate-pulse">
          {"{this is where ad will be shown}"}
        </span>
      </div>
    </div>
  );
};
