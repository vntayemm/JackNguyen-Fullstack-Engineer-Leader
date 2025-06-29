import express from 'express';
import { 
  getUserDomains, 
  addDomain, 
  deleteDomain, 
  analyzeIndividualDNSRecord
} from '../controllers/domainController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/dns/records/:domain/individual', auth, analyzeIndividualDNSRecord);
// Get user's domains
router.get('/', auth, getUserDomains);
// Add new domain
router.post('/', auth, addDomain);
// Delete domain by name (now /:domain)
router.delete('/:domain', auth, deleteDomain);

export default router; 