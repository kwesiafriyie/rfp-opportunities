"""Shared best-effort date parsing for scrapers that capture a deadline
written as free text (e.g. "Closing: 03 Sept 2026", "Deadline: 3 Sep 2026").
"""
import logging
import re
from datetime import datetime, timezone
from typing import Optional

from dateutil import parser as date_parser

logger = logging.getLogger(__name__)

# dateutil's month-name matching doesn't recognize "Sept" (only "Sep"/"September").
_SEPT_RE = re.compile(r"\bSept\b", re.IGNORECASE)

# Matched and parsed explicitly before falling back to dateutil below --
# `dayfirst=True` (needed for day-month-year text like "03 Sept 2026") would
# otherwise silently swap month/day on an unambiguous ISO date like
# "2026-09-03" and turn it into March 9th.
_ISO_DATE_RE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})\b")


def parse_deadline(raw: Optional[str]) -> Optional[datetime]:
    """Parse a human-written date string into a timezone-aware datetime.
    Returns None (never raises) if it can't be parsed -- a missing or
    malformed deadline shouldn't ever break a scrape.
    """
    if not raw:
        return None

    cleaned = _SEPT_RE.sub("Sep", raw).strip()
    if not cleaned:
        return None

    iso_match = _ISO_DATE_RE.search(cleaned)
    if iso_match:
        try:
            return datetime.strptime(iso_match.group(0), "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            pass

    try:
        parsed = date_parser.parse(cleaned, fuzzy=True, dayfirst=True)
    except (ValueError, OverflowError, TypeError) as e:
        logger.debug(f"Couldn't parse deadline {raw!r}: {e}")
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed
