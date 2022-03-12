from multiprocessing import Process, freeze_support, Manager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver
import sys
import base64
import json
import os
import platform
import locale

osType = platform.platform()
waitTime = 20

def getBrowser(type):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--log-level=OFF")
    #options.add_experimental_option('prefs', {'intl.accept_languages': 'en,en_US'})
    #options.add_experimental_option('prefs', {'intl.accept_languages': 'ja,ja_JP'})
    if "Windows" in osType: execFile = "chromedriver.exe"
    else: execFile = "chromedriver"
    if getattr(sys, 'frozen', False): 
        chromedriver_path = Service(os.path.join(sys._MEIPASS, execFile))
        driver = webdriver.Chrome(service=chromedriver_path, options=options)
    else:
        driver = webdriver.Chrome(service=Service("./"+execFile), options=options)
    return driver

def getBase(url, lang, returns):
    driver = getBrowser("all")
    driver.get(url)
    driver.execute_script("window.scrollTo(0, 999999999)")
    driver.implicitly_wait(waitTime)
    try:
        subscriber = driver.find_element(By.XPATH, '''//*[@id="subscriber-count"]''').get_attribute("aria-label").split(' ')
        if "ko" in lang: subscriber = subscriber[1].replace('명', '')
        elif "ja" in lang: subscriber = subscriber[1].replace("人", '')
        else: subscriber = subscriber[0]
    except:
        subscriber = "CantLoad"
    streams = []
    try:
        streamDiv = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse[1]/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer[1]/div[3]/ytd-channel-featured-content-renderer/div[2]''')
        streamDiv = streamDiv.find_elements(By.TAG_NAME, "ytd-video-renderer")
    except:
        streams = "CantLoad"
    if streams != "CantLoad":
        for stream in streamDiv:
            link = stream.find_element(By.XPATH, '''.//*[@id="thumbnail"]''').get_attribute("href")
            name = stream.find_element(By.XPATH, '''.//*[@id="video-title"]/yt-formatted-string''').get_attribute("innerText")
            streams.append([name, link])
    returns[0] = subscriber
    returns[1] = streams

def getVideos(url, lang, returns):
    driver = getBrowser("all")
    driver.get(url+"/videos")
    driver.execute_script(f"window.scrollTo(0, {str(999999999 * 3)})")
    videos = []
    driver.implicitly_wait(waitTime)
    try:
        recentVideos = driver.find_element(By.XPATH, "/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-grid-renderer/div[1]")
        recentVideos = recentVideos.find_elements(By.TAG_NAME, "ytd-grid-video-renderer")
    except:
        videos = "CantLoad"
    if videos != "CantLoad":
        for video in recentVideos:
            videoInfo = video.find_element(By.ID, "video-title").get_attribute("aria-label")
            videoLink = video.find_element(By.ID, "video-title").get_attribute("href")
            videoUpload = ""
            if "ko" in lang:
                try: videoView = videoInfo.split(" 조회수 ")[1].replace("회", '')
                except: continue
                if "전" in videoInfo:
                    try: videoUpload = videoInfo.split(' ')[videoInfo.split(' ').index("전")-1]
                    except: videoUpload = ""
            elif "ja" in lang:
                try: videoView = videoInfo.split(" ")[-2]
                except: continue
                if "前" in videoInfo:
                    videoUpload = ""
                    parsedText = videoInfo.split(" ")
                    for i in range(len(parsedText)):
                        if "前" in parsedText[i-1]:
                            videoUpload = f"{parsedText[i-2]} {parsedText[i-1].replace('前', '')}"
            else:
                try: videoView = videoInfo.split(" ")[videoInfo.split(" ").index("views")-1]
                except: continue
                if "ago" in videoInfo:
                    try: videoUpload = f'''{videoInfo.split(' ')[videoInfo.split(' ').index("ago")-2]} {videoInfo.split(' ')[videoInfo.split(' ').index("ago")-1]}'''
                    except: videoUpload = ""
            videoName = video.find_element(By.ID, "video-title").get_attribute("title")
            videos.append([videoName, videoLink, videoUpload, videoView])
    returns[2] = videos

def getCommunity(url, returns):
    driver = getBrowser("all")
    driver.get(url+"/community")
    driver.execute_script("window.scrollTo(0, 999999999)")
    communitys = []
    driver.implicitly_wait(waitTime)
    try:
        communityLogs = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-backstage-items/ytd-item-section-renderer/div[3]''')
        communityLogs = communityLogs.find_elements(By.TAG_NAME, "ytd-backstage-post-thread-renderer")
    except:
        communitys = "CantLoad"
    if communitys != "CantLoad":
        for communityLog in communityLogs:
            main = communityLog.find_element(By.XPATH, '''.//*[@id="main"]''')
            communityUpload = main.find_element(By.XPATH, '''.//*[@id="published-time-text"]/a''').get_attribute('innerText')
            communityContent = main.find_element(By.XPATH, '''.//*[@id="content-text"]''').get_attribute('innerText')
            communityLikes = main.find_element(By.XPATH, '''.//*[@id="vote-count-middle"]''').get_attribute("innerText")
            communitys.append([communityContent, communityLikes, communityUpload])
    returns[3] = communitys

def getAbout(url, lang, returns):
    driver = getBrowser("all")
    driver.get(url+"/about")
    driver.execute_script("window.scrollTo(0, 999999999)")
    driver.implicitly_wait(waitTime)
    try:
        about = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[1]/div[1]/yt-formatted-string[2]''').get_attribute("innerText")
    except:
        about = "CantLoad"
    try:    
        location = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[1]/div[4]/table/tbody/tr[2]/td[2]/yt-formatted-string''').get_attribute("innerText")
    except:
        location = "CantLoad"
    try:
        if "ja" in lang: joinDate = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[2]''').get_attribute("innerText").split(" ")[0]
        else: joinDate = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[2]/span[2]''').get_attribute("innerText").replace(' ', '')
    except: joinDate = "CantLoad"
    try:
        totalViews = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[3]''').get_attribute("innerText")
        if "ko" in lang: totalViews = totalViews.replace("조회수 ", '').replace("회", "")
        elif "ja" in lang: totalViews = totalViews.replace(" 回視聴", "")
        else: totalViews = totalViews.split(' ')[0]
    except:
        totalViews = "CantLoad"
    links = []
    try:
        linkDiv = driver.find_element(By.ID, '''link-list-container''')
        linkDiv = linkDiv.find_elements(By.TAG_NAME, 'a')
    except:
        links = "CantLoad"
    if links != "CantLoad":
        for link in linkDiv:
            Link = link.get_attribute("href")
            info = link.find_element(By.TAG_NAME, "yt-formatted-string").get_attribute("innerText")
            links.append([Link, info])
    about = [about, location, joinDate, totalViews, links]
    returns[4] = about

#=====Main=====#
if __name__ == "__main__":
    freeze_support()
    url = sys.argv[1]
    type = sys.argv[2]
    lang = locale.getdefaultlocale()[0]
    #lang = "en_US"
    #lang = "ja_JP"
    procs = []
    manager = Manager()
    returns = manager.dict()
    try:
        debug = sys.argv[3]
    except IndexError:
        debug = False
    if type == "simple":
        driver  = getBrowser("simple")
        driver.get(url)
        driver.implicitly_wait(waitTime)
        channelName = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/tp-yt-app-header-layout/div/tp-yt-app-header/div[2]/div[2]/div/div[1]/div/div[1]/ytd-channel-name/div/div/yt-formatted-string''').get_attribute('innerText')
        profileImg = driver.find_element(By.XPATH, '''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/tp-yt-app-header-layout/div/tp-yt-app-header/div[2]/div[2]/div/div[1]/yt-img-shadow/img''').get_attribute("src")
        print(base64.b64encode(f"{channelName}::{profileImg}".encode("utf-8")))
        driver.quit()
    elif type == "all":
        procs.append(Process(target=getBase, args=(url, lang, returns)))
        procs.append(Process(target=getVideos, args=(url, lang, returns)))
        procs.append(Process(target=getCommunity, args=(url, returns)))
        procs.append(Process(target=getAbout, args=(url, lang, returns)))
        for proc in procs:
            proc.start()
        for proc in procs:
            proc.join()

        subscriber = returns[0]
        streams = returns[1]
        videos = returns[2]
        communitys = returns[3]
        about  = returns[4]
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
    sys.exit()
