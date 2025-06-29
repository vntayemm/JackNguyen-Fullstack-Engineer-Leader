import { DNSAnalysis } from '../models/index.js';
import pythonDomainValidatorService from './pythonDomainValidatorService.js';

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
      throw new Error('Domain already exists in your list');
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

  async testDomain(userId, domainName) {
    const latestAnalysis = await DNSAnalysis.findOne({
      where: { 
        domain_name: domainName,
        user_id: userId
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (!latestAnalysis) {
      throw new Error('Domain not found');
    }
    
    const results = {};
    
    try {
      // Test SPF using Python service
      try {
        const spfResult = await pythonDomainValidatorService.analyzeSPF(domainName);
        results.spf = spfResult;
      } catch (error) {
        results.spf = { error: error.message };
      }
      
      // Test DMARC using Python service
      try {
        const dmarcResult = await pythonDomainValidatorService.analyzeDMARC(domainName);
        results.dmarc = dmarcResult;
      } catch (error) {
        results.dmarc = { error: error.message };
      }
      
      // Test DNS (MX records) using Python service
      try {
        const dnsResult = await pythonDomainValidatorService.getDNSRecords(domainName, 'MX');
        results.dns = dnsResult;
      } catch (error) {
        results.dns = { error: error.message };
      }
      
      // Create new analysis record with updated results
      const now = new Date();
      const analysisData = {
        domain: domainName,
        dns_provider: 'Unknown',
        hosting_provider: 'Unknown',
        dns_record_published: false,
        dmarc_record_published: false,
        spf_record_published: false,
        status: 'completed',
        createdAt: now,
        updatedAt: now,
        use_cases: {
          SPF: { ...results.spf, createdAt: now, updatedAt: now },
          DMARC: { ...results.dmarc, createdAt: now, updatedAt: now },
          MX: { ...results.dns, createdAt: now, updatedAt: now },
          createdAt: now,
          updatedAt: now
        }
      };
      
      await DNSAnalysis.create({
        domain_name: domainName,
        user_id: userId,
        analysis_data: analysisData
      });
      
      const response = {
        domain: {
          domainName,
          ...analysisData
        },
        message: 'Domain tests completed successfully'
      };
      
      return response;
      
    } catch (error) {
      console.error('Service: General test error:', error.message);
      throw new Error(`Failed to test domain: ${error.message}`);
    }
  }

  async getDomainDetails(userId, domainName) {
    const latestAnalysis = await DNSAnalysis.findOne({
      where: { 
        domain_name: domainName,
        user_id: userId
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (!latestAnalysis) {
      throw new Error('Domain not found');
    }
    
    return {
      domainName,
      ...latestAnalysis.analysis_data
    };
  }
}

// Create and export singleton instance
const domainService = new DomainService();
export default domainService;