import { analyzeDMARC } from '../services/dmarcService.js';

export function analyzeDMARCController(req, res) {
  const { domain, dmarc_record } = req.body;
  if (!domain && !dmarc_record) {
    return res.status(400).json({ errors: ['Domain or DMARC record required'] });
  }
  analyzeDMARC(domain, dmarc_record, (result) => {
    res.json(result);
  });
} 