"""Keyword filter that decides whether a post is a consulting opportunity.

Scoped deliberately narrow (per product decision): individual/firm consultancy
notices only -- not general goods/works tenders that happen to share a category
with them.
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
