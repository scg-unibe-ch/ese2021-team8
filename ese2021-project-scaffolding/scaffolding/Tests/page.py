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
    
class TitleElement(BasePageElement):
    locator = 'title'
    
class PostTextElement(BasePageElement):

    locator = 'content_field'



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
    search_title_element = TitleElement()
    search_postText_element = PostTextElement()
    
    #checkers:
    def is_title_matches(self):
        """Verifies that the hardcoded text "YB Fan Community" appears in page title"""

        return "YB Fan Community" in self.driver.title
    
    
    def is_title_matches(self):
        """Verifies that the hardcoded text "YB Fan Community" appears in page title"""

        return "YB Fan Community" in self.driver.title

    def click_Login_button(self):
       
        element = self.driver.find_element(*MainPageLocators.LOGIN_Button)
        element.click()
        
    def click_REGISTRER_Button(self):
        element2 = self.driver.find_element(*MainPageLocators.REGISTRER_Button)
        element2.click
        
    def click_UpVote_Button(self):
        element3= self.driver.find_element(*MainPageLocators.UpVote_Button)
        element3.click
        
    def click_DownVote_Button(self):
        element= self.driver.find_element(*MainPageLocators.DownVote_Button)
        element.click
        
    def click_Home_Button(self):
        element = self.driver.find_element(*MainPageLocators.Home_Button)
        element.click
        
    def click_Loggout_Button(self):
        element = self.driver.find_element(*MainPageLocators.Loggout_Button)
        element.click
        
    def click_CreateNewPost_Button(self):
       
        element = self.driver.find_element(*MainPageLocators.CreateNewPost_Button)
        element.click()
        
    def click_Category_Button(self):
       
        element = self.driver.find_element(*MainPageLocators.DropDownForCategory_Button)
        element.click()
        
    def click_CategoryMannschaft_Button(self):
       
        element = self.driver.find_element(*MainPageLocators.CategoryMannschaft_Button)
        element.click()
    
    def click_PublishPost_Button(self):
       
        element = self.driver.find_element(*MainPageLocators.PublishPost_Button)
        element.click()
    
        
class SearchResultsPage(BasePage):
    """Search results page action methods come here"""

    def is_not_logged_in_found(self):
        # Probably should search for this text in the specific page
        # element, but as for now it works fine
        return "Username/Email invalid" not in self.driver.page_source
        
    def is_Title_Post_Publish_found(self):
        # Probably should search for this text in the specific page
        # element, but as for now it works fine
        return "Selenium Generierter Title" in self.driver.page_source
        
    def is_Text_Post_Publish_found(self):
        # Probably should search for this text in the specific page
        # element, but as for now it works fine
        return  "Selenium Generierter Text" in self.driver.page_source
        
    