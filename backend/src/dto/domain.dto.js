/**
 * Domain and DNS DTOs
 */

// Domain Validation DTO
class DomainValidationResponseDTO {
  constructor(result) {
    this.domain = result.domain;
    this.is_valid = result.is_valid;
    this.errors = result.errors || [];
  }
}

// SPF Analysis DTO
class SPFAnalysisRequestDTO {
  constructor(data) {
    this.domain = data.domain;
    this.spf_record = data.spf_record;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.domain) {
      this._errors.push('Domain is required');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }

  sanitize() {
    return {
      domain: this.domain ? this.domain.toLowerCase().trim() : null,
      spf_record: this.spf_record ? this.spf_record.trim() : null
    };
  }
}

class SPFAnalysisResponseDTO {
  constructor(result) {
    this.domain = result.domain;
    this.is_valid = result.is_valid;
    this.spf_record = result.spf_record;
    this.parsed_record = result.parsed_record;
    this.warnings = result.warnings || [];
    this.errors = result.errors || [];
  }
}

// DMARC Analysis DTO
class DMARCAnalysisRequestDTO {
  constructor(data) {
    this.domain = data.domain;
    this.dmarc_record = data.dmarc_record;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.domain) {
      this._errors.push('Domain is required');
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }

  sanitize() {
    return {
      domain: this.domain ? this.domain.toLowerCase().trim() : null,
      dmarc_record: this.dmarc_record ? this.dmarc_record.trim() : null
    };
  }
}

class DMARCAnalysisResponseDTO {
  constructor(result) {
    this.domain = result.domain;
    this.is_valid = result.is_valid;
    this.dmarc_record = result.dmarc_record;
    this.parsed_record = result.parsed_record;
    this.warnings = result.warnings || [];
    this.errors = result.errors || [];
  }
}

// DNS Record DTO
class DNSRecordDTO {
  constructor(record) {
    this.value = record.value;
    this.ttl = record.ttl;
  }
}

// DNS Response DTO
class DNSResponseDTO {
  constructor(result) {
    this.domain = result.domain;
    this.record_type = result.record_type;
    this.records = (result.records || []).map(record => new DNSRecordDTO(record));
    this.errors = result.errors || [];
  }
}

// Domain Management DTO
class DomainDTO {
  constructor(domain) {
    this.id = domain.id;
    this.domainName = domain.domainName;
    this.spfResult = domain.spfResult;
    this.dmarcResult = domain.dmarcResult;
    this.dnsResult = domain.dnsResult;
    this.lastTested = domain.lastTested;
    this.createdAt = domain.createdAt;
    this.updatedAt = domain.updatedAt;
  }
}

// Add Domain DTO
class AddDomainRequestDTO {
  constructor(data) {
    this.domainName = data.domainName;
    this._errors = [];
  }

  validate() {
    this._errors = [];
    
    if (!this.domainName) {
      this._errors.push('Domain name is required');
    } else {
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!domainRegex.test(this.domainName)) {
        this._errors.push('Invalid domain name format');
      }
    }
    
    return this._errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  getErrors() {
    return this._errors;
  }

  sanitize() {
    return {
      domainName: this.domainName ? this.domainName.toLowerCase().trim() : null
    };
  }
}

// Domain List Response DTO
class DomainListResponseDTO {
  constructor(domains) {
    this.domains = domains.map(domain => new DomainDTO(domain));
    this.count = domains.length;
  }
}

// Domain Test Response DTO
class DomainTestResponseDTO {
  constructor(result) {
    this.domain = new DomainDTO(result.domain);
    this.message = result.message || 'Domain tests completed successfully';
  }
}

export {
  DomainValidationResponseDTO,
  SPFAnalysisRequestDTO,
  SPFAnalysisResponseDTO,
  DMARCAnalysisRequestDTO,
  DMARCAnalysisResponseDTO,
  DNSRecordDTO,
  DNSResponseDTO,
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO,
  DomainTestResponseDTO
}; 