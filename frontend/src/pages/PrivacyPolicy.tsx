import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8 px-2 md:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="flex items-center justify-between w-full mb-4">
              <img src="/assets/logo.png" alt="Logo" className="h-8 md:h-12 w-auto" />
              <button 
                onClick={() => window.history.back()}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm md:text-base"
              >
                ← Back
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">DNS/Email Security Tool</p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We collect information you provide directly to us, such as when you create an account, use DNS/Email Security Tool, or contact us for support. This may include your name, email address, domain information, and other contact details.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We use the information we collect to provide, maintain, and improve DNS/Email Security Tool, to communicate with you, and to develop new features and services.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy or as required by law.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">4. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We use cookies and similar tracking technologies to enhance your experience on DNS/Email Security Tool and to analyze how our services are used.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">6. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                You have the right to access, update, or delete your personal information. You may also have the right to restrict or object to certain processing of your information.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on DNS/Email Security Tool and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">8. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                If you have any questions about this privacy policy, please contact us at privacy@amberos.com.
              </p>
            </section>
          </div>
          
          {/* Bottom Back to Login Button */}
          <div className="mt-8 md:mt-12 text-center">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm md:text-base"
            >
              ← Back
            </button>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Amberos. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 