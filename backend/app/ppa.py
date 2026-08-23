
# import time
# import pandas as pd
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options

# # Set up Selenium in headless mode
# chrome_options = Options()
# chrome_options.add_argument("--headless")  # Run in headless mode
# chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
# driver = webdriver.Chrome(options=chrome_options)

# # Base URL of the EOI page
# base_url = "https://tenders.ppa.gov.gh/eois"

# # List to store all scraped EOIs
# eois = []

# # Function to scrape a single page
# def scrape_page(url):
#     driver.get(url)
#     time.sleep(5)  # Wait for the page to load

#     # Parse the page content with Beautiful Soup
#     soup = BeautifulSoup(driver.page_source, 'html.parser')

#     # Find the container holding the RFP/EOI listings
#     listings = soup.find_all('div', class_='list-wrap')  
    
#     print(f"Found {len(listings)} listings on the page.")
#     if listings:
#         print(listings[0].prettify())

#     # Loop through each listing and extract details
#     for listing in listings:
#         title = listing.find('div', class_='list-agency').text.strip()  
#         description = listing.find('div', class_='list-date').text.strip()  
#         date = listing.find('div', class_='list-desc').text.strip()  
#         link = listing.find('a')['href']  
#         # full_link = f"https://tenders.ppa.gov.gh{link}"  # Construct full URL if needed
#         full_link = link  # Construct full URL if needed

#         # Append the data to the list
#         eois.append({
#             "Title": title,
#             "Description": description,
#             "Date": date,
#             "Link": full_link
#         })

# # Function to get the next page URL
# def get_next_page_url(soup):
#     next_button = soup.find('a', class_='page-link', rel='next')  
#     if next_button and 'href' in next_button.attrs:
#         next_page_url = next_button['href']  # Get the href attribute
#         if next_page_url.startswith('http'):  # Check if the link is already a full URL
#             return next_page_url
#         else:
#             return f"https://tenders.ppa.gov.gh{next_button['href']}"
        
#     return None

# # Main loop to scrape all pages
# current_url = base_url
# while current_url:
#     print("we here baby")
#     print(current_url)
#     print(f"Scraping page: {current_url}")
#     scrape_page(current_url)  # Scrape the current page

#     # Check for the next page
#     soup = BeautifulSoup(driver.page_source, 'html.parser')
#     current_url = get_next_page_url(soup)

# # Close the Selenium browser
# driver.quit()

# # Save the scraped data to a CSV file
# df = pd.DataFrame(eois)
# df.to_csv("eois.csv", index=False)
# print("Scraping complete! Data saved to 'eois.csv'.")




















#added deadline limits

# import time 
# import pandas as pd
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from datetime import datetime

# # Set up Selenium in headless mode
# chrome_options = Options()
# chrome_options.add_argument("--headless")
# chrome_options.add_argument("--disable-gpu")
# driver = webdriver.Chrome(options=chrome_options)

# # Base URL of the EOI page
# base_url = "https://tenders.ppa.gov.gh/eois"

# # List to store all scraped EOIs
# eois = []

# # Function to clean and convert date
# def convert_date(date_str):
#     """
#     Convert '02nd July, 2024' to datetime format.
#     """
#     try:
#         date_str = date_str.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "")  # Remove suffixes
#         return datetime.strptime(date_str, "%d %B, %Y")
#     except ValueError as e:
#         print(f"Error parsing date: {date_str} - {e}")
#         return None  # Return None if parsing fails

# # Function to scrape a single page
# def scrape_page(url):
#     driver.get(url)
#     time.sleep(5)  # Wait for the page to load

#     # Parse the page content with BeautifulSoup
#     soup = BeautifulSoup(driver.page_source, 'html.parser')

#     # Find all listings
#     listings = soup.find_all('div', class_='list-wrap')  
#     print(f"Found {len(listings)} listings on the page.")

#     today = datetime.today()  # Get today's date

#     # Loop through each listing and extract details
#     for listing in listings:
#         title = listing.find('div', class_='list-agency').text.strip()  
#         description = listing.find('div', class_='list-date').text.strip()  # Contains deadline & posted date
#         link = listing.find('a')['href']  
#         full_link = link  # Assuming the link is already a full URL

#         # Extract deadline and posted date from 'description'
#         date_parts = description.split("|")
#         if len(date_parts) >= 2:
#             posted_date_text = date_parts[0].strip().replace("Posted on:", "").strip()
#             deadline_text = date_parts[1].strip().replace("Deadline:", "").strip()
            
#             # Convert deadline to datetime
#             deadline_date = convert_date(deadline_text)

#             # Only save tenders with future deadlines
#             if deadline_date and deadline_date >= today:
#                 eois.append({
#                     "Title": title,
#                     "Posted Date": posted_date_text,
#                     "Deadline": deadline_text,
#                     "Link": full_link
#                 })

# # Function to get the next page URL
# def get_next_page_url(soup):
#     next_button = soup.find('a', class_='page-link', rel='next')  
#     if next_button and 'href' in next_button.attrs:
#         next_page_url = next_button['href']
#         return f"https://tenders.ppa.gov.gh{next_page_url}" if not next_page_url.startswith("http") else next_page_url
#     return None

# # Main loop to scrape all pages
# current_url = base_url
# while current_url:
#     print(f"Scraping page: {current_url}")
#     scrape_page(current_url)  # Scrape the current page

#     # Check for the next page
#     soup = BeautifulSoup(driver.page_source, 'html.parser')
#     current_url = get_next_page_url(soup)

# # Close the Selenium browser
# driver.quit()

# # Save the scraped data to a CSV file
# df = pd.DataFrame(eois)
# df.to_csv("eois.csv", index=False)
# print("Scraping complete! Data saved to 'eois.csv'.")










# import time
# import pandas as pd
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from datetime import datetime

# # Set up Selenium in headless mode
# chrome_options = Options()
# chrome_options.add_argument("--headless")
# chrome_options.add_argument("--disable-gpu")
# driver = webdriver.Chrome(options=chrome_options)

# # Base URL of the EOI page
# base_url = "https://tenders.ppa.gov.gh/eois"
# eois = []  # List to store all EOIs
# today = datetime.today()  # Get today's date once instead of multiple times

# # Function to convert date string to datetime object
# def convert_date(date_str):
#     try:
#         date_str = date_str.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "")  # Remove suffixes
#         return datetime.strptime(date_str, "%d %B, %Y")
#     except ValueError:
#         return None  # If conversion fails, return None

# # Function to scrape a single page
# def scrape_page(url):
#     driver.get(url)

#     # Wait for page content to load dynamically instead of using time.sleep
#     try:
#         WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.CLASS_NAME, "list-wrap"))
#         )
#     except Exception as e:
#         print(f"Timeout error loading page: {url} - {e}")
#         return

#     # Parse with BeautifulSoup
#     soup = BeautifulSoup(driver.page_source, 'html.parser')

#     # Find all listings
#     listings = soup.find_all('div', class_='list-wrap')  
#     print(f"Found {len(listings)} listings on the page.")

#     # Extract data efficiently
#     extracted_data = []
#     for listing in listings:
#         title = listing.find('div', class_='list-agency').text.strip()
#         description = listing.find('div', class_='list-date').text.strip()
#         link = listing.find('a')['href']

#         # Extract posted date & deadline
#         date_parts = description.split("|")
#         if len(date_parts) >= 2:
#             posted_date_text = date_parts[0].strip().replace("Posted on:", "").strip()
#             deadline_text = date_parts[1].strip().replace("Deadline:", "").strip()
#             deadline_date = convert_date(deadline_text)

#             if deadline_date and deadline_date >= today:
#                 extracted_data.append({
#                     "Title": title,
#                     "Posted Date": posted_date_text,
#                     "Deadline": deadline_text,
#                     "Link": link
#                 })

#     # Extend eois list after processing all items (faster than appending inside loop)
#     eois.extend(extracted_data)
#     return soup  # Return soup to reuse in pagination

# # Function to get the next page URL
# def get_next_page_url(soup):
#     next_button = soup.find('a', class_='page-link', rel='next')
#     if next_button and 'href' in next_button.attrs:
#         return f"https://tenders.ppa.gov.gh{next_button['href']}" if not next_button['href'].startswith("http") else next_button['href']
#     return None

# # Main loop to scrape all pages
# current_url = base_url
# while current_url:
#     print(f"Scraping: {current_url}")
#     soup = scrape_page(current_url)  # Scrape and get BeautifulSoup object
#     if not soup:
#         break  # Stop if scraping fails

#     current_url = get_next_page_url(soup)  # Find next page URL

# # Close browser
# driver.quit()

# # Save data to CSV
# df = pd.DataFrame(eois)
# df.to_csv("eois.csv", index=False)
# print("Scraping complete! Data saved to 'eois.csv'.")






import time
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import requests
from io import BytesIO

# Set up Selenium in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
driver = webdriver.Chrome(options=chrome_options)

# Base URL of the EOI page
base_url = "https://tenders.ppa.gov.gh/eois"
eois = []  # List to store all EOIs
today = datetime.today()  # Get today's date once instead of multiple times

# Function to convert date string to datetime object
def convert_date(date_str):
    try:
        date_str = date_str.replace("st", "").replace("nd", "").replace("rd", "").replace("th", "")  # Remove suffixes
        return datetime.strptime(date_str, "%d %B, %Y")
    except ValueError:
        return None  # If conversion fails, return None

# Function to scrape a single page
def scrape_page(url):
    driver.get(url)

    # Wait for page content to load dynamically instead of using time.sleep
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "list-wrap"))
        )
    except Exception as e:
        print(f"Timeout error loading page: {url} - {e}")
        return

    # Parse with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Find all listings
    listings = soup.find_all('div', class_='list-wrap')  
    print(f"Found {len(listings)} listings on the page.")

    # Extract data efficiently
    extracted_data = []
    for listing in listings:
        title = listing.find('div', class_='list-agency').text.strip()  # Example: Tender title
        description = listing.find('div', class_='list-date').text.strip()  # Example: Deadline
        link = listing.find('a')['href']

        # Extract posted date & deadline
        date_parts = description.split("|")
        if len(date_parts) >= 2:
            posted_date_text = date_parts[0].strip().replace("Posted on:", "").strip()
            deadline_text = date_parts[1].strip().replace("Deadline:", "").strip()
            deadline_date = convert_date(deadline_text)

            if deadline_date and deadline_date >= today:
                extracted_data.append({
                    "Title": title,
                    "Posted Date": posted_date_text,
                    "Deadline": deadline_text,
                    "Link": link,
                    "Status": "Active"  # Default status
                })

    # Extend eois list after processing all items (faster than appending inside loop)
    eois.extend(extracted_data)
    return soup  # Return soup to reuse in pagination

# Function to get the next page URL
def get_next_page_url(soup):
    next_button = soup.find('a', class_='page-link', rel='next')
    if next_button and 'href' in next_button.attrs:
        return f"https://tenders.ppa.gov.gh{next_button['href']}" if not next_button['href'].startswith("http") else next_button['href']
    return None

# Function to get access token for Microsoft Graph API
def get_access_token():
    client_id = "4ccba41a-ef2b-4d76-8787-af46d5d8b82a"
    client_secret = "c4964dea-e49b-4aaa-8df2-701c9e4c2c28"
    tenant_id = "f50221b0-9f06-46fc-a435-36ee68817b8d"

    url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "https://graph.microsoft.com/.default"
    }

    response = requests.post(url, data=data)
    if response.status_code != 200:
        raise Exception("Failed to get access token")
    return response.json().get("access_token")

# Function to download the existing Excel file from OneDrive
def download_file_from_onedrive():
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
    }

    file_url = "https://graph.microsoft.com/v1.0/me/drive/root:/EOIs.xlsx:/content"
    response = requests.get(file_url, headers=headers)

    if response.status_code == 200:
        return BytesIO(response.content)  # Return file content as a BytesIO object
    else:
        raise Exception("Failed to download file from OneDrive")

# Function to update the Excel file with new data
def update_excel_file(existing_file):
    # Load existing Excel file into a DataFrame
    df_existing = pd.read_excel(existing_file)

    # Convert scraped data to DataFrame
    df_new = pd.DataFrame(eois)

    # Append new data to existing data (remove duplicates)
    df_updated = pd.concat([df_existing, df_new]).drop_duplicates(subset=["Title"], keep="last")

    # Mark critical deadlines (within 7 days)
    df_updated["Deadline Date"] = pd.to_datetime(df_updated["Deadline"], format="%d %B, %Y")
    df_updated["Status"] = df_updated.apply(
        lambda row: "Critical" if (row["Deadline Date"] - today) <= timedelta(days=7) else row["Status"],
        axis=1
    )

    return df_updated


  # Function to save and upload the updated Excel file
def save_and_upload_excel_file(df, file_path):
    # Save DataFrame to Excel
    df.to_excel(file_path, index=False)

    # Upload the updated file to OneDrive
    upload_file_to_onedrive(file_path)


    

# Function to upload the updated Excel file to OneDrive
def upload_file_to_onedrive(file_path):
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/octet-stream"
    }

    with open(file_path, "rb") as file:
        file_content = file.read()

    upload_url = "https://graph.microsoft.com/v1.0/me/drive/root:/EOIs.xlsx:/content"
    response = requests.put(upload_url, headers=headers, data=file_content)

    if response.status_code == 200:
        print("File uploaded to OneDrive successfully!")
    else:
        print("Failed to upload file:", response.text)


  


# Main loop to scrape all pages
current_url = base_url
while current_url:
    print(f"Scraping: {current_url}")
    soup = scrape_page(current_url)  # Scrape and get BeautifulSoup object
    if not soup:
        break  # Stop if scraping fails

    current_url = get_next_page_url(soup)  # Find next page URL

# Close browser
driver.quit()

# Step 1: Download the existing Excel file from OneDrive
try:
    existing_file = download_file_from_onedrive()
except Exception as e:
    print(e)
    exit()

# Step 2: Update the Excel file with new data
df_updated = update_excel_file(existing_file)

# Step 3: Save and upload the updated Excel file
save_and_upload_excel_file(df_updated, "EOIs.xlsx")
print("Scraping and update complete! Data saved to OneDrive.")