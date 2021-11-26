from requests.api import get
import selenium
from selenium import webdriver
from time import sleep
import time

def getInfo(url):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)
    driver.get(url)
    subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''')
    subscriber = subscriber.get_attribute("aria-label")
    print(subscriber)

getInfo("https://www.youtube.com/c/PartitionZion")