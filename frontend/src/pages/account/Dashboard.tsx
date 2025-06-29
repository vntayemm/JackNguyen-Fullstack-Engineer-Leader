import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Domain } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RecordItemResult from '../../components/RecordItemResult';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testingDomain, setTestingDomain] = useState<string | null>(null);
  const [testingRecordType, setTestingRecordType] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [explainModal, setExplainModal] = useState<{ show: boolean; status: string; recordType: string }>({
    show: false,
    status: '',
    recordType: ''
  });
  
  // Refs for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Add state for collapsing the entire domain group
  const [domainsCollapsed, setDomainsCollapsed] = useState(false);

  // Add state for three-dot menu
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Add state for analysis results
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});

  // Cleanup function for timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const showSuccessMessage = useCallback((message: string) => {
    setSuccess(message);
    const timeout = setTimeout(() => setSuccess(''), 3000);
    timeoutRefs.current.push(timeout);
  }, []);

  // Handle individual DNS record testing
  useEffect(() => {
    if (testingDomain && testingRecordType) {
      const testIndividualRecord = async () => {
        try {
          const result = await apiService.analyzeIndividualDNSRecord(testingDomain, testingRecordType);
          
          // The backend returns the complete domain analysis data, not just the individual record
          // So we need to update the domain's use_cases with the new data
          setDomains(prevDomains => 
            prevDomains.map(domain => {
              if (domain.domain_name === testingDomain) {
                return {
                  ...domain,
                  use_cases: {
                    ...domain.use_cases,
                    ...result.use_cases
                  },
                  dns_provider: result.dns_provider || domain.dns_provider,
                  hosting_provider: result.hosting_provider || domain.hosting_provider,
                  dns_record_published: result.dns_record_published,
                  dmarc_record_published: result.dmarc_record_published,
                  spf_record_published: result.spf_record_published,
                  status: result.status
                };
              }
              return domain;
            })
          );
          
          showSuccessMessage(`${testingRecordType} analysis completed!`);
        } catch (err: any) {
          setError(`Failed to analyze ${testingRecordType} record: ${err.response?.data?.error || err.message}`);
        } finally {
          setTestingDomain(null);
          setTestingRecordType(null);
        }
      };
      
      testIndividualRecord();
    }
  }, [testingDomain, testingRecordType, showSuccessMessage]);

  // Handle comprehensive domain testing (when testingDomain is set but testingRecordType is null)
  useEffect(() => {
    if (testingDomain && !testingRecordType) {
      const testComprehensiveDomain = async () => {
        try {
          // Use the backend's comprehensive analysis endpoint (no record_type parameter)
          const result = await apiService.analyzeIndividualDNSRecord(testingDomain);
          
          // Update the domain with the complete analysis results
          setDomains(prevDomains => 
            prevDomains.map(domain => {
              if (domain.domain_name === testingDomain) {
                return {
                  ...domain,
                  use_cases: {
                    ...domain.use_cases,
                    ...result.use_cases
                  },
                  dns_provider: result.dns_provider || domain.dns_provider,
                  hosting_provider: result.hosting_provider || domain.hosting_provider,
                  dns_record_published: result.dns_record_published,
                  dmarc_record_published: result.dmarc_record_published,
                  spf_record_published: result.spf_record_published,
                  status: result.status
                };
              }
              return domain;
            })
          );
          
          showSuccessMessage('Comprehensive domain analysis completed!');
        } catch (err: any) {
          setError(`Failed to analyze domain: ${err.response?.data?.error || err.message}`);
        } finally {
          setTestingDomain(null);
        }
      };
      
      testComprehensiveDomain();
    }
  }, [testingDomain, testingRecordType, showSuccessMessage]);

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await apiService.getDomains();
      
      // Handle both array and object with domains property
      let domainsArray: Domain[] = [];
      if (Array.isArray(response)) {
        domainsArray = response;
      } else if (response && response.domains && Array.isArray(response.domains)) {
        domainsArray = response.domains;
      } else if (response && response.data && Array.isArray(response.data)) {
        domainsArray = response.data;
      }
      
      setDomains(domainsArray);
    } catch (err: any) {
      setError('Failed to load domains');
      console.error('Fetch domains error:', err);
      setDomains([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleAddDomain = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      setError('Domain name is required');
      return;
    }

    try {
      setAddingDomain(true);
      setError('');
      const domain = await apiService.addDomain({ domainName: newDomain.trim() });
      
      // Ensure the domain_name is set properly
      const domainWithName = {
        ...domain,
        domain_name: domain.domain_name || newDomain.trim()
      };
      
      console.log('Added domain response:', domain);
      console.log('Domain with ensured name:', domainWithName);
      
      setDomains(prevDomains => [domainWithName, ...prevDomains]);
      setNewDomain('');
      showSuccessMessage('Domain added successfully!');
      
      // Refresh domains list to ensure we have complete data
      setTimeout(() => {
        fetchDomains();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add domain');
    } finally {
      setAddingDomain(false);
    }
  }, [newDomain, showSuccessMessage, fetchDomains]);

  const handleDeleteDomain = useCallback(async (domainName: string) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) {
      return;
    }

    try {
      await apiService.deleteDomain(domainName);
      setDomains(prevDomains => prevDomains.filter(d => d.domain_name !== domainName));
      showSuccessMessage('Domain deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete domain');
    }
  }, [showSuccessMessage]);

  const toggleExpanded = useCallback((domainName: string) => {
    setExpandedDomains(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(domainName)) {
        newExpanded.delete(domainName);
      } else {
        newExpanded.add(domainName);
      }
      return newExpanded;
    });
  }, []);

  // Status explanations
  const statusExplanations = {
    'Valid': {
      title: 'Valid Status',
      description: 'This DNS record is properly configured and functioning correctly. The record exists and is responding as expected.',
      icon: '✅',
      color: 'text-green-600'
    },
    'Not present': {
      title: 'Not Present Status',
      description: 'This DNS record type is not configured for this domain. While not always required, it may be recommended for security or functionality.',
      icon: '⚠️',
      color: 'text-yellow-600'
    },
    'Error': {
      title: 'Error Status',
      description: 'There was an issue retrieving or processing this DNS record. This could indicate a configuration problem or network issue.',
      icon: '❌',
      color: 'text-red-600'
    }
  };

  const showExplainModal = (status: string, recordType: string) => {
    setExplainModal({ show: true, status, recordType });
  };

  const closeExplainModal = () => {
    setExplainModal({ show: false, status: '', recordType: '' });
  };

  const toggleMenu = (domainName: string) => {
    setMenuOpen(menuOpen === domainName ? null : domainName);
  };

  const closeMenu = () => {
    setMenuOpen(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest('.menu-container')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const collapseAll = () => {
    setExpandedDomains(new Set());
  };

  const hasAnyExpanded = expandedDomains.size > 0;

  // DNS Record Type Descriptions
  const getRecordTypeDescription = (recordType: string): string => {
    const descriptions: Record<string, string> = {
      'A': 'Maps domain to IPv4 address',
      'AAAA': 'Maps domain to IPv6 address',
      'CNAME': 'Creates alias for domain name',
      'MX': 'Specifies mail server for domain',
      'NS': 'Nameserver records for domain',
      'SOA': 'Start of Authority record',
      'CAA': 'Certificate Authority Authorization',
      'TXT': 'Text records for various purposes',
      'SPF': 'Sender Policy Framework for email',
      'DMARC': 'Domain-based Message Authentication',
      'DKIM': 'DomainKeys Identified Mail'
    };
    return descriptions[recordType] || 'DNS record type';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Domain Dashboard
        </h1>
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
            title="Enter a domain name to add it to your dashboard for DNS analysis"
          />
          <button
            type="submit"
            disabled={addingDomain || !newDomain.trim()}
            className="px-4 md:px-6 py-2 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            title="Add the domain to your dashboard and start analyzing its DNS records"
          >
            {addingDomain ? 'Adding...' : 'Add Domain'}
          </button>
        </form>
      </div>

      {/* Domain List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Your Domains ({domains.length})
          </h2>
          <button
            onClick={() => setDomainsCollapsed((prev) => !prev)}
            className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label={domainsCollapsed ? 'Expand domain list' : 'Collapse domain list'}
            title={domainsCollapsed ? 'Expand domain list' : 'Collapse domain list'}
          >
            {domainsCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            )}
          </button>
          </div>
        
        {!domainsCollapsed && (
          <div>
          {domains.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
              <p className="text-base md:text-lg mb-2">No domains added yet</p>
              <p className="text-sm md:text-base">Add a domain above to start testing</p>
            </div>
          ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {domains.map((domain, index) => (
                  <div
                    key={domain.domain_name}
                    className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center space-x-0 sm:space-x-3">
                            <div className="flex-shrink-0 hidden sm:block">
                              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                                  {domain.domain_name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                      </div>
                    </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                  {domain.domain_name || 'Unknown Domain'}
                                </h3>
                                {/* Circle Badge - Always shown */}
                                <span
                                  className="inline-flex items-center justify-center rounded-full bg-blue-500"
                                  style={{ width: '16px', height: '16px' }}
                                  title="Domain status indicator"
                                >
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                
                                {/* Explain More Label - Near domain name */}
                                <button
                                  onClick={() => toggleExpanded(domain.domain_name || '')}
                                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline ml-2"
                                  title="View detailed analysis results and DNS record information"
                                >
                                  {expandedDomains.has(domain.domain_name || '') ? 'Hide Details' : 'Explain More'}
                                </button>
                                
                                {/* Three-dot Menu */}
                                <div className="relative menu-container ml-2">
                      <button
                                    onClick={() => toggleMenu(domain.domain_name || '')}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    aria-label="More options"
                                    title="More actions for this domain"
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                      </button>
                                  
                                  {menuOpen === (domain.domain_name || '') && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                      <div className="py-1">
                      <button
                                          onClick={() => {
                                            handleDeleteDomain(domain.domain_name || '');
                                            closeMenu();
                                          }}
                                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                          title="Remove this domain from your dashboard"
                                        >
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                        Delete
                      </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Timestamp */}
                              {domain.createdAt && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  Added: {new Date(domain.createdAt).toLocaleString()}
                                </div>
                              )}
                    </div>
                  </div>

                          {/* Analyze Button - Hidden on mobile, shown on sm and up */}
                          <div className="hidden sm:flex items-center space-x-2 mt-0">
                            <button
                              onClick={() => {
                                setTestingDomain(domain.domain_name);
                                setTestingRecordType(null);
                              }}
                              disabled={testingDomain === (domain.domain_name || '')}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Run comprehensive DNS analysis for all record types"
                            >
                              {testingDomain === (domain.domain_name || '') ? (
                          <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Analyzing...
                                </div>
                              ) : (
                                'Analyze'
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Analyze Button - Shown only on mobile (xs) */}
                        <div className="flex sm:hidden items-center mt-3">
                          <button
                            onClick={() => {
                              setTestingDomain(domain.domain_name);
                              setTestingRecordType(null);
                            }}
                            disabled={testingDomain === (domain.domain_name || '')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Run comprehensive DNS analysis for all record types"
                          >
                            {testingDomain === (domain.domain_name || '') ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                              </div>
                            ) : (
                              'Analyze'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DNS Record Type Pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(() => {
                        const recordTypes = [
                          { key: 'A', label: 'A', icon: '🌐' },
                          { key: 'AAAA', label: 'AAAA', icon: '🔗' },
                          { key: 'CNAME', label: 'CNAME', icon: '🔗' },
                          { key: 'MX', label: 'MX', icon: '📧' },
                          { key: 'NS', label: 'NS', icon: '🌍' },
                          { key: 'SOA', label: 'SOA', icon: '⚙️' },
                          { key: 'CAA', label: 'CAA', icon: '🔒' },
                          { key: 'TXT', label: 'TXT', icon: '📝' },
                          { key: 'SPF', label: 'SPF', icon: '🛡️' },
                          { key: 'DMARC', label: 'DMARC', icon: '🛡️' },
                          { key: 'DKIM', label: 'DKIM', icon: '🔐' }
                        ];

                        return recordTypes.map(({ key, label, icon }) => {
                          // Use the domain's use_cases directly since individual testing updates the domain
                          const useCase = domain.use_cases?.[key];
                          const hasRecords = useCase && useCase.Status === 'Valid' && useCase.records && useCase.records.length > 0;
                          
                        return (
                            <button
                              key={key}
                              onClick={(e) => {
                                setTestingDomain(domain.domain_name);
                                setTestingRecordType(key);
                              }}
                              disabled={testingDomain === (domain.domain_name || '') && testingRecordType === key}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative ${
                                hasRecords
                                  ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800'
                                  : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                              title={`Test ${label} records - ${getRecordTypeDescription(key)}`}
                            >
                              <span className="mr-1">{icon}</span>
                              <span className="mr-2">{label}</span>
                              {hasRecords ? (
                                <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className={`w-3 h-3 ${testingDomain === domain.domain_name && testingRecordType === key ? 'animate-spin text-blue-500 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                  {testingDomain === domain.domain_name && testingRecordType === key ? (
                                    // Spinning refresh icon when testing
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                  ) : useCase ? (
                                    // X icon for failed/invalid records
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  ) : (
                                    // Minus icon for missing/not tested records
                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  )}
                                </svg>
                              )}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Expanded Details Panel as Modal */}
                    {expandedDomains.has(domain.domain_name || '') && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] relative flex flex-col">
                          {/* Fixed Header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Analysis Results – {domain.domain_name || 'Unknown Domain'}</h4>
                            <button
                              onClick={() => toggleExpanded(domain.domain_name || '')}
                              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
                              aria-label="Close"
                              title="Close detailed view"
                            >
                              ×
                            </button>
                          </div>
                          {/* Scrollable Content */}
                          <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
                            {/* DNS Provider & Hosting Info */}
                            {(domain.dns_provider || domain.hosting_provider) && (
                              <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Provider Information</h5>
                                <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                  {domain.dns_provider && (
                                    <div><span className="font-medium text-gray-900 dark:text-white">DNS Provider:</span> <span>{domain.dns_provider}</span></div>
                                  )}
                                  {domain.hosting_provider && (
                                    <div><span className="font-medium text-gray-900 dark:text-white">Hosting Provider:</span> <span>{domain.hosting_provider}</span></div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Record Type Details */}
                            {(() => {
                              // Use domain use_cases directly since individual testing updates the domain
                              const recordTypesArray = Object.keys(domain.use_cases || {}).filter(recordType => 
                                recordType !== 'createdAt' && recordType !== 'updatedAt'
                              );
                              
                              if (recordTypesArray.length === 0) {
                                return (
                                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    <p className="text-sm">No analysis data available</p>
                                    <p className="text-xs mt-1">Click "Analyze" to run comprehensive DNS analysis</p>
                                  </div>
                                );
                              }
                              
                              return (
                                <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
                                  {recordTypesArray.map((recordType) => {
                                    // Use the domain's use_cases directly
                                    const useCase = domain.use_cases?.[recordType];
                                    
                                    return (
                                      <div key={recordType} className="p-3">
                                        <RecordItemResult
                                          recordType={recordType}
                                          useCase={useCase}
                                          isTesting={true}
                                          onAnalyze={(recordType) => {
                                            setTestingDomain(domain.domain_name);
                                            setTestingRecordType(recordType);
                                          }}
                                          testingRecordType={testingRecordType}
                                          testingDomain={testingDomain}
                                          currentDomain={domain.domain_name}
                                        />
                                      </div>
                                    );
                                  })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>

      {/* Status Explanation Modal */}
      {explainModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{statusExplanations[explainModal.status as keyof typeof statusExplanations]?.icon || '❓'}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {statusExplanations[explainModal.status as keyof typeof statusExplanations]?.title || 'Status Information'}
                </h3>
              </div>
              <button
                onClick={closeExplainModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {statusExplanations[explainModal.status as keyof typeof statusExplanations]?.description || 
               `This ${explainModal.recordType} record has a status of "${explainModal.status}".`}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeExplainModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 