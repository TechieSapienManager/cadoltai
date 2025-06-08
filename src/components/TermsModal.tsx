
import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = type === 'terms' ? {
    title: 'Terms of Service',
    content: `
**Last Updated: ${new Date().toLocaleDateString()}**

## 1. Acceptance of Terms
By accessing and using this application ("SmartAssist"), you accept and agree to be bound by the terms and provision of this agreement.

## 2. Description of Service
SmartAssist is a productivity application that provides:
- Calendar and event management
- Task and to-do list organization
- Secure note storage and file vault
- Focus timer and productivity tools
- AI-powered assistance features

## 3. User Accounts and Registration
- You must provide accurate and complete information when creating an account
- You are responsible for maintaining the confidentiality of your account credentials
- You agree to notify us immediately of any unauthorized use of your account

## 4. Acceptable Use Policy
You agree not to:
- Use the service for any unlawful purpose or in violation of any applicable laws
- Upload malicious content, viruses, or harmful code
- Attempt to gain unauthorized access to other user accounts or data
- Reverse engineer, modify, or create derivative works of the application

## 5. Privacy and Data Protection
- We collect and process personal data as outlined in our Privacy Policy
- Your data is encrypted and stored securely
- We do not sell or share your personal information with third parties without consent

## 6. Subscription and Payments
- Subscription fees are charged in advance on a recurring basis
- All fees are non-refundable except as required by law
- We reserve the right to change subscription prices with 30 days notice

## 7. Content and Intellectual Property
- You retain ownership of content you upload to the service
- You grant us a license to use your content solely to provide the service
- All application code, design, and features are our intellectual property

## 8. Service Availability
- We strive to maintain 99.9% uptime but do not guarantee uninterrupted service
- We may perform maintenance that temporarily interrupts service
- We are not liable for data loss due to service interruptions

## 9. Limitation of Liability
- Our liability is limited to the amount you paid for the service
- We are not liable for indirect, incidental, or consequential damages
- Some jurisdictions do not allow limitation of liability

## 10. Termination
- Either party may terminate the agreement at any time
- We may suspend or terminate accounts that violate these terms
- Upon termination, your right to use the service ceases immediately

## 11. Changes to Terms
- We may modify these terms at any time
- Changes will be posted with an updated "Last Updated" date
- Continued use after changes constitutes acceptance of new terms

## 12. Governing Law
These terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.

## 13. Contact Information
For questions about these terms, please contact us at support@smartassist.com
    `
  } : {
    title: 'Privacy Policy',
    content: `
**Last Updated: ${new Date().toLocaleDateString()}**

## 1. Information We Collect

### Personal Information
- Name and email address (when you create an account)
- Phone number (if provided for SMS notifications)
- Profile picture (if uploaded)

### Usage Data
- Application features used and frequency of use
- Device information (browser type, operating system)
- Log data (IP address, access times, pages viewed)

### User Content
- Calendar events and task data
- Notes and files stored in the vault
- Custom preferences and settings

## 2. How We Use Your Information

We use collected information to:
- Provide and maintain our services
- Send notifications and reminders
- Improve and personalize user experience
- Communicate important updates and changes
- Provide customer support

## 3. Data Storage and Security

### Security Measures
- All data is encrypted in transit using TLS 1.3
- Sensitive data is encrypted at rest using AES-256
- Vault content is protected with user-defined PINs
- Regular security audits and vulnerability assessments

### Data Location
- Data is stored on secure servers provided by Supabase
- Servers are located in [Your Region] with regular backups
- All data centers meet SOC 2 Type II compliance standards

## 4. Data Sharing and Disclosure

We do not sell, trade, or rent your personal information. We may share data only in these circumstances:
- With your explicit consent
- To comply with legal obligations or court orders
- To protect our rights and prevent fraud
- With service providers who assist in operations (under strict confidentiality)

## 5. Your Privacy Rights

You have the right to:
- Access your personal data
- Correct inaccurate information
- Delete your account and associated data
- Export your data in a portable format
- Opt-out of non-essential communications

## 6. Cookies and Tracking

We use essential cookies to:
- Maintain your logged-in session
- Remember your preferences and settings
- Analyze usage patterns to improve the service

You can disable cookies in your browser, but this may affect functionality.

## 7. Third-Party Services

Our application integrates with:
- **Supabase**: Database and authentication services
- **Razorpay**: Payment processing (PCI DSS compliant)
- **Email Service**: For notifications and communications

Each service has its own privacy policy governing data handling.

## 8. Data Retention

We retain your data:
- Account information: Until account deletion
- Usage logs: 90 days for security and analytics
- Backup data: 30 days after account deletion
- Financial records: 7 years as required by law

## 9. Children's Privacy

Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover such data, we will delete it immediately.

## 10. International Data Transfers

If you access our service from outside [Your Country], your data may be transferred internationally. We ensure adequate protection through:
- Standard contractual clauses
- Adequacy decisions where applicable
- Appropriate safeguards for data protection

## 11. Privacy Policy Changes

We may update this policy to reflect:
- Changes in our practices
- Legal or regulatory requirements
- New features or services

We will notify you of significant changes via email or in-app notification.

## 12. Contact Us

For privacy-related questions or requests:
- Email: privacy@smartassist.com
- Address: [Your Company Address]
- Data Protection Officer: dpo@smartassist.com

## 13. Complaint Resolution

If you believe we have not complied with this privacy policy, you may:
- Contact us directly at the above email
- File a complaint with your local data protection authority
- Seek resolution through applicable dispute resolution mechanisms
    `
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{content.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose dark:prose-invert max-w-none">
            {content.content.split('\n').map((line, index) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{line.slice(2, -2)}</h3>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{line.slice(4)}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="mb-3">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
