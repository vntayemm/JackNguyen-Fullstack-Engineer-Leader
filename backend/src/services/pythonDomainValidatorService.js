import { spawn } from 'child_process';

export async function testDomainValidation(domain) {
  try {
    const result = await runPythonTest(domain, 'validation');
    return result.result || {
      domain,
      is_valid: false,
      errors: ['Python script execution failed']
    };
  } catch (error) {
    return {
      domain,
      is_valid: false,
      errors: [error.message]
    };
  }
}

export async function testSPFRecord(domain) {
  try {
    const result = await runPythonTest(domain, 'spf');
    return result.result || {
      domain,
      spf_record: null,
      is_valid: false,
      errors: ['Python script execution failed']
    };
  } catch (error) {
    return {
      domain,
      spf_record: null,
      is_valid: false,
      errors: [error.message]
    };
  }
}

export async function getDNSRecords(domain) {
  try {
    const result = await runPythonTest(domain, 'dns');
    return result.result || {
      domain,
      txt_records: [],
      spf_records: [],
      dmarc_records: [],
      success: false,
      error: 'Python script execution failed'
    };
  } catch (error) {
    return {
      domain,
      txt_records: [],
      spf_records: [],
      dmarc_records: [],
      success: false,
      error: error.message
    };
  }
}

export async function runPythonTest(domain, testType = 'comprehensive') {
  return new Promise((resolve, reject) => {
    const pythonScript = 'scripts/test-domain.py';
    const args = [domain, '--test-type', testType];
    
    const pythonProcess = spawn('python3', [pythonScript, ...args]);
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve({
            success: true,
            test_type: testType,
            domain: domain,
            result: result
          });
        } catch (error) {
          resolve({
            success: true,
            test_type: testType,
            domain: domain,
            output: output,
            raw_output: true,
            parse_error: error.message
          });
        }
      } else {
        reject({
          success: false,
          test_type: testType,
          domain: domain,
          error: errorOutput || 'Python script execution failed',
          exit_code: code
        });
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject({
        success: false,
        test_type: testType,
        domain: domain,
        error: error.message
      });
    });
  });
}

export async function comprehensiveDomainTest(domain) {
  try {
    const results = {
      domain,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Run comprehensive test using Python script
    try {
      const pythonResult = await runPythonTest(domain, 'comprehensive');
      results.tests.python_comprehensive = pythonResult;
      
      // Extract individual test results from comprehensive test
      if (pythonResult.success && pythonResult.result && pythonResult.result.tests) {
        results.tests.validation = pythonResult.result.tests.domain_validation;
        results.tests.spf = pythonResult.result.tests.spf_analysis;
        results.tests.dns = pythonResult.result.tests.dns_records;
      }
    } catch (error) {
      results.tests.python_comprehensive = {
        success: false,
        error: error.message
      };
      
      // Fallback: run individual tests if comprehensive fails
      try {
        const [validation, spf, dns] = await Promise.all([
          runPythonTest(domain, 'validation'),
          runPythonTest(domain, 'spf'),
          runPythonTest(domain, 'dns')
        ]);
        
        results.tests.validation = validation.result;
        results.tests.spf = spf.result;
        results.tests.dns = dns.result;
      } catch (fallbackError) {
        results.tests.validation = { error: fallbackError.message };
        results.tests.spf = { error: fallbackError.message };
        results.tests.dns = { error: fallbackError.message };
      }
    }

    return results;
  } catch (error) {
    return {
      domain,
      timestamp: new Date().toISOString(),
      error: error.message,
      success: false
    };
  }
} 