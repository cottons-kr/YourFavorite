from requests.api import get
from selenium import webdriver
import sys

def main(url):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)
    driver.get(url)
    subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''')
    subscriber = subscriber.get_attribute("aria-label")
    channelName = driver.find_element_by_xpath('''//*[@id="channel-name"]''')
    avatar = driver.find_element_by_xpath('''//*[@id="img"]''')
    print(subscriber.split(' ')[1].encode())
    driver.quit()

if __name__ == "__main__":
    main(sys.argv[1])