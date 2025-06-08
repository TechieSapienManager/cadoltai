
import React from 'react';

export const AdPlaceholder: React.FC = () => {
  return (
    <div className="mx-4 mb-6 mt-16 pt-4">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
        {/* AdMob Banner Integration */}
        <div 
          id="admob-banner" 
          data-ad-unit-id="ca-app-pub-7476969524014751/9741948988"
          className="w-full h-16 flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              📱 AdMob Banner
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Ad Unit: ca-app-pub-7476969524014751/9741948988
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
