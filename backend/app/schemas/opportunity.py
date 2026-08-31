from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class DocumentOut(BaseModel):
    label: str
    url: str


class ExtraFieldOut(BaseModel):
    label: str
    value: str


class OpportunityOut(BaseModel):
    """Mirrors Opportunity.to_dict() field-for-field. This is the response
    shape for every public opportunity endpoint -- declaring it here (instead
    of the previous bare `response_model=dict`) is what makes the OpenAPI
    schema actually describe the payload, which is what any client (mobile
    included) needs to generate real types from it rather than `Record<string,
    any>`. Purely additive: the JSON on the wire is unchanged, since to_dict()
    already produces exactly these types.
    """

    id: int
    source: str
    title: str
    link: str
    excerpt: Optional[str] = None
    description: Optional[str] = None
    published_at: Optional[str] = None
    deadline: Optional[str] = None
    matched_keywords: List[str] = []
    organization: Optional[str] = None
    country: Optional[str] = None
    reference: Optional[str] = None
    opportunity_type: Optional[str] = None
    sector: Optional[str] = None
    eligibility: Optional[str] = None
    contact_info: Optional[str] = None
    documents: List[DocumentOut] = []
    extra: List[ExtraFieldOut] = []
    ingestion_method: str = "automated"
    # fit_tier/fit_score/fit_analysis are only meaningful when fit_status ==
    # "available" -- see the comments on the Opportunity model itself.
    fit_status: Optional[str] = None
    fit_score: Optional[int] = None
    fit_tier: Optional[str] = None
    # Left as a generic object rather than a fully-typed nested model: its
    # internal shape (breakdown/matched_capabilities/gaps/explanation) is an
    # implementation detail of kpmg_fit_engine.py that's still evolving --
    # over-specifying it here would make this schema go stale every time the
    # engine changes, for a field no client should be parsing structurally
    # yet anyway.
    fit_analysis: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
