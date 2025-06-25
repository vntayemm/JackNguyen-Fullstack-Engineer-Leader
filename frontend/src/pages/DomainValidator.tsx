import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { apiService, DomainValidationResponse } from '../services/api';

const DomainValidator: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [submittedData, setSubmittedData] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<DomainValidationResponse>(
    ['validateDomain', submittedData],
    () => apiService.validateDomain(submittedData!),
    {
      enabled: !!submittedData,
      retry: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      setSubmittedData(domain.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold dark:text-white mb-2">Domain Validator</h1>
        <p className="dark:text-gray-300">
          Validate domain names and check their format
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium dark:text-gray-300 mb-2">
              Domain Name
            </label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Validate Domain
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 dark:text-gray-300">Validating domain...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6 border border-red-200 dark:border-red-800">
          <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">Error</h3>
          <p className="text-red-700 dark:text-red-300">Failed to validate domain. Please try again.</p>
        </div>
      )}

      {data && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white mb-4">Validation Results</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">Domain:</span>
              <span className="dark:text-gray-400">{data.domain}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">Status:</span>
              <span className={`font-semibold ${data.is_valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {data.is_valid ? 'Valid' : 'Invalid'}
              </span>
            </div>

            {data.errors && data.errors.length > 0 && (
              <div>
                <span className="font-medium block mb-2 dark:text-gray-300">Errors:</span>
                <ul className="list-disc list-inside space-y-1">
                  {data.errors.map((error, index) => (
                    <li key={index} className="text-red-600 dark:text-red-400">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.is_valid && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-800 dark:text-green-200">✅ Domain format is valid!</p>
                <p className="text-sm mt-1 text-green-700 dark:text-green-300">
                  This domain follows the standard domain naming conventions.
                </p>
              </div>
            )}

            {!data.is_valid && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <p className="font-semibold text-red-800 dark:text-red-200">❌ Invalid domain format</p>
                <p className="text-sm mt-1 text-red-700 dark:text-red-300">
                  The domain name format is not valid. Please check the spelling and format.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional content to make page longer for testing scroll-to-top */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Domain Validation Guidelines</h2>
        <div className="space-y-4 dark:text-gray-300">
          <div>
            <h3 className="font-medium dark:text-white mb-2">Valid Domain Examples:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>example.com</li>
              <li>subdomain.example.com</li>
              <li>my-website.org</li>
              <li>company.co.uk</li>
              <li>test123.net</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium dark:text-white mb-2">Invalid Domain Examples:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>example..com (double dots)</li>
              <li>.example.com (starts with dot)</li>
              <li>example.com. (ends with dot)</li>
              <li>example-.com (ends with hyphen)</li>
              <li>-example.com (starts with hyphen)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium dark:text-white mb-2">Domain Naming Rules:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Must be between 1 and 253 characters long</li>
              <li>Can contain letters (a-z, A-Z), numbers (0-9), and hyphens (-)</li>
              <li>Cannot start or end with a hyphen</li>
              <li>Cannot contain consecutive hyphens</li>
              <li>Each label (part between dots) must be 1-63 characters</li>
              <li>Must have at least one dot separating labels</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Common Domain Extensions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.com</div>
            <div className="text-sm dark:text-gray-300">Commercial</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.org</div>
            <div className="text-sm dark:text-gray-300">Organization</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.net</div>
            <div className="text-sm dark:text-gray-300">Network</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.edu</div>
            <div className="text-sm dark:text-gray-300">Education</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.gov</div>
            <div className="text-sm dark:text-gray-300">Government</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.mil</div>
            <div className="text-sm dark:text-gray-300">Military</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.io</div>
            <div className="text-sm dark:text-gray-300">Technology</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold dark:text-white">.co</div>
            <div className="text-sm dark:text-gray-300">Company</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Why Domain Validation Matters</h2>
        <div className="space-y-3 dark:text-gray-300">
          <p>
            Domain validation is crucial for ensuring that email addresses, websites, and other online services 
            function correctly. Invalid domain names can cause:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Email delivery failures</li>
            <li>Website accessibility issues</li>
            <li>DNS resolution problems</li>
            <li>Security vulnerabilities</li>
            <li>User experience degradation</li>
          </ul>
          <p>
            By validating domain names before use, you can prevent these issues and ensure a smooth 
            experience for your users and customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DomainValidator; 