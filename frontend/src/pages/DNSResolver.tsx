import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { apiService, DNSResponse } from '../services/api';

const DNSResolver: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('TXT');
  const [submittedData, setSubmittedData] = useState<{ domain: string; recordType: string } | null>(null);

  const { data, isLoading, error } = useQuery<DNSResponse>(
    ['resolveDNS', submittedData],
    () => apiService.resolveDNS(submittedData!.domain, submittedData!.recordType),
    {
      enabled: !!submittedData,
      retry: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      setSubmittedData({
        domain: domain.trim(),
        recordType
      });
    }
  };

  const recordTypes = [
    { value: 'A', label: 'A (IPv4 Address)' },
    { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
    { value: 'CNAME', label: 'CNAME (Canonical Name)' },
    { value: 'MX', label: 'MX (Mail Exchange)' },
    { value: 'TXT', label: 'TXT (Text Record)' },
    { value: 'NS', label: 'NS (Name Server)' },
    { value: 'SOA', label: 'SOA (Start of Authority)' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold dark:text-white mb-2">DNS Resolver</h1>
        <p className="dark:text-gray-300">
          Resolve DNS records for any domain
        </p>
      </div>

      <div className="card">
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
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label htmlFor="recordType" className="block text-sm font-medium dark:text-gray-300 mb-2">
              Record Type
            </label>
            <select
              id="recordType"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="input-field"
            >
              {recordTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn-primary">
            Resolve DNS
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="card">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 dark:text-gray-300">Resolving DNS records...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card error">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>Failed to resolve DNS records. Please try again.</p>
        </div>
      )}

      {data && (
        <div className="card">
          <h2 className="text-xl font-semibold dark:text-white mb-4">DNS Resolution Results</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">Domain:</span>
              <span className="dark:text-gray-400">{data.domain}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">Record Type:</span>
              <span className="dark:text-gray-400">{data.record_type}</span>
            </div>

            {data.records.length > 0 ? (
              <div>
                <span className="font-medium block mb-2 dark:text-gray-300">Records:</span>
                <div className="space-y-2">
                  {data.records.map((record, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium dark:text-gray-200">Record {index + 1}:</span>
                        {record.ttl && (
                          <span className="text-xs dark:text-gray-400">TTL: {record.ttl}s</span>
                        )}
                      </div>
                      <code className="text-sm break-all dark:text-gray-100">{record.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-center py-4">No {data.record_type} records found for this domain.</p>
              </div>
            )}

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
          </div>
        </div>
      )}
    </div>
  );
};

export default DNSResolver; 