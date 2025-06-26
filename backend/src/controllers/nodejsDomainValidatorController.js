import { validateDomain } from '../services/nodejsDomainValidatorService.js';
import { analyzeSPF } from '../services/nodejsDomainValidatorService.js';
import { analyzeDMARC } from '../services/nodejsDomainValidatorService.js';
import { getDNSRecords, getAllDNSRecords } from '../services/nodejsDomainValidatorService.js';
import {
  DomainValidationResponseDTO,
  SPFAnalysisRequestDTO,
  SPFAnalysisResponseDTO,
  DMARCAnalysisRequestDTO,
  DMARCAnalysisResponseDTO,
  DNSResponseDTO,
  ErrorResponseDTO
} from '../dto/index.js';
import {
  validateRequest,
  handleValidationErrors,
  sendSuccessResponse,
  sendErrorResponse,
  sanitizeRequest,
  isValidDomain
} from '../dto/utils.js';

// Domain validation controller
export function validateDomainController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = validateDomain(domain);
    
    // Create response using DTO
    const response = new DomainValidationResponseDTO(domain, result.isValid, result.errors || []);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Domain validation error:', error);
    const errorResponse = new ErrorResponseDTO('Domain validation failed');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

// SPF analysis controller
export function analyzeSPFController(req, res) {
  try {
    // Validate request data
    const validation = validateRequest(SPFAnalysisRequestDTO, req.body);
    if (!validation.isValid) {
      return handleValidationErrors(res, validation.errors);
    }

    // Sanitize the data
    const sanitizedData = sanitizeRequest(SPFAnalysisRequestDTO, req.body);
    
    const result = analyzeSPF(sanitizedData.domain, sanitizedData.spf_record);
    
    // Create response using DTO
    const response = new SPFAnalysisResponseDTO(
      sanitizedData.domain,
      result.isValid,
      result.spfRecord,
      result.parsedRecord,
      result.warnings || [],
      result.errors || []
    );
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('SPF analysis error:', error);
    const errorResponse = new ErrorResponseDTO('SPF analysis failed');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

// DMARC analysis controller
export function analyzeDMARCController(req, res) {
  try {
    // Validate request data
    const validation = validateRequest(DMARCAnalysisRequestDTO, req.body);
    if (!validation.isValid) {
      return handleValidationErrors(res, validation.errors);
    }

    // Sanitize the data
    const sanitizedData = sanitizeRequest(DMARCAnalysisRequestDTO, req.body);
    
    const result = analyzeDMARC(sanitizedData.domain, sanitizedData.dmarc_record);
    
    // Create response using DTO
    const response = new DMARCAnalysisResponseDTO(
      sanitizedData.domain,
      result.isValid,
      result.dmarcRecord,
      result.parsedRecord,
      result.warnings || [],
      result.errors || []
    );
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('DMARC analysis error:', error);
    const errorResponse = new ErrorResponseDTO('DMARC analysis failed');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

// DNS records controller
export function getDNSRecordsController(req, res) {
  try {
    const { domain } = req.params;
    const { record_type } = req.query;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = getDNSRecords(domain, record_type);
    
    // Create response using DTO
    const response = new DNSResponseDTO(domain, record_type, result.records || [], result.errors || []);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('DNS records error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to fetch DNS records');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

// All DNS records controller
export function getAllDNSRecordsController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = getAllDNSRecords(domain);
    
    // Create response using DTO
    const response = {
      domain: domain,
      records: result.records || {},
      errors: result.errors || []
    };
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('All DNS records error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to fetch all DNS records');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
} 