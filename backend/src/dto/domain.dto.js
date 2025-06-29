/**
 * Domain and DNS DTOs
 */

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

export {
  DomainDTO,
  AddDomainRequestDTO,
  DomainListResponseDTO
}; 