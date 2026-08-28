"""KPMG Technology Advisory capability taxonomy.

Read by kpmg_fit_engine.py's capability-mapping step -- this is the single
source of truth both that engine and any future replacement (embeddings,
LLM, ...) should read capability names/descriptions from, rather than
embedding them inline in scoring logic.

`match_phrases` per capability are deliberately specific multi-word phrases,
not bare words -- same collision-safety discipline as keywords.py (see that
file's own docstring): "quality assurance", "current state assessment", and
similar generic KPMG service names are left with NO match_phrases rather
than a phrase that would false-positive across unrelated procurement text.
An empty match_phrases list means that capability is real (kept for
completeness/description) but the engine currently has no safe way to
detect it from text alone -- not a bug, a documented limitation.

Structure, per the assessment's own recommendation (§3): capabilities as the
primary axis, cross-tagged with technology/platform names as a secondary
facet, rather than a single strict tree -- a real notice ("SAP S/4HANA
migration for a national tax authority") needs to hit a Powered capability
*and* the SAP platform tag *and* a Government industry tag simultaneously,
which a strict tree can't express.

Grounding status: Connected/Powered/Trusted are transcribed from KPMG
Ghana's own IT Advisory pages (kpmg.com/gh/en/services/advisory/
risk-consulting/information-technology-advisory/{Connected,powered,
trusted}.html), pasted in directly since that domain is blocked from this
environment's egress proxy. The Data pillar is NOT grounded the same way --
KPMG Ghana's dedicated Data page wasn't part of what was captured, so its
entries are still the earlier draft (marked below) and shouldn't be treated
as verified. Service names below are KPMG's own headings/groupings, not
individual line-item bullets -- the full page content has more granular
sub-bullets under each of these than are worth encoding here.
"""

PILLARS = ("Connected", "Powered", "Trusted", "Data")

# label -> {"pillar": ..., "description": ..., "match_phrases": [...]}
CAPABILITIES = {
    # --- Connected (kpmg.com/gh .../Connected.html) ---
    "Payments Strategy": {"pillar": "Connected", "description": "National/institutional payment strategy, product & technology strategy, operating model design", "match_phrases": ["payments strategy", "payment strategy", "national payment strategy"]},
    "Payments Platform Modernisation": {"pillar": "Connected", "description": "End-to-end payments modernisation across high-value, low-value, instant, cards, cross-border", "match_phrases": ["payments modernisation", "payments modernization", "payment platform"]},
    "ISO 20022 Conversion": {"pillar": "Connected", "description": "ISO 20022 messaging migration for national switches and financial institutions", "match_phrases": ["iso 20022"]},
    "Instant & Real-Time Payments": {"pillar": "Connected", "description": "Real-time/instant payment scheme design, readiness, and enablement", "match_phrases": ["instant payments", "real-time payments", "real time payments"]},
    "Payment Regulatory Risk & Controls": {"pillar": "Connected", "description": "Payments risk frameworks, SWIFT CSP, scheme compliance, controls automation", "match_phrases": ["swift csp", "payment compliance"]},
    "Payment Security & Fraud": {"pillar": "Connected", "description": "Payment security/fraud risk assessment, PCI DSS, AML, VAPT for payment infrastructure", "match_phrases": ["payment security", "pci dss"]},
    "Embedded Finance": {"pillar": "Connected", "description": "Payments/product strategy for fintechs, PSPs, and non-bank players", "match_phrases": ["embedded finance"]},
    "Mobile Payments": {"pillar": "Connected", "description": "Mobile payment platform strategy, optimisation, and UI/UX", "match_phrases": ["mobile payments", "mobile payment"]},
    "Digital Transformation Strategy": {"pillar": "Connected", "description": "AI/digital/IT maturity assessment and digital channel optimisation", "match_phrases": ["digital transformation", "digital maturity", "digital channels"]},
    "API Strategy & Integration Architecture": {"pillar": "Connected", "description": "API strategy, integration architecture review, API testing, open banking readiness", "match_phrases": ["integration architecture", "open banking"]},
    "Core Banking": {"pillar": "Connected", "description": "Core banking assessment, vendor selection, architecture review", "match_phrases": ["core banking"]},
    "Cloud & DevOps": {"pillar": "Connected", "description": "Cloud migration strategy, cloud readiness, FinOps/cost optimisation", "match_phrases": ["cloud migration", "cloud readiness", "devops"]},
    "UI/UX Design": {"pillar": "Connected", "description": "Digital product UI/UX review, design, and prototyping", "match_phrases": ["user experience design"]},

    # --- Powered (kpmg.com/gh .../powered.html) ---
    "ERP Implementation": {"pillar": "Powered", "description": "Greenfield ERP implementation -- process design, configuration, data migration", "match_phrases": ["erp implementation", "erp greenfield"]},
    "ERP System Upgrade": {"pillar": "Powered", "description": "Brownfield ERP upgrades -- technical migration, custom code adaptation", "match_phrases": ["erp upgrade", "erp brownfield"]},
    "ERP Quality Assurance": {"pillar": "Powered", "description": "Deliverable/methodology review and go-live readiness assurance for ERP programs", "match_phrases": []},
    "ERP Current State Assessment": {"pillar": "Powered", "description": "Technology landscape, process, and readiness assessment ahead of an ERP program", "match_phrases": []},
    "ERP Post Implementation Review": {"pillar": "Powered", "description": "Post-go-live system performance, adoption, and process-effectiveness review", "match_phrases": ["post implementation review"]},

    # --- Trusted (kpmg.com/gh .../trusted.html) ---
    "Technical Cyber Security Assessment": {"pillar": "Trusted", "description": "Vulnerability assessment, penetration testing, breach/compromise assessment", "match_phrases": ["penetration testing"]},
    "Cyber Security Strategy & Governance": {"pillar": "Trusted", "description": "Cyber strategy, architecture, security compliance (ISO 27xxx, PCI DSS, SWIFT CSP), third-party risk", "match_phrases": ["cyber security strategy", "cybersecurity strategy", "security architecture"]},
    "Security Transformation & Integration": {"pillar": "Trusted", "description": "Cyber solutions implementation, CISO-as-a-Service, SecOps", "match_phrases": ["ciso-as-a-service", "secops", "security automation"]},
    "Data Privacy & Protection": {"pillar": "Trusted", "description": "Privacy strategy/governance, data protection audits, outsourced DPO", "match_phrases": ["data protection", "data privacy", "privacy strategy"]},
    "Cyber Incident Response & Recovery": {"pillar": "Trusted", "description": "Incident response/recovery strategy, simulation exercises, cyber recovery services", "match_phrases": ["cyber incident response"]},

    # --- Data -- NOT grounded against KPMG's own Data page (not captured yet); draft only.
    # match_phrases below are still individually safe/collision-checked -- the
    # thing that's unverified is whether this is really how KPMG groups its
    # Data offering, not whether these phrases are safe text signals.
    "Data Strategy": {"pillar": "Data", "description": "Data strategy and governance (unverified draft)", "match_phrases": ["data strategy", "data governance"]},
    "Data Architecture": {"pillar": "Data", "description": "Data architecture and modernization (unverified draft)", "match_phrases": ["data architecture", "data modernisation", "data modernization"]},
    "Analytics": {"pillar": "Data", "description": "BI / analytics (unverified draft)", "match_phrases": ["business intelligence", "data analytics"]},
    "AI & GenAI": {"pillar": "Data", "description": "AI/ML and generative AI (unverified draft)", "match_phrases": ["generative ai", "artificial intelligence strategy"]},
}

# Confirmed via public KPMG alliance pages (not Ghana-specific, but these
# partnerships are consistent across KPMG's member firms).
PLATFORMS = ("SAP", "Oracle", "Microsoft", "ServiceNow", "Workday")
