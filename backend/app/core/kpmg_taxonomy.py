"""KPMG Technology Advisory capability taxonomy -- reference data only.

Not imported or read by any pipeline, endpoint, or UI code yet. This exists
purely as prep for the future "KPMG Fit" capability described in the
"KPMG Fit Feasibility" assessment: when that feature is actually built, its
capability-mapping step reads this structure rather than embedding capability
names inline in scoring logic. Adding it now costs nothing (it's inert data,
not a wired-up feature) and means the taxonomy can be refined independently
of -- and well before -- any scoring/matching code exists.

Structure, per the assessment's own recommendation (§3): capabilities as the
primary axis, cross-tagged with technology/platform names as a secondary
facet, rather than a single strict tree -- a real notice ("SAP S/4HANA
migration for a national tax authority") needs to hit a Powered capability
*and* the SAP platform tag *and* a Government industry tag simultaneously,
which a strict tree can't express.

Grounding status: the three pillars (Connected/Powered/Trusted) and the
platform alliance list are confirmed from KPMG's own public materials
(researched via web search earlier in this session). The leaf-level
capability names below are a reasonable starting structure, NOT yet verified
against KPMG Ghana's own IT Advisory pages (kpmg.com/gh/en/services/advisory/
risk-consulting/information-technology-advisory/{Connected,powered,trusted}.
html) -- that domain is blocked from this environment's egress proxy, so
those pages haven't been read directly. Treat CAPABILITIES below as a draft
to be corrected against the real page content, not as verified fact; nothing
here should be copied into the keyword filter (keywords.py) without that
grounding, per the assessment's own "don't copy marketing language blindly"
principle.
"""

PILLARS = ("Connected", "Powered", "Trusted", "Data")

# label -> {"pillar": ..., "description": ...}. No match_phrases yet -- those
# get added once the leaf names are verified against KPMG's own page content,
# not guessed. classify_sector()/keywords.py stay the only things that
# actually run against opportunity text; this taxonomy is a *finer-grained*
# layer for future capability-mapping, not a replacement for the existing
# sector classifier.
CAPABILITIES = {
    "Digital Transformation": {"pillar": "Connected", "description": "Customer/digital experience and channel transformation"},
    "API Strategy": {"pillar": "Connected", "description": "API design, governance, and strategy"},
    "Integration Architecture": {"pillar": "Connected", "description": "Enterprise/systems integration architecture"},
    "Payments": {"pillar": "Connected", "description": "Payments modernization and infrastructure"},
    "Core Banking": {"pillar": "Connected", "description": "Core banking platform transformation"},
    "Technology Architecture": {"pillar": "Connected", "description": "Target-state technology architecture design"},

    "ERP Transformation": {"pillar": "Powered", "description": "ERP-led business transformation (KPMG's \"Powered Enterprise\")"},
    "ERP Implementation": {"pillar": "Powered", "description": "ERP platform implementation"},
    "Process Transformation": {"pillar": "Powered", "description": "Business process reform enabled by a technology platform"},
    "Cloud": {"pillar": "Powered", "description": "Cloud migration and modernization"},

    "Data Strategy": {"pillar": "Data", "description": "Data strategy and governance"},
    "Data Architecture": {"pillar": "Data", "description": "Data architecture and modernization"},
    "Analytics": {"pillar": "Data", "description": "BI / analytics"},
    "AI & GenAI": {"pillar": "Data", "description": "AI/ML and generative AI"},

    "Cybersecurity": {"pillar": "Trusted", "description": "Cybersecurity strategy and operations"},
    "IT Risk": {"pillar": "Trusted", "description": "IT risk and controls"},
    "Privacy": {"pillar": "Trusted", "description": "Data privacy and protection"},
    "Compliance": {"pillar": "Trusted", "description": "Regulatory/technology compliance"},
}

# Confirmed via public KPMG alliance pages (not Ghana-specific, but these
# partnerships are consistent across KPMG's member firms).
PLATFORMS = ("SAP", "Oracle", "Microsoft", "ServiceNow", "Workday")
