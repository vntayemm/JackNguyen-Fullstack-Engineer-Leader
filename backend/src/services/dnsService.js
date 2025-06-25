import dns from 'dns';

const SUPPORTED_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'];

export function getDNSRecords(domain, record_type, callback) {
  if (!SUPPORTED_TYPES.includes(record_type.toUpperCase())) {
    return callback({
      domain,
      record_type,
      records: [],
      errors: ['Unsupported record type']
    });
  }
  dns.resolve(domain, record_type, (err, records) => {
    if (err) {
      return callback({
        domain,
        record_type,
        records: [],
        errors: [err.message]
      });
    }
    callback({
      domain,
      record_type,
      records: Array.isArray(records) ? records.map(r => ({ value: r })) : [],
      errors: []
    });
  });
}

export function getAllDNSRecords(domain, callback) {
  const results = {};
  let done = 0;
  SUPPORTED_TYPES.forEach(type => {
    dns.resolve(domain, type, (err, records) => {
      results[type] = err ? [] : (Array.isArray(records) ? records : []);
      done++;
      if (done === SUPPORTED_TYPES.length) {
        callback({ domain, records: results });
      }
    });
  });
} 