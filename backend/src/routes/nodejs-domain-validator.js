import express from 'express';
import { 
  validateDomainController,
  analyzeSPFController,
  analyzeDMARCController,
  getDNSRecordsController,
  getAllDNSRecordsController
} from '../controllers/nodejsDomainValidatorController.js';
import pythonDomainValidatorRoutes from './python-domain-validator.js';

const router = express.Router();

// Domain routes
router.get('/domains/validate/:domain', validateDomainController);

// SPF routes
router.post('/spf/analyze', analyzeSPFController);

// DMARC routes
router.post('/dmarc/analyze', analyzeDMARCController);

// DNS routes
router.get('/dns/records/:domain', getDNSRecordsController);
router.get('/dns/records/:domain/all', getAllDNSRecordsController);

// Python domain validator routes
router.use('/python-domain-validator', pythonDomainValidatorRoutes);

export default router; 