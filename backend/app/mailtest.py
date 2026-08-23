import smtplib
from email.message import EmailMessage
import logging
import sqlite3

def send_email():

    recipients = [
        "kae.afriyie@gmail.com",
        "afriyie.kae@gmail.com"
    ]

    # msg = EmailMessage()
    # msg['Subject'] = "New Tender Listings"
    # msg['From'] = "00erictest@gmail.com"
    # msg['To'] = recipients

    body = "New Listings:\n\n"
    body += "Tender Type: Request for Proposal\n"
    body += "Title: Request for Proposal for the Supply of Goods\n"
    body += "Hello just testinggg againnnnn\n\n\n"
    body += "This is an automated email. Please do not reply.\n"

    

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login("00erictest@gmail.com", "kweg kxpw dssk zfme")
            for recipient in recipients:
                msg = EmailMessage()
                msg['Subject'] = "New Tender Listings"
                msg['From'] = "00erictest@gmail.com"
                msg['To'] = recipient
                msg.set_content(body)
                
                
                server.send_message(msg)
            logging.info("Email sent successfully.")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

send_email()
