import { analyzeSPF } from '../services/spfService.js';

export function analyzeSPFController(req, res) {
  const { domain, spf_record } = req.body;
  if (!domain && !spf_record) {
    return res.status(400).json({ errors: ['Domain or SPF record required'] });
  }
  analyzeSPF(domain, spf_record, (result) => {
    res.json(result);
  });
} 