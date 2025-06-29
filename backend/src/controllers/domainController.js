import domainService from '../services/domainService.js';
import pythonDomainValidatorService from '../services/pythonDomainValidatorService.js';
import dnsAnalysisService from '../services/dnsAnalysisService.js';
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
import { DNSAnalysis } from '../models/index.js';

// Get all domains for user (using DNSAnalysis)
export const getUserDomains = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  // Get latest analysis for each domain
  const analyses = await DNSAnalysis.findAll({ 
    where: { user_id: userId },
    order: [['createdAt', 'DESC']]
  });
  
  // Group by domain and get latest for each
  const domainMap = new Map();
  analyses.forEach(analysis => {
    const domainName = analysis.domain_name;
    if (!domainMap.has(domainName)) {
      domainMap.set(domainName, analysis.analysis_data);
    }
  });
  
  const domains = Array.from(domainMap.entries()).map(([domainName, analysisData]) => ({
    domain_name: domainName,
    ...analysisData
  }));
  
  return sendSuccessResponse(res, { domains });
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

// Delete domain
export const deleteDomain = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { domain } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const result = await domainService.deleteDomain(userId, domain);
  
  if (!result) {
    throw new NotFoundError('Domain not found');
  }
  
  return sendSuccessResponse(res, { message: 'Domain deleted successfully' });
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

// Analyze individual DNS record type (chỉ lưu vào DNSAnalysis, không update Domains)
export const analyzeIndividualDNSRecord = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { domain } = req.params;
  const { record_type, no_save } = req.query;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const now = new Date();
  const shouldSave = no_save !== 'true'; // Don't save if no_save=true

  // Nếu phân tích toàn bộ
  if (!record_type) {
    let result = await pythonDomainValidatorService.analyzeIndividualDNSRecord(domain, null);
    if (result && !result.error) {
      // Gán createdAt, updatedAt cho từng type và cha
      const use_cases = result.use_cases || {};
      Object.keys(use_cases).forEach(type => {
        use_cases[type] = {
          ...use_cases[type],
          createdAt: now,
          updatedAt: now
        };
      });
      use_cases.createdAt = now;
      use_cases.updatedAt = now;
      // Tạo bản ghi mới trong DNSAnalysis
      const analysisData = {
        domain: result.domain,
        dns_provider: result.dns_provider,
        hosting_provider: result.hosting_provider,
        dns_record_published: result.dns_record_published,
        dmarc_record_published: result.dmarc_record_published,
        spf_record_published: result.spf_record_published,
        status: result.status,
        createdAt: now,
        updatedAt: now,
        use_cases
      };
      
      // Only save to database if shouldSave is true
      if (shouldSave) {
        await DNSAnalysis.create({
          domain_name: result.domain,
          user_id: userId,
          analysis_data: analysisData
        });
      }
      
      return sendSuccessResponse(res, analysisData);
    }
    return sendSuccessResponse(res, result);
  }

  // Nếu phân tích từng type
  const validRecordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'CAA', 'TXT', 'SPF', 'DMARC', 'DKIM'];
  if (!validRecordTypes.includes(record_type.toUpperCase())) {
    throw new ValidationError(`Invalid record type. Must be one of: ${validRecordTypes.join(', ')}`);
  }

  let result = await pythonDomainValidatorService.analyzeIndividualDNSRecord(domain, record_type.toUpperCase());
  if (result && !result.error) {
    // Lấy bản ghi mới nhất từ DNSAnalysis
    const latest = shouldSave ? await DNSAnalysis.findOne({
      where: { domain_name: domain, user_id: userId },
      order: [['createdAt', 'DESC']]
    }) : null;
    
    let analysisData = latest ? { ...latest.analysis_data } : {
      domain: result.domain,
      dns_provider: result.dns_provider,
      hosting_provider: result.hosting_provider,
      dns_record_published: result.dns_record_published,
      dmarc_record_published: result.dmarc_record_published,
      spf_record_published: result.spf_record_published,
      status: result.status,
      createdAt: now,
      updatedAt: now,
      use_cases: {}
    };
    // Cập nhật type tương ứng
    const type = record_type.toUpperCase();
    analysisData.use_cases = analysisData.use_cases || {};
    analysisData.use_cases[type] = {
      ...result.use_cases?.[type],
      createdAt: analysisData.use_cases[type]?.createdAt || now,
      updatedAt: now
    };
    // Cập nhật updatedAt cho cha
    analysisData.updatedAt = now;
    if (!analysisData.createdAt) analysisData.createdAt = now;
    // Cập nhật các trường tổng quan nếu có
    analysisData.dns_provider = result.dns_provider;
    analysisData.hosting_provider = result.hosting_provider;
    analysisData.dns_record_published = result.dns_record_published;
    analysisData.dmarc_record_published = result.dmarc_record_published;
    analysisData.spf_record_published = result.spf_record_published;
    analysisData.status = result.status;
    
    // Only save to database if shouldSave is true
    if (shouldSave) {
      await DNSAnalysis.create({
        domain_name: result.domain,
        user_id: userId,
        analysis_data: analysisData
      });
    }
    
    return sendSuccessResponse(res, analysisData);
  }
  return sendSuccessResponse(res, result);
});

// Get user's DNS analyses
export const getUserDNSAnalyses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 50 } = req.query;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const analyses = await dnsAnalysisService.getUserAnalyses(userId, parseInt(limit));
  
  return sendSuccessResponse(res, { analyses });
});

// Get DNS analysis by ID
export const getDNSAnalysisById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('Valid analysis ID is required');
  }

  const analysis = await dnsAnalysisService.getAnalysisById(userId, parseInt(id));
  
  if (!analysis) {
    throw new NotFoundError('DNS analysis not found');
  }
  
  return sendSuccessResponse(res, { analysis });
});

// Get domain's DNS analyses
export const getDomainDNSAnalyses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { domain } = req.params;
  const { limit = 10 } = req.query;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!domain) {
    throw new ValidationError('Domain name is required');
  }

  const analyses = await dnsAnalysisService.getDomainAnalyses(userId, domain, parseInt(limit));
  
  return sendSuccessResponse(res, { analyses });
});

// API lấy bản ghi mới nhất cho domain
export const getLatestDNSAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { domain } = req.params;
  if (!userId) throw new AuthenticationError('User not authenticated');
  if (!domain) throw new ValidationError('Domain name is required');
  const latest = await DNSAnalysis.findOne({
    where: { domain_name: domain, user_id: userId },
    order: [['createdAt', 'DESC']]
  });
  if (latest) {
    return sendSuccessResponse(res, latest.analysis_data);
  }
  return sendSuccessResponse(res, null);
});

// Delete DNS analysis
export const deleteDNSAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }
  
  if (!id || isNaN(parseInt(id))) {
    throw new ValidationError('Valid analysis ID is required');
  }

  const result = await dnsAnalysisService.deleteAnalysis(userId, parseInt(id));
  
  return sendSuccessResponse(res, result);
}); 