import express from 'express';
import { 
  testDomainValidationController, 
  testSPFRecordController, 
  getDNSRecordsController as testDNSRecordsController, 
  runPythonTestController, 
  comprehensiveDomainTestController 
} from '../controllers/pythonDomainValidatorController.js';

const router = express.Router();

// Python domain validator routes (integration with test-domain.py)
router.get('/domain/validate/:domain', testDomainValidationController);
router.get('/spf/:domain', testSPFRecordController);
router.get('/dns/:domain', testDNSRecordsController);
router.get('/python/:domain', runPythonTestController);
router.get('/comprehensive/:domain', comprehensiveDomainTestController);

export default router; 