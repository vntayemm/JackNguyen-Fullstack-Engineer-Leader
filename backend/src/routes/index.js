import express from 'express';
import { validateDomainController } from '../controllers/domainController.js';
import { analyzeSPFController } from '../controllers/spfController.js';
import { analyzeDMARCController } from '../controllers/dmarcController.js';
import { getDNSRecordsController, getAllDNSRecordsController } from '../controllers/dnsController.js';

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

export default router; 