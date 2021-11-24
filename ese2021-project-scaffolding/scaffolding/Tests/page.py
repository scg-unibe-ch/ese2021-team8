from element import BasePageElement
from locator import MainPageLocators


class SearchTextElement(BasePageElement):
    """This class gets the search text from the specified locator"""

    #The locator for search box where search string is entered
    locator = 'name'
class PasswordElement(BasePageElement):
    """This class gets the search text from the specified locator"""

    #The locator for search box where search string is entered
    locator = 'password'



class BasePage(object):
    """Base class to initialize the base page that will be called from all
    pages"""

    def __init__(self, driver):
        self.driver = driver


class MainPage(BasePage):
    """Home page action methods come here."""

    #Declares a variable that will contain the retrieved text
    search_text_element = SearchTextElement()
    search_password_element = PasswordElement()

    def is_title_matches(self):
        """Verifies that the hardcoded text "YB Fan Community" appears in page title"""

        return "YB Fan Community" in self.driver.title

    def click_Login_button(self):
       
        element = self.driver.find_element(*MainPageLocators.LOGIN_Button)
        element.click()
        
    def click_REGISTRER_Button(self):
        element = self.driver.find_element(*MainPageLocators.REGISTRER_Button)
        element.click
        
    def click_UpVote_Button(self):
        element= self.driver.find_element(*MainPageLocators.UpVote_Button)
        element.click
        
    def click_DownVote_Button(self):
        element= self.driver.find_element(*MainPageLocators.DownVote_Button)
        element.click
        
   def click_Home_Button(self):
        element = self.driver.find_element(*MainPageLocators.Home_Button)
        element.click
    
        
class SearchResultsPage(BasePage):
    """Search results page action methods come here"""

    def is_not_logged_in_found(self):
        # Probably should search for this text in the specific page
        # element, but as for now it works fine
        return "Username/Email invalid" not in self.driver.page_source
        
    