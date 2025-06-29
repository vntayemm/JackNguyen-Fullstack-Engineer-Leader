import { DNSAnalysis } from '../models/index.js';

class DNSAnalysisService {
  constructor() {
    if (DNSAnalysisService.instance) {
      return DNSAnalysisService.instance;
    }
    DNSAnalysisService.instance = this;
  }

  async saveAnalysis(userId, analysisData) {
    try {
      const { domain } = analysisData;

      // Create the analysis record
      const analysis = await DNSAnalysis.create({
        domain_name: domain,
        analysis_data: analysisData, // Store the complete analysis data
        user_id: userId
      });

      return {
        id: analysis.id,
        domain_name: analysis.domain_name,
        analysis_data: analysis.analysis_data,
        created_at: analysis.createdAt,
        updated_at: analysis.updatedAt
      };
    } catch (error) {
      console.error('Error saving DNS analysis:', error);
      throw new Error(`Failed to save DNS analysis: ${error.message}`);
    }
  }

  async getUserAnalyses(userId, limit = 50) {
    try {
      const analyses = await DNSAnalysis.findAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        limit: limit
      });

      return analyses.map(analysis => ({
        id: analysis.id,
        domain_name: analysis.domain_name,
        analysis_data: analysis.analysis_data,
        created_at: analysis.createdAt,
        updated_at: analysis.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      throw new Error(`Failed to fetch DNS analyses: ${error.message}`);
    }
  }

  async getAnalysisById(userId, analysisId) {
    try {
      const analysis = await DNSAnalysis.findOne({
        where: { 
          id: analysisId,
          user_id: userId
        }
      });

      if (!analysis) {
        throw new Error('DNS analysis not found');
      }

      return {
        id: analysis.id,
        domain_name: analysis.domain_name,
        analysis_data: analysis.analysis_data,
        created_at: analysis.createdAt,
        updated_at: analysis.updatedAt
      };
    } catch (error) {
      console.error('Error fetching analysis by ID:', error);
      throw new Error(`Failed to fetch DNS analysis: ${error.message}`);
    }
  }

  async getDomainAnalyses(userId, domainName, limit = 10) {
    try {
      const analyses = await DNSAnalysis.findAll({
        where: { 
          user_id: userId,
          domain_name: domainName
        },
        order: [['createdAt', 'DESC']],
        limit: limit
      });

      return analyses.map(analysis => ({
        id: analysis.id,
        domain_name: analysis.domain_name,
        analysis_data: analysis.analysis_data,
        created_at: analysis.createdAt,
        updated_at: analysis.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching domain analyses:', error);
      throw new Error(`Failed to fetch domain analyses: ${error.message}`);
    }
  }

  async deleteAnalysis(userId, analysisId) {
    try {
      const analysis = await DNSAnalysis.findOne({
        where: { 
          id: analysisId,
          user_id: userId
        }
      });

      if (!analysis) {
        throw new Error('DNS analysis not found');
      }

      await analysis.destroy();
      return { message: 'DNS analysis deleted successfully' };
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw new Error(`Failed to delete DNS analysis: ${error.message}`);
    }
  }

  async getLatestAnalysis(userId, domainName) {
    try {
      const analysis = await DNSAnalysis.findOne({
        where: { 
          user_id: userId,
          domain_name: domainName
        },
        order: [['createdAt', 'DESC']]
      });

      if (!analysis) {
        return null;
      }

      return {
        id: analysis.id,
        domain_name: analysis.domain_name,
        analysis_data: analysis.analysis_data,
        created_at: analysis.createdAt,
        updated_at: analysis.updatedAt
      };
    } catch (error) {
      console.error('Error fetching latest analysis:', error);
      throw new Error(`Failed to fetch latest analysis: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const dnsAnalysisService = new DNSAnalysisService();
export default dnsAnalysisService; 