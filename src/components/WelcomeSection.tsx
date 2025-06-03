
import React from 'react';
import { Clock, CheckCircle, Calendar, FileText } from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-102 transition-transform duration-100 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${color.replace('text-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const WelcomeSection: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-gray-800 mx-4 rounded-b-2xl p-6 mb-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side - Welcome Text */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI-powered productivity companion is ready. Let's make today count.
          </p>
        </div>

        {/* Right Side - Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard
            title="Today's Focus"
            value="2h 45m"
            icon={<Clock className="w-5 h-5" />}
            color="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Tasks Done"
            value="8/12"
            icon={<CheckCircle className="w-5 h-5" />}
            color="text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Upcoming"
            value="3"
            icon={<Calendar className="w-5 h-5" />}
            color="text-orange-600 dark:text-orange-400"
          />
          <StatCard
            title="Notes"
            value="24"
            icon={<FileText className="w-5 h-5" />}
            color="text-purple-600 dark:text-purple-400"
          />
        </div>
      </div>
    </div>
  );
};
