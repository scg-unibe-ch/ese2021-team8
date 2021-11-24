import unittest
from selenium import webdriver
import page
import time

class WebseitTester(unittest.TestCase):
    """This is a test Case for the Website """

    def setUp(self):
        self.driver = webdriver.Chrome("C:\Program Files (x86)\chromedriver.exe")
        self.driver.get("http://localhost:4200/user")
        #Login
        
        main_page = page.MainPage(self.driver)
        #Checks if the word "YB Fan Community" is in title
        assert main_page.is_title_matches(), "python.org title doesn't match."
        #Sets the text of Name textbox to "nora"
        main_page.search_text_element = "Nora"
        #Sets the Password in the Password Field to "notSecure12!"
        main_page.search_password_element = "notSecure12!"
        #Click the Loggin Button
        main_page.click_Login_button()
        
        search_results_page = page.SearchResultsPage(self.driver)
        #Verifies that the results page is not empty
        assert search_results_page.is_not_logged_in_found(), "Loggin failed"
        
   
        

    def test_Up_Vote (self):
        """Hier is the first """
        main_page = page.MainPage(self.driver)
        
        time.sleep(1)

    def tearDown(self):
         main_page = page.MainPage(self.driver)
        
        self.driver.close()

if __name__ == "__main__":
    unittest.main()