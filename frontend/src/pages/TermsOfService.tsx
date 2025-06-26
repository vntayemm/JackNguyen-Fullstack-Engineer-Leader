import React from "react";
import { Link } from "react-router-dom";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-between w-full mb-4">
              <img src="/assets/logo.png" alt="Logo" className="h-12 w-auto" />
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">DNS/Email Security Tool</p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using DNS/Email Security Tool, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Use License</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on DNS/Email Security Tool for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Disclaimer</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The materials on DNS/Email Security Tool are provided on an 'as is' basis. Amberos makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Limitations</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                In no event shall Amberos or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DNS/Email Security Tool.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Revisions and Errata</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The materials appearing on DNS/Email Security Tool could include technical, typographical, or photographic errors. Amberos does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Links</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Amberos has not reviewed all of the sites linked to DNS/Email Security Tool and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Amberos of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Site Terms of Use Modifications</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Amberos may revise these terms of use for DNS/Email Security Tool at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Any claim relating to DNS/Email Security Tool shall be governed by the laws of the State of California without regard to its conflict of law provisions.
              </p>
            </section>
          </div>
          
          {/* Bottom Back to Login Button */}
          <div className="mt-12 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              ← Back to Login
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Amberos. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 