import time
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, filename="ppa_scraper.log", filemode="a",
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Set up Selenium in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")

# Site configurations for PPA Ghana (EOIs and RFPs)
SITE_CONFIGS = {
    "ppa_eois": {
        "base_url": "https://tenders.ppa.gov.gh/eois",
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "link_selector": "a",
        "date_split": "|",
        "posted_label": "Posted on:",
        "deadline_label": "Deadline:",
        "next_selector": "a.page-link[rel='next']",
        "type": "EOI"
    },
    "ppa_rfps": {  # Assuming tenders page for RFPs; adjust if different
        "base_url": "https://tenders.ppa.gov.gh/tenders",
        "list_selector": "div.list-wrap",
        "title_selector": "div.list-agency",
        "date_selector": "div.list-date",
        "link_selector": "a",
        "date_split": "|",
        "posted_label": "Posted on:",
        "deadline_label": "Deadline:",
        "next_selector": "a.page-link[rel='next']",
        "type": "RFP"
    }
}

job_data = []  # List to store EOIs and RFPs
today = datetime.today()

# Function to convert date string to datetime object
def convert_date(date_str):
    date_str = date_str.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "")
    formats = ["%d %B, %Y", "%d %B %Y", "%B %d, %Y"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    logging.warning(f"Failed to parse date: {date_str}")
    return None

# Function to scrape a single page
def scrape_page(driver, url, config, retries=3):
    for attempt in range(retries):
        try:
            driver.get(url)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, config["list_selector"])))
            soup = BeautifulSoup(driver.page_source, "html.parser")
            listings = soup.select(config["list_selector"])
            logging.info(f"Found {len(listings)} listings on {url}")

            extracted_data = []
            for listing in listings:
                try:
                    title = listing.select_one(config["title_selector"]).text.strip()
                    date_text = listing.select_one(config["date_selector"]).text.strip()
                    link = listing.select_one(config["link_selector"])["href"]

                    date_parts = date_text.split(config["date_split"])
                    if len(date_parts) >= 2:
                        posted_date_text = date_parts[0].strip().replace(config["posted_label"], "").strip()
                        deadline_text = date_parts[1].strip().replace(config["deadline_label"], "").strip()
                        deadline_date = convert_date(deadline_text)

                        # if deadline_date and deadline_date >= today:
                        if deadline_date:
                            extracted_data.append({
                                "Type": config["type"],
                                "Title": title,
                                "Posted Date": posted_date_text,
                                "Deadline": deadline_text,
                                "Link": link if link.startswith("http") else f"{config['base_url']}/{link.lstrip('/')}",
                                "Status": "Active"
                            })
                except AttributeError as e:
                    logging.warning(f"Failed to parse listing on {url}: {e}")
                    continue

            job_data.extend(extracted_data)
            return soup
        except Exception as e:
            logging.error(f"Attempt {attempt + 1} failed for {url}: {e}")
            time.sleep(2)
    logging.error(f"Failed to scrape {url} after {retries} attempts")
    return None

# Function to get the next page URL
def get_next_page_url(soup, config):
    next_button = soup.select_one(config["next_selector"])
    if next_button and "href" in next_button.attrs:
        href = next_button["href"]
        return f"{config['base_url']}{href}" if not href.startswith("http") else href
    return None

# Function to scrape PPA sites
def scrape_ppa():
    with webdriver.Chrome(options=chrome_options) as driver:
        for site_name, config in SITE_CONFIGS.items():
            logging.info(f"Starting scrape for {site_name}: {config['base_url']}")
            current_url = config["base_url"]
            while current_url:
                soup = scrape_page(driver, current_url, config)
                if not soup:
                    break
                current_url = get_next_page_url(soup, config)

# Function to save data to Excel
def save_to_excel():
    if not job_data:
        logging.info("No data to save.")
        return
    
    df = pd.DataFrame(job_data)
    df["Deadline Date"] = pd.to_datetime(df["Deadline"], errors="coerce")
    df["Status"] = df.apply(
        lambda row: "Critical" if pd.notna(row["Deadline Date"]) and (row["Deadline Date"] - today) <= timedelta(days=7) else row["Status"],
        axis=1
    )
    df = df.drop(columns=["Deadline Date"])  # Remove temp column
    df.to_excel("PPA_Jobs.xlsx", index=False)
    logging.info("Data saved to PPA_Jobs.xlsx")

# Main execution
if __name__ == "__main__":
    scrape_ppa()
    save_to_excel()
    logging.info("Scraping complete!")