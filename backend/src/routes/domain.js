import express from 'express';
import { 
  getUserDomains, 
  addDomain, 
  deleteDomain, 
  validateDomain,
  analyzeSPF,
  analyzeDMARC,
  getDNSRecords,
  getAllDNSRecords,
  analyzeIndividualDNSRecord
} from '../controllers/domainController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/validate/:domain', auth, validateDomain);
router.post('/spf/analyze', auth, analyzeSPF);
router.post('/dmarc/analyze', auth, analyzeDMARC);
router.get('/dns/records/:domain', auth, getDNSRecords);
router.get('/dns/records/:domain/all', auth, getAllDNSRecords);
router.get('/dns/records/:domain/individual', auth, analyzeIndividualDNSRecord);

// Get user's domains
router.get('/', auth, getUserDomains);

// Add new domain
router.post('/', auth, addDomain);

// Delete domain by name (now /:domain)
router.delete('/:domain', auth, deleteDomain);

export default router; 