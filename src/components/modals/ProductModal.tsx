import React from 'react';
import { X, Star, Zap, Calendar } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'features' | 'updates';
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'features':
        return {
          title: 'Features',
          icon: <Star className="w-8 h-8 text-yellow-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Core Features</h3>
                <p className="text-yellow-700 dark:text-yellow-300">Discover all the powerful features that make CadoltAI your ultimate productivity companion.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      Calendar & Events
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Smart event scheduling</li>
                      <li>• Recurring events</li>
                      <li>• Custom reminders</li>
                      <li>• Color-coded categories</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Task Management</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Priority levels</li>
                      <li>• Due date tracking</li>
                      <li>• Progress monitoring</li>
                      <li>• Completion analytics</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Secure Vault</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• PIN-protected storage</li>
                      <li>• Password management</li>
                      <li>• File encryption</li>
                      <li>• Secure notes</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">AI Assistant</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Natural language queries</li>
                      <li>• Smart suggestions</li>
                      <li>• Task automation</li>
                      <li>• Content generation</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Focus Timer</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Pomodoro technique</li>
                      <li>• Custom intervals</li>
                      <li>• Break reminders</li>
                      <li>• Productivity tracking</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Smart Alarms</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Multiple alarm types</li>
                      <li>• Custom sounds</li>
                      <li>• Snooze options</li>
                      <li>• Weekly scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Additional Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>• Dark/Light theme</span>
                  <span>• Export/Import data</span>
                  <span>• Offline access</span>
                  <span>• Cross-platform sync</span>
                  <span>• Custom categories</span>
                  <span>• Search functionality</span>
                  <span>• Keyboard shortcuts</span>
                  <span>• Mobile responsive</span>
                </div>
              </div>
            </div>
          )
        };
      case 'updates':
        return {
          title: 'Latest Updates',
          icon: <Zap className="w-8 h-8 text-orange-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Recent Updates</h3>
                <p className="text-orange-700 dark:text-orange-300">Stay up to date with the latest features and improvements to CadoltAI.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Version 2.1.0</h4>
                    <span className="text-sm text-gray-500">January 15, 2025</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>✨ <strong>New:</strong> Enhanced AI assistant with better context understanding</li>
                    <li>🔒 <strong>Security:</strong> Improved vault encryption with biometric support</li>
                    <li>🎨 <strong>UI:</strong> Redesigned dashboard with better dark mode</li>
                    <li>⚡ <strong>Performance:</strong> 40% faster load times</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Version 2.0.5</h4>
                    <span className="text-sm text-gray-500">January 8, 2025</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>🐛 <strong>Fixed:</strong> Calendar event sync issues</li>
                    <li>📱 <strong>Mobile:</strong> Improved touch gestures</li>
                    <li>🔔 <strong>Notifications:</strong> Better reminder accuracy</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Version 2.0.0</h4>
                    <span className="text-sm text-gray-500">December 20, 2024</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>🚀 <strong>Major:</strong> Complete UI redesign</li>
                    <li>🤖 <strong>AI:</strong> Integrated ChatGPT-powered assistant</li>
                    <li>📊 <strong>Analytics:</strong> Productivity insights dashboard</li>
                    <li>🔄 <strong>Sync:</strong> Real-time collaboration features</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Coming Soon</h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>🔮 Advanced AI workflow automation</li>
                  <li>👥 Team collaboration spaces</li>
                  <li>📈 Advanced analytics and reporting</li>
                  <li>🔗 Third-party app integrations</li>
                  <li>🌐 Multi-language support</li>
                </ul>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Want to be notified about new updates? 
                  <span className="text-blue-500 hover:text-blue-600 cursor-pointer ml-1">
                    Subscribe to our newsletter
                  </span>
                </p>
              </div>
            </div>
          )
        };
      default:
        return { title: '', icon: null, content: null };
    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-gray-700 dark:text-gray-300">
          {content}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};