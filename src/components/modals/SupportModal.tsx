import React from 'react';
import { X, HelpCircle, Book, Users } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'help' | 'docs' | 'community';
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'help':
        return {
          title: 'Help Center',
          icon: <HelpCircle className="w-8 h-8 text-blue-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Help</h3>
                <p className="text-blue-700 dark:text-blue-300">Need immediate assistance? Here are some quick solutions to common issues.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Getting Started</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Create your account and set up your profile</li>
                    <li>• Explore the dashboard and available features</li>
                    <li>• Set up notifications for events and reminders</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Common Issues</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Can't log in?</strong> Try resetting your password</li>
                    <li>• <strong>Notifications not working?</strong> Check your browser permissions</li>
                    <li>• <strong>Data not syncing?</strong> Refresh the page or check your connection</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Contact Support</h4>
                  <p className="text-sm">Still need help? Reach out to our support team:</p>
                  <ul className="space-y-1 text-sm mt-2">
                    <li>• Email: support@cadolt.ai</li>
                    <li>• Alt email: techiesapienmanager@gmail.com</li>
                    <li>• Response time: Within 24 hours</li>
                    <li>• Live chat: Available 9 AM - 6 PM EST</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        };
      case 'docs':
        return {
          title: 'Documentation',
          icon: <Book className="w-8 h-8 text-green-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Complete Documentation</h3>
                <p className="text-green-700 dark:text-green-300">Comprehensive guides and API references for developers and users.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">User Guides</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Dashboard Overview</li>
                    <li>• Calendar Management</li>
                    <li>• Note Taking</li>
                    <li>• Task Management</li>
                    <li>• Vault Security</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Advanced Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• AI Assistant Integration</li>
                    <li>• Focus Timer</li>
                    <li>• Alarm Settings</li>
                    <li>• Data Export/Import</li>
                    <li>• Custom Themes</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">API Documentation</h4>
                <p className="text-sm">For developers looking to integrate with CadoltAI:</p>
                <ul className="space-y-1 text-sm mt-2">
                  <li>• REST API endpoints</li>
                  <li>• Authentication methods</li>
                  <li>• Webhook configurations</li>
                  <li>• Rate limiting information</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'community':
        return {
          title: 'Community',
          icon: <Users className="w-8 h-8 text-purple-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Join Our Community</h3>
                <p className="text-purple-700 dark:text-purple-300">Connect with other users, share tips, and get help from the community.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Discord Server</h4>
                  <p className="text-sm mb-2">Join our active Discord community for real-time discussions and support.</p>
                  <ul className="space-y-1 text-sm">
                    <li>• General discussions</li>
                    <li>• Feature requests</li>
                    <li>• Bug reports</li>
                    <li>• Tips and tricks</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Community Forums</h4>
                  <p className="text-sm mb-2">Participate in detailed discussions and find answers to common questions.</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Q&A section</li>
                    <li>• Feature discussions</li>
                    <li>• User showcases</li>
                    <li>• Feedback and suggestions</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Social Media</h4>
                  <p className="text-sm mb-2">Follow us for updates and community highlights.</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Twitter: @CadoltAI</li>
                    <li>• LinkedIn: CadoltAI</li>
                    <li>• YouTube: CadoltAI Channel</li>
                  </ul>
                </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl mx-4 max-h-[80vh] overflow-y-auto">
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