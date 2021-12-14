# This File is a documentation of the Tests

# With Selenium IDE

You can add Selenium IDE on your Chrome and can test it with this. This Cases are slower, it can "check" the
website faster and it's easier. You can import the test cases with "Open an existing project". In The Test suites,
you have two test suites, one for a logged-in user and for a not-logged-in user, this tests checke if all functions are visible.
There work on Firefox or Chrome.


# Python with Selenium

## How you use it: 

First you need to have Python 3 and Selenium installed.
To Install Python you can take a look at:

https://www.computerwoche.de/a/wie-sie-python-richtig-installieren,3548847

Second you need Selenium installed:

pip install selenium

After This you need a Driver, we used a Webdriver for Windows and for Mac. You need to change the Pfad to your Driver. 
For my Device the Pfad is "C:\Program Files (x86)\chromedriver.exe" you can also give the Pfad to the chromedriver.exe in this Folder.

If you use a Mac the ChromeDriver have a little bit truble with "!" so you need to change the Keyboard Layout. 
You can use the chromedriver in this folder

## Chrome
### Set Up 

Here is what happend befor each Case. Create a Driver, open the Website, and login. And checked if 
we are logged in. 

### Create a Post 

It Make a Post in the Category Mannschaft, with a Title and e text and checked if the Post is available on the Website.


