
import React from 'react';

export const AdPlaceholder: React.FC = () => {
  // This would only show for Basic Plan users
  return (
    <div className="mx-4 mb-6 mt-16 pt-4">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          📱 AdMob Banner Space
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Sponsored Content
        </p>
      </div>
    </div>
  );
};
