const fileContent = `while True:
    try:
        from multiprocessing import Process, freeze_support, Manager
        from selenium.webdriver.edge.service import Service
        from selenium.webdriver.edge.options import Options
        from selenium.webdriver.common.by import By
        from webdriver_manager.microsoft import EdgeChromiumDriverManager
        from selenium import webdriver
        from subprocess import run
        import sys
        import base64
        import json
        import os
        import platform
        import urllib
        import locale
        break
    except ModuleNotFoundError:
        from subprocess import run
        import platform
        if platform.system() == "Windows":
            run(["powershell", "pip3 install --user selenium msedge-selenium-tools"], shell=True)
            run(["powershell", "pip3 install --user --upgrade requests"], shell=True)
            run(["powershell", "pip3 install --user --upgrade selenium"], shell=True)
            run(["powershell", "pip3 install --user --upgrade pip"], shell=True)
            run(["powershell", "pip3 install --user webdriver-manager"], shell=True)
        else:
            run(["pip3 install --user selenium msedge-selenium-tools"], shell=True)
            run(["pip3 install --user --upgrade requests"], shell=True)
            run(["pip3 install --user --upgrade selenium"], shell=True)
            run(["pip3 install --user --upgrade pip"], shell=True)
            run(["pip3 install --user webdriver-manager"], shell=True)
        continue

osType = platform.platform()
waitTime = 10
rootPath = open(os.path.join(os.path.join(os.path.expanduser('~'), ".yf/path")) , "r").read()

def getBrowser(type):
    if "Windows" in osType:
        options = Options()
        if type == "simple":
            options.add_experimental_option("mobileEmulation", { "deviceName": "iPhone X" })
        options.add_argument("headless")
        EdgeChromiumDriverManager(log_level=20)
        driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()), options=options)
    elif "Linux" in osType:
        pass #Firefox 지원
    elif "macOS" in osType:
        pass #Safari 지원
    return driver

def getBase(url, lang, returns):
    driver = getBrowser("all")
    driver.get(url)
    driver.execute_script("window.scrollTo(0, 999999999)")
    driver.implicitly_wait(waitTime)
    try:
        subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''').get_attribute("aria-label").split(' ')
        if lang == "ko_KR":
            subscriber = subscriber[1].replace('명', '')
        else:
            subscriber = subscriber[0]
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
    returns[0] = subscriber
    returns[1] = streams

def getVideos(url, lang, returns):
    driver = getBrowser("all")
    driver.get(url+"/videos")
    driver.execute_script(f"window.scrollTo(0, {str(999999999 * 3)})")
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
            if lang == "ko_KR":
                videoView = videoInfo.split(" 조회수 ")[1].replace("회", '')
                videoUpload = videoInfo.split(' ')[videoInfo.split(' ').index("전")-1]
            else:
                videoView = videoInfo.split(" ")[videoInfo.split(" ").index("views")-1]
                videoUpload = f'''{videoInfo.split(' ')[videoInfo.split(' ').index("ago")-2]} {videoInfo.split(' ')[videoInfo.split(' ').index("ago")-1]}'''
            videoName = video.find_element_by_id("video-title").get_attribute("title")
            videos.append([videoName, videoLink, videoUpload, videoView])
    returns[2] = videos

def getCommunity(url, returns):
    driver = getBrowser("all")
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
    returns[3] = communitys

def getAbout(url, lang, returns):
    driver = getBrowser("all")
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
        totalViews = driver.find_element_by_xpath('''/html/body/ytd-app/div/ytd-page-manager/ytd-browse/ytd-two-column-browse-results-renderer/div[1]/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-channel-about-metadata-renderer/div[2]/yt-formatted-string[3]''').get_attribute("innerText")
        if lang == "ko_KR":
            totalViews = totalViews.replace("조회수 ", '').replace("회", "")
        else:
            totalViews = totalViews.split(' ')[0]
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
    returns[4] = about

#=====Main=====#
if __name__ == "__main__":
    freeze_support()
    url = sys.argv[1]
    type = sys.argv[2]
    lang = locale.getdefaultlocale()[0]
    procs = []
    manager = Manager()
    returns = manager.dict()
    try:
        debug = sys.argv[3]
    except IndexError:
        debug = False
    if type == "simple":
        driver  = getBrowser(type)
        driver.get(url)
        driver.implicitly_wait(waitTime)
        channelName = driver.find_element_by_xpath('''/html/body/ytm-app/div[1]/ytm-browse/ytm-c4-tabbed-header-renderer/div[2]/div/h1''').get_attribute('innerText')
        profileImg = driver.find_element_by_xpath('''/html/body/ytm-app/div[1]/ytm-browse/ytm-c4-tabbed-header-renderer/div[2]/ytm-profile-icon/img''').get_attribute("src")
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
`; export default fileContent