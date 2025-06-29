import { spawn } from 'child_process';
import path from 'path';

class PythonDomainValidatorService {
  constructor() {
    if (PythonDomainValidatorService.instance) {
      return PythonDomainValidatorService.instance;
    }
    PythonDomainValidatorService.instance = this;
  }

  // Domain validation using Python script
  async validateDomain(domain) {
    try {
      const result = await this.runPythonTest(domain, 'validation');
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

  // SPF analysis using Python script
  async analyzeSPF(domain, spf_record) {
    try {
      const result = await this.runPythonTest(domain, 'spf', null, spf_record);
      return result.result || {
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['Python script execution failed'],
        is_valid: false
      };
    } catch (error) {
      return {
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: [error.message],
        is_valid: false
      };
    }
  }

  // DMARC analysis using Python script
  async analyzeDMARC(domain, dmarc_record) {
    try {
      const result = await this.runPythonTest(domain, 'dmarc', null, null, dmarc_record);
      return result.result || {
        domain,
        dmarc_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['Python script execution failed'],
        is_valid: false
      };
    } catch (error) {
      return {
        domain,
        dmarc_record: null,
        parsed_record: null,
        warnings: [],
        errors: [error.message],
        is_valid: false
      };
    }
  }

  // Get all DNS records using Python script
  async getAllDNSRecords(domain) {
    try {
      const result = await this.runPythonTest(domain, 'dns');
      return result.result || {
        domain,
        records: {},
        success: false,
        error: 'Python script execution failed'
      };
    } catch (error) {
      return {
        domain,
        records: {},
        success: false,
        error: error.message
      };
    }
  }

  async testSPFRecord(domain) {
    try {
      const result = await this.runPythonTest(domain, 'spf');
      return result.result || {
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['Python script execution failed'],
        is_valid: false
      };
    } catch (error) {
      return {
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: [error.message],
        is_valid: false
      };
    }
  }

  async getDNSRecords(domain, record_type = null) {
    try {
      const result = await this.runPythonTest(domain, 'dns', record_type);
      return result.result || {
        domain,
        record_type: record_type || 'TXT',
        records: [],
        txt_records: [],
        spf_records: [],
        dmarc_records: [],
        success: false,
        error: 'Python script execution failed'
      };
    } catch (error) {
      return {
        domain,
        record_type: record_type || 'TXT',
        records: [],
        txt_records: [],
        spf_records: [],
        dmarc_records: [],
        success: false,
        error: error.message
      };
    }
  }

  async analyzeIndividualDNSRecord(domain, record_type) {
    try {
      // If record_type is null, run comprehensive analysis
      if (!record_type) {
        const result = await this.runPythonTest(domain, 'individual', null);
        return result.result || {
          domain,
          record_type: 'comprehensive',
          use_cases: {},
          success: false,
          error: 'Python script execution failed'
        };
      }
      
      // Run individual record type analysis
      const result = await this.runPythonTest(domain, 'individual', record_type);
      return result.result || {
        domain,
        record_type,
        use_cases: {},
        success: false,
        error: 'Python script execution failed'
      };
    } catch (error) {
      return {
        domain,
        record_type: record_type || 'comprehensive',
        use_cases: {},
        success: false,
        error: error.message
      };
    }
  }

  async runPythonTest(domain, testType = 'individual', record_type = null, spf_record = null, dmarc_record = null) {
    return new Promise((resolve, reject) => {
      let args;
      
      // Use dns_individual.py script for all tests
      const pythonScript = 'scripts/dns_individual.py';
      
      if (record_type) {
        // Individual record type analysis
        args = [domain, '--test-type', record_type];
      } else {
        // Comprehensive analysis (no test-type specified)
        args = [domain];
      }
      
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
}

// Create and export singleton instance
const pythonDomainValidatorService = new PythonDomainValidatorService();
export default pythonDomainValidatorService;
