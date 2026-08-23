

# scraper.py
import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime
import logging
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import warnings
from urllib3.exceptions import InsecureRequestWarning

# Suppress SSL verification warning for TENDERS.com.gh
warnings.filterwarnings("ignore", category=InsecureRequestWarning)

# Setup logging
logging.basicConfig(level=logging.INFO, filename="job_scraper.log", filemode="a",
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Site configurations with explicit selectors
SITE_CONFIGS = {
    "ppa_eois": {
        "base_url": "https://tenders.ppa.gov.gh/eois?industry=3&cat=3",  # IT Services & Consultancy Services
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "desc_selector": "div.list-desc",
        "link_selector": "a",
        "next_selector": "a.page-link[rel='next']",
        "type": "EOI",
        "use_selenium": False,
        "filter_types": ["Expression of Interest", "Request for Proposal"],
        "source": "ppa"
    },
    "ppa_rfps": {
        "base_url": "https://tenders.ppa.gov.gh/tenders?industry=3&cat=3",  # IT Services & Consultancy Services
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "desc_selector": "div.list-desc",
        "link_selector": "a",
        "next_selector": "a.page-link[rel='next']",
        "type": "RFP",
        "use_selenium": False,
        "filter_types": ["Expression of Interest", "Request for Proposal"],
        "source": "ppa"
    },
    "afdb_consultants": {
        "base_url": "https://www.afdb.org/en/about-us/careers/current-vacancies/consultants",
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
        "filter_types": ["Expression of Interest", "Request for Proposal"],
        "source": "afdb"
    },
    # "tenders_com_gh": {
    #     "base_url": "https://tenders.com.gh/tenders/lists",
    #     "list_selector": "ul#featured li",
    #     "title_selector": "h4.title-header a",
    #     "posted_date_selector": "p span.text-success",
    #     "deadline_selector": "p span.text-danger",
    #     "desc_selector": "div.custom-breadcrumb:nth-child(2)",
    #     "link_selector": "h4.title-header a",
    #     "type_selector": "a.btn-type",
    #     "next_selector": "a[rel='next']",
    #     "use_selenium": False,
    #     "filter_category": "Information Technology (IT) & Telecommunications",
    #     "filter_types": ["Expression of Interest", "Request for Proposal"],
    #     "source": "tenders_com_gh",
    #     "verify_ssl": False
    # }
}

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

# Scrape function with stopping logic
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
            response = requests.get(url, headers=headers, timeout=10, verify=config.get("verify_ssl", True))
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
        except requests.RequestException as e:
            logging.error(f"Requests failed for {url}: {e}")
            return [], None, True  # Stop on failure
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
            return [], None, True  # Stop on failure

    listings = soup.select(config["list_selector"])
    logging.info(f"Found {len(listings)} listings on {url}")
    if not listings:
        logging.debug(f"Page HTML snippet: {soup.prettify()[:1000]}")
        return [], soup, False

    data = []
    today = datetime.today()
    stop_scraping = False

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
                    logging.debug(f"Skipped {title}: Consultant type '{consultant_type}' != '{config['filter_consultant_type']}'")
                    continue

                title = title.text.strip()
                posted_date = posted_date_elem.text.strip()
                deadline = deadline_elem.text.strip()
                description = consultant_type
                link = link_elem["href"]
                link = link if link.startswith("http") else f"{config['base_url']}{link}"
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

                categories = [span.text.strip() for span in desc_elem.select("span a")] if desc_elem else []
                if "filter_category" in config and config["filter_category"] not in categories:
                    logging.debug(f"Skipped {title}: Category '{config['filter_category']}' not found in {categories}")
                    continue

                title = title.text.strip()
                posted_date = posted_date_elem.text.strip().replace("\xa0", " ")
                deadline = deadline_elem.text.strip().replace("\xa0", " ")
                description = desc_elem.text.strip() if desc_elem else "No description available"
                link = link_elem["href"]
                type_value = type_elem.text.strip()

            # Type filter for all sites
            if "filter_types" in config and type_value not in config["filter_types"]:
                logging.debug(f"Skipped {title}: Type '{type_value}' not in {config['filter_types']}")
                continue

            # Common processing with stopping logic
            deadline_date = convert_date(deadline)
            if deadline_date:
                if deadline_date < today:
                    logging.info(f"Stopping scrape for {config['source']} at {url}: Found past deadline {deadline} for {title}")
                    stop_scraping = True
                    break  # Exit loop as soon as a past deadline is found
                status = "Critical" if (deadline_date - today).days <= 7 else "Active"
                data.append((type_value, title, posted_date, deadline, description, link, status, config["source"]))
                logging.debug(f"Added: Type={type_value}, Title={title}, Deadline={deadline}, Description={description[:50]}..., Status={status}, Source={config['source']}")
            else:
                logging.debug(f"Skipped {title}: Deadline {deadline} unparseable")

        except AttributeError as e:
            logging.warning(f"Parsing error: {e}")

    return data, soup, stop_scraping

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
            return f"{base_url}&{href}" if "?" in base_url else f"{base_url}?{href}"
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
        logging.info(f"Starting scrape for {site_name}: {config['base_url']}")
        current_url = config['base_url']
        while current_url:
            data, soup, stop_scraping = scrape_page(current_url, config)
            if data:
                save_to_db(data)
            if stop_scraping or not soup:
                logging.info(f"Stopped scraping {site_name}: {'Past deadline encountered' if stop_scraping else 'No more pages'}")
                break
            current_url = get_next_page_url(soup, config)
            if current_url:
                logging.info(f"Moving to next page: {current_url}")
            time.sleep(1)  # Reduced delay for efficiency
    logging.info("All scraping complete!")
    conn.close()

if __name__ == "__main__":
    scrape_all()

