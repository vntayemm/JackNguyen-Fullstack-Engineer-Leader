import express from 'express';
import { getDomains, createDomain, removeDomain, runDomainTest, getDomainDetail } from '../controllers/domainController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All domain routes require authentication
router.use(auth);

// Get user's domains
router.get('/', getDomains);

// Add new domain
router.post('/', createDomain);

// Get domain details
router.get('/:id', getDomainDetail);

// Run domain test
router.post('/:id/test', runDomainTest);

// Delete domain
router.delete('/:id', removeDomain);

export default router; 