import React from 'react';
import { X, Building, Briefcase, Mail } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'careers' | 'contact';
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About CadoltAI',
          icon: <Building className="w-8 h-8 text-blue-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Our Mission</h3>
                <p className="text-blue-700 dark:text-blue-300">To empower individuals and teams with AI-driven productivity tools that make work and life more organized, efficient, and meaningful.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Our Story</h4>
                  <p className="text-sm leading-relaxed">
                    Founded in 2024, CadoltAI emerged from a simple observation: people were juggling multiple apps to manage their daily tasks, 
                    calendars, notes, and secure information. We believed there had to be a better way—a unified platform that brings 
                    everything together with the power of artificial intelligence.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What We Do</h4>
                  <p className="text-sm leading-relaxed">
                    CadoltAI is more than just a productivity app. It's an intelligent workspace that learns from your habits, 
                    anticipates your needs, and helps you stay focused on what matters most. From smart scheduling to secure 
                    storage, we provide tools that adapt to your workflow.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500 mb-1">50K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-500 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500 mb-1">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Our Values</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-sm">Privacy First:</strong>
                      <p className="text-sm">Your data belongs to you. We use end-to-end encryption and never sell your information.</p>
                    </div>
                    <div>
                      <strong className="text-sm">Innovation:</strong>
                      <p className="text-sm">We continuously evolve our platform with cutting-edge AI and user feedback.</p>
                    </div>
                    <div>
                      <strong className="text-sm">Simplicity:</strong>
                      <p className="text-sm">Complex technology should feel simple. We design for intuitive, effortless experiences.</p>
                    </div>
                    <div>
                      <strong className="text-sm">Community:</strong>
                      <p className="text-sm">We build with our users, for our users, creating tools that truly make a difference.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      case 'careers':
        return {
          title: 'Careers',
          icon: <Briefcase className="w-8 h-8 text-green-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Join Our Team</h3>
                <p className="text-green-700 dark:text-green-300">Be part of a mission to revolutionize productivity with AI. We're looking for passionate individuals who want to make a real impact.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Why Work at CadoltAI?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li>🚀 <strong>Innovation:</strong> Work on cutting-edge AI technology</li>
                      <li>💼 <strong>Growth:</strong> Accelerate your career with mentorship</li>
                      <li>🌍 <strong>Remote-first:</strong> Work from anywhere in the world</li>
                      <li>⚖️ <strong>Work-life balance:</strong> Flexible hours and unlimited PTO</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>💰 <strong>Competitive pay:</strong> Above-market compensation</li>
                      <li>🏥 <strong>Benefits:</strong> Health, dental, vision coverage</li>
                      <li>📚 <strong>Learning:</strong> $2,000 annual learning budget</li>
                      <li>🎯 <strong>Impact:</strong> Your work affects thousands of users</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Open Positions</h4>
                  <div className="space-y-3">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">Senior Full-Stack Engineer</h5>
                        <span className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Remote</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Build scalable features for our AI-powered productivity platform. React, Node.js, TypeScript experience required.
                      </p>
                      <div className="text-xs text-gray-500">Posted 2 days ago</div>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">AI/ML Engineer</h5>
                        <span className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Remote</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Develop and optimize AI models for productivity insights. Python, TensorFlow, NLP experience preferred.
                      </p>
                      <div className="text-xs text-gray-500">Posted 1 week ago</div>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">Product Designer</h5>
                        <span className="text-sm text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Hybrid</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Shape the user experience of our platform. Figma, user research, and design systems experience required.
                      </p>
                      <div className="text-xs text-gray-500">Posted 3 days ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Don't see the right role?</h4>
                  <p className="text-sm mb-3">We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute!</p>
                  <button className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Send Resume
                  </button>
                </div>
              </div>
            </div>
          )
        };
      case 'contact':
        return {
          title: 'Contact Us',
          icon: <Mail className="w-8 h-8 text-purple-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Get In Touch</h3>
                <p className="text-purple-700 dark:text-purple-300">We'd love to hear from you. Choose the best way to reach our team.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-500" />
                      General Inquiries
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      For general questions about CadoltAI
                    </p>
                    <a href="mailto:hello@cadolt.ai" className="text-blue-500 hover:text-blue-600 text-sm">
                      hello@cadolt.ai
                    </a>
                    <div className="text-xs text-gray-500 mt-1">Response time: 24-48 hours</div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Technical support and troubleshooting
                    </p>
                    <a href="mailto:support@cadolt.ai" className="text-blue-500 hover:text-blue-600 text-sm">
                      support@cadolt.ai
                    </a>
                    <div className="text-xs text-gray-500 mt-1">Response time: Within 24 hours</div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Business & Partnerships</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enterprise solutions and partnerships
                    </p>
                    <a href="mailto:business@cadolt.ai" className="text-blue-500 hover:text-blue-600 text-sm">
                      business@cadolt.ai
                    </a>
                    <div className="text-xs text-gray-500 mt-1">Response time: 2-3 business days</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Office Hours</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span>10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Live Chat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Get instant help during business hours
                    </p>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm">
                      Start Live Chat
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Social Media</h4>
                    <div className="space-y-2 text-sm">
                      <div>Twitter: <a href="#" className="text-blue-500 hover:text-blue-600">@CadoltAI</a></div>
                      <div>LinkedIn: <a href="#" className="text-blue-500 hover:text-blue-600">CadoltAI</a></div>
                      <div>Discord: <a href="#" className="text-blue-500 hover:text-blue-600">CadoltAI Community</a></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Emergency Contact</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  For critical security issues or data breaches, contact us immediately at: 
                  <a href="mailto:security@cadolt.ai" className="font-medium ml-1">security@cadolt.ai</a>
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