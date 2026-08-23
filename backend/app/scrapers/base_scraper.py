from abc import ABC, abstractmethod
import logging
from typing import Dict, List, Optional
from datetime import datetime
from typing import Any, Dict, List, Optional, TypeVar, Type, cast, TYPE_CHECKING
if TYPE_CHECKING:
    from .ppa_scraper import PPAScraper
    from .afdb_scraper import AfDBScraper

class BaseScraper(ABC):
    """Abstract base class for all scrapers"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
        self.setup_logging()
    
    def setup_logging(self):
        """Setup logger for the scraper"""
        self.logger.setLevel(logging.INFO)
        handler = logging.FileHandler('job_scraper.log', mode='a')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    @abstractmethod
    def scrape(self) -> List[Dict]:
        """Scrape data from the source"""
        pass
    
    @abstractmethod
    def get_next_page(self) -> Optional[str]:
        """Get URL for next page if available"""
        pass
    
    def validate_data(self, data: Dict) -> bool:
        """Validate scraped data"""
        required_fields = ['title', 'date', 'description', 'link', 'type', 'source']
        return all(field in data for field in required_fields)
    
    def format_date(self, date_str: str) -> datetime:
        """Format date string to datetime object, handling multiple formats"""
        date_str = date_str.strip()
        # Remove any extra text before the date
        if ':' in date_str:
            date_str = date_str.split(':')[1].strip()
        
        # Try multiple date formats
        date_formats = [
            '%dth %B, %Y',  # e.g., 21st June, 2024
            '%dnd %B, %Y',  # e.g., 22nd June, 2024
            '%drd %B, %Y',  # e.g., 23rd June, 2024
            '%dst %B, %Y',  # e.g., 1st June, 2024
            '%d %B, %Y',    # e.g., 2 June, 2024
            '%d %b, %Y',    # e.g., 2 Jun, 2024
            '%Y-%m-%d'      # e.g., 2024-06-21
        ]
        
        for date_format in date_formats:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                continue
        
        self.logger.warning(f"Could not parse date: {date_str}")
        return datetime.now()
    
    def should_filter(self, data: Dict) -> bool:
        """Check if data should be filtered out"""
        if self.config.get('filter_past_deadlines', False):
            date = self.format_date(data['date'])
            return date < datetime.now()
        return False
