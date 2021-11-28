from requests.api import get
from selenium import webdriver
from bs4 import BeautifulSoup
import sys
import time
import base64

def main(url, type):
    options = webdriver.ChromeOptions()
    #options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)

    if type == "simple":
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
    
    elif type == "recentVideos":
        driver.get(url+"/videos")
        driver.execute_script("window.scrollTo(0, 10000)")
        time.sleep(2)
        recentVideos = driver.find_element_by_xpath("/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-grid-renderer/div[1]")
        recentVideos = recentVideos.find_elements_by_tag_name("ytd-grid-video-renderer")
        for video in recentVideos:
            print(video.find_element_by_id("video-title").get_attribute("aria-label"))
            print(video.find_element_by_id("video-title").get_attribute("href"))
            continue

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])