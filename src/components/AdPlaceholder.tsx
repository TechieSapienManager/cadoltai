
import React from 'react';

export const AdPlaceholder: React.FC = () => {
  return (
    <div className="mt-16 mx-4 mb-4 animate-fade-in">
      <div className="h-32 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-lg font-bold text-black dark:text-white">
          {"{this is where ad will be shown}"}
        </span>
      </div>
    </div>
  );
};
