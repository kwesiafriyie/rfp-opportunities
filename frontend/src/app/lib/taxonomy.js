// Shared source/type/sector option lists for the admin intake and edit
// forms -- mirrors the normalized values the backend's classifiers and
// scrapers already produce (see backend/app/core/normalize.py), so a
// manually-entered opportunity looks and filters identically to a scraped
// one rather than introducing a parallel vocabulary.

export const SOURCES = [
  "standard.gm",
  "thepoint.gm",
  "foroyaa.net",
  "dailyobservergambia.com",
  "gambiatenders.com",
  "tenders.gm",
  "gppa.gm",
  "tenders.ppa.gov.gh",
  "tenders.com.gh",
  "UNGM",
  "AfDB",
];

export const OPPORTUNITY_TYPES = [
  "Individual Consultant",
  "Expression of Interest",
  "Request for Proposal",
  "Request for Quotation",
  "Invitation to Bid",
  "Request for Pre-Qualification",
  "Request for Information",
  "Grant / Call for Proposals",
  "Implementing Partner",
  "Pre-Bid Notice",
  "Consultancy",
];

export const SECTORS = [
  "Technology",
  "Finance & Audit",
  "Legal",
  "Monitoring & Evaluation",
  "Engineering & Infrastructure",
  "Health",
  "Education",
  "Human Resources",
  "Procurement",
  "Strategy & Management",
  "Research",
];
