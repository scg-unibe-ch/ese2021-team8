# This File is a documentation of the Tests

#Python with Selenium

## How you use it: 

First you need to have Python 3 and Selenium installed.
To Install Python you can take a look at: https://www.computerwoche.de/a/wie-sie-python-richtig-installieren,3548847

Second you need Selenium installed:

pip install selenium

After This you need a Driver, we used a Webdriver for Windows and for Mac. You need to change the Pfad to your Driver. 
For my Device the Pfad is "C:\Program Files (x86)\chromedriver.exe" you can also give the Pfad to the chromedriver in this Folder.

If you use a Mac the ChromeDriver have a little bit truble with "!" so you need to change the Keyboard Layout. 

## Chrome
### Set Up 

Here is what happend befor each Case. Create a Driver, open the Website, and login. And checked if 
we are logged in. 

### Create a Post 

It Make a Post in the Category Mannschaft, with a Title and e text and checked if the Post is avaible on the Website.

#With Selenium IDE 

You can also add Selenium IDE on your Chrome and can test it with this. This Cases are slower, it can't "check" the 
website.
