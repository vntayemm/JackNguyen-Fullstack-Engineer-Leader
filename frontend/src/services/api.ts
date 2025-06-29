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
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    
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

// TypeScript interfaces for API responses - Updated to match swagger.json

// Domain Analysis Interfaces
export interface DomainValidationResponse {
  domain: string;
  is_valid: boolean;
  errors: string[];
}

export interface SPFAnalysisRequest {
  domain: string;
  spf_record?: string;
}

export interface SPFAnalysisResponse {
  domain: string;
  is_valid: boolean;
  spf_record?: string;
  parsed_record?: any;
  warnings: string[];
  errors: string[];
}

export interface DMARCAnalysisRequest {
  domain: string;
  dmarc_record?: string;
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

// Auth Interfaces
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface DeleteAccountResponse {
  message: string;
}

// Domain Management Interfaces
export interface Domain {
  domain_name: string;
  dns_provider?: string;
  hosting_provider?: string;
  dns_record_published?: boolean;
  dmarc_record_published?: boolean;
  spf_record_published?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  use_cases?: Record<string, any>;
}

export interface AddDomainRequest {
  domainName: string;
}

export interface DomainListResponse {
  domains: Domain[];
  count: number;
}

export interface DomainTestResponse {
  domain: Domain;
  message: string;
}

// API Service class using axios - Updated to match swagger.json endpoints
class ApiService {
  private api: AxiosInstance;

  constructor(apiInstance: AxiosInstance) {
    this.api = apiInstance;
  }

  // ===== DOMAIN ANALYSIS ENDPOINTS =====

  // Individual DNS analysis - GET /api/domains/dns/records/{domain}/individual?record_type={type}
  async analyzeIndividualDNSRecord(domain: string, recordType?: string): Promise<any> {
    const params = recordType ? { record_type: recordType } : {};
    const response = await this.api.get(`/api/domains/dns/records/${domain}/individual`, { params });
    return response.data;
  }

  // Individual DNS analysis without saving to database - GET /api/domains/dns/records/{domain}/individual?record_type={type}&no_save=true
  async analyzeDNSRecordWithoutSave(domain: string, recordType?: string): Promise<any> {
    const params: any = { no_save: 'true' };
    if (recordType) {
      params.record_type = recordType;
    }
    const response = await this.api.get(`/api/domains/dns/records/${domain}/individual`, { params });
    return response.data;
  }

  // ===== AUTHENTICATION ENDPOINTS =====

  // Register - POST /api/auth/register
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.api.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  }

  // Login - POST /api/auth/login
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  }

  // Forgot Password - POST /api/auth/forgot-password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await this.api.post<ForgotPasswordResponse>('/api/auth/forgot-password', data);
    return response.data;
  }

  // Reset Password - POST /api/auth/reset-password/{token}
  async resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
    const response = await this.api.post<ResetPasswordResponse>(`/api/auth/reset-password/${token}`, {
      password
    });
    return response.data;
  }

  // Verify Email - GET /api/auth/verify-email/{token}
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await this.api.get<VerifyEmailResponse>(`/api/auth/verify-email/${token}`);
    return response.data;
  }

  // ===== USER MANAGEMENT ENDPOINTS =====

  // Get Profile - GET /api/user/profile
  async getProfile(): Promise<UserProfile> {
    try {
      console.log('Making getProfile request to:', `${this.api.defaults.baseURL}/api/user/profile`);
      const response = await this.api.get<UserProfile>('/api/user/profile');
      console.log('getProfile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('getProfile error:', error);
      console.error('getProfile error response:', error.response?.data);
      console.error('getProfile error status:', error.response?.status);
      throw error;
    }
  }

  // Update Profile - PUT /api/user/profile
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await this.api.put<UserProfile>('/api/user/profile', data);
    return response.data;
  }

  // Change Password - PUT /api/user/change-password
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await this.api.put<ChangePasswordResponse>('/api/user/change-password', data);
    return response.data;
  }

  // Delete Account - DELETE /api/user/delete-account
  async deleteAccount(): Promise<DeleteAccountResponse> {
    const response = await this.api.delete<DeleteAccountResponse>('/api/user/delete-account');
    return response.data;
  }

  // ===== DOMAIN MANAGEMENT ENDPOINTS =====

  // Get user domains - GET /api/domains
  async getDomains(): Promise<Domain[]> {
    const response = await this.api.get<DomainListResponse>('/api/domains');
    return response.data.domains;
  }

  // Add domain - POST /api/domains
  async addDomain(data: AddDomainRequest): Promise<Domain> {
    const response = await this.api.post<Domain>('/api/domains', data);
    return response.data;
  }

  // Delete domain - DELETE /api/domains/:domain
  async deleteDomain(domain: string): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(`/api/domains/${domain}`);
    return response.data;
  }

  // ===== SYSTEM ENDPOINTS =====

  // Health check - GET /health
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService(api);
