
# scraper.py
import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime
import logging
import time
import smtplib
from email.message import EmailMessage
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Setup logging
logging.basicConfig(level=logging.INFO, filename="job_scraper.log", filemode="a",
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Site configurations with explicit selectors
SITE_CONFIGS = {
    "ppa_eois": {
        "base_url": "https://tenders.ppa.gov.gh/eois",
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "desc_selector": "div.list-desc",
        "link_selector": "a",
        "next_selector": "a.page-link[rel='next']",
        "type": "EOI",
        "use_selenium": False,
        "filter_past_deadlines": True,
        "source": "ppa"
    },
    "ppa_rfps": {
        "base_url": "https://tenders.ppa.gov.gh/tenders",
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "desc_selector": "div.list-desc",
        "link_selector": "a",
        "next_selector": "a.page-link[rel='next']",
        "type": "RFP",
        "use_selenium": False,
        "filter_past_deadlines": True,
        "source": "ppa"
    },
    "afdb_consultants": {
        "base_url": "https://www.afdb.org/en/about-us/careers/current-vacancies/consultants",
        "base1_url": "https://www.afdb.org/",
        "list_selector": "table.vacancies-table-display tbody tr",
        "title_selector": "td.views-field-title a",
        "posted_date_selector": "td.views-field-created",
        "deadline_selector": "td.views-field-unpublish-on",
        "desc_selector": "td.views-field-field-consultant-type",
        "link_selector": "td.views-field-title a",
        "next_selector": "li.next a",
        "type": "EOI",
        "filter_consultant_type": "Firm Consultant",
        "use_selenium": True,
        "filter_past_deadlines": True,
        "source": "afdb"
    }
}




import smtplib
from email.message import EmailMessage



# def send_email(new_entries):
#     recipients = [
#         "kae.afriyie@gmail.com",
#         "afriyie.kae@gmail.com"
#     ]

#     if not new_entries:
#         return

    
#     # msg.set_content("This is an automated email. Please do not reply.")

#     body = "New Listings:\n\n"
#     for entry in new_entries:
#         body += f"Title: {entry[1]}\nDeadline: {entry[3]}\nLink: {entry[5]}\n\n\n"
#     body += "This is an automated email. Please do not reply.\n"

#     try:
#         with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
#             server.login("00erictest@gmail.com", "kweg kxpw dssk zfme")
            
#             for recipient in recipients:
#                 msg = EmailMessage()
#                 msg['Subject'] = f"{len(new_entries)} New Tender Listings"
#                 msg['From'] = "00erictest@gmail.com"
#                 msg['To'] = recipient
#                 msg.set_content(body)

#                 server.send_message(msg)
#         logging.info("Email sent successfully.")
#     except Exception as e:
#         logging.error(f"Failed to send email: {e}")



def send_email(new_entries):
    recipients = [
        "kae.afriyie@gmail.com",
        "afriyie.kae@gmail.com"
    ]

    if not new_entries:
        return

    # Start HTML email body
    html = """
    <html>
        <body>
            <p>New Listings:</p>
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                <thead style="background-color: #f2f2f2;">
                    <tr>
                        <th>Title</th>
                        <th>Deadline</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
    """

    for entry in new_entries:
        title = entry[1]
        deadline = entry[3]
        link = entry[5]
        html += f"""
            <tr>
                <td>{title}</td>
                <td>{deadline}</td>
                <td><a href="{link}">View Details</a></td>
            </tr>
        """

    html += """
                </tbody>
            </table>
            <p style="margin-top: 20px;color:red">This is an automated email. Please do not reply.</p>
        </body>
    </html>
    """

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login("00erictest@gmail.com", "kweg kxpw dssk zfme")

            for recipient in recipients:
                msg = EmailMessage()
                msg['Subject'] = f"{len(new_entries)} New Tender Listings"
                msg['From'] = "00erictest@gmail.com"
                msg['To'] = recipient
                msg.set_content("This is an HTML email. Please view it in an HTML-compatible client.")
                msg.add_alternative(html, subtype='html')  # Attach the HTML part

                server.send_message(msg)

        logging.info("Email sent successfully.")

    except Exception as e:
        logging.error(f"Failed to send email: {e}")




# Database connection
conn = sqlite3.connect("tender_jobs.db")
cursor = conn.cursor()

# Date parsing
def convert_date(date_str):
    date_str = date_str.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "").strip()
    formats = ["%d %B, %Y", "%d %B %Y", "%B %d, %Y", "%d-%b-%Y", "%Y-%m-%d"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    logging.warning(f"Failed to parse date: {date_str}")
    return None

# Scrape function
def scrape_page(url, config):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/"
    }
    
    if not config.get("use_selenium", False):
        try:
            logging.info(f"Attempting to scrape with requests: {url}")
            # Use verify=False if specified in config
            response = requests.get(url, headers=headers, timeout=10, verify=config.get("verify_ssl", True))
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
        except requests.RequestException as e:
            logging.error(f"Requests failed for {url}: {e}")
            return [], None
    else:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument(f"user-agent={headers['User-Agent']}")
        try:
            with webdriver.Chrome(options=chrome_options) as driver:
                logging.info(f"Attempting to scrape with Selenium: {url}")
                driver.get(url)
                WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.CSS_SELECTOR, config["list_selector"])))
                soup = BeautifulSoup(driver.page_source, "html.parser")
        except Exception as e:
            logging.error(f"Selenium failed for {url}: {e}")
            return [], None

    listings = soup.select(config["list_selector"])
    logging.info(f"Found {len(listings)} listings on {url}")
    if not listings:
        logging.debug(f"Page HTML snippet: {soup.prettify()[:1000]}")

    data = []
    today = datetime.today()
    for listing in listings:
        try:
            # PPA-specific parsing
            if "ppa" in url:
                title = listing.select_one(config["title_selector"])
                date_elem = listing.select_one(config["date_selector"])
                desc_elem = listing.select_one(config["desc_selector"])
                link_elem = listing.select_one(config["link_selector"])

                if not all([title, date_elem, link_elem]):
                    logging.warning(f"Missing required elements in PPA listing: {listing.prettify()[:200]}")
                    continue

                title = title.text.strip()
                date_text = date_elem.text.strip()
                description = desc_elem.text.strip() if desc_elem else "No description available"
                link = link_elem["href"]
                link = link if link.startswith("http") else f"{config['base_url']}/{link.lstrip('/')}"
                type_value = config["type"]

                date_lines = [line.strip() for line in date_text.split("\n") if line.strip()]
                if len(date_lines) >= 2:
                    posted_date = date_lines[0]
                    deadline_line = date_lines[1]
                    if "Deadline :" in deadline_line:
                        deadline = deadline_line.replace("Deadline :", "").strip()
                    else:
                        logging.warning(f"Deadline format unexpected: {deadline_line}")
                        continue
                else:
                    logging.warning(f"Date split failed: {date_text}")
                    continue

            # AfDB-specific parsing
            elif "afdb" in url:
                title = listing.select_one(config["title_selector"])
                posted_date_elem = listing.select_one(config["posted_date_selector"])
                deadline_elem = listing.select_one(config["deadline_selector"])
                desc_elem = listing.select_one(config["desc_selector"])
                link_elem = listing.select_one(config["link_selector"])

                if not all([title, posted_date_elem, deadline_elem, desc_elem, link_elem]):
                    logging.warning(f"Missing required elements in AfDB listing: {listing.prettify()[:200]}")
                    continue

                consultant_type = desc_elem.text.strip()
                if "filter_consultant_type" in config and consultant_type != config["filter_consultant_type"]:
                    logging.debug(f"Skipped {title.text.strip()}: Consultant type '{consultant_type}' != '{config['filter_consultant_type']}'")
                    continue

                title = title.text.strip()
                posted_date = posted_date_elem.text.strip()
                deadline = deadline_elem.text.strip()
                description = consultant_type
                link = link_elem["href"]
                link = link if link.startswith("http") else f"{config['base1_url']}{link}"
                type_value = config["type"]

            # TENDERS.com.gh-specific parsing
            else:
                title = listing.select_one(config["title_selector"])
                posted_date_elem = listing.select_one(config["posted_date_selector"])
                deadline_elem = listing.select_one(config["deadline_selector"])
                desc_elem = listing.select_one(config["desc_selector"])
                link_elem = listing.select_one(config["link_selector"])
                type_elem = listing.select_one(config["type_selector"])

                if not all([title, posted_date_elem, deadline_elem, link_elem, type_elem]):
                    logging.warning(f"Missing required elements in TENDERS.com.gh listing: {listing.prettify()[:200]}")
                    continue

                # Check category filter
                categories = [span.text.strip() for span in desc_elem.select("span a")] if desc_elem else []
                if "filter_category" in config and config["filter_category"] not in categories:
                    logging.debug(f"Skipped {title.text.strip()}: Category '{config['filter_category']}' not found in {categories}")
                    continue

                title = title.text.strip()
                posted_date = posted_date_elem.text.strip().replace("\xa0", " ")
                deadline = deadline_elem.text.strip().replace("\xa0", " ")
                description = desc_elem.text.strip() if desc_elem else "No description available"
                link = link_elem["href"]
                type_value = type_elem.text.strip()

            # Common processing
            deadline_date = convert_date(deadline)
            if deadline_date:
                if config.get("filter_past_deadlines", True) and deadline_date < today:
                    logging.debug(f"Skipped {title}: Deadline {deadline} is past {today.strftime('%Y-%m-%d')}")
                    continue
                status = "Critical" if (deadline_date - today).days <= 7 else "Active"
                data.append((type_value, title, posted_date, deadline, description, link, status, config["source"]))
                logging.debug(f"Added: Type={type_value}, Title={title}, Deadline={deadline}, Description={description[:50]}..., Status={status}, Source={config['source']}")
            else:
                logging.debug(f"Skipped {title}: Deadline {deadline} unparseable")

        except AttributeError as e:
            logging.warning(f"Parsing error: {e}")
    return data, soup

# Get next page URL
def get_next_page_url(soup, config):
    next_url = soup.select_one(config["next_selector"])
    if next_url and "href" in next_url.attrs:
        href = next_url["href"]
        logging.info(f"Next page href: {href}")
        base_url = config['base_url'].rstrip('/')
        if href.startswith("http"):
            return href
        elif href.startswith("/"):
            domain = "https://www.afdb.org" if "afdb" in config['base_url'] else "https://tenders.ppa.gov.gh" if "ppa" in config['base_url'] else "https://tenders.com.gh"
            return f"{domain}{href}"
        else:
            return f"{base_url}?{href}"
    logging.info("No next page found")
    return None

# Save to database
def save_to_db(data):
    cursor.executemany("""
        INSERT OR REPLACE INTO jobs (type, title, posted_date, deadline, description, link, status, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, data)
    conn.commit()
    logging.info(f"Saved/Updated {len(data)} records to database.")

# Main scraping function
def scrape_all():
    for site_name, config in SITE_CONFIGS.items():
        logging.info(f"Scraping {site_name}: {config['base_url']}")
        current_url = config['base_url']
        new_entries = []  # List to hold new entries
        while current_url:
            data, soup = scrape_page(current_url, config)
            if data:
                new_data = []
                for entry in data:
                    cursor.execute("SELECT 1 FROM jobs WHERE link = ?", (entry[5],))
                    if not cursor.fetchone():  # If the link doesn't exist in the database
                        new_data.append(entry)
                if new_data:
                    new_entries.extend(new_data)
                save_to_db(data)
            if soup:
                current_url = get_next_page_url(soup, config)
            else:
                break
            time.sleep(2)
            # After scraping all pages for this site, send an email if there are new entries
            if new_entries:
                send_email(new_entries)
    logging.info("Scraping complete!")

if __name__ == "__main__":
    scrape_all()
    conn.close()
