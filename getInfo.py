from requests.api import get
from selenium import webdriver
import sys
import time
import base64
import json

waitTime = 10

def main(url, type, debug=False):
    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)

    if type == "simple":
        driver.get(url)
        driver.implicitly_wait(waitTime)
        channelName = driver.find_element_by_xpath('''//*[@id="channel-name"]''').get_attribute('innerText')
        profileImg = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/tp-yt-app-header-layout/div/tp-yt-app-header/div[2]/div[2]/div/div[1]/yt-img-shadow/img''').get_attribute("src")
        print(base64.b64encode(f"{channelName}::{profileImg}".encode("utf-8")))
        driver.quit()

    elif type == "all":
        driver.get(url)
        driver.execute_script("window.scrollTo(0, 999999999)")
        driver.implicitly_wait(waitTime)
        try:
            subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''').get_attribute("aria-label").split(' ')[1].replace('명', '')
        except:
            subscriber = "CantLoad"
        streams = []
        try:
            streamDiv = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse[1]/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer[1]/div[3]/ytd-channel-featured-content-renderer/div[2]''')
            streamDiv = streamDiv.find_elements_by_tag_name("ytd-video-renderer")
        except:
            streams = "CantLoad"
        if streams != "CantLoad":
            for stream in streamDiv:
                link = stream.find_element_by_xpath('''.//*[@id="thumbnail"]''').get_attribute("href")
                name = stream.find_element_by_xpath('''.//*[@id="video-title"]/yt-formatted-string''').get_attribute("innerText")
                streams.append([name, link])

        driver.get(url+"/videos")
        driver.execute_script("window.scrollTo(0, 999999999)")
        videos = []
        driver.implicitly_wait(waitTime)
        try:
            recentVideos = driver.find_element_by_xpath("/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-grid-renderer/div[1]")
            recentVideos = recentVideos.find_elements_by_tag_name("ytd-grid-video-renderer")
        except:
            videos = "CantLoad"
        if videos != "CantLoad":
            for video in recentVideos:
                videoInfo = video.find_element_by_id("video-title").get_attribute("aria-label")
                videoLink = video.find_element_by_id("video-title").get_attribute("href")
                videoView = videoInfo.split(" 조회수 ")[1].replace("회", '')
                videoName = videoInfo.split(" 게시자: ")[0]
                try:
                    videoUpload = videoInfo.split(' ')[videoInfo.split(' ').index("전")-1]
                except ValueError:
                    continue
                videos.append([videoName, videoLink, videoUpload, videoView])
        
        driver.get(url+"/community")
        driver.execute_script("window.scrollTo(0, 999999999)")
        communitys = []
        driver.implicitly_wait(waitTime)
        try:
            communityLogs = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-backstage-items/ytd-item-section-renderer/div[3]''')
            communityLogs = communityLogs.find_elements_by_tag_name("ytd-backstage-post-thread-renderer")
        except:
            communitys = "CantLoad"
        if communitys != "CantLoad":
            for communityLog in communityLogs:
                main = communityLog.find_element_by_xpath('''.//*[@id="main"]''')
                communityUpload = main.find_element_by_xpath('''.//*[@id="published-time-text"]/a''').get_attribute('innerText')
                communityContent = main.find_element_by_xpath('''.//*[@id="content-text"]''').get_attribute('innerText')
                communityLikes = main.find_element_by_xpath('''.//*[@id="vote-count-middle"]''').get_attribute("innerText")
                communitys.append([communityContent, communityLikes, communityUpload])
        
        driver.get(url+"/about")
        driver.execute_script("window.scrollTo(0, 999999999)")
        driver.implicitly_wait(waitTime)
        try:
            about = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[1]/div[1]/yt-formatted-string[2]''').get_attribute("innerText")
        except:
            about = "CantLoad"
        try:    
            location = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[1]/div[4]/table/tbody/tr[2]/td[2]/yt-formatted-string''').get_attribute("innerText")
        except:
            location = "CantLoad"
        try:
            joinDate = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[2]/span[2]''').get_attribute("innerText").replace(' ', '')
        except:
            joinDate = "CantLoad"
        try:
            totalViews = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[3]''').get_attribute("innerText").replace("조회수 ", '').replace("회", "")
        except:
            totalViews = "CantLoad"
        links = []
        try:
            linkDiv = driver.find_element_by_id('''link-list-container''')
            linkDiv = linkDiv.find_elements_by_tag_name('a')
        except:
            links = "CantLoad"
        if links != "CantLoad":
            for link in linkDiv:
                Link = link.get_attribute("href")
                info = link.find_element_by_tag_name("yt-formatted-string").get_attribute("innerText")
                links.append([Link, info])
        about = [about, location, joinDate, totalViews, links]

        jsonData = {
            "subscriber": subscriber,
            "streams": streams,
            "videos": videos,
            "communitys": communitys,
            "about": about
        }
        jsonString = json.dumps(jsonData, ensure_ascii=False)
        if debug == False:
            print(base64.b64encode(jsonString.encode("utf-8")))
        else:
            print(jsonString)

if __name__ == "__main__":
    try:
        main(sys.argv[1], sys.argv[2], sys.argv[3])
    except IndexError:
        main(sys.argv[1], sys.argv[2])
