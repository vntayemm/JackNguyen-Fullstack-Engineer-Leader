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
  getAllDNSRecords
} from '../controllers/domainController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Domain validation (no auth required)
router.get('/validate/:domain', validateDomain);

// SPF analysis (no auth required)
router.post('/spf/analyze', analyzeSPF);

// DMARC analysis (no auth required)
router.post('/dmarc/analyze', analyzeDMARC);

// DNS records (no auth required)
router.get('/dns/records/:domain', getDNSRecords);
router.get('/dns/records/:domain/all', getAllDNSRecords);

// Get user's domains
router.get('/', getUserDomains);

// Add new domain
router.post('/', addDomain);

// Get domain details
router.get('/:id', getDomainById);

// Run domain test
router.post('/:id/test', testDomain);

// Delete domain
router.delete('/:id', deleteDomain);

export default router; 