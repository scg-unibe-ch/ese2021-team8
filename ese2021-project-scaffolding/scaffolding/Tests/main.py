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
        main_page = page.MainPage(self.driver)
                #Sets the text of Name textbox to "nora"
        main_page.search_text_element = "Nora"
        #Sets the Password in the Password Field to "notSecure12!"
        time.sleep(1)
        main_page.search_passwordLogin_element = "notSecure12!"
        #Click the Loggin Button
        main_page.click_Login_button()
        time.sleep(3)
        
        
        search_results_page = page.SearchResultsPage(self.driver)
        #Verifies that the results page is not empty
        assert search_results_page.is_not_logged_in_found(), "Loggin failed"
        
        
   
        

   
    def test_CreateNewPost (self):
        """Hier is the first """
        main_page = page.MainPage(self.driver)
        
        self.driver.get("http://localhost:4200/home")
        main_page.click_CreateNewPost_Button()
        time.sleep(1)
        main_page.search_title_element = "Selenium Generierter Title" 
        time.sleep(1)
        main_page.search_postText_element = "Selenium Generierter Text"
        time.sleep(1)
        main_page.click_Category_Button()
        time.sleep(1)
        main_page.click_CategoryMannschaft_Button()
        time.sleep(1)
        main_page.search_postTest_element= "Seleniu Generierter Text"
        main_page.click_PublishPost_Button()
        search_results_page = page.SearchResultsPage(self.driver)
        assert search_results_page.is_Title_Post_Publish_found(), "Title is lost."
        assert search_results_page.is_Text_Post_Publish_found(), "Text is lost."
    
    def tearDown(self):
         main_page = page.MainPage(self.driver)
       

if __name__ == "__main__":
    unittest.main()