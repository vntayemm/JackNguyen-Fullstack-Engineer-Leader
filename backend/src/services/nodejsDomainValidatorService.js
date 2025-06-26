import validator from 'validator';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const resolve = promisify(dns.resolve);

const SUPPORTED_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'];

// Domain validation service
export function validateDomain(domain) {
  const is_valid = validator.isFQDN(domain);
  return {
    domain,
    is_valid,
    errors: is_valid ? [] : ['Invalid domain format']
  };
}

// SPF parsing function
function parseSPFRecord(record) {
  if (!record.startsWith('v=spf1')) return { valid: false, warnings: ['Not a valid SPF record'] };
  return { valid: true, warnings: [] };
}

// SPF analysis service
export async function analyzeSPF(domain, spf_record) {
  try {
    let record = spf_record;
    
    if (!record) {
      const records = await resolveTxt(domain);
      record = records.flat().find(r => r.startsWith('v=spf1'));
    }
    
    if (!record) {
      return {
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['No SPF record found'],
        is_valid: false
      };
    }
    
    const parsed = parseSPFRecord(record);
    return {
      domain,
      spf_record: record,
      parsed_record: parsed,
      warnings: parsed.warnings,
      errors: parsed.valid ? [] : ['Invalid SPF record'],
      is_valid: parsed.valid
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

// DMARC parsing function
function parseDMARCRecord(record) {
  if (!record.startsWith('v=DMARC1')) return { valid: false, warnings: ['Not a valid DMARC record'] };
  return { valid: true, warnings: [] };
}

// DMARC analysis service
export async function analyzeDMARC(domain, dmarc_record) {
  try {
    let record = dmarc_record;
    
    if (!record) {
      const records = await resolveTxt(`_dmarc.${domain}`);
      record = records.flat().find(r => r.startsWith('v=DMARC1'));
    }
    
    if (!record) {
      return {
        domain,
        dmarc_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['No DMARC record found'],
        is_valid: false
      };
    }
    
    const parsed = parseDMARCRecord(record);
    return {
      domain,
      dmarc_record: record,
      parsed_record: parsed,
      warnings: parsed.warnings,
      errors: parsed.valid ? [] : ['Invalid DMARC record'],
      is_valid: parsed.valid
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

// DNS records service
export async function getDNSRecords(domain, record_type = 'TXT') {
  try {
    if (!SUPPORTED_TYPES.includes(record_type.toUpperCase())) {
      return {
        domain,
        record_type,
        records: [],
        errors: ['Unsupported record type']
      };
    }
    
    const records = await resolve(domain, record_type);
    return {
      domain,
      record_type,
      records: Array.isArray(records) ? records.map(r => ({ value: r })) : [],
      errors: []
    };
  } catch (error) {
    return {
      domain,
      record_type,
      records: [],
      errors: [error.message]
    };
  }
}

// All DNS records service
export async function getAllDNSRecords(domain) {
  try {
    const results = {};
    const promises = SUPPORTED_TYPES.map(async (type) => {
      try {
        const records = await resolve(domain, type);
        results[type] = Array.isArray(records) ? records : [];
      } catch (error) {
        results[type] = [];
      }
    });
    
    await Promise.all(promises);
    return { domain, records: results };
  } catch (error) {
    return { domain, records: {}, errors: [error.message] };
  }
} 