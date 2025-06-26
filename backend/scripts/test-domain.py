# test_sample.py
# To run this install the follow packages
# pip install pytest validators checkdmarc
# run with :
# pytest -svv test_sample.py
import json
import sys
import argparse
import pytest
import dns.resolver
import validators.domain as validate_domain
from validators.utils import ValidationError
from checkdmarc.dmarc import parse_dmarc_record
from checkdmarc.spf import parse_spf_record
from checkdmarc.spf import SPFTooManyDNSLookups, SPFTooManyVoidDNSLookups, SPFRecordNotFound


def test_domain_check(test_domain, expected_result=None) -> dict:
    """Test Domain"""
    try:
        actual = validate_domain(test_domain)
        is_valid = bool(actual)
        return {
            "domain": test_domain,
            "is_valid": is_valid,
            "expected": expected_result,
            "passed": expected_result is None or is_valid == expected_result
        }
    except Exception as e:
        return {
            "domain": test_domain,
            "is_valid": False,
            "error": str(e),
            "passed": False
        }


def test_spf_records(test_record=None, test_domain=None, raised_exception=None) -> dict:
    """Test SPF records"""
    try:
        # If no test_record provided, try to get it from DNS
        if test_record is None and test_domain:
            dns_result = get_dns_records(test_domain)
            if dns_result["success"] and dns_result["spf_records"]:
                test_record = dns_result["spf_records"][0].strip('"')
            else:
                return {
                    "domain": test_domain,
                    "spf_record": None,
                    "is_valid": False,
                    "errors": ["No SPF record found"],
                    "passed": False
                }
        
        if test_record and test_domain:
            if raised_exception is None:
                # Not expecting any raises here
                parsed_record = parse_spf_record(test_record, test_domain)
                return {
                    "domain": test_domain,
                    "spf_record": test_record,
                    "parsed": parsed_record,
                    "is_valid": True,
                    "passed": True,
                    "errors": []
                }
            else:
                with pytest.raises(raised_exception) as error:
                    parsed_record = parse_spf_record(test_record, test_domain)
                return {
                    "domain": test_domain,
                    "spf_record": test_record,
                    "expected_exception": raised_exception.__name__,
                    "passed": True,
                    "errors": []
                }
        else:
            return {
                "domain": test_domain,
                "spf_record": None,
                "is_valid": False,
                "errors": ["Invalid parameters provided"],
                "passed": False
            }
    except Exception as e:
        return {
            "domain": test_domain,
            "spf_record": test_record,
            "error": str(e),
            "is_valid": False,
            "passed": False,
            "errors": [str(e)]
        }


def get_dns_records(domain) -> dict:
    """Get DNS Records"""
    try:
        answers = dns.resolver.resolve(domain, "TXT")
        records = [str(answer) for answer in answers]
        spf_records = [record for record in records if record.startswith('"v=spf1')]
        dmarc_records = [record for record in records if record.startswith('"v=DMARC1')]
        
        return {
            "domain": domain,
            "txt_records": records,
            "all_txt_records": records,
            "spf_records": spf_records,
            "dmarc_records": dmarc_records,
            "success": True
        }
    except Exception as e:
        return {
            "domain": domain,
            "txt_records": [],
            "all_txt_records": [],
            "spf_records": [],
            "dmarc_records": [],
            "success": False,
            "error": str(e)
        }


def run_comprehensive_test(domain) -> dict:
    """Run comprehensive domain tests"""
    results = {
        "domain": domain,
        "tests": {}
    }
    
    # Test domain validation
    results["tests"]["domain_validation"] = test_domain_check(domain)
    
    # Test DNS records
    results["tests"]["dns_records"] = get_dns_records(domain)
    
    # Test SPF records
    results["tests"]["spf_analysis"] = test_spf_records(None, domain)
    
    return results


def main():
    parser = argparse.ArgumentParser(description='Domain testing tool')
    parser.add_argument('domain', help='Domain to test')
    parser.add_argument('--test-type', choices=['validation', 'spf', 'dns', 'comprehensive'], 
                       default='comprehensive', help='Type of test to run')
    parser.add_argument('--spf-record', help='SPF record to test (for spf test type)')
    
    args = parser.parse_args()
    
    if args.test_type == 'validation':
        result = test_domain_check(args.domain)
    elif args.test_type == 'dns':
        result = get_dns_records(args.domain)
    elif args.test_type == 'spf':
        if args.spf_record:
            result = test_spf_records(args.spf_record, args.domain)
        else:
            result = test_spf_records(None, args.domain)
    else:  # comprehensive
        result = run_comprehensive_test(args.domain)
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()


# Keep the original pytest functions for backward compatibility
@pytest.mark.parametrize(
    "test_domain,expected_result",
    [
        ("aaa", False),
        ("aaa.com", True),
        ("www.google.com", True),
        ("www.google", True),
    ],
)
def test_domain_check_pytest(test_domain, expected_result) -> None:
    """Test Domain - pytest version"""
    actual = validate_domain(test_domain)
    assert bool(actual) is expected_result


@pytest.mark.parametrize(
    "test_record,test_domain,raised_exception",
    [
        (
            "v=spf1 ip4:213.5.39.110 -all MS=83859DAEBD1978F9A7A67D3",
            "avd.dk",
            None,
        ),
        (
            (
                '"v=spf1 include:spf.comendosystems.com '
                "include:bounce.peytz.dk include:etrack.indicia.dk "
                "include:etrack1.com include:mail1.dialogportal.com "
                "include:mail2.dialogportal.com a:mailrelay.jppol.dk "
                'a:sendmail.jppol.dk ?all"'
            ),
            "ekstrabladet.dk",
            SPFRecordNotFound,
        ),
    ],
)
def test_spf_records_pytest(test_record, test_domain, raised_exception) -> None:
    """Test SPF records - pytest version"""
    if raised_exception is None:
        parsed_record = parse_spf_record(test_record, test_domain)
        print(json.dumps(parsed_record, indent=2))
    else:
        with pytest.raises(raised_exception) as error:
            parsed_record = parse_spf_record(test_record, test_domain)


def test_get_dns_records_pytest() -> None:
    """Get DNS Records - pytest version"""
    answers = dns.resolver.resolve("amberos.com", "TXT")
    for answer in answers:
        print(answer)
