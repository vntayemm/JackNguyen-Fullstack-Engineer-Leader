import React, { useState, useEffect } from 'react';
import { apiService, Domain } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  BarController,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  BarController
);

const DNSCharts: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const domainsArray = await apiService.getDomains();
      setDomains(domainsArray);
    } catch (err) {
      setError('Failed to load domains');
      console.error('Fetch domains error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation functions
  const getDNSOverviewData = () => {
    const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS'];
    const data = recordTypes.map(type => {
      return domains.filter(domain => {
        const useCases = domain.use_cases || {};
        return useCases[type] && useCases[type].records && useCases[type].records.length > 0;
      }).length;
    });
    
    return {
      labels: recordTypes,
      datasets: [{
        label: 'Domains with Records',
        data: data,
        backgroundColor: recordTypes.map(type => getColorForRecordType(type)) as string[],
        borderColor: recordTypes.map(type => getColorForRecordType(type)) as string[],
        borderWidth: 1,
        borderRadius: 4,
      }]
    };
  };

  const getEmailSecurityData = () => {
    const spfCount = domains.filter(d => d.spf_record_published).length;
    const dmarcCount = domains.filter(d => d.dmarc_record_published).length;
    const bothCount = domains.filter(d => d.spf_record_published && d.dmarc_record_published).length;
    const noneCount = domains.filter(d => !d.spf_record_published && !d.dmarc_record_published).length;

    return {
      labels: ['SPF Only', 'DMARC Only', 'Both SPF & DMARC', 'No Email Security'],
      datasets: [{
        data: [
          spfCount - bothCount, // SPF only
          dmarcCount - bothCount, // DMARC only
          bothCount, // Both
          noneCount // None
        ],
        backgroundColor: [
          '#3B82F6', // Blue for SPF
          '#10B981', // Green for DMARC
          '#8B5CF6', // Purple for both
          '#EF4444'  // Red for none
        ] as string[],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      }]
    };
  };

  const getDNSProvidersData = () => {
    const providerCounts: { [key: string]: number } = {};
    const hostingCounts: { [key: string]: number } = {};

    domains.forEach(domain => {
      if (domain.dns_provider) {
        providerCounts[domain.dns_provider] = (providerCounts[domain.dns_provider] || 0) + 1;
      }
      if (domain.hosting_provider) {
        hostingCounts[domain.hosting_provider] = (hostingCounts[domain.hosting_provider] || 0) + 1;
      }
    });

    const dnsProviders = Object.entries(providerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5 DNS providers

    const hostingProviders = Object.entries(hostingCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5 hosting providers

    return {
      dnsProviders: {
        labels: dnsProviders.map(([provider]) => provider),
        datasets: [{
          label: 'DNS Providers',
          data: dnsProviders.map(([, count]) => count),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      hostingProviders: {
        labels: hostingProviders.map(([provider]) => provider),
        datasets: [{
          label: 'Hosting Providers',
          data: hostingProviders.map(([, count]) => count),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 4,
        }]
      }
    };
  };

  const getDomainStatusData = () => {
    const statusCounts: { [key: string]: number } = {};
    
    domains.forEach(domain => {
      const status = domain.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Domain Status',
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => getColorForStatus(status)) as string[],
        borderColor: Object.keys(statusCounts).map(status => getColorForStatus(status)) as string[],
        borderWidth: 1,
        borderRadius: 4,
      }]
    };
  };

  const getRecordTypeDistributionData = () => {
    const recordTypeCounts: { [key: string]: number } = {};
    
    domains.forEach(domain => {
      const useCases = domain.use_cases || {};
      Object.keys(useCases).forEach(recordType => {
        if (useCases[recordType] && useCases[recordType].records) {
          recordTypeCounts[recordType] = (recordTypeCounts[recordType] || 0) + useCases[recordType].records.length;
        }
      });
    });

    return {
      labels: Object.keys(recordTypeCounts),
      datasets: [{
        label: 'Record Count',
        data: Object.values(recordTypeCounts),
        backgroundColor: Object.keys(recordTypeCounts).map(type => getColorForRecordType(type)) as string[],
        borderColor: Object.keys(recordTypeCounts).map(type => getColorForRecordType(type)) as string[],
        borderWidth: 1,
        borderRadius: 4,
      }]
    };
  };

  // Helper functions for colors
  const getColorForRecordType = (type: string): string => {
    const colors: { [key: string]: string } = {
      'A': '#3B82F6',      // Blue
      'AAAA': '#1D4ED8',   // Dark Blue
      'MX': '#10B981',     // Green
      'TXT': '#F59E0B',    // Yellow
      'CNAME': '#8B5CF6',  // Purple
      'NS': '#EF4444',     // Red
      'PTR': '#06B6D4',    // Cyan
      'SRV': '#84CC16'     // Lime
    };
    return colors[type] || '#6B7280'; // Gray as default
  };

  const getColorForStatus = (status: string): string => {
    const colors: { [key: string]: string } = {
      'active': '#10B981',     // Green
      'pending': '#F59E0B',    // Yellow
      'error': '#EF4444',      // Red
      'inactive': '#6B7280',   // Gray
      'Unknown': '#9CA3AF'     // Light Gray
    };
    return colors[status] || '#6B7280';
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const totalDomains = domains.length;
    const domainsWithAnalysis = domains.filter(d => d.use_cases && Object.keys(d.use_cases).length > 0).length;
    const domainsWithSPF = domains.filter(d => d.spf_record_published).length;
    const domainsWithDMARC = domains.filter(d => d.dmarc_record_published).length;
    const domainsWithBoth = domains.filter(d => d.spf_record_published && d.dmarc_record_published).length;
    const domainsWithDNSProvider = domains.filter(d => d.dns_provider).length;
    const domainsWithHostingProvider = domains.filter(d => d.hosting_provider).length;

    return {
      totalDomains,
      domainsWithAnalysis,
      domainsWithSPF,
      domainsWithDMARC,
      domainsWithBoth,
      domainsWithDNSProvider,
      domainsWithHostingProvider,
      analysisPercentage: totalDomains > 0 ? Math.round((domainsWithAnalysis / totalDomains) * 100) : 0,
      spfPercentage: totalDomains > 0 ? Math.round((domainsWithSPF / totalDomains) * 100) : 0,
      dmarcPercentage: totalDomains > 0 ? Math.round((domainsWithDMARC / totalDomains) * 100) : 0
    };
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        },
        grid: {
          color: '#E5E7EB',
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        },
        grid: {
          color: '#E5E7EB',
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const stats = getSummaryStats();
  const dnsOverviewData = getDNSOverviewData();
  const emailSecurityData = getEmailSecurityData();
  const providersData = getDNSProvidersData();
  const statusData = getDomainStatusData();
  const recordDistributionData = getRecordTypeDistributionData();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DNS Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Visual insights into your DNS and email security configuration
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Domains</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDomains}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Analysis</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.domainsWithAnalysis}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">({stats.analysisPercentage}%)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Security</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.domainsWithBoth}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SPF + DMARC</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">DNS Providers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.domainsWithDNSProvider}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Configured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DNS Overview Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">DNS Record Overview</h3>
          <div className="h-64">
            <Bar data={dnsOverviewData} options={barChartOptions} />
          </div>
        </div>

        {/* Email Security Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Email Security Status</h3>
          <div className="h-64">
            <Doughnut data={emailSecurityData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* DNS Providers Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top DNS Providers</h3>
          {providersData.dnsProviders.labels.length > 0 ? (
            <div className="h-64">
              <Bar data={providersData.dnsProviders} options={barChartOptions} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No DNS provider data available</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Hosting Providers</h3>
          {providersData.hostingProviders.labels.length > 0 ? (
            <div className="h-64">
              <Bar data={providersData.hostingProviders} options={barChartOptions} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hosting provider data available</p>
          )}
        </div>
      </div>

      {/* Domain Status and Record Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Domain Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={statusData} options={doughnutChartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Record Type Distribution</h3>
          {recordDistributionData.labels.length > 0 ? (
            <div className="h-64">
              <Bar data={recordDistributionData} options={barChartOptions} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No record data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DNSCharts;
