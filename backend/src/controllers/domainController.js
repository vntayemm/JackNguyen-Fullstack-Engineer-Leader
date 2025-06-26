import { 
  getUserDomains as getUserDomainsService,
  addDomain as addDomainService,
  deleteDomain as deleteDomainService,
  testDomain as testDomainService,
  getDomainDetails as getDomainDetailsService
} from '../services/domainService.js';
import { 
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO,
  DomainTestResponseDTO,
  DomainValidationResponseDTO,
  SPFAnalysisRequestDTO,
  SPFAnalysisResponseDTO,
  DMARCAnalysisRequestDTO,
  DMARCAnalysisResponseDTO,
  DNSResponseDTO
} from '../dto/index.js';
import { sendSuccessResponse } from '../dto/utils.js';
import { asyncHandler, AuthenticationError, ValidationError, NotFoundError } from '../middleware/errorHandler.js';

// Get all domains for user
export const getUserDomains = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const result = await getUserDomainsService(userId);
  const response = new DomainListResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Add new domain
export const addDomain = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addDomainData = new AddDomainRequestDTO(req.body);
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!addDomainData.isValid()) {
    throw new ValidationError('Invalid domain data', addDomainData.getErrors());
  }

  const result = await addDomainService(userId, addDomainData);
  const response = new DomainDTO(result);
  
  return sendSuccessResponse(res, response, 201);
});

// Get domain by ID
export const getDomainById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('Valid domain ID is required');
  }

  const result = await getDomainDetailsService(userId, parseInt(id));
  
  if (!result) {
    throw new NotFoundError('Domain not found');
  }
  
  const response = new DomainDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Delete domain
export const deleteDomain = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('Valid domain ID is required');
  }

  const result = await deleteDomainService(userId, parseInt(id));
  
  if (!result) {
    throw new NotFoundError('Domain not found');
  }
  
  return sendSuccessResponse(res, { message: 'Domain deleted successfully' });
});

// Test domain
export const testDomain = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('Valid domain ID is required');
  }

  const result = await testDomainService(userId, parseInt(id));
  
  if (!result) {
    throw new NotFoundError('Domain not found');
  }
  
  const response = new DomainTestResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Validate domain name
export const validateDomain = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  // Simple domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValid = domainRegex.test(domain) && domain.length <= 253;
  
  const result = {
    domain,
    is_valid: isValid,
    errors: isValid ? [] : ['Invalid domain format']
  };
  
  const response = new DomainValidationResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Analyze SPF record
export const analyzeSPF = asyncHandler(async (req, res) => {
  const spfData = new SPFAnalysisRequestDTO(req.body);
  
  if (!spfData.isValid()) {
    throw new ValidationError('Invalid SPF analysis data', spfData.getErrors());
  }

  // Import SPF analysis function
  const { analyzeSPF: analyzeSPFService } = await import('../services/nodejsDomainValidatorService.js');
  const result = await analyzeSPFService(spfData.domain, spfData.spf_record);
  const response = new SPFAnalysisResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Analyze DMARC record
export const analyzeDMARC = asyncHandler(async (req, res) => {
  const dmarcData = new DMARCAnalysisRequestDTO(req.body);
  
  if (!dmarcData.isValid()) {
    throw new ValidationError('Invalid DMARC analysis data', dmarcData.getErrors());
  }

  // Import DMARC analysis function
  const { comprehensiveDomainTest } = await import('../services/pythonDomainValidatorService.js');
  const result = await comprehensiveDomainTest(dmarcData.domain);
  const response = new DMARCAnalysisResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Get DNS records
export const getDNSRecords = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  const { record_type } = req.query;
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const { getDNSRecords: getDNSRecordsService } = await import('../services/nodejsDomainValidatorService.js');
  const result = await getDNSRecordsService(domain, record_type);
  const response = new DNSResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Get all DNS records
export const getAllDNSRecords = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const { getDNSRecords: getDNSRecordsService } = await import('../services/nodejsDomainValidatorService.js');
  const result = await getDNSRecordsService(domain);
  
  return sendSuccessResponse(res, result);
}); 