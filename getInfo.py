from requests.api import get
from selenium import webdriver
#from bs4 import BeautifulSoup
import sys
import time
import base64

waitTime = 2

def main(url, type):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)

    if type == "simple":
        driver.get(url)
        time.sleep(waitTime)
        channelName = driver.find_element_by_xpath('''//*[@id="channel-name"]''').get_attribute('innerText')
        profileImg = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/tp-yt-app-header-layout/div/tp-yt-app-header/div[2]/div[2]/div/div[1]/yt-img-shadow/img''').get_attribute("src")
        print(base64.b64encode(f"{channelName}::{profileImg}".encode("utf-8")))
        driver.quit()

    elif type == "all":
        driver.get(url)
        driver.execute_script("window.scrollTo(0, 999999999)")
        time.sleep(waitTime)
        try:
            subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''').get_attribute("aria-label").split(' ')[1].replace('명', '')
        except:
            subscriber = "notShown"
        try:
            streamDiv = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse[1]/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer[1]/div[3]/ytd-channel-featured-content-renderer/div[2]''')
            streamDiv = streams.find_elements_by_tag_name("ytd-video-renderer")
            streams = []
        except:
            streams = "noStream"
        if streams != "noStream":
            for stream in streamDiv:
                streams.append(stream.find_element_by_xpath('''.//*[@id="thumbnail"]''').get_attribute("href"))

        driver.get(url+"/videos")
        driver.execute_script("window.scrollTo(0, 999999999)")
        time.sleep(waitTime)
        try:
            recentVideos = driver.find_element_by_xpath("/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-grid-renderer/div[1]")
            recentVideos = recentVideos.find_elements_by_tag_name("ytd-grid-video-renderer")
        except:
            recentVideos = "noVideo"
        if recentVideos != "noVideo":
            for video in recentVideos:
                videoInfo = video.find_element_by_id("video-title").get_attribute("aria-label")
                videoLink = video.find_element_by_id("video-title").get_attribute("href")
                videoView = videoInfo.split(" 조회수 ")[1].replace("회", '')
                videoName = videoInfo.split(" 게시자: ")[0]
                videoUpload = videoInfo.split(' ')[videoInfo.split(' ').index("전")-1]
        
        driver.get(url+"/community")
        driver.execute_script("window.scrollTo(0, 999999999)")
        time.sleep(waitTime)
        try:
            communityLogs = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-backstage-items/ytd-item-section-renderer/div[3]''')
            communityLogs = communityLogs.find_elements_by_tag_name("ytd-backstage-post-thread-renderer")
            for communityLog in communityLogs:
                main = communityLog.find_element_by_xpath('''.//*[@id="main"]''')
                communityUpload = main.find_element_by_xpath('''.//*[@id="published-time-text"]/a''').get_attribute('innerText')
                communityContent = main.find_element_by_xpath('''.//*[@id="content-text"]''').get_attribute('innerText')
                communityLikes = main.find_element_by_xpath('''.//*[@id="vote-count-middle"]''').get_attribute("innerText")
        except:
            communityLogs = "noCommunityLog"

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
