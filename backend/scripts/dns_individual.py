#!/usr/bin/env python3
"""
Individual DNS record type analysis functions
Each function returns the same structure but only with the requested record type populated
"""
import json
import argparse
import dns.resolver
import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed


def analyze_a_record(domain, timeout=10) -> dict:
    """Analyze only A records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    a_case = {
        "Goal": "Email deliverability",
        "Purpose": "Maps domain → IPv4 address",
        "Expected": "Ensure points to correct web server IP",
        "Notes": "A record is required for email deliverability",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        a_answers = resolver.resolve(domain, 'A')
        a_records = [str(answer) for answer in a_answers]
        a_case["Status"] = "Valid" if a_records else "Not present"
        a_case["records"] = a_records
        result["dns_record_published"] = bool(a_records)
        result["hosting_provider"] = detect_hosting_provider(a_records, [], [])
    except Exception as e:
        a_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["A"] = a_case
    return result


def analyze_aaaa_record(domain, timeout=10) -> dict:
    """Analyze only AAAA records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    aaaa_case = {
        "Goal": "IPv6 support",
        "Purpose": "Maps domain → IPv6 address",
        "Expected": "IPv6 address for modern connectivity",
        "Notes": "Optional but recommended for future-proofing",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        aaaa_answers = resolver.resolve(domain, 'AAAA')
        aaaa_records = [str(answer) for answer in aaaa_answers]
        aaaa_case["Status"] = "Valid" if aaaa_records else "Not present"
        aaaa_case["records"] = aaaa_records
        result["dns_record_published"] = bool(aaaa_records)
    except Exception as e:
        aaaa_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["AAAA"] = aaaa_case
    return result


def analyze_cname_record(domain, timeout=10) -> dict:
    """Analyze only CNAME records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    cname_case = {
        "Goal": "Domain aliasing",
        "Purpose": "Maps domain → another domain",
        "Expected": "Points to target domain for redirection",
        "Notes": "Cannot coexist with A record for same domain",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        cname_answers = resolver.resolve(domain, 'CNAME')
        cname_records = [str(answer).rstrip('.') for answer in cname_answers]
        cname_case["Status"] = "Valid" if cname_records else "Not present"
        cname_case["records"] = cname_records
        result["dns_record_published"] = bool(cname_records)
        result["hosting_provider"] = detect_hosting_provider([], cname_records, [])
    except Exception as e:
        cname_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["CNAME"] = cname_case
    return result


def analyze_mx_record(domain, timeout=10) -> dict:
    """Analyze only MX records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    mx_case = {
        "Goal": "Email routing",
        "Purpose": "Maps domain → mail servers",
        "Expected": "List of mail servers in priority order",
        "Notes": "Essential for email delivery",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        mx_answers = resolver.resolve(domain, 'MX')
        mx_records = [str(answer.exchange).rstrip('.') for answer in mx_answers]
        mx_case["Status"] = "Valid" if mx_records else "Not present"
        mx_case["records"] = mx_records
    except Exception as e:
        mx_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["MX"] = mx_case
    return result


def analyze_ns_record(domain, timeout=10) -> dict:
    """Analyze only NS records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    ns_case = {
        "Goal": "DNS delegation",
        "Purpose": "Maps domain → authoritative name servers",
        "Expected": "List of authoritative DNS servers",
        "Notes": "Required for domain to function",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        ns_answers = resolver.resolve(domain, 'NS')
        ns_records = [str(answer).rstrip('.') for answer in ns_answers]
        ns_case["Status"] = "Valid" if ns_records else "Not present"
        ns_case["records"] = ns_records
        result["dns_provider"] = detect_dns_provider(ns_records)
    except Exception as e:
        ns_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["NS"] = ns_case
    return result


def analyze_soa_record(domain, timeout=10) -> dict:
    """Analyze only SOA records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    soa_case = {
        "Goal": "Zone authority",
        "Purpose": "Defines zone parameters and authority",
        "Expected": "Zone start of authority information",
        "Notes": "Required for DNS zone management",
        "Status": "Not present",
        "records": []
    }
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    try:
        soa_answers = resolver.resolve(domain, 'SOA')
        if soa_answers:
            soa = soa_answers[0]
            soa_data = {
                "mname": str(soa.mname).rstrip('.'),
                "rname": str(soa.rname).rstrip('.'),
                "serial": soa.serial,
                "refresh": soa.refresh,
                "retry": soa.retry,
                "expire": soa.expire,
                "minimum": soa.minimum
            }
            soa_case["Status"] = "Valid"
            soa_case["records"] = [soa_data]
    except Exception as e:
        soa_case["Error"] = str(e)
        result["success"] = False
    result["use_cases"]["SOA"] = soa_case
    return result


def analyze_caa_record(domain, timeout=10) -> dict:
    """Analyze only CAA records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    
    try:
        caa_answers = resolver.resolve(domain, 'CAA')
        caa_records = [str(answer) for answer in caa_answers]
        result["use_cases"]["CAA"] = {
            "Goal": "Certificate authority authorization",
            "Purpose": "Specifies allowed CAs for SSL certificates",
            "Expected": "List of authorized certificate authorities",
            "Notes": "Security measure for SSL certificate issuance",
            "Status": "Valid" if caa_records else "Not present",
            "records": caa_records
        }
    except Exception as e:
        result["use_cases"]["CAA"] = {
            "Goal": "Certificate authority authorization",
            "Purpose": "Specifies allowed CAs for SSL certificates",
            "Expected": "List of authorized certificate authorities",
            "Notes": "Security measure for SSL certificate issuance",
            "Status": "Not present",
            "records": [],
            "Error": str(e)
        }
        result["success"] = False
    
    return result


def analyze_txt_record(domain, timeout=10) -> dict:
    """Analyze only TXT records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    
    try:
        txt_answers = resolver.resolve(domain, 'TXT')
        txt_records = [str(answer).strip('"') for answer in txt_answers]
        result["use_cases"]["TXT"] = {
            "Goal": "Text information",
            "Purpose": "Stores text-based information",
            "Expected": "Various text records for verification and configuration",
            "Notes": "Used for SPF, DMARC, verification codes, etc.",
            "Status": "Valid" if txt_records else "Not present",
            "records": txt_records
        }
        result["hosting_provider"] = detect_hosting_provider([], [], txt_records)
    except Exception as e:
        result["use_cases"]["TXT"] = {
            "Goal": "Text information",
            "Purpose": "Stores text-based information",
            "Expected": "Various text records for verification and configuration",
            "Notes": "Used for SPF, DMARC, verification codes, etc.",
            "Status": "Not present",
            "records": [],
            "Error": str(e)
        }
        result["success"] = False
    
    return result


def analyze_spf_record(domain, timeout=10) -> dict:
    """Analyze only SPF records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    
    try:
        txt_answers = resolver.resolve(domain, 'TXT')
        txt_records = [str(answer).strip('"') for answer in txt_answers]
        
        # Extract SPF record
        spf_record = None
        for txt in txt_records:
            if txt.startswith('v=spf1'):
                spf_record = txt
                break
        
        result["use_cases"]["SPF"] = {
            "Goal": "Email authentication",
            "Purpose": "Prevents email spoofing",
            "Expected": "v=spf1 directive with authorized servers",
            "Notes": "Essential for email deliverability",
            "Status": "Valid" if spf_record else "Not present",
            "records": [spf_record] if spf_record else []
        }
        result["spf_record_published"] = bool(spf_record)
    except Exception as e:
        result["use_cases"]["SPF"] = {
            "Goal": "Email authentication",
            "Purpose": "Prevents email spoofing",
            "Expected": "v=spf1 directive with authorized servers",
            "Notes": "Essential for email deliverability",
            "Status": "Not present",
            "records": [],
            "Error": str(e)
        }
        result["success"] = False
    
    return result


def analyze_dmarc_record(domain, timeout=10) -> dict:
    """Analyze only DMARC records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    
    try:
        dmarc_domain = f"_dmarc.{domain}"
        dmarc_answers = resolver.resolve(dmarc_domain, 'TXT')
        dmarc_record = None
        
        for answer in dmarc_answers:
            txt = str(answer).strip('"')
            if txt.startswith('v=DMARC1'):
                dmarc_record = txt
                break
        
        result["use_cases"]["DMARC"] = {
            "Goal": "Email authentication policy",
            "Purpose": "Defines email authentication policy",
            "Expected": "v=DMARC1 directive with policy settings",
            "Notes": "Advanced email security and reporting",
            "Status": "Valid" if dmarc_record else "Not present",
            "records": [dmarc_record] if dmarc_record else []
        }
        result["dmarc_record_published"] = bool(dmarc_record)
    except Exception as e:
        result["use_cases"]["DMARC"] = {
            "Goal": "Email authentication policy",
            "Purpose": "Defines email authentication policy",
            "Expected": "v=DMARC1 directive with policy settings",
            "Notes": "Advanced email security and reporting",
            "Status": "Not present",
            "records": [],
            "Error": str(e)
        }
        result["success"] = False
    
    return result


def analyze_dkim_record(domain, timeout=10) -> dict:
    """Analyze only DKIM records"""
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = timeout
    resolver.lifetime = timeout
    
    # Try common DKIM selectors
    dkim_selectors = ['default', 'google', 'selector1', 'selector2', 'k1', 'mail']
    dkim_record = None
    
    for selector in dkim_selectors:
        try:
            dkim_domain = f"{selector}._domainkey.{domain}"
            dkim_answers = resolver.resolve(dkim_domain, 'TXT')
            for answer in dkim_answers:
                txt = str(answer).strip('"')
                if txt.startswith('v=DKIM1'):
                    dkim_record = f"Valid (selector: {selector})"
                    break
            if dkim_record:
                break
        except Exception:
            continue
    
    result["use_cases"]["DKIM"] = {
        "Goal": "Email authentication",
        "Purpose": "Digital signature for email verification",
        "Expected": "v=DKIM1 directive with public key",
        "Notes": "Advanced email authentication method",
        "Status": "Valid" if dkim_record else "Not present",
        "records": [dkim_record] if dkim_record else []
    }
    
    return result


def comprehensive_dns_analysis(domain, timeout=10) -> dict:
    """
    Perform comprehensive DNS analysis with provider detection by calling individual analyze_*_record functions
    """
    result = {
        "domain": domain,
        "dns_provider": None,
        "hosting_provider": None,
        "use_cases": {},
        "dns_record_published": False,
        "dmarc_record_published": False,
        "spf_record_published": False,
        "success": True
    }
    # Call each analyze_*_record function and merge their results
    a = analyze_a_record(domain, timeout)
    aaaa = analyze_aaaa_record(domain, timeout)
    cname = analyze_cname_record(domain, timeout)
    mx = analyze_mx_record(domain, timeout)
    ns = analyze_ns_record(domain, timeout)
    soa = analyze_soa_record(domain, timeout)
    caa = analyze_caa_record(domain, timeout)
    txt = analyze_txt_record(domain, timeout)
    spf = analyze_spf_record(domain, timeout)
    dmarc = analyze_dmarc_record(domain, timeout)
    dkim = analyze_dkim_record(domain, timeout)

    # Merge use_cases
    result["use_cases"].update(a["use_cases"])
    result["use_cases"].update(aaaa["use_cases"])
    result["use_cases"].update(cname["use_cases"])
    result["use_cases"].update(mx["use_cases"])
    result["use_cases"].update(ns["use_cases"])
    result["use_cases"].update(soa["use_cases"])
    result["use_cases"].update(caa["use_cases"])
    result["use_cases"].update(txt["use_cases"])
    result["use_cases"].update(spf["use_cases"])
    result["use_cases"].update(dmarc["use_cases"])
    result["use_cases"].update(dkim["use_cases"])

    # Merge provider and published fields (prefer first valid)
    for r in [ns, a, cname, txt]:
        if not result["dns_provider"] and r.get("dns_provider"):
            result["dns_provider"] = r["dns_provider"]
        if not result["hosting_provider"] and r.get("hosting_provider"):
            result["hosting_provider"] = r["hosting_provider"]
    
    # If we still don't have providers, try to detect from collected data
    if not result["dns_provider"]:
        # Collect all NS records from use_cases
        all_ns_records = []
        if "NS" in result["use_cases"] and result["use_cases"]["NS"].get("records"):
            all_ns_records = result["use_cases"]["NS"]["records"]
        result["dns_provider"] = detect_dns_provider(all_ns_records)
    
    if not result["hosting_provider"]:
        # Collect all A, CNAME, and TXT records from use_cases
        all_a_records = []
        all_cname_records = []
        all_txt_records = []
        
        if "A" in result["use_cases"] and result["use_cases"]["A"].get("records"):
            all_a_records = result["use_cases"]["A"]["records"]
        if "CNAME" in result["use_cases"] and result["use_cases"]["CNAME"].get("records"):
            all_cname_records = result["use_cases"]["CNAME"]["records"]
        if "TXT" in result["use_cases"] and result["use_cases"]["TXT"].get("records"):
            all_txt_records = result["use_cases"]["TXT"]["records"]
        
        result["hosting_provider"] = detect_hosting_provider(all_a_records, all_cname_records, all_txt_records)
    
    # Check if any DNS records are published (not just A/AAAA/CNAME)
    has_any_dns_records = False
    for record_type, use_case in result["use_cases"].items():
        if use_case.get("Status") == "Valid" and use_case.get("records") and len(use_case["records"]) > 0:
            has_any_dns_records = True
            break
    
    result["dns_record_published"] = has_any_dns_records
    
    for r in [dmarc]:
        if r.get("dmarc_record_published"):
            result["dmarc_record_published"] = True
    for r in [spf]:
        if r.get("spf_record_published"):
            result["spf_record_published"] = True
    # If any function failed, set success to False
    for r in [a, aaaa, cname, mx, ns, soa, caa, txt, spf, dmarc, dkim]:
        if not r.get("success", True):
            result["success"] = False
    return result


def detect_dns_provider(ns_records):
    """Detect DNS provider based on NS records"""
    if not ns_records:
        return "Unknown"
    
    ns_lower = [ns.lower() for ns in ns_records]
    
    if any('cloudflare' in ns for ns in ns_lower):
        return "Cloudflare"
    elif any('awsdns' in ns for ns in ns_lower) or any('route53' in ns for ns in ns_lower):
        return "Amazon Route 53"
    elif any('google' in ns for ns in ns_lower):
        return "Google Cloud DNS"
    elif any('azure' in ns for ns in ns_lower):
        return "Microsoft Azure DNS"
    elif any('godaddy' in ns for ns in ns_lower):
        return "GoDaddy"
    elif any('namecheap' in ns for ns in ns_lower):
        return "Namecheap"
    elif any('tucows' in ns for ns in ns_lower):
        return "Tucows Inc."
    elif any('dnsimple' in ns for ns in ns_lower):
        return "DNSimple"
    elif any('dyn' in ns for ns in ns_lower):
        return "Dyn"
    elif any('ns1.com' in ns for ns in ns_lower):
        return "NS1"
    elif any('systemdns' in ns for ns in ns_lower):
        return "SystemDNS"
    elif any('name.com' in ns for ns in ns_lower):
        return "Name.com"
    elif any('hover' in ns for ns in ns_lower):
        return "Hover"
    elif any('porkbun' in ns for ns in ns_lower):
        return "Porkbun"
    elif any('namesilo' in ns for ns in ns_lower):
        return "NameSilo"
    elif any('ionos' in ns for ns in ns_lower):
        return "IONOS"
    elif any('hostinger' in ns for ns in ns_lower):
        return "Hostinger"
    elif any('bluehost' in ns for ns in ns_lower):
        return "Bluehost"
    elif any('hostgator' in ns for ns in ns_lower):
        return "HostGator"
    elif any('dreamhost' in ns for ns in ns_lower):
        return "DreamHost"
    elif any('inmotion' in ns for ns in ns_lower):
        return "InMotion Hosting"
    elif any('a2hosting' in ns for ns in ns_lower):
        return "A2 Hosting"
    elif any('siteground' in ns for ns in ns_lower):
        return "SiteGround"
    elif any('wpengine' in ns for ns in ns_lower):
        return "WP Engine"
    elif any('kinsta' in ns for ns in ns_lower):
        return "Kinsta"
    elif any('digitalocean' in ns for ns in ns_lower):
        return "DigitalOcean"
    elif any('linode' in ns for ns in ns_lower):
        return "Linode"
    elif any('vultr' in ns for ns in ns_lower):
        return "Vultr"
    elif any('ovh' in ns for ns in ns_lower):
        return "OVH"
    elif any('hetzner' in ns for ns in ns_lower):
        return "Hetzner"
    else:
        # Try to extract provider name from NS records
        for ns in ns_lower:
            if '.' in ns:
                parts = ns.split('.')
                if len(parts) >= 2:
                    provider = parts[-2]  # Get the second-to-last part
                    if provider not in ['ns', 'dns', 'name']:
                        return provider.replace('-', ' ').title()
        return "Unknown"


def detect_hosting_provider(a_records, cname_records, txt_records):
    """Detect hosting provider based on A records, CNAME, and TXT records"""
    # Check TXT records for hosting indicators first (most reliable)
    for txt in txt_records or []:
        txt_lower = txt.lower()
        if 'hosting-site=' in txt_lower:
            # Extract hosting provider from custom TXT record
            try:
                provider_part = txt.split('hosting-site=')[1].split()[0]
                provider = provider_part.replace('-', ' ').replace('_', ' ').title()
                return provider
            except:
                pass
        elif 'vercel' in txt_lower:
            return "Vercel"
        elif 'netlify' in txt_lower:
            return "Netlify"
        elif 'heroku' in txt_lower:
            return "Heroku"
        elif 'github' in txt_lower:
            return "GitHub Pages"
        elif 'firebase' in txt_lower:
            return "Firebase"
        elif 'cloudflare' in txt_lower:
            return "Cloudflare"
        elif 'zoho' in txt_lower:
            return "Zoho"
        elif 'google' in txt_lower:
            return "Google"
        elif 'microsoft' in txt_lower:
            return "Microsoft"
    
    # Check CNAME records
    for cname in cname_records or []:
        cname_lower = cname.lower()
        if 'vercel' in cname_lower:
            return "Vercel"
        elif 'netlify' in cname_lower:
            return "Netlify"
        elif 'heroku' in cname_lower:
            return "Heroku"
        elif 'github' in cname_lower:
            return "GitHub Pages"
        elif 'firebase' in cname_lower:
            return "Firebase"
        elif 'cloudflare' in cname_lower:
            return "Cloudflare"
        elif 'zoho' in cname_lower:
            return "Zoho"
    
    # Check A records for common hosting IP ranges (lowest priority)
    for ip in a_records or []:
        if ip.startswith('192.168.') or ip.startswith('10.') or ip.startswith('172.'):
            continue  # Skip private IPs
        
        # AWS
        if ip.startswith('3.') or ip.startswith('52.') or ip.startswith('54.'):
            return "AWS"
        # Google Cloud
        elif ip.startswith('35.') or ip.startswith('34.'):
            return "Google Cloud"
        # Azure
        elif ip.startswith('13.') or ip.startswith('20.'):
            return "Microsoft Azure"
        # Cloudflare
        elif ip.startswith('104.') or ip.startswith('172.64.'):
            return "Cloudflare"
        # Vercel
        elif ip.startswith('76.76.') or ip.startswith('76.223.'):
            return "Vercel"
        # Netlify
        elif ip.startswith('75.2.') or ip.startswith('99.83.'):
            return "Netlify"
        # GitHub Pages
        elif ip.startswith('185.199.'):
            return "GitHub Pages"
        # Heroku
        elif ip.startswith('52.') and any('heroku' in str(cname).lower() for cname in cname_records or []):
            return "Heroku"
        # Zoho
        elif ip.startswith('199.36.') or ip.startswith('199.37.'):
            return "Zoho"
    
    return "Unknown"


def main():
    parser = argparse.ArgumentParser(description='Individual DNS record type analysis')
    parser.add_argument('domain', help='Domain to test')
    parser.add_argument('--test-type', choices=['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'CAA', 'TXT', 'SPF', 'DMARC', 'DKIM'], 
                       nargs='?', default=None, help='Type of DNS record to analyze (if not specified, runs comprehensive analysis)')
    parser.add_argument('--timeout', type=int, default=10, help='Timeout for operations in seconds')
    
    args = parser.parse_args()
    
    # If test_type is None, empty, or not provided, run comprehensive analysis
    if not args.test_type or args.test_type.strip() == '':
        result = comprehensive_dns_analysis(args.domain, timeout=args.timeout)
    elif args.test_type == 'A':
        result = analyze_a_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'AAAA':
        result = analyze_aaaa_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'CNAME':
        result = analyze_cname_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'MX':
        result = analyze_mx_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'NS':
        result = analyze_ns_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'SOA':
        result = analyze_soa_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'CAA':
        result = analyze_caa_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'TXT':
        result = analyze_txt_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'SPF':
        result = analyze_spf_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'DMARC':
        result = analyze_dmarc_record(args.domain, timeout=args.timeout)
    elif args.test_type == 'DKIM':
        result = analyze_dkim_record(args.domain, timeout=args.timeout)
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main() 