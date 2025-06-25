import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { apiService, DMARCAnalysisResponse } from '../services/api';

const DMARCAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [dmarcRecord, setDmarcRecord] = useState('');
  const [submittedData, setSubmittedData] = useState<{ domain: string; dmarcRecord?: string } | null>(null);

  const { data, isLoading, error } = useQuery<DMARCAnalysisResponse>(
    ['analyzeDMARC', submittedData],
    () => apiService.analyzeDMARC(submittedData!.domain, submittedData!.dmarcRecord),
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
        dmarcRecord: dmarcRecord.trim() || undefined
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">DMARC Analyzer</h1>
        <p>
          Analyze DMARC policies and configurations
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
            <label htmlFor="dmarcRecord" className="block text-sm font-medium mb-2">
              DMARC Record (Optional)
            </label>
            <textarea
              id="dmarcRecord"
              value={dmarcRecord}
              onChange={(e) => setDmarcRecord(e.target.value)}
              placeholder="Enter DMARC record (e.g., v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com)"
              className="input-field"
              rows={3}
            />
            <p className="text-sm mt-1">
              Leave empty to automatically fetch from DNS
            </p>
          </div>
          
          <button type="submit" className="btn-primary">
            Analyze DMARC
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="card">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Analyzing DMARC record...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card error">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>Failed to analyze DMARC record. Please try again.</p>
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

            {data.dmarc_record && (
              <div>
                <span className="font-medium block mb-2">DMARC Record:</span>
                <code className="bg-gray-100 p-2 rounded text-sm block break-all">
                  {data.dmarc_record}
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
                <p className="font-semibold">✅ DMARC record is valid!</p>
                <p className="text-sm mt-1">
                  This DMARC record is properly formatted and should work for email authentication reporting.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DMARCAnalyzer; 