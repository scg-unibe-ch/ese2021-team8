from selenium.webdriver.common.by import By

class MainPageLocators(object):
    """A class for main page locators. All main page locators should come here"""

    
   
    
    Shop_Button                 = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/a[2]')
    
    #Home 
    Home_Button                 = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/a[1]')
    CreateNewPost_Button        = (By.XPATH, '/html/body/app-root/body/app-post-template/body/mat-card/div/button')
    ##to Posts
    SelectPostCategory_Field    = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    PublishPost_Button          = (By.XPATH, '/html/body/app-root/body/app-post-template/body/div/mat-card/button[2]')
    DropDownForCategory_Button  = (By.XPATH, '/html/body/app-root/body/app-post-template/body/div/mat-card/mat-form-field[2]/div/div[1]/div/mat-select/div/div[2]')
    CategoryMannschaft_Button   = (By.XPATH, '/html/body/div[2]/div[2]/div/div/div/mat-option[1]')
    Menu_Button                 = (By.XPATH, '/html/body/app-root/body/nav/div[2]/div/div/div/button/span[1]/mat-icon')
    
    ##interact with the Posts
    UpVote_Button               = (By.XPATH, '/html/body/app-root/body/app-post-template/body/app-post[1]/mat-card/div[1]/button[1]')
    DownVote_Button             = (By.XPATH, '/html/body/app-root/body/app-post-template/body/app-post[1]/mat-card/div[1]/button[2]')
    
    
    
    #Profile
    LOGIN_Button                = (By.XPATH, '/html/body/app-root/body/app-user/body/div[1]/mat-card/form/button')
   
    
    REGISTRER_Button            = (By.XPATH, '/html/body/app-root/body/app-user/div[2]/mat-card/button/span[1]')
    Loggout_Button              = (By.XPATH, '/html/body/app-root/body/app-profile/div/mat-drawer-container/mat-drawer/div/nav[3]/div[2]/div/div/a')
    
    #Menu
    Menu_Button                 = (By.XPATH, "/html/body/app-root/body/nav/div[2]/div/div/div/button")
    LoggoutInMenu_Button        = (By.XPATH, "/html/body/app-root/body/app-profile/div/mat-drawer-container/mat-drawer/div/nav[5]/div[2]/div/div/a/mat-icon")
    
    #shop
    Buy_Now                     =  (By.XPATH, "/html/body/app-root/body/app-shop/div[1]/div[1]/app-shop-items/mat-card/div/button")
    Buy_Now_inCheckout          =  (By.XPATH, "/html/body/div[2]/div[2]/div/mat-dialog-container/app-checkout/div/mat-card/button[2]/span[2]")
    Buy_Now_Bestätigung         =  (By.XPATH, "/html/body/div[2]/div[2]/div/mat-dialog-container/app-checkout/div/mat-card/button[1]")
    
    
    

class SearchResultsPageLocators(object):
    """A class for search results locators. All search results locators should
    come here"""
    
    pass