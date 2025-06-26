# Python Domain Validator Endpoints

This document describes the Python domain validator endpoints that integrate with the `test-domain.py` Python script for comprehensive domain testing. **All endpoints now use the Python script functions directly** instead of implementing similar functionality in JavaScript.

## Route Structure

The API is now organized into two main route groups:

### NodeJS Domain Validator Routes (`nodejs-domain-validator.js`)
```
/api/
├── /domains/validate/:domain
├── /spf/analyze
├── /dmarc/analyze
├── /dns/records/:domain
└── /dns/records/:domain/all
```

### Python Domain Validator Routes (`python-domain-validator.js`)
```
/api/python-domain-validator/
├── /domain/validate/:domain
├── /spf/:domain
├── /dns/:domain
├── /python/:domain
└── /comprehensive/:domain
```

## Python Domain Validator Endpoints

All Python domain validator endpoints are prefixed with `/api/python-domain-validator/` and provide various domain testing functionalities using the Python script.

### 1. Domain Validation
**GET** `/api/python-domain-validator/domain/validate/:domain`

Tests if a domain is valid using the Python `validators` library.

**Example:**
```bash
curl http://localhost:3000/api/python-domain-validator/domain/validate/google.com
```

**Response:**
```json
{
  "domain": "google.com",
  "is_valid": true,
  "expected": null,
  "passed": true
}
```

### 2. SPF Record Testing
**GET** `/api/python-domain-validator/spf/:domain`

Tests and analyzes SPF records using the Python `checkdmarc` library.

**Example:**
```bash
curl http://localhost:3000/api/python-domain-validator/spf/google.com
```

**Response:**
```json
{
  "domain": "google.com",
  "spf_record": "v=spf1 include:_spf.google.com ~all",
  "parsed": {
    "dns_lookups": 1,
    "dns_void_lookups": 0,
    "parsed": {
      "pass": [],
      "neutral": [],
      "softfail": [],
      "fail": [],
      "include": ["_spf.google.com"],
      "redirect": null,
      "exp": null,
      "all": "softfail"
    },
    "warnings": []
  },
  "is_valid": true,
  "passed": true,
  "errors": []
}
```

### 3. DNS Records Retrieval
**GET** `/api/python-domain-validator/dns/:domain`

Retrieves all TXT records using the Python `dnspython` library.

**Example:**
```bash
curl http://localhost:3000/api/python-domain-validator/dns/google.com
```

**Response:**
```json
{
  "domain": "google.com",
  "txt_records": [
    "v=spf1 include:_spf.google.com ~all",
    "google-site-verification=...",
    "v=DMARC1; p=reject; rua=mailto:dmarc@google.com"
  ],
  "all_txt_records": [
    "v=spf1 include:_spf.google.com ~all",
    "google-site-verification=...",
    "v=DMARC1; p=reject; rua=mailto:dmarc@google.com"
  ],
  "spf_records": ["v=spf1 include:_spf.google.com ~all"],
  "dmarc_records": ["v=DMARC1; p=reject; rua=mailto:dmarc@google.com"],
  "success": true
}
```

### 4. Python Script Integration
**GET** `/api/python-domain-validator/python/:domain?testType=comprehensive`

Executes the Python script directly with specified test type.

**Query Parameters:**
- `testType`: `validation`, `spf`, `dns`, or `comprehensive` (default: `comprehensive`)

**Example:**
```bash
curl "http://localhost:3000/api/python-domain-validator/python/google.com?testType=comprehensive"
```

**Response:**
```json
{
  "success": true,
  "test_type": "comprehensive",
  "domain": "google.com",
  "result": {
    "domain": "google.com",
    "tests": {
      "domain_validation": { ... },
      "dns_records": { ... },
      "spf_analysis": { ... }
    }
  }
}
```

### 5. Comprehensive Domain Test
**GET** `/api/python-domain-validator/comprehensive/:domain`

Runs all tests using the Python script and provides a unified response.

**Example:**
```bash
curl http://localhost:3000/api/python-domain-validator/comprehensive/google.com
```

**Response:**
```json
{
  "domain": "google.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "tests": {
    "python_comprehensive": {
      "success": true,
      "test_type": "comprehensive",
      "domain": "google.com",
      "result": { ... }
    },
    "validation": { ... },
    "spf": { ... },
    "dns": { ... }
  }
}
```

## File Structure

```
backend/src/
├── routes/
│   ├── nodejs-domain-validator.js    # NodeJS domain validator routes
│   └── python-domain-validator.js    # Python domain validator routes
├── controllers/
│   ├── nodejsDomainValidatorController.js    # NodeJS domain validator controllers (merged)
│   └── pythonDomainValidatorController.js    # Python domain validator controllers
└── services/
    ├── nodejsDomainValidatorService.js       # NodeJS domain validator services (merged)
    └── pythonDomainValidatorService.js       # Python domain validator services
```

## Controller and Service Organization

### NodeJS Domain Validator
- **Controller**: `nodejsDomainValidatorController.js` - Merged all NodeJS-based controllers
  - `validateDomainController` - Domain validation
  - `analyzeSPFController` - SPF analysis
  - `analyzeDMARCController` - DMARC analysis
  - `getDNSRecordsController` - DNS records retrieval
  - `getAllDNSRecordsController` - All DNS records retrieval

- **Service**: `nodejsDomainValidatorService.js` - Merged all NodeJS-based services
  - `validateDomain` - Domain validation using validator library
  - `analyzeSPF` - SPF analysis with DNS resolution
  - `analyzeDMARC` - DMARC analysis with DNS resolution
  - `getDNSRecords` - DNS records retrieval
  - `getAllDNSRecords` - All DNS records retrieval

### Python Domain Validator
- **Controller**: `pythonDomainValidatorController.js` - Python script integration controllers
  - `testDomainValidationController` - Python domain validation
  - `testSPFRecordController` - Python SPF testing
  - `getDNSRecordsController` - Python DNS records
  - `runPythonTestController` - Direct Python script execution
  - `comprehensiveDomainTestController` - Comprehensive testing

- **Service**: `pythonDomainValidatorService.js` - Python script integration services
  - `testDomainValidation` - Calls Python script for domain validation
  - `testSPFRecord` - Calls Python script for SPF testing
  - `getDNSRecords` - Calls Python script for DNS records
  - `runPythonTest` - Executes Python script with parameters
  - `comprehensiveDomainTest` - Runs all Python tests

## Python Script Integration

The Python domain validator endpoints **exclusively use** the modified `scripts/test-domain.py` script, which provides:

- **Domain validation** using `validators.domain`
- **SPF record parsing** using `checkdmarc.spf`
- **DNS record resolution** using `dnspython`
- **Comprehensive testing** that combines all functions
- **JSON output** for easy parsing by Node.js
- **Error handling** and structured responses

### Python Script Functions Used

1. **`test_domain_check(domain)`** - Domain validation
2. **`test_spf_records(domain)`** - SPF record analysis
3. **`get_dns_records(domain)`** - DNS TXT record retrieval
4. **`run_comprehensive_test(domain)`** - All tests combined

### Python Script Usage

```bash
# Run comprehensive test
python3 scripts/test-domain.py google.com

# Run specific test type
python3 scripts/test-domain.py google.com --test-type validation
python3 scripts/test-domain.py google.com --test-type spf
python3 scripts/test-domain.py google.com --test-type dns

# Test with custom SPF record
python3 scripts/test-domain.py google.com --test-type spf --spf-record "v=spf1 ip4:1.2.3.4 -all"
```

## Testing

To test the Python domain validator endpoints, you can use the provided test script:

```bash
# Install dependencies
npm install
pip install pytest validators checkdmarc dnspython

# Start the server
npm run dev

# In another terminal, run the test
npm run test:endpoints
```

## Error Handling

All endpoints include proper error handling:

- **Python script execution errors** are captured and returned
- **Invalid domains** return validation errors from Python validators
- **Missing DNS records** are handled gracefully by dnspython
- **SPF parsing errors** are captured by checkdmarc library
- **Network timeouts** and DNS resolution failures are handled

## Dependencies

The Python script requires these packages:
```bash
pip install pytest validators checkdmarc dnspython
```

The Node.js service requires:
```bash
npm install node-fetch validator
```

## Architecture

```
Client Request
    ↓
Node.js App (app.js)
    ↓
NodeJS Domain Validator Routes (nodejs-domain-validator.js)
    ↓
NodeJS Domain Validator Controller (nodejsDomainValidatorController.js)
    ↓
NodeJS Domain Validator Service (nodejsDomainValidatorService.js)
    ↓
Python Domain Validator Routes (python-domain-validator.js)
    ↓
Python Domain Validator Controller (pythonDomainValidatorController.js)
    ↓
Python Domain Validator Service (pythonDomainValidatorService.js)
    ↓
Calls Python Script (test-domain.py)
    ↓
Uses Python Libraries:
- validators (domain validation)
- checkdmarc (SPF/DMARC parsing)
- dnspython (DNS resolution)
    ↓
Returns JSON to Node.js
    ↓
Sends Response to Client
```

This architecture ensures that all domain testing logic is centralized in the Python script, leveraging the robust Python libraries for email security testing, while maintaining clean separation of concerns in the Node.js application structure with descriptive route names and organized controllers and services. 