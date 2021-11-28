from requests.api import get
from selenium import webdriver
from bs4 import BeautifulSoup
import sys
import base64

def main(url):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)
    driver.get(url)
    subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''').get_attribute("aria-label").split(' ')[1]
    channelName = driver.find_element_by_xpath('''//*[@id="channel-name"]''').get_attribute('innerText')
    profileImg = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/tp-yt-app-header-layout/div/tp-yt-app-header/div[2]/div[2]/div/div[1]/yt-img-shadow/img''').get_attribute("src")

    if "천" in subscriber:
        subscriber = subscriber.replace("천명", "a")
    elif "만" in subscriber:
        subscriber = subscriber.replace("만명", "b")
    elif "억" in subscriber:
        subscriber = subscriber.replace("억명", "c")

    print(base64.b64encode(f"{subscriber}::{channelName}::{profileImg}".encode("utf-8")))
    driver.quit()

if __name__ == "__main__":
    main(sys.argv[1])