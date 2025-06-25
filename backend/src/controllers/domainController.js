import { validateDomain } from '../services/domainService.js';

export function validateDomainController(req, res) {
  const { domain } = req.params;
  const result = validateDomain(domain);
  res.json(result);
} 