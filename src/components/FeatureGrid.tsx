import React from 'react';
import { Calendar, FileText, CheckCircle, Target, Shield, Clock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  bgColor,
  onClick,
  delay = 0
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 group animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start space-x-4">
        <div className={`${bgColor} rounded-2xl p-4 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureGridProps {
  onFeatureClick: (feature: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onFeatureClick }) => {
  const features = [
    {
      title: "Advanced Calendar",
      description: "Manage your schedule with drag-and-drop, weather integration, and smart suggestions",
      icon: <Calendar className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      key: "calendar"
    },
    {
      title: "Smart Notes",
      description: "Create unlimited notes with rich formatting and templates",
      icon: <FileText className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      key: "notes"
    },
    {
      title: "AI To-Do Lists",
      description: "Smart task management with insights and productivity reports",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      key: "todo"
    },
    {
      title: "Focus Mode+",
      description: "Distraction-free environment with focus music and custom timers",
      icon: <Target className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      key: "focus"
    },
    {
      title: "Advanced Vault",
      description: "Secure password vault with biometric lock and cloud backup",
      icon: <Shield className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-gray-700 to-gray-800",
      key: "vault"
    },
    {
      title: "Smart Alarms",
      description: "Set custom alarms with various ringtones and smart scheduling",
      icon: <Clock className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      key: "alarms"
    }
  ];

  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.key}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            bgColor={feature.bgColor}
            onClick={() => onFeatureClick(feature.key)}
            delay={0.7 + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};
