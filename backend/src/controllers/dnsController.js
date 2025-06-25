import { getDNSRecords, getAllDNSRecords } from '../services/dnsService.js';

export function getDNSRecordsController(req, res) {
  const { domain } = req.params;
  const { record_type = 'TXT' } = req.query;
  getDNSRecords(domain, record_type, (result) => {
    res.json(result);
  });
}

export function getAllDNSRecordsController(req, res) {
  const { domain } = req.params;
  getAllDNSRecords(domain, (result) => {
    res.json(result);
  });
} 