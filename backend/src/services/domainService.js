import validator from 'validator';

export function validateDomain(domain) {
  const is_valid = validator.isFQDN(domain);
  return {
    domain,
    is_valid,
    errors: is_valid ? [] : ['Invalid domain format']
  };
} 