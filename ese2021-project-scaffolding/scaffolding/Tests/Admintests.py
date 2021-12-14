import unittest
from selenium import webdriver
import page
import time

class WebseitTester(unittest.TestCase):
    """This is a test Case for the Website YB Fan Community """

    def setUp(self):
        self.driver = webdriver.Chrome("C:\Program Files (x86)\chromedriver.exe")
        self.driver.get("http://localhost:4200/user")
        #Login
        
   
        
       
    def test_log_in(self):
        main_page = page.MainPage(self.driver)
        #Sets the text of Name textbox to "nora"
        main_page.search_text_element = "Max"
        #Sets the Password in the Password Field to "notSecure12!"
        time.sleep(1)
        main_page.search_passwordLogin_element = "notSecure12!"
        #Click the Loggin Button
        main_page.click_Login_button()
        time.sleep(3)
        
        
        search_results_page = page.SearchResultsPage(self.driver)
        #Verifies that the results page is not empty
        assert search_results_page.is_not_logged_in_found(), "Loggin failed"
        time.sleep(1)
        
        
        
        
    
    def tearDown(self):
         main_page = page.MainPage(self.driver)
         
        
       

if __name__ == "__main__":
    unittest.main()