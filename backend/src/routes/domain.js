import express from 'express';
import { 
  getUserDomains, 
  addDomain, 
  deleteDomain, 
  testDomain, 
  getDomainById,
  validateDomain,
  analyzeSPF,
  analyzeDMARC,
  getDNSRecords,
  getAllDNSRecords,
  analyzeIndividualDNSRecord,
  getUserDNSAnalyses,
  getDNSAnalysisById,
  getDomainDNSAnalyses,
  getLatestDNSAnalysis,
  deleteDNSAnalysis
} from '../controllers/domainController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/validate/:domain', auth, validateDomain);
router.post('/spf/analyze', auth, analyzeSPF);
router.post('/dmarc/analyze', auth, analyzeDMARC);
router.get('/dns/records/:domain', auth, getDNSRecords);
router.get('/dns/records/:domain/all', auth, getAllDNSRecords);
router.get('/dns/records/:domain/individual', auth, analyzeIndividualDNSRecord);

// DNS Analysis routes
router.get('/dns/analyses', auth, getUserDNSAnalyses);
router.get('/dns/analyses/:id', auth, getDNSAnalysisById);
router.get('/dns/analyses/domain/:domain', auth, getDomainDNSAnalyses);
router.get('/dns/analyses/domain/:domain/latest', auth, getLatestDNSAnalysis);
router.delete('/dns/analyses/:id', auth, deleteDNSAnalysis);

// Get user's domains
router.get('/', auth, getUserDomains);

// Add new domain
router.post('/', auth, addDomain);

// Get domain details by name
router.get('/domain/:domain', auth, getDomainById);

// Run domain test by name
router.post('/domain/:domain/test', auth, testDomain);

// Delete domain by name
router.delete('/domain/:domain', auth, deleteDomain);

export default router; 