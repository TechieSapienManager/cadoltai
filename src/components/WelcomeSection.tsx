
import React from 'react';
import { Clock, CheckCircle, Calendar, FileText } from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color} group-hover:scale-110 transition-transform duration-300`}>{value}</p>
        </div>
        <div className={`${color.replace('text-', 'text-')} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const WelcomeSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 mx-6 rounded-3xl p-8 mb-8 animate-fade-in shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Side - Welcome Text */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Welcome back! <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>👋</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your AI-powered productivity companion is ready. Let's make today count.
          </p>
        </div>

        {/* Right Side - Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Today's Focus"
              value="2h 45m"
              icon={<Clock className="w-6 h-6" />}
              color="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <StatCard
              title="Tasks Done"
              value="8/12"
              icon={<CheckCircle className="w-6 h-6" />}
              color="text-green-600 dark:text-green-400"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <StatCard
              title="Upcoming"
              value="3"
              icon={<Calendar className="w-6 h-6" />}
              color="text-orange-600 dark:text-orange-400"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <StatCard
              title="Notes"
              value="24"
              icon={<FileText className="w-6 h-6" />}
              color="text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
