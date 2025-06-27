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

router.get('/validate/:domain', auth, validateDomain);
router.post('/spf/analyze', auth, analyzeSPF);
router.post('/dmarc/analyze', auth, analyzeDMARC);
router.get('/dns/records/:domain', auth, getDNSRecords);
router.get('/dns/records/:domain/all', auth, getAllDNSRecords);

// Get user's domains
router.get('/', auth, getUserDomains);

// Add new domain
router.post('/', auth, addDomain);

// Get domain details
router.get('/:id', auth, getDomainById);

// Run domain test
router.post('/:id/test', auth, testDomain);

// Delete domain
router.delete('/:id', auth, deleteDomain);

export default router; 