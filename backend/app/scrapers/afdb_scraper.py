from typing import Dict, List, Optional
from .base_scraper import BaseScraper
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from typing import Any, Dict, List, Optional, TypeVar, Type, cast, TYPE_CHECKING
if TYPE_CHECKING:
    from .base_scraper import BaseScraper

class AfDBScraper(BaseScraper):
    """Scraper for African Development Bank consultant positions"""
    
    def __init__(self, config: Dict):
        super().__init__(config)
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Selenium WebDriver"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        self.driver = webdriver.Chrome(options=chrome_options)
    
    def scrape(self) -> List[Dict]:
        """Scrape consultant positions from AfDB with retry logic"""
        data = []
        max_retries = 3
        retry_delay = 5  # seconds
        
        for attempt in range(max_retries):
            try:
                self.driver.get(self.config['base_url'])
                
                # Wait for page to load with increased timeout
                WebDriverWait(self.driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, self.config['list_selector']))
                )
                
                listings = self.driver.find_elements(By.CSS_SELECTOR, self.config['list_selector'])
                for listing in listings:
                    try:
                        item = {
                            'title': listing.find_element(By.CSS_SELECTOR, self.config['title_selector']).text.strip(),
                            'date': listing.find_element(By.CSS_SELECTOR, self.config['date_selector']).text.strip(),
                            'description': listing.find_element(By.CSS_SELECTOR, self.config['desc_selector']).text.strip(),
                            'link': listing.find_element(By.CSS_SELECTOR, self.config['link_selector']).get_attribute('href'),
                            'type': self.config['type'],
                            'source': self.config['source']
                        }
                        
                        if self.validate_data(item) and not self.should_filter(item):
                            data.append(item)
                    except Exception as e:
                        self.logger.warning(f"Error processing listing: {str(e)}")
                
                break  # Success, break out of retry loop
                
            except Exception as e:
                if attempt < max_retries - 1:
                    self.logger.warning(f"Retrying AfDB scrape (attempt {attempt + 1}/{max_retries}) due to: {str(e)}")
                    time.sleep(retry_delay)
                else:
                    self.logger.error(f"Failed to scrape AfDB after {max_retries} attempts: {str(e)}")
                    break
        
        self.driver.quit()
        return data
    
    def get_next_page(self, driver) -> Optional[str]:
        """Get URL for next page"""
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, self.config['next_selector'])
            if next_button.is_enabled():
                return next_button.get_attribute('href')
        except:
            pass
        return None
