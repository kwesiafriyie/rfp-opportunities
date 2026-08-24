"""Sends an HTML digest email to subscribers when new consulting
opportunities are found. Credentials come from environment variables only --
see backend/.env.example. If SMTP isn't configured, sending is skipped
(logged, not an error) so the scraper never fails because of email.
"""
import logging
import smtplib
from email.message import EmailMessage
from html import escape
from typing import List

from ..core.config import settings
from ..models.opportunity import Opportunity

logger = logging.getLogger(__name__)


def _format_date(opportunity: Opportunity) -> str:
    if not opportunity.published_at:
        return "Date unknown"
    return opportunity.published_at.strftime("%b %d, %Y")


def _build_html(opportunities: List[Opportunity]) -> str:
    rows = "".join(
        f"""
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
            <a href="{escape(o.link)}" style="color:#2563eb;text-decoration:none;font-weight:600;font-size:15px;line-height:1.4;">
              {escape(o.title)}
            </a>
            <div style="margin-top:6px;">
              <span style="display:inline-block;background:#eff6ff;color:#2563eb;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;padding:2px 8px;border-radius:999px;">
                {escape(o.source)}
              </span>
              <span style="color:#9ca3af;font-size:12px;margin-left:8px;">{_format_date(o)}</span>
            </div>
          </td>
        </tr>
        """
        for o in opportunities
    )

    count = len(opportunities)
    return f"""
    <html>
      <body style="margin:0;padding:24px 16px;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;">New Consulting Opportunities</h1>
            <p style="color:#dbeafe;margin:8px 0 0;font-size:13px;">
              {count} new notice{'s' if count != 1 else ''} found across standard.gm, thepoint.gm, and foroyaa.net
            </p>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;background:#ffffff;">
            {rows}
          </table>
          <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:18px 24px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              You're receiving this because your email is subscribed to Consulting Opportunities updates.
            </p>
          </div>
        </div>
      </body>
    </html>
    """


def send_digest(opportunities: List[Opportunity], recipients: List[str]) -> None:
    """Email a digest of newly found opportunities to every recipient.
    No-ops (with a log line) if there's nothing to send or SMTP isn't
    configured.
    """
    if not opportunities or not recipients:
        return

    if not settings.EMAIL_ENABLED:
        logger.info("SMTP not configured (SMTP_USER/SMTP_PASSWORD unset) -- skipping email digest")
        return

    count = len(opportunities)
    subject = f"{count} new consulting opportunit{'y' if count == 1 else 'ies'} found"
    html = _build_html(opportunities)
    from_addr = settings.FROM_EMAIL or settings.SMTP_USER

    try:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            for recipient in recipients:
                msg = EmailMessage()
                msg["Subject"] = subject
                msg["From"] = from_addr
                msg["To"] = recipient
                msg.set_content("View this email in an HTML-compatible client to see the opportunities.")
                msg.add_alternative(html, subtype="html")
                server.send_message(msg)
        logger.info(f"Sent opportunity digest to {len(recipients)} recipient(s)")
    except Exception as e:
        logger.error(f"Failed to send email digest: {e}")
