from selenium.webdriver.common.by import By

class MainPageLocators(object):
    """A class for main page locators. All main page locators should come here"""

    
    LOGIN_Button =(By.XPATH, '/html/body/app-root/body/app-user/div[1]/mat-card/button/span[1]')
    REGISTRER_Button = (By.XPATH, '/html/body/app-root/body/app-user/div[2]/mat-card/button/span[1]')
    UpVote_Button = (By.XPATH, '/html/body/app-root/body/app-post-template/body/app-post[1]/mat-card/div[1]/button[1]')
    DownVote_Button = (By.XPATH, '/html/body/app-root/body/app-post-template/body/app-post[1]/mat-card/div[1]/button[2]')
    Password_Field = (By.XPATH, '/html/body/app-root/body/app-user/div[1]/mat-card/mat-form-field[2]/div/div[1]/div/input')
    Menu_Button = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    Loggout_Button_inMenu = (By.XPATH, '/html/body/div[1]/div[2]/div/div/div/button[2]')
    
    Shop_Button = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/a[2]')
    
    #Home 
    Home_Button = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/a[1]')
    CreateNewPost_Button = (By.XPATH, '/html/body/app-root/body/app-post-template/body/mat-card/div/button/span[1]')
    ##to Posts
    Title_Field = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    SelectPostCategory_Field = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    Menu_Button = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    Menu_Button = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    
    
    

class SearchResultsPageLocators(object):
    """A class for search results locators. All search results locators should
    come here"""
    
    pass