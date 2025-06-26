import { 
  testDomainValidation, 
  testSPFRecord, 
  getDNSRecords, 
  runPythonTest, 
  comprehensiveDomainTest 
} from '../services/pythonDomainValidatorService.js';

export async function testDomainValidationController(req, res) {
  try {
    const { domain } = req.params;
    const result = await testDomainValidation(domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to validate domain',
      message: error.message
    });
  }
}

export async function testSPFRecordController(req, res) {
  try {
    const { domain } = req.params;
    const result = await testSPFRecord(domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to test SPF record',
      message: error.message
    });
  }
}

export async function getDNSRecordsController(req, res) {
  try {
    const { domain } = req.params;
    const result = await getDNSRecords(domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get DNS records',
      message: error.message
    });
  }
}

export async function runPythonTestController(req, res) {
  try {
    const { domain } = req.params;
    const { testType } = req.query;
    const result = await runPythonTest(domain, testType);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to run Python test',
      message: error.message
    });
  }
}

export async function comprehensiveDomainTestController(req, res) {
  try {
    const { domain } = req.params;
    const result = await comprehensiveDomainTest(domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to run comprehensive domain test',
      message: error.message
    });
  }
} 