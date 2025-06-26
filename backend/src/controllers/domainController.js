import { getUserDomains, addDomain, deleteDomain, testDomain, getDomainDetails } from '../services/domainService.js';

export const getDomains = async (req, res) => {
  try {
    const domains = await getUserDomains(req.user.id);
    res.json(domains);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createDomain = async (req, res) => {
  try {
    const { domainName } = req.body;
    const domain = await addDomain(req.user.id, domainName);
    res.status(201).json(domain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDomain(req.user.id, parseInt(id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const runDomainTest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await testDomain(req.user.id, parseInt(id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDomainDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const domain = await getDomainDetails(req.user.id, parseInt(id));
    res.json(domain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 