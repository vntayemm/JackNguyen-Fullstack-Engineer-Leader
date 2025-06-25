import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const features = [
    {
      title: 'Domain Validator',
      description: 'Validate domain names and check their format',
      path: '/domain-validator',
      icon: '🌐',
    },
    {
      title: 'SPF Analyzer',
      description: 'Parse and validate SPF records for email authentication',
      path: '/spf-analyzer',
      icon: '📧',
    },
    {
      title: 'DMARC Analyzer',
      description: 'Analyze DMARC policies and configurations',
      path: '/dmarc-analyzer',
      icon: '🛡️',
    },
    {
      title: 'DNS Lookup',
      description: 'Query and display various DNS record types',
      path: '/dns-lookup',
      icon: '🔍',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DNS/Email Security Testing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive tools for testing and validating DNS records, SPF, and DMARC configurations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tool</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            This application provides comprehensive testing and validation tools for DNS records,
            SPF (Sender Policy Framework), and DMARC (Domain-based Message Authentication,
            Reporting & Conformance) configurations.
          </p>
          <p>
            Use these tools to ensure your email infrastructure is properly configured and secure
            against spoofing and phishing attacks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 