# YourFavorite
Check the news and information of your favorite YouTubers at a glance

# Characteristic
* You can check real-time changes such as the number of YouTubers subscribers, videos, streaming, etc.
* Different themes depending on the YouTuber's personal color
* Intuitive and clean design

# Requirements
**Meeting recommendations may still be slow**

**Severe slowdowns without graphics hardware**

||Operating system|Processor|Memory|Free disk space|Internet speed|
|-|-|-|-|-|-|
|Recommended(Windows)|Windows 11 or higher|4GHz hexa-core|16GB|1GB|100Mbps|
|Recommended (Linux)|Kernel 5 or higher|4GHz quad-core|8GB|1GB|100Mbps|
|Minimum(Windows)|Windows 10 or higher|3GHz quad-core|8GB|500MB|50Mbps|
|Minimum (Linux)|Kernel 5 or higher|3GHz quad-core|6GB|500MB|50Mbps|

**You must install Chrome Browser**<br>
Only x64 architectures are supported.

# How to install
**The latest version is strongly recommended!**

1. Get the latest release from [Release] (https://github.com/cottons-kr/YourFavorite/releases).
2. After extracting the compressed file, run the installer and install it.
3. Then the installation is complete.

# How to install Python
## Windows
1. Click [here] (https://www.python.org/ftp/python/3.9.8/python-3.9.8-amd64.exe) to download Python
2. **Check Add Python to PATH before proceeding with the installation**

## Linux
Run the command below according to your package manager.

|APT|RPM|
|-|-|
|```sudo apt update && sudo apt upgrade -y && sudo apt install python3 python3-pip```|```rpm -Uvh python3 python3-pip```|

# package
A package is a file containing a specific type of YouTuber.

## Characteristic
- Register multiple YouTubers at once
- Arrangement of YouTubers of a specific category
- Easy sharing

## Create the package
Packages must be written in JSON syntax. The contents are as follows.
```json
{
    "title": "package name",
    "about": "package description",
    "madeby": "madeby",
    "content": [
        "channel name": {
            "url": "channel url",
            "color": ["R", "G", "B"]
        }
    ]
}
```
Packages can be registered in the **"Register YouTuber"** pop-up.

# QnA
- Q: It only loaded a little.
- A : The amount of loading may vary depending on the specifications of the computer and the Internet environment.
-----
- Q: I can't load.
- A : Please update your browser to the latest state.
-----
- Q : The sentence "CantLoad" is displayed.
- A : It is displayed when it cannot be loaded depending on the specifications of the computer or the Internet environment. You can refresh by clicking the YouTuber again.
-----
- Q : Are there any copyright issues?
- A : If you use it for personal non-commercial purposes, there is no problem.
-----
- Q : Is there a virus?
- A : No, but it is safe to download it from Github. [Download Link](https://github.com/cottons-kr/YourFavorite/releases)
-----
- Q: There is a bug.
- A : Since it is still under development, there may be many. Please contact the [Issues] (https://github.com/cottons-kr/YourFavorite/issues) tab. (Login required)
