import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'cookies';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4">
              <p>Last updated: January 2025</p>
              <h3 className="font-semibold">Information We Collect</h3>
              <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
              
              <h3 className="font-semibold">How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              
              <h3 className="font-semibold">Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h3 className="font-semibold">Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information. You may also object to certain processing of your data.</p>
              
              <h3 className="font-semibold">Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@cadolt.ai</p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <div className="space-y-4">
              <p>Last updated: January 2025</p>
              <h3 className="font-semibold">Acceptance of Terms</h3>
              <p>By accessing and using CadoltAI, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h3 className="font-semibold">Use License</h3>
              <p>Permission is granted to temporarily use CadoltAI for personal, non-commercial transitory viewing only.</p>
              
              <h3 className="font-semibold">User Account</h3>
              <p>When you create an account, you must provide information that is accurate and complete. You are responsible for safeguarding your account.</p>
              
              <h3 className="font-semibold">Prohibited Uses</h3>
              <p>You may not use our service for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws.</p>
              
              <h3 className="font-semibold">Termination</h3>
              <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.</p>
              
              <h3 className="font-semibold">Contact Information</h3>
              <p>Questions about the Terms of Service should be sent to us at legal@cadolt.ai</p>
            </div>
          )
        };
      case 'cookies':
        return {
          title: 'Cookie Policy',
          content: (
            <div className="space-y-4">
              <p>Last updated: January 2025</p>
              <h3 className="font-semibold">What Are Cookies</h3>
              <p>Cookies are small text files that are placed on your computer by websites that you visit. They are widely used to make websites work more efficiently.</p>
              
              <h3 className="font-semibold">How We Use Cookies</h3>
              <p>We use cookies to enhance your experience, remember your preferences, and analyze how our website is used.</p>
              
              <h3 className="font-semibold">Types of Cookies We Use</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
              
              <h3 className="font-semibold">Managing Cookies</h3>
              <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and set most browsers to prevent them from being placed.</p>
              
              <h3 className="font-semibold">Contact Us</h3>
              <p>If you have any questions about our use of cookies, please contact us at privacy@cadolt.ai</p>
            </div>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
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