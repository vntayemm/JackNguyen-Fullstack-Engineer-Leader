import domainService from '../services/domainService.js';
// import nodejsDomainValidatorService from '../services/nodejsDomainValidatorService.js';
import pythonDomainValidatorService from '../services/pythonDomainValidatorService.js';
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

  const result = await domainService.getUserDomains(userId);
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

  const result = await domainService.addDomain(userId, addDomainData);
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

  const result = await domainService.getDomainDetails(userId, parseInt(id));
  
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

  const result = await domainService.deleteDomain(userId, parseInt(id));
  
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

  const result = await domainService.testDomain(userId, parseInt(id));
  
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

  const result = await pythonDomainValidatorService.validateDomain(domain);
  const response = new DomainValidationResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Analyze SPF record
export const analyzeSPF = asyncHandler(async (req, res) => {
  const spfData = new SPFAnalysisRequestDTO(req.body);
  
  if (!spfData.isValid()) {
    throw new ValidationError('Invalid SPF analysis data', spfData.getErrors());
  }

  const result = await pythonDomainValidatorService.analyzeSPF(spfData.domain, spfData.spf_record);
  const response = new SPFAnalysisResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Analyze DMARC record
export const analyzeDMARC = asyncHandler(async (req, res) => {
  const dmarcData = new DMARCAnalysisRequestDTO(req.body);
  
  if (!dmarcData.isValid()) {
    throw new ValidationError('Invalid DMARC analysis data', dmarcData.getErrors());
  }

  const result = await pythonDomainValidatorService.analyzeDMARC(dmarcData.domain, dmarcData.dmarc_record);
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

  const result = await pythonDomainValidatorService.getDNSRecords(domain, record_type);
  const response = new DNSResponseDTO(result);
  
  return sendSuccessResponse(res, response);
});

// Get all DNS records
export const getAllDNSRecords = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const result = await pythonDomainValidatorService.getAllDNSRecords(domain);
  
  return sendSuccessResponse(res, result);
}); 