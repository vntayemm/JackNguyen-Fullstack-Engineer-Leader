import { DNSAnalysis } from '../models/index.js';
import { BusinessException } from '../middleware/errorHandler.js';

class DomainService {
  constructor() {
    if (DomainService.instance) {
      return DomainService.instance;
    }
    DomainService.instance = this;
  }

  async getUserDomains(userId) {
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
    
    return Array.from(domainMap.entries()).map(([domainName, analysisData]) => ({
      domainName,
      ...analysisData
    }));
  }

  async addDomain(userId, addDomainDTO) {
    // DTO validation is already handled in controller
    const { domainName } = addDomainDTO;
    
    const cleanDomain = domainName.toLowerCase();
    
    // Check if domain already has analysis for this user
    const existingAnalysis = await DNSAnalysis.findOne({
      where: { 
        domain_name: cleanDomain,
        user_id: userId
      }
    });
    
    if (existingAnalysis) {
      throw new BusinessException('Domain already exists in your list');
    }
    
    // Create initial analysis record
    const now = new Date();
    const initialAnalysisData = {
      domain: cleanDomain,
      dns_provider: 'Unknown',
      hosting_provider: 'Unknown',
      dns_record_published: false,
      dmarc_record_published: false,
      spf_record_published: false,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      use_cases: {}
    };
    
    const analysis = await DNSAnalysis.create({
      domain_name: cleanDomain,
      user_id: userId,
      analysis_data: initialAnalysisData
    });
    
    return {
      domainName: cleanDomain,
      ...initialAnalysisData
    };
  }

  async deleteDomain(userId, domainName) {
    const analyses = await DNSAnalysis.findAll({
      where: { 
        domain_name: domainName,
        user_id: userId
      }
    });
    
    if (analyses.length === 0) {
      throw new Error('Domain not found');
    }
    
    await DNSAnalysis.destroy({
      where: { 
        domain_name: domainName,
        user_id: userId
      }
    });
    
    return { message: 'Domain deleted successfully' };
  }
}

// Create and export singleton instance
const domainService = new DomainService();
export default domainService;