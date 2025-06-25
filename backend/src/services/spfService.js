import dns from 'dns';

function parseSPFRecord(record) {
  if (!record.startsWith('v=spf1')) return { valid: false, warnings: ['Not a valid SPF record'] };
  return { valid: true, warnings: [] };
}

export function analyzeSPF(domain, spf_record, callback) {
  const respond = (record) => {
    if (!record) {
      return callback({
        domain,
        spf_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['No SPF record found'],
        is_valid: false
      });
    }
    const parsed = parseSPFRecord(record);
    callback({
      domain,
      spf_record: record,
      parsed_record: parsed,
      warnings: parsed.warnings,
      errors: parsed.valid ? [] : ['Invalid SPF record'],
      is_valid: parsed.valid
    });
  };
  if (spf_record) {
    respond(spf_record);
  } else {
    dns.resolveTxt(domain, (err, records) => {
      if (err) return respond(null);
      const spf = records.flat().find(r => r.startsWith('v=spf1'));
      respond(spf || null);
    });
  }
} 