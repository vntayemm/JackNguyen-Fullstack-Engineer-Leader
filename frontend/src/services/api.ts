import axios, { AxiosInstance, AxiosResponse } from 'axios';
import config from '../config';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// TypeScript interfaces for API responses
export interface DomainValidationResponse {
  domain: string;
  is_valid: boolean;
  errors: string[];
}

export interface SPFAnalysisResponse {
  domain: string;
  is_valid: boolean;
  spf_record?: string;
  parsed_record?: any;
  warnings: string[];
  errors: string[];
}

export interface DMARCAnalysisResponse {
  domain: string;
  is_valid: boolean;
  dmarc_record?: string;
  parsed_record?: any;
  warnings: string[];
  errors: string[];
}

export interface DNSRecord {
  value: string;
  ttl?: number;
}

export interface DNSResponse {
  domain: string;
  record_type: string;
  records: DNSRecord[];
  errors: string[];
}

// API Service class using axios
class ApiService {
  private api: AxiosInstance;

  constructor(apiInstance: AxiosInstance) {
    this.api = apiInstance;
  }

  // Domain validation - GET /api/domains/validate/{domain}
  async validateDomain(domain: string): Promise<DomainValidationResponse> {
    const response = await this.api.get<DomainValidationResponse>(`/api/domains/validate/${domain}`);
    return response.data;
  }

  // SPF analysis - POST /api/spf/analyze
  async analyzeSPF(domain: string, spfRecord?: string): Promise<SPFAnalysisResponse> {
    const body: any = { domain };
    if (spfRecord) {
      body.spf_record = spfRecord;
    }
    
    const response = await this.api.post<SPFAnalysisResponse>('/api/spf/analyze', body);
    return response.data;
  }

  // DMARC analysis - POST /api/dmarc/analyze
  async analyzeDMARC(domain: string, dmarcRecord?: string): Promise<DMARCAnalysisResponse> {
    const body: any = { domain };
    if (dmarcRecord) {
      body.dmarc_record = dmarcRecord;
    }
    
    const response = await this.api.post<DMARCAnalysisResponse>('/api/dmarc/analyze', body);
    return response.data;
  }

  // DNS resolution - GET /api/dns/records/{domain}?record_type={type}
  async resolveDNS(domain: string, recordType: string): Promise<DNSResponse> {
    const response = await this.api.get<DNSResponse>(`/api/dns/records/${domain}`, {
      params: { record_type: recordType },
    });
    return response.data;
  }

  // Health check - GET /health
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  }

  // Get all DNS records for a domain - GET /api/dns/records/{domain}/all
  async getAllDNSRecords(domain: string): Promise<any> {
    const response = await this.api.get(`/api/dns/records/${domain}/all`);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService(api);

// Export axios instance for direct use if needed
export default api; 