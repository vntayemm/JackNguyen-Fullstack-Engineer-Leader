import React, { useState, useRef, useEffect } from 'react';
import { apiService, DNSResponse } from '../services/api';
import RecordItemResult from '../components/RecordItemResult';

const recordTypeOptions = [
  { value: 'A', label: 'A (IPv4 Address)' },
  { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
  { value: 'MX', label: 'MX (Mail Exchange)' },
  { value: 'TXT', label: 'TXT (Text Record)' },
  { value: 'CNAME', label: 'CNAME (Canonical Name)' },
  { value: 'NS', label: 'NS (Name Server)' },
  { value: 'SOA', label: 'SOA (Start of Authority)' },
  { value: 'CAA', label: 'CAA (Certificate Authority Auth)' },
  { value: 'DMARC', label: 'DMARC (Email Auth)' },
  { value: 'DKIM', label: 'DKIM (Email Auth)' },
  { value: 'SPF', label: 'SPF (Sender Policy Framework)' },
];

const recordTypeLabel = (type: string) => {
  const found = recordTypeOptions.find(opt => opt.value === type);
  return found ? found.label : type;
};

interface HistoryItem {
  domain: string;
  recordType: string;
  result: DNSResponse;
  timestamp: number;
}

const DomainValidator: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [recordType, setRecordType] = useState('TXT');
  const [analyzingItem, setAnalyzingItem] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!domain.trim()) return;
    setLoading(true);
    try {
      const result = await apiService.analyzeDNSRecordWithoutSave(domain.trim(), recordType);
      const recordTypeResult = result.use_cases?.[recordType];
      const formattedResult: DNSResponse = {
        domain: result.domain || domain.trim(),
        record_type: recordType,
        records: recordTypeResult?.records || [],
        errors: recordTypeResult?.errors || []
      };
      setHistory(prev => {
        // Check if this (domain, recordType) already exists
        const idx = prev.findIndex(item => item.domain === domain.trim() && item.recordType === recordType);
        let newHistory;
        if (idx !== -1) {
          // Update the existing item and move it to the top
          newHistory = [
            { domain: domain.trim(), recordType, result: formattedResult, timestamp: Date.now() },
            ...prev.filter((_, i) => i !== idx)
          ];
        } else {
          // Prepend new item
          newHistory = [
            { domain: domain.trim(), recordType, result: formattedResult, timestamp: Date.now() },
            ...prev
          ];
        }
        // Sort by timestamp (most recent first)
        return newHistory.sort((a, b) => b.timestamp - a.timestamp);
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze record');
    } finally {
      setLoading(false);
    }
  };

  const handleReAnalyze = async (domain: string, recordType: string) => {
    setAnalyzingItem(`${domain}-${recordType}`);
    try {
      const result = await apiService.analyzeDNSRecordWithoutSave(domain, recordType);
      const recordTypeResult = result.use_cases?.[recordType];
      const formattedResult: DNSResponse = {
        domain: result.domain || domain,
        record_type: recordType,
        records: recordTypeResult?.records || [],
        errors: recordTypeResult?.errors || []
      };
      setHistory(prev => {
        // Only update the matching item in place, do not sort or add
        return prev.map(item =>
          item.domain === domain && item.recordType === recordType
            ? { ...item, result: formattedResult, timestamp: Date.now() }
            : item
        );
      });
    } catch (err: any) {
      setError('Failed to re-analyze record');
    } finally {
      setAnalyzingItem(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Domain Validator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Analyze DNS records for any domain without storing results
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <div className="md:w-64 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Record Type</label>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setDropdownOpen(v => !v)}
              >
                <span>{recordTypeLabel(recordType)}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
                  {recordTypeOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800 ${recordType === opt.value ? 'font-semibold bg-gray-800' : ''}`}
                      onClick={() => { setRecordType(opt.value); setDropdownOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors" 
            disabled={loading}
            title="Analyze DNS records for the specified domain and record type"
          >
            {loading ? 'Analyzing...' : 'Analyze DNS'}
          </button>
          {error && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>}
        </form>
      </div>

      {/* History List - Styled like Dashboard Modal */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis History</h2>
          {history.map((item, idx) => (
            <div key={item.timestamp} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.domain}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {item.recordType}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(item.timestamp)}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Record Type Details */}
                <div className="rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <RecordItemResult
                    recordType={item.recordType}
                    useCase={{
                      ...item.result,
                      Status: (item.result.records && item.result.records.length > 0) ? 'Valid' : 'Not present',
                      records: item.result.records,
                      errors: item.result.errors
                    }}
                    isTesting={analyzingItem === `${item.domain}-${item.recordType}`}
                    onAnalyze={() => handleReAnalyze(item.domain, item.recordType)}
                    testingRecordType={analyzingItem === `${item.domain}-${item.recordType}` ? item.recordType : null}
                    testingDomain={analyzingItem === `${item.domain}-${item.recordType}` ? item.domain : null}
                    currentDomain={item.domain}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Analyzing DNS records...</p>
          </div>
        </div>
      )}

      {/* Additional content to make page longer for testing scroll-to-top */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Domain Validation Guidelines</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Valid Domain Examples:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>example.com</li>
              <li>subdomain.example.com</li>
              <li>my-website.org</li>
              <li>company.co.uk</li>
              <li>test123.net</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Invalid Domain Examples:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>example..com (double dots)</li>
              <li>.example.com (starts with dot)</li>
              <li>example.com. (ends with dot)</li>
              <li>example-.com (ends with hyphen)</li>
              <li>-example.com (starts with hyphen)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Domain Naming Rules:</h3>
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Common Domain Extensions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.com</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Commercial</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.org</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Organization</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.net</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Network</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.edu</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Education</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.gov</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Government</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.mil</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Military</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.io</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Technology</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">.co</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Company</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why Domain Validation Matters</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
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