import { validateDomain } from '../services/nodejsDomainValidatorService.js';
import { analyzeSPF } from '../services/nodejsDomainValidatorService.js';
import { analyzeDMARC } from '../services/nodejsDomainValidatorService.js';
import { getDNSRecords, getAllDNSRecords } from '../services/nodejsDomainValidatorService.js';

// Domain validation controller
export function validateDomainController(req, res) {
  const { domain } = req.params;
  const result = validateDomain(domain);
  res.json(result);
}

// SPF analysis controller
export function analyzeSPFController(req, res) {
  const { domain, spfRecord } = req.body;
  const result = analyzeSPF(domain, spfRecord);
  res.json(result);
}

// DMARC analysis controller
export function analyzeDMARCController(req, res) {
  const { domain, dmarcRecord } = req.body;
  const result = analyzeDMARC(domain, dmarcRecord);
  res.json(result);
}

// DNS records controller
export function getDNSRecordsController(req, res) {
  const { domain } = req.params;
  const result = getDNSRecords(domain);
  res.json(result);
}

// All DNS records controller
export function getAllDNSRecordsController(req, res) {
  const { domain } = req.params;
  const result = getAllDNSRecords(domain);
  res.json(result);
} 