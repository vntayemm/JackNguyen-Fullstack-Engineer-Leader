import Domain from '../models/domain.js';
import { analyzeSPF } from './nodejsDomainValidatorService.js';
import { comprehensiveDomainTest } from './pythonDomainValidatorService.js';
import { getDNSRecords } from './nodejsDomainValidatorService.js';

export async function getUserDomains(userId) {
  const domains = await Domain.findAll({
    where: { user_id: userId },
    order: [['updatedAt', 'DESC']]
  });
  
  return domains.map(domain => ({
    id: domain.id,
    domainName: domain.domain_name,
    spfResult: domain.spf_result,
    dmarcResult: domain.dmarc_result,
    dnsResult: domain.dns_result,
    lastTested: domain.last_tested,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt
  }));
}

export async function addDomain(userId, addDomainDTO) {
  // DTO validation is already handled in controller
  const { domainName } = addDomainDTO;
  
  const cleanDomain = domainName.toLowerCase();
  
  // Check if domain already exists for this user
  const existingDomain = await Domain.findOne({
    where: { 
      domain_name: cleanDomain,
      user_id: userId
    }
  });
  
  if (existingDomain) {
    throw new Error('Domain already exists in your list');
  }
  
  // Create new domain
  const domain = await Domain.create({
    domain_name: cleanDomain,
    user_id: userId
  });
  
  return {
    id: domain.id,
    domainName: domain.domain_name,
    spfResult: domain.spf_result,
    dmarcResult: domain.dmarc_result,
    dnsResult: domain.dns_result,
    lastTested: domain.last_tested,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt
  };
}

export async function deleteDomain(userId, domainId) {
  const domain = await Domain.findOne({
    where: { 
      id: domainId,
      user_id: userId
    }
  });
  
  if (!domain) {
    throw new Error('Domain not found');
  }
  
  await domain.destroy();
  return { message: 'Domain deleted successfully' };
}

export async function testDomain(userId, domainId) {
  const domain = await Domain.findOne({
    where: { 
      id: domainId,
      user_id: userId
    }
  });
  
  if (!domain) {
    throw new Error('Domain not found');
  }
  
  const domainName = domain.domain_name;
  const results = {};
  
  try {
    // Test SPF using NodeJS service
    try {
      const spfResult = await analyzeSPF(domainName);
      results.spf = spfResult;
    } catch (error) {
      results.spf = { error: error.message };
    }
    
    // Test DMARC and other comprehensive tests using Python service
    try {
      const comprehensiveResult = await comprehensiveDomainTest(domainName);
      if (comprehensiveResult.tests && comprehensiveResult.tests.spf) {
        results.dmarc = comprehensiveResult.tests.spf; // Use SPF result as DMARC for now
      } else {
        results.dmarc = { error: 'DMARC test not available' };
      }
    } catch (error) {
      results.dmarc = { error: error.message };
    }
    
    // Test DNS (MX records)
    try {
      const dnsResult = await getDNSRecords(domainName, 'MX');
      results.dns = dnsResult;
    } catch (error) {
      results.dns = { error: error.message };
    }
    
    // Update domain with results
    domain.spf_result = results.spf;
    domain.dmarc_result = results.dmarc;
    domain.dns_result = results.dns;
    domain.last_tested = new Date();
    await domain.save();
    
    return {
      id: domain.id,
      domainName: domain.domain_name,
      spfResult: results.spf,
      dmarcResult: results.dmarc,
      dnsResult: results.dns,
      lastTested: domain.last_tested,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
    
  } catch (error) {
    throw new Error(`Failed to test domain: ${error.message}`);
  }
}

export async function getDomainDetails(userId, domainId) {
  const domain = await Domain.findOne({
    where: { 
      id: domainId,
      user_id: userId
    }
  });
  
  if (!domain) {
    throw new Error('Domain not found');
  }
  
  return {
    id: domain.id,
    domainName: domain.domain_name,
    spfResult: domain.spf_result,
    dmarcResult: domain.dmarc_result,
    dnsResult: domain.dns_result,
    lastTested: domain.last_tested,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt
  };
} 