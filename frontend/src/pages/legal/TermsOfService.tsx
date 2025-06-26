import React from "react";

const TermsOfService: React.FC = () => {
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">DNS/Email Security Tool</p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                By accessing and using DNS/Email Security Tool, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">2. Use License</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Permission is granted to temporarily download one copy of the materials (information or software) on DNS/Email Security Tool for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">3. Disclaimer</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                The materials on DNS/Email Security Tool are provided on an 'as is' basis. Amberos makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">4. Limitations</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                In no event shall Amberos or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DNS/Email Security Tool.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">5. Revisions and Errata</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                The materials appearing on DNS/Email Security Tool could include technical, typographical, or photographic errors. Amberos does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">6. Links</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Amberos has not reviewed all of the sites linked to DNS/Email Security Tool and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Amberos of the site.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">7. Site Terms of Use Modifications</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Amberos may revise these terms of use for DNS/Email Security Tool at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </section>

            <section className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Any claim relating to DNS/Email Security Tool shall be governed by the laws of the State of California without regard to its conflict of law provisions.
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

export default TermsOfService; 