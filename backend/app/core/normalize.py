"""Shared normalization layer applied to every scraped post before storage.

Three independent, deliberately simple (rule-based, no ML) classifiers:
- classify_opportunity_type: maps a source's free-text type label/title into
  a small fixed set of procurement instruments.
- classify_sector: maps title/excerpt into a small fixed set of sectors --
  a handful of buckets a user can actually filter by, not hundreds of noisy
  auto-generated tags.
- parse_deadline_with_offset: for sources (like UNGM) that show a date/time
  string and its UTC offset as two separate pieces of markup rather than one
  parseable string.
"""
import re
from datetime import datetime, timedelta, timezone
from typing import Optional

from dateutil import parser as date_parser

# Ordered: more specific phrases first so e.g. "individual consultant" wins
# over a bare "consultant" mention elsewhere in the same text.
_TYPE_RULES = [
    ("Individual Consultant", ("individual consultant", "call for individual consultant")),
    ("Expression of Interest", ("expression of interest", "expressions of interest", " eoi", "reoi", "ami ")),
    ("Request for Proposal", ("request for proposal", " rfp")),
    ("Request for Quotation", ("request for quotation", " rfq")),
    ("Invitation to Bid", ("invitation to bid", "invitation for bids", "invitation for tenders", " itb")),
    ("Request for Pre-Qualification", ("pre-qualification", "prequalification")),
    ("Request for Information", ("request for information", " rfi")),
    ("Grant / Call for Proposals", ("call for proposals", "grant support", "call for proposal")),
    ("Implementing Partner", ("implementing partner",)),
    ("Pre-Bid Notice", ("pre-bid notice", "pre bid notice")),
]


def classify_opportunity_type(*texts: Optional[str]) -> str:
    """Best-effort normalized type from any free text describing the
    procurement instrument (a source's own type label, title, excerpt).
    Falls back to "Consultancy" -- every stored opportunity already passed
    the consulting keyword filter, so that's a safe generic default.
    """
    haystack = " ".join(t for t in texts if t).lower()
    for label, markers in _TYPE_RULES:
        if any(m in haystack for m in markers):
            return label
    return "Consultancy"


# Deliberately small and fixed -- a handful of buckets a user can actually
# filter by, not hundreds of noisy auto-generated tags.
_SECTOR_RULES = [
    ("Technology", ("digital transformation", "software", "ict", "information technology",
                     "cybersecurity", "cyber security", "data governance", "data protection",
                     "database", "erp", "core banking", "payment system", "it system")),
    ("Finance & Audit", ("audit", "financial management", "accounting", "actuarial",
                          "financial statements", "internal control")),
    ("Legal", ("legal advisory", "legal services", "legal counsel", "attorney", "law firm")),
    ("Monitoring & Evaluation", ("monitoring and evaluation", "monitoring & evaluation",
                                  "impact evaluation", "baseline assessment")),
    ("Engineering & Infrastructure", ("engineering", "construction supervision", "infrastructure",
                                       "civil works", "hydropower", "road design", "water supply")),
    ("Health", ("health", "medical", "hospital", "pharmaceutical", "vaccine")),
    ("Education", ("education", "training", "curriculum", "scholarship", "capacity building")),
    ("Human Resources", ("human resources", "recruitment", "executive search", "staffing")),
    ("Procurement", ("procurement services", "supply chain", "logistics")),
    ("Strategy & Management", ("management consulting", "institutional development", "strategy",
                                 "business process reform", "business process reengineering",
                                 "organizational review")),
    ("Research", ("research study", "impact study", "feasibility study")),
]


def classify_sector(*texts: Optional[str]) -> Optional[str]:
    """Best-effort sector from free text. None (not "Other") when nothing
    matches -- an absent sector is more honest than a meaningless catch-all
    bucket, and the frontend labels it "Uncategorized" itself.
    """
    haystack = " ".join(t for t in texts if t).lower()
    for label, markers in _SECTOR_RULES:
        if any(m in haystack for m in markers):
            return label
    return None


_OFFSET_RE = re.compile(r"GMT\s*([+-])\s*(\d{1,2})[:.]?(\d{2})?", re.IGNORECASE)


def parse_deadline_with_offset(date_str: Optional[str], offset_str: Optional[str]) -> Optional[datetime]:
    """Parse a date/time string paired with a separately-given UTC offset
    (e.g. UNGM shows "26-Aug-2026 04:30" next to "(GMT -4.00)" as two
    separate pieces of markup, not one parseable string). Returns a
    UTC-normalized, timezone-aware datetime, or None if unparseable --
    never raises.
    """
    if not date_str:
        return None

    try:
        naive = date_parser.parse(date_str.strip(), fuzzy=True)
    except (ValueError, OverflowError, TypeError):
        return None

    offset_hours = 0.0
    if offset_str:
        match = _OFFSET_RE.search(offset_str)
        if match:
            sign = -1 if match.group(1) == "-" else 1
            hours = int(match.group(2))
            minutes = int(match.group(3)) if match.group(3) else 0
            offset_hours = sign * (hours + minutes / 60)

    source_tz = timezone(timedelta(hours=offset_hours))
    aware = naive.replace(tzinfo=source_tz)
    return aware.astimezone(timezone.utc)
