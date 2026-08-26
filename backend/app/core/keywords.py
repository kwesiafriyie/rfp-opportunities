"""Keyword filter that decides whether a post is a consulting opportunity.

Scoped deliberately narrow (per product decision): individual/firm
consultancy and IT/digital-services notices -- not general goods/works
tenders that happen to share a category with them. The IT/digital-services
phrases (website hosting, software development, ...) were added after a
real UNGM notice ("Provision of services for WMO Website Hosting,
Maintenance, Security and Hosting and Development") showed the original
consultancy/advisory-only wording missed genuine digital-services work that
doesn't use consulting language. Added as specific multi-word phrases, not
bare words like "security"/"maintenance"/"development" -- those alone are
far too generic and would also match physical guard/building-maintenance
or unrelated "economic development" tenders.
"""
import re
from typing import List

# Multi-word phrases are safe as plain substrings -- they're distinctive enough
# not to false-positive inside unrelated text.
_PHRASES = [
    "expression of interest",
    "expressions of interest",
    "request for expression of interest",
    "request for expressions of interest",
    "request for proposal",
    "request for proposals",
    "individual consultant",
    "consulting services",
    "consultancy services",
    "consulting firm",
    "consulting firms",
    "terms of reference",
    "call for proposals",
    "technical assistance",
    "advisory services",
    "digital transformation",
    "financial management",
    "institutional development",
    "business process reform",
    "business process reengineering",
    "business process re-engineering",
    "core banking",
    "payment systems",
    "payments system",
    "data governance",
    "data protection",
    "data management",
    "cybersecurity",
    "cyber security",
    "website hosting",
    "web hosting",
    "website development",
    "website design",
    "website maintenance",
    "software development",
    "systems development",
    "application development",
    "ict services",
    "network infrastructure",
]

# Short tokens need word-boundary matching, otherwise "eoi"/"rfp" style
# acronyms and "consultant"/"consultancy" would also match inside unrelated
# longer words. Deliberately excludes bare "IT"/"data"/"payments" -- too
# generic on their own to be useful signal (see the phrases above for the
# scoped versions instead).
_WORDS = [
    "eoi",
    "reoi",
    "rfp",
    "consultant",
    "consultants",
    "consultancy",
    "consultancies",
    "ict",
    "iso",
    "api",
    "erp",
    "strategy",
]

_WORD_PATTERN = re.compile(r"\b(" + "|".join(_WORDS) + r")\b", re.IGNORECASE)


def find_matched_keywords(text: str) -> List[str]:
    """Return the list of consulting-related keywords/phrases found in text."""
    if not text:
        return []

    lowered = text.lower()
    matches = [phrase for phrase in _PHRASES if phrase in lowered]
    matches.extend(m.lower() for m in _WORD_PATTERN.findall(text))

    # de-dupe while preserving order
    seen = set()
    unique = []
    for m in matches:
        if m not in seen:
            seen.add(m)
            unique.append(m)
    return unique
