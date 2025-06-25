# test_sample.py
# To run this install the follow packages
# pip install pytest validators checkdmarc
# run with :
# pytest -svv test_sample.py
import json
import pytest
import dns.resolver
import validators.domain as validate_domain
from validators.utils import ValidationError
from checkdmarc.dmarc import parse_dmarc_record
from checkdmarc.spf import parse_spf_record
from checkdmarc.spf import SPFTooManyDNSLookups, SPFTooManyVoidDNSLookups, SPFRecordNotFound


@pytest.mark.parametrize(
    "test_domain,expected_result",
    [
        ("aaa", False),
        ("aaa.com", True),
        ("www.google.com", True),
        ("www.google", True),
    ],
)
def test_domain_check(test_domain, expected_result) -> None:
    """Test Domain"""
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
def test_spf_records(test_record, test_domain, raised_exception) -> None:
    """Test SPF records"""

    # Returns an OrderdDict
    if raised_exception is None:
        # Not expecting any raises here
        parsed_record = parse_spf_record(test_record, test_domain)
        print(json.dumps(parsed_record, indent=2))
        # Example  "dns_lookups": 0,
        #{
        #  "dns_void_lookups": 0,
        #  "parsed": {
        #    "pass": [
        #      {
        #        "value": "213.5.39.110",
        #        "mechanism": "ip4"
        #      }
        #    ],
        #    "neutral": [],
        #    "softfail": [],
        #    "fail": [],
        #    "include": [],
        #    "redirect": null,
        #    "exp": null,
        #    "all": "fail"
        #  },
        #  "warnings": [
        #    "Any text after the all mechanism is ignored"
        #  ]
        #}
    else:
        with pytest.raises(raised_exception) as error:
            parsed_record = parse_spf_record(test_record, test_domain)


def test_get_dns_records() -> None:
    """Get DNS Records"""
    answers = dns.resolver.resolve("amberos.com", "TXT")
    for answer in answers:
        print(answer)
        # Example SPF Record
        # v=spf1 include:zoho.com ~all
