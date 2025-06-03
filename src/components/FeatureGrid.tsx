
import React from 'react';
import { Calendar, FileText, CheckCircle, Clock, Shield, Clock as AlarmClock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  bgColor,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md hover:scale-102 transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`${bgColor} rounded-lg p-2.5 flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
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
      icon: <Calendar className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500",
      key: "calendar"
    },
    {
      title: "Smart Notes",
      description: "Create unlimited notes with rich formatting and templates",
      icon: <FileText className="w-5 h-5 text-white" />,
      bgColor: "bg-green-500",
      key: "notes"
    },
    {
      title: "AI To-Do Lists",
      description: "Smart task management with insights and productivity reports",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      bgColor: "bg-orange-500",
      key: "todo"
    },
    {
      title: "Focus Mode+",
      description: "Distraction-free environment with focus music and custom timers",
      icon: <Clock className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500",
      key: "focus"
    },
    {
      title: "Advanced Vault",
      description: "Secure password vault with biometric lock and cloud backup",
      icon: <Shield className="w-5 h-5 text-white" />,
      bgColor: "bg-gray-700",
      key: "vault"
    },
    {
      title: "Smart Alarms",
      description: "Set custom alarms with various ringtones and smart scheduling",
      icon: <AlarmClock className="w-5 h-5 text-white" />,
      bgColor: "bg-purple-500",
      key: "alarms"
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.key}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            bgColor={feature.bgColor}
            onClick={() => onFeatureClick(feature.key)}
          />
        ))}
      </div>
    </div>
  );
};
