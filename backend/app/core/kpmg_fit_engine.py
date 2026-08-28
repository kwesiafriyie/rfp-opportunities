"""Deterministic KPMG Fit scoring engine -- Option B from the "KPMG Fit
Feasibility" assessment. Pure rule/keyword matching against
kpmg_taxonomy.py; no LLM calls, no embeddings, no vector search.

Every dimension score is a function of identifiable evidence in the
opportunity's own text/fields, never an invented number -- see each
_score_* function's docstring for exactly what evidence it uses and why.
Where no defensible public-data signal exists for a dimension (see the
assessment's §12 on data sufficiency), the score defaults to a neutral,
clearly-documented baseline rather than a confident-looking guess.

Replaceable by design: the only public entry point is compute_fit(), which
returns the exact shape the Opportunity model's fit_status/fit_score/
fit_tier/fit_analysis columns expect (see opportunity.py) and that
frontend/src/app/lib/kpmgFit.js's normalizer consumes. A future embeddings-
or LLM-based engine can replace this file's internals without any other
code -- pipeline.py, admin_opportunities.py, the frontend -- changing.
"""
import hashlib
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from .kpmg_taxonomy import CAPABILITIES, PLATFORMS

# Below this many characters of combined title+description+eligibility text,
# there simply isn't enough substantive content to assess -- some sources
# (see this session's own UNGM investigation) provide only metadata-shaped
# short text. Returning "insufficient_information" here is what keeps this
# engine honest per the assessment's explicit instruction: never assign an
# arbitrary score when there's nothing real to base it on.
MIN_CONTENT_LENGTH = 60

_DIMENSION_MAX = {
    "capability_technical_fit": 35,
    "industry_sector_fit": 15,
    "technology_platform_fit": 10,
    "experience_track_record_fit": 15,
    "eligibility_geographic_fit": 15,
    "pursuit_feasibility": 10,
}

# Ordered high-to-low; the first threshold a score meets or exceeds wins.
_TIER_THRESHOLDS = (("strong", 75), ("moderate", 50))

_EXPERIENCE_RE = re.compile(
    r"(?:minimum|at least|not less than)?\s*(\d{1,2})\+?\s*years?\s+(?:of\s+)?experience",
    re.IGNORECASE,
)

# Phrases that indicate a hard eligibility barrier for an international firm
# without a confirmed local presence -- this is exactly the "gate" the
# assessment's scoring model recommends over a pure weighted sum: a strong
# capability match doesn't overcome a stated local-registration requirement.
_ELIGIBILITY_GATE_PHRASES = (
    "locally registered",
    "local registration",
    "local partner required",
    "citizens only",
    "nationals only",
    "local incorporation",
)


def _tier_for_score(score: int) -> str:
    for label, threshold in _TIER_THRESHOLDS:
        if score >= threshold:
            return label
    return "weak"


def _matched_capabilities(text: str) -> List[str]:
    lowered = text.lower()
    return [
        name
        for name, meta in CAPABILITIES.items()
        if any(phrase in lowered for phrase in meta.get("match_phrases", []))
    ]


def _matched_platforms(text: str) -> List[str]:
    return [p for p in PLATFORMS if re.search(rf"\b{re.escape(p)}\b", text, re.IGNORECASE)]


def _score_capability(matched_caps: List[str]) -> int:
    """Evidence: count of distinct KPMG capabilities whose match_phrases
    appear in the text. Four or more distinct matches is treated as full
    marks -- a reasonable ceiling, not a claim that only 4+ matches count
    as real alignment.
    """
    if not matched_caps:
        return 0
    per_match = _DIMENSION_MAX["capability_technical_fit"] / 4
    return min(_DIMENSION_MAX["capability_technical_fit"], round(len(matched_caps) * per_match))


def _score_sector(sector: Optional[str]) -> int:
    """Evidence: the opportunity's own classified sector (normalize.py's
    classify_sector(), already computed upstream -- reused here rather than
    reclassified). "Technology" is KPMG's core relevant sector; other
    sectors get partial or low credit rather than zero, since sector
    classification alone is a weak signal either way.
    """
    max_score = _DIMENSION_MAX["industry_sector_fit"]
    if sector == "Technology":
        return max_score
    if sector == "Finance & Audit":  # payments/core banking overlap
        return round(max_score * 0.6)
    if sector is None:
        return round(max_score * 0.4)  # no signal either way
    return round(max_score * 0.2)


def _score_platform(matched_platforms: List[str], matched_caps: List[str]) -> int:
    """Evidence: an explicit platform name (SAP, Oracle, ...) in the text.
    Falling back to partial credit when a Connected/Powered capability
    matched but no platform was explicitly named -- most real notices
    describe the work, not the vendor, so zero would understate this too
    often.
    """
    max_score = _DIMENSION_MAX["technology_platform_fit"]
    if matched_platforms:
        return max_score
    connected_or_powered = any(CAPABILITIES[c]["pillar"] in ("Connected", "Powered") for c in matched_caps)
    return round(max_score * 0.5) if connected_or_powered else 0


def _score_experience(text: str) -> Tuple[int, Optional[str]]:
    """Evidence: an explicit "N years experience" requirement in the text.
    No internal KPMG track-record data exists to score this positively
    (see the assessment's §12) -- the only defensible signal from public
    data is whether the opportunity states an unusually demanding bar.
    """
    max_score = _DIMENSION_MAX["experience_track_record_fit"]
    match = _EXPERIENCE_RE.search(text)
    if not match:
        return round(max_score * 0.7), None
    years = int(match.group(1))
    if years >= 8:
        return round(max_score * 0.3), f"{years}+ years of experience required"
    return round(max_score * 0.6), None


def _score_eligibility(text: str) -> Tuple[int, Optional[str]]:
    """Evidence: explicit local-registration/nationals-only gating language
    in the text. Absence of such language isn't proof of eligibility, just
    absence of a detected barrier -- scored as a permissive default, not a
    confirmed "eligible" claim.
    """
    max_score = _DIMENSION_MAX["eligibility_geographic_fit"]
    lowered = text.lower()
    for phrase in _ELIGIBILITY_GATE_PHRASES:
        if phrase in lowered:
            return round(max_score * 0.4), "Local registration or local-partner requirement identified"
    return round(max_score * 0.75), None


def _score_pursuit(deadline: Optional[datetime], now: datetime) -> Tuple[int, Optional[str]]:
    """Evidence: days remaining until deadline -- reuses the same <=10-day
    urgency threshold already established platform-wide (see
    frontend/src/app/lib/deadline.js) for consistency. A very short window
    is a genuine pursuit-feasibility concern regardless of capability fit.
    """
    max_score = _DIMENSION_MAX["pursuit_feasibility"]
    if deadline is None:
        return round(max_score * 0.6), None
    days = (deadline - now).days
    if days >= 21:
        return max_score, None
    if days >= 10:
        return round(max_score * 0.7), None
    return round(max_score * 0.4), "Short window remaining to prepare a competitive pursuit"


def compute_fit(opportunity_fields: Dict) -> Dict:
    """Computes a KPMG Fit result for one opportunity.

    `opportunity_fields` should have (all optional except title):
    title, description, eligibility, sector, deadline (timezone-aware
    datetime or None).

    Returns {"status", "score", "tier", "analysis"} -- analysis is the dict
    that gets JSON-encoded into Opportunity.fit_analysis; status/score/tier
    map directly onto fit_status/fit_score/fit_tier.
    """
    title = opportunity_fields.get("title") or ""
    description = opportunity_fields.get("description") or ""
    eligibility = opportunity_fields.get("eligibility") or ""
    combined_text = " ".join(t for t in (title, description, eligibility) if t)

    now = datetime.now(timezone.utc)
    content_hash = hashlib.sha256(combined_text.strip().lower().encode("utf-8")).hexdigest()[:16]

    if len(combined_text.strip()) < MIN_CONTENT_LENGTH:
        return {
            "status": "insufficient_information",
            "score": None,
            "tier": None,
            "analysis": {"content_hash": content_hash, "analyzed_at": now.isoformat()},
        }

    matched_caps = _matched_capabilities(combined_text)
    matched_platforms = _matched_platforms(combined_text)

    cap_score = _score_capability(matched_caps)
    sector_score = _score_sector(opportunity_fields.get("sector"))
    platform_score = _score_platform(matched_platforms, matched_caps)
    exp_score, exp_gap = _score_experience(combined_text)
    elig_score, elig_gap = _score_eligibility(combined_text)
    pursuit_score, pursuit_gap = _score_pursuit(opportunity_fields.get("deadline"), now)

    gaps = [g for g in (elig_gap, exp_gap, pursuit_gap) if g]
    if not matched_caps:
        gaps.append("No specific KPMG capability identified in the opportunity text")

    raw_score = cap_score + sector_score + platform_score + exp_score + elig_score + pursuit_score

    # Hard gate: an explicit eligibility barrier caps the score at the top
    # of the "weak" band regardless of how strong the rest of the profile
    # looks -- the assessment's own "gates, not just weights" principle
    # (§5): a strong capability match doesn't overcome a stated
    # local-registration requirement this firm's status on isn't known.
    score = min(raw_score, 45) if elig_gap else raw_score
    tier = _tier_for_score(score)

    if matched_caps:
        pillars_hit = sorted({CAPABILITIES[c]["pillar"] for c in matched_caps})
        explanation = (
            f"Aligns with KPMG's {' and '.join(pillars_hit)} capabilities: "
            f"{', '.join(matched_caps[:3])}."
        )
    else:
        explanation = "No specific alignment with KPMG's technology advisory capabilities was identified from the opportunity text."

    return {
        "status": "available",
        "score": score,
        "tier": tier,
        "analysis": {
            "breakdown": {
                "capability_technical_fit": {"score": cap_score, "max": _DIMENSION_MAX["capability_technical_fit"]},
                "industry_sector_fit": {"score": sector_score, "max": _DIMENSION_MAX["industry_sector_fit"]},
                "technology_platform_fit": {"score": platform_score, "max": _DIMENSION_MAX["technology_platform_fit"]},
                "experience_track_record_fit": {"score": exp_score, "max": _DIMENSION_MAX["experience_track_record_fit"]},
                "eligibility_geographic_fit": {"score": elig_score, "max": _DIMENSION_MAX["eligibility_geographic_fit"]},
                "pursuit_feasibility": {"score": pursuit_score, "max": _DIMENSION_MAX["pursuit_feasibility"]},
            },
            "matched_capabilities": matched_caps,
            "gaps": gaps,
            "explanation": explanation,
            "content_hash": content_hash,
            "analyzed_at": now.isoformat(),
        },
    }
