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

# label -> {"pillar": ..., "description": ...}
CAPABILITIES = {
    # --- Connected (kpmg.com/gh .../Connected.html) ---
    "Payments Strategy": {"pillar": "Connected", "description": "National/institutional payment strategy, product & technology strategy, operating model design"},
    "Payments Platform Modernisation": {"pillar": "Connected", "description": "End-to-end payments modernisation across high-value, low-value, instant, cards, cross-border"},
    "ISO 20022 Conversion": {"pillar": "Connected", "description": "ISO 20022 messaging migration for national switches and financial institutions"},
    "Instant & Real-Time Payments": {"pillar": "Connected", "description": "Real-time/instant payment scheme design, readiness, and enablement"},
    "Payment Regulatory Risk & Controls": {"pillar": "Connected", "description": "Payments risk frameworks, SWIFT CSP, scheme compliance, controls automation"},
    "Payment Security & Fraud": {"pillar": "Connected", "description": "Payment security/fraud risk assessment, PCI DSS, AML, VAPT for payment infrastructure"},
    "Embedded Finance": {"pillar": "Connected", "description": "Payments/product strategy for fintechs, PSPs, and non-bank players"},
    "Mobile Payments": {"pillar": "Connected", "description": "Mobile payment platform strategy, optimisation, and UI/UX"},
    "Digital Transformation Strategy": {"pillar": "Connected", "description": "AI/digital/IT maturity assessment and digital channel optimisation"},
    "API Strategy & Integration Architecture": {"pillar": "Connected", "description": "API strategy, integration architecture review, API testing, open banking readiness"},
    "Core Banking": {"pillar": "Connected", "description": "Core banking assessment, vendor selection, architecture review"},
    "Cloud & DevOps": {"pillar": "Connected", "description": "Cloud migration strategy, cloud readiness, FinOps/cost optimisation"},
    "UI/UX Design": {"pillar": "Connected", "description": "Digital product UI/UX review, design, and prototyping"},

    # --- Powered (kpmg.com/gh .../powered.html) ---
    "ERP Implementation": {"pillar": "Powered", "description": "Greenfield ERP implementation -- process design, configuration, data migration"},
    "ERP System Upgrade": {"pillar": "Powered", "description": "Brownfield ERP upgrades -- technical migration, custom code adaptation"},
    "ERP Quality Assurance": {"pillar": "Powered", "description": "Deliverable/methodology review and go-live readiness assurance for ERP programs"},
    "ERP Current State Assessment": {"pillar": "Powered", "description": "Technology landscape, process, and readiness assessment ahead of an ERP program"},
    "ERP Post Implementation Review": {"pillar": "Powered", "description": "Post-go-live system performance, adoption, and process-effectiveness review"},

    # --- Trusted (kpmg.com/gh .../trusted.html) ---
    "Technical Cyber Security Assessment": {"pillar": "Trusted", "description": "Vulnerability assessment, penetration testing, breach/compromise assessment"},
    "Cyber Security Strategy & Governance": {"pillar": "Trusted", "description": "Cyber strategy, architecture, security compliance (ISO 27xxx, PCI DSS, SWIFT CSP), third-party risk"},
    "Security Transformation & Integration": {"pillar": "Trusted", "description": "Cyber solutions implementation, CISO-as-a-Service, SecOps"},
    "Data Privacy & Protection": {"pillar": "Trusted", "description": "Privacy strategy/governance, data protection audits, outsourced DPO"},
    "Cyber Incident Response & Recovery": {"pillar": "Trusted", "description": "Incident response/recovery strategy, simulation exercises, cyber recovery services"},

    # --- Data -- NOT grounded against KPMG's own Data page (not captured yet); draft only ---
    "Data Strategy": {"pillar": "Data", "description": "Data strategy and governance (unverified draft)"},
    "Data Architecture": {"pillar": "Data", "description": "Data architecture and modernization (unverified draft)"},
    "Analytics": {"pillar": "Data", "description": "BI / analytics (unverified draft)"},
    "AI & GenAI": {"pillar": "Data", "description": "AI/ML and generative AI (unverified draft)"},
}

# Confirmed via public KPMG alliance pages (not Ghana-specific, but these
# partnerships are consistent across KPMG's member firms).
PLATFORMS = ("SAP", "Oracle", "Microsoft", "ServiceNow", "Workday")
