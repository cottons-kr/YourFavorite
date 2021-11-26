from requests.api import get
from selenium import webdriver
import sys
from socket import *

IP = "127.0.0.1"
PORT = 9999

def main(url):
    server_socket = socket(AF_INET, SOCK_STREAM)
    server_socket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    server_socket.bind((IP, PORT))
    server_socket.listen(1)
    client_socket, addr = server_socket.accept()

    options = webdriver.ChromeOptions()
    options.add_argument("headless")
    driver = webdriver.Chrome(executable_path='chromedriver', options=options)
    driver.get(url)
    subscriber = driver.find_element_by_xpath('''//*[@id="subscriber-count"]''')
    subscriber = subscriber.get_attribute("aria-label")
    channelName = driver.find_element_by_xpath('''//*[@id="channel-name"]''')
    avatar = driver.find_element_by_xpath('''//*[@id="img"]''')
    print(subscriber, channelName, avatar)
    driver.quit()

if __name__ == "__main__":
    main(sys.argv[1])