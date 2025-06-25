import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { apiService, SPFAnalysisResponse } from '../services/api';

const SPFAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [spfRecord, setSpfRecord] = useState('');
  const [submittedData, setSubmittedData] = useState<{ domain: string; spfRecord?: string } | null>(null);

  const { data, isLoading, error } = useQuery<SPFAnalysisResponse>(
    ['analyzeSPF', submittedData],
    () => apiService.analyzeSPF(submittedData!.domain, submittedData!.spfRecord),
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
        spfRecord: spfRecord.trim() || undefined
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">SPF Analyzer</h1>
        <p>
          Parse and validate SPF records for email authentication
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-2">
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
            <label htmlFor="spfRecord" className="block text-sm font-medium mb-2">
              SPF Record (Optional)
            </label>
            <textarea
              id="spfRecord"
              value={spfRecord}
              onChange={(e) => setSpfRecord(e.target.value)}
              placeholder="Enter SPF record (e.g., v=spf1 include:_spf.google.com ~all)"
              className="input-field"
              rows={3}
            />
            <p className="text-sm mt-1">
              Leave empty to automatically fetch from DNS
            </p>
          </div>
          
          <button type="submit" className="btn-primary">
            Analyze SPF
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="card">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Analyzing SPF record...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card error">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>Failed to analyze SPF record. Please try again.</p>
        </div>
      )}

      {data && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Domain:</span>
              <span>{data.domain}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <span className={`font-semibold ${data.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                {data.is_valid ? 'Valid' : 'Invalid'}
              </span>
            </div>

            {data.spf_record && (
              <div>
                <span className="font-medium block mb-2">SPF Record:</span>
                <code className="bg-gray-100 p-2 rounded text-sm block break-all">
                  {data.spf_record}
                </code>
              </div>
            )}

            {data.warnings.length > 0 && (
              <div>
                <span className="font-medium block mb-2">Warnings:</span>
                <ul className="list-disc list-inside space-y-1">
                  {data.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-600">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.errors.length > 0 && (
              <div>
                <span className="font-medium block mb-2">Errors:</span>
                <ul className="list-disc list-inside space-y-1">
                  {data.errors.map((error, index) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.is_valid && (
              <div className="success">
                <p className="font-semibold">✅ SPF record is valid!</p>
                <p className="text-sm mt-1">
                  This SPF record is properly formatted and should work for email authentication.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SPFAnalyzer; 