"""Sends an HTML digest email to subscribers when new consulting
opportunities are found, via the Resend HTTP API (plain SMTP doesn't work
from Render -- see RESEND_API_KEY in app/core/config.py). Credentials come
from environment variables only -- see backend/.env.example. If Resend isn't
configured, sending is skipped (logged, not an error) so the scraper never
fails because of email.
"""
import logging
from html import escape
from typing import List

import requests

from ..core.config import settings
from ..models.opportunity import Opportunity

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"

# (background, text) per source, matching the frontend's badge colors. Falls
# back to a neutral slate for any source not listed here, so a new source
# doesn't need an email-template change to render correctly.
SOURCE_COLORS = {
    "standard.gm": ("#eff6ff", "#1d4ed8"),
    "thepoint.gm": ("#ecfdf5", "#047857"),
    "foroyaa.net": ("#f5f3ff", "#6d28d9"),
}
DEFAULT_SOURCE_COLOR = ("#f1f5f9", "#475569")


def _format_date(opportunity: Opportunity) -> str:
    if not opportunity.published_at:
        return "Date unknown"
    return opportunity.published_at.strftime("%b %d, %Y")


def _build_html(opportunities: List[Opportunity]) -> str:
    sources = sorted({o.source for o in opportunities})
    rows = "".join(
        f"""
        <tr>
          <td style="padding:18px 24px;border-bottom:1px solid #e2e8f0;border-left:3px solid {SOURCE_COLORS.get(o.source, DEFAULT_SOURCE_COLOR)[1]};">
            <a href="{escape(o.link)}" style="color:#0f172a;text-decoration:none;font-weight:600;font-size:17px;line-height:1.4;font-family:Georgia,'Times New Roman',serif;">
              {escape(o.title)}
            </a>
            <div style="margin-top:8px;">
              <span style="display:inline-block;background:{SOURCE_COLORS.get(o.source, DEFAULT_SOURCE_COLOR)[0]};color:{SOURCE_COLORS.get(o.source, DEFAULT_SOURCE_COLOR)[1]};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;padding:3px 9px;border-radius:4px;">
                {escape(o.source)}
              </span>
              <span style="color:#94a3b8;font-size:13px;margin-left:10px;">{_format_date(o)}</span>
            </div>
          </td>
        </tr>
        """
        for o in opportunities
    )

    count = len(opportunities)
    return f"""
    <html>
      <body style="margin:0;padding:32px 16px;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:#0f172a;padding:28px 28px 24px;">
            <p style="color:#f59e0b;margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;">
              New Notices
            </p>
            <h1 style="color:#ffffff;margin:0;font-size:26px;font-family:Georgia,'Times New Roman',serif;font-weight:700;">
              {count} Consulting Opportunit{'y' if count == 1 else 'ies'}
            </h1>
            <p style="color:#94a3b8;margin:10px 0 0;font-size:14px;">
              Found across {len(sources)} source{'s' if len(sources) != 1 else ''}: {escape(", ".join(sources))}
            </p>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            {rows}
          </table>
          <div style="padding:20px 24px;text-align:center;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              You're receiving this because your email is subscribed to Consulting Opportunities updates.
            </p>
          </div>
        </div>
      </body>
    </html>
    """


def send_digest(opportunities: List[Opportunity], recipients: List[str]) -> None:
    """Email a digest of newly found opportunities to every recipient.
    No-ops (with a log line) if there's nothing to send or Resend isn't
    configured. Sends one API call per recipient so a single bad address
    doesn't block the rest.
    """
    if not opportunities or not recipients:
        return

    if not settings.EMAIL_ENABLED:
        logger.info("RESEND_API_KEY not configured -- skipping email digest")
        return

    count = len(opportunities)
    subject = f"{count} new consulting opportunit{'y' if count == 1 else 'ies'} found"
    html = _build_html(opportunities)
    headers = {"Authorization": f"Bearer {settings.RESEND_API_KEY}"}

    sent = 0
    for recipient in recipients:
        try:
            response = requests.post(
                RESEND_API_URL,
                headers=headers,
                json={
                    "from": settings.FROM_EMAIL,
                    "to": [recipient],
                    "subject": subject,
                    "html": html,
                },
                timeout=20,
            )
            response.raise_for_status()
            sent += 1
        except requests.RequestException as e:
            logger.error(f"Failed to send email digest to {recipient}: {e}")

    logger.info(f"Sent opportunity digest to {sent}/{len(recipients)} recipient(s)")
