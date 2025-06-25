import dns from 'dns';

function parseDMARCRecord(record) {
  if (!record.startsWith('v=DMARC1')) return { valid: false, warnings: ['Not a valid DMARC record'] };
  return { valid: true, warnings: [] };
}

export function analyzeDMARC(domain, dmarc_record, callback) {
  const respond = (record) => {
    if (!record) {
      return callback({
        domain,
        dmarc_record: null,
        parsed_record: null,
        warnings: [],
        errors: ['No DMARC record found'],
        is_valid: false
      });
    }
    const parsed = parseDMARCRecord(record);
    callback({
      domain,
      dmarc_record: record,
      parsed_record: parsed,
      warnings: parsed.warnings,
      errors: parsed.valid ? [] : ['Invalid DMARC record'],
      is_valid: parsed.valid
    });
  };
  if (dmarc_record) {
    respond(dmarc_record);
  } else {
    dns.resolveTxt(`_dmarc.${domain}`, (err, records) => {
      if (err) return respond(null);
      const dmarc = records.flat().find(r => r.startsWith('v=DMARC1'));
      respond(dmarc || null);
    });
  }
} 