from typing import Dict, List, Optional
from .base_scraper import BaseScraper
from bs4 import BeautifulSoup
import requests
from typing import Any, Dict, List, Optional, TypeVar, Type, cast, TYPE_CHECKING
if TYPE_CHECKING:
    from .base_scraper import BaseScraper

class PPAScraper(BaseScraper):
    """Scraper for Ghana's Public Procurement Authority"""
    
    def __init__(self, config: Dict):
        super().__init__(config)
        self.session = requests.Session()
    
    def scrape(self) -> List[Dict]:
        """Scrape tender/EOI listings from PPA with retry logic and rate limiting"""
        data = []
        current_url = self.config['base_url']
        max_retries = 3
        retry_delay = 5  # seconds
        
        while current_url:
            retries = 0
            while retries < max_retries:
                try:
                    response = self.session.get(current_url, timeout=30)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    listings = soup.select(self.config['list_selector'])
                    for listing in listings:
                        item = {
                            'title': listing.select_one(self.config['title_selector']).text.strip(),
                            'date': listing.select_one(self.config['date_selector']).text.strip(),
                            'description': listing.select_one(self.config['desc_selector']).text.strip(),
                            'link': listing.select_one(self.config['link_selector'])['href'],
                            'type': self.config['type'],
                            'source': self.config['source']
                        }
                        
                        if self.validate_data(item) and not self.should_filter(item):
                            data.append(item)
                    
                    current_url = self.get_next_page(soup)
                    break  # Success, break out of retry loop
                    
                except requests.exceptions.RequestException as e:
                    retries += 1
                    if retries < max_retries:
                        self.logger.warning(f"Retrying {current_url} (attempt {retries}/{max_retries}) due to: {str(e)}")
                        time.sleep(retry_delay)
                    else:
                        self.logger.error(f"Failed to scrape {current_url} after {max_retries} attempts: {str(e)}")
                        break
                
                # Rate limiting between pages
                time.sleep(2)  # Wait 2 seconds between pages
        
        return data
    
    def get_next_page(self, soup: BeautifulSoup) -> Optional[str]:
        """Get URL for next page"""
        next_link = soup.select_one(self.config['next_selector'])
        if next_link and 'href' in next_link.attrs:
            return next_link['href']
        return None
