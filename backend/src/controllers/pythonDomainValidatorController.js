import { 
  testDomainValidation, 
  testSPFRecord, 
  getDNSRecords, 
  runPythonTest, 
  comprehensiveDomainTest 
} from '../services/pythonDomainValidatorService.js';
import {
  DomainValidationResponseDTO,
  SPFAnalysisResponseDTO,
  DNSResponseDTO,
  ErrorResponseDTO
} from '../dto/index.js';
import {
  handleValidationErrors,
  sendSuccessResponse,
  sendErrorResponse,
  isValidDomain
} from '../dto/utils.js';

export async function testDomainValidationController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = await testDomainValidation(domain);
    
    // Create response using DTO
    const response = new DomainValidationResponseDTO(domain, result.isValid, result.errors || []);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Python domain validation error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to validate domain');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function testSPFRecordController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = await testSPFRecord(domain);
    
    // Create response using DTO
    const response = new SPFAnalysisResponseDTO(
      domain,
      result.isValid,
      result.spfRecord,
      result.parsedRecord,
      result.warnings || [],
      result.errors || []
    );
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Python SPF test error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to test SPF record');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function getDNSRecordsController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = await getDNSRecords(domain);
    
    // Create response using DTO
    const response = new DNSResponseDTO(domain, 'ALL', result.records || [], result.errors || []);
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Python DNS records error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to get DNS records');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function runPythonTestController(req, res) {
  try {
    const { domain } = req.params;
    const { testType } = req.query;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    if (!testType) {
      return handleValidationErrors(res, ['Test type is required']);
    }
    
    const result = await runPythonTest(domain, testType);
    
    // Create response using DTO
    const response = {
      domain: domain,
      testType: testType,
      result: result,
      timestamp: new Date().toISOString()
    };
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Python test error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to run Python test');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
}

export async function comprehensiveDomainTestController(req, res) {
  try {
    const { domain } = req.params;
    
    if (!domain || !isValidDomain(domain)) {
      return handleValidationErrors(res, ['Valid domain name is required']);
    }
    
    const result = await comprehensiveDomainTest(domain);
    
    // Create response using DTO
    const response = {
      domain: domain,
      comprehensiveTest: result,
      timestamp: new Date().toISOString()
    };
    return sendSuccessResponse(res, response);
  } catch (error) {
    console.error('Comprehensive domain test error:', error);
    const errorResponse = new ErrorResponseDTO('Failed to run comprehensive domain test');
    return sendErrorResponse(res, errorResponse.error, 500);
  }
} 