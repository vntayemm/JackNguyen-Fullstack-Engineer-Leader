import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Domain } from '../services/api';

const Dashboard: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testingDomain, setTestingDomain] = useState<number | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDomains();
      setDomains(response);
    } catch (err: any) {
      setError('Failed to load domains');
      console.error('Fetch domains error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      setError('Domain name is required');
      return;
    }

    try {
      setAddingDomain(true);
      setError('');
      const domain = await apiService.addDomain({ domainName: newDomain.trim() });
      setDomains([domain, ...domains]);
      setNewDomain('');
      setSuccess('Domain added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add domain');
    } finally {
      setAddingDomain(false);
    }
  };

  const handleDeleteDomain = async (domainId: number) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) {
      return;
    }

    try {
      await apiService.deleteDomain(domainId);
      setDomains(domains.filter(d => d.id !== domainId));
      setSuccess('Domain deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete domain');
    }
  };

  const handleTestDomain = async (domainId: number) => {
    try {
      setTestingDomain(domainId);
      const updatedDomain = await apiService.testDomain(domainId);
      setDomains(domains.map(d => d.id === domainId ? updatedDomain : d));
      setSuccess('Domain test completed!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to test domain');
    } finally {
      setTestingDomain(null);
    }
  };

  const getTestStatus = (domain: Domain) => {
    if (!domain.lastTested) return 'Not tested';
    return 'Tested';
  };

  const getTestResult = (result: any, testType: string) => {
    if (!result) return { status: 'Not tested', color: 'gray' };
    if (result.error) return { status: 'Error', color: 'red' };
    
    switch (testType) {
      case 'spf':
        return result.is_valid 
          ? { status: 'Pass', color: 'green' }
          : { status: 'Fail', color: 'red' };
      case 'dmarc':
        return result.is_valid 
          ? { status: 'Pass', color: 'green' }
          : { status: 'Fail', color: 'red' };
      case 'dns':
        return result.records && result.records.length > 0
          ? { status: 'Pass', color: 'green' }
          : { status: 'Fail', color: 'red' };
      default:
        return { status: 'Unknown', color: 'gray' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Domain Dashboard
        </h1>
        <Link
          to="/domain-validator"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center text-sm md:text-base"
        >
          Quick Test
        </Link>
      </div>

      {error && (
        <div className="p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm md:text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 md:p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm md:text-base">
          {success}
        </div>
      )}

      {/* Add New Domain */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Add New Domain
        </h2>
        <form onSubmit={handleAddDomain} className="flex flex-col md:flex-row gap-3 md:gap-4">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Enter domain name (e.g., example.com)"
            className="flex-1 px-3 md:px-4 py-2 md:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base"
            disabled={addingDomain}
          />
          <button
            type="submit"
            disabled={addingDomain || !newDomain.trim()}
            className="px-4 md:px-6 py-2 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {addingDomain ? 'Adding...' : 'Add Domain'}
          </button>
        </form>
      </div>

      {/* Domain List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Your Domains ({domains.length})
        </h2>
        
        {domains.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
            <p className="text-base md:text-lg mb-2">No domains added yet</p>
            <p className="text-sm md:text-base">Add a domain above to start testing</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {domain.domainName}
                    </h3>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Added: {new Date(domain.createdAt).toLocaleDateString()}</p>
                      {domain.lastTested && (
                        <p>Last tested: {new Date(domain.lastTested).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestDomain(domain.id)}
                      disabled={testingDomain === domain.id}
                      className="px-3 py-2 md:py-1 bg-green-600 text-white text-xs md:text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {testingDomain === domain.id ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="px-3 py-2 md:py-1 bg-red-600 text-white text-xs md:text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Test Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                  {/* SPF Result */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 md:p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">SPF</h4>
                    {(() => {
                      const result = getTestResult(domain.spfResult, 'spf');
                      return (
                        <div className="flex items-center">
                          <span className={`inline-block w-2 md:w-3 h-2 md:h-3 rounded-full mr-2 bg-${result.color}-500`}></span>
                          <span className="text-xs md:text-sm">{result.status}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* DMARC Result */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 md:p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">DMARC</h4>
                    {(() => {
                      const result = getTestResult(domain.dmarcResult, 'dmarc');
                      return (
                        <div className="flex items-center">
                          <span className={`inline-block w-2 md:w-3 h-2 md:h-3 rounded-full mr-2 bg-${result.color}-500`}></span>
                          <span className="text-xs md:text-sm">{result.status}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* DNS Result */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 md:p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base">DNS (MX)</h4>
                    {(() => {
                      const result = getTestResult(domain.dnsResult, 'dns');
                      return (
                        <div className="flex items-center">
                          <span className={`inline-block w-2 md:w-3 h-2 md:h-3 rounded-full mr-2 bg-${result.color}-500`}></span>
                          <span className="text-xs md:text-sm">{result.status}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Tools */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Quick Access Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link
            to="/domain-validator"
            className="p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-center"
          >
            <div className="text-xl md:text-2xl mb-1 md:mb-2">🌐</div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Domain Validator</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Validate domain names</p>
          </Link>
          <Link
            to="/spf"
            className="p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-center"
          >
            <div className="text-xl md:text-2xl mb-1 md:mb-2">📧</div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">SPF Analyzer</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Analyze SPF records</p>
          </Link>
          <Link
            to="/dmarc"
            className="p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-center"
          >
            <div className="text-xl md:text-2xl mb-1 md:mb-2">🛡️</div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">DMARC Analyzer</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Analyze DMARC policies</p>
          </Link>
          <Link
            to="/dns"
            className="p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-center"
          >
            <div className="text-xl md:text-2xl mb-1 md:mb-2">🔍</div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">DNS Resolver</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Query DNS records</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 