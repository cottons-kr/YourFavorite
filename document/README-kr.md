# YourFavorite
좋아하는 유튜버의 소식과 정보를 한눈에 확인해보세요

# 특징
* 유튜버 구독자수, 동영상, 스트리밍 등 실시간 변동사항 확인 가능
* 유튜버의 퍼스널 컬러에 따라 다른 테마
* 직관적이고 깔끔한 디자인

# 요구사양
**권장사항을 충족해도 속도가 느릴 수 있습니다**

**그래픽 하드웨어가 없으면 심각한 속도저하가 일어납니다**

||운영체제|프로세서|메모리|디스크 여유공간|인터넷 속도|
|-|-|-|-|-|-|
|권장(Windows)|Windows 11 or higher|4GHz 헥사코어|16GB|1GB|100Mbps|
|권장(Linux)|Kernel 5 or higher|4GHz 쿼드코어|8GB|1GB|100Mbps|
|최소(Windows)|Windows 10 or higher|3GHz 쿼드코어|8GB|500MB|50Mbps|
|최소(Linux)|Kernel 5 or higher|3GHz 쿼드코어|6GB|500MB|50Mbps|

**Chrome 브라우저가 설치되있어야 **<br>
x64 아키텍처만 지원합니다.

# 설치법
**최신버전을 강력히 권장합니다!**

1. [릴리즈](https://github.com/cottons-kr/YourFavorite/releases)에서 최신 릴리즈를 받아주세요.
2. 압축파일을 푼후 설치 프로그램을 실행한뒤 설치해주세요.
3. 그러면 설치완료입니다.

# Python 설치법
## Windows
1. [여기](https://www.python.org/ftp/python/3.9.8/python-3.9.8-amd64.exe)를 눌러 Python을 다운로드 해주세요
2. **Add Python to PATH에 체크를 해주신뒤 설치를 진행해주세요**

## Linux
밑에 명령어를 패키지 관리자에 맞게 실행해주세요

|APT|RPM|
|-|-|
|```sudo apt update && sudo apt upgrade -y && sudo apt install python3 python3-pip```|```rpm -Uvh python3 python3-pip```|

# 패키지
패키지(Package)는 특정 계열의 유튜버를 포함한 파일입니다.

## 특징
- 여러 유튜버 한번에 등록
- 특정 계열의 유튜버 정리
- 쉬운 공유

## 패키지 만들기
패키지는 JSON 문법으로 작성해야 됩니다. 내용은 다음과 같습니다.
```json
{
    "title": "패키지 이름",
    "about": "패키지 설명",
    "madeby": "만든 사람",
    "content": [
        "채널명": {
            "url": "채널 url",
            "color": ["R", "G", "B"]
        }
    ]
}
```
패키지는 **"유튜버 등록하기"** 팝업에서 등록할 수 있습니다.

# 트러블슈팅

1. 권한에러

![img](https://github.com/cottons-kr/YourFavorite/raw/main/document/asd.png)

해결법 : 백신 프로그램에서 YourFavorite을 예외로 설정해주세요

# QnA
- Q : 로딩이 조금밖에 안됐어요.
- A : 컴퓨터의 사양, 인터넷 환경에 따라 불러오는 양이 달라질 수 있습니다.
-----
- Q : 로딩이 안되요.
- A : 브라우저를 최신상태로 업데이 해주세요. 
-----
- Q : "CantLoad" 라는 문장이 표시되요.
- A : 컴퓨터의 사양, 인터넷 환경에 따라 불러오지 못했을때 표시됩니다. 유튜버를 다시 클릭해서 새로고침할 수 있습니다.
-----
- Q : 저작권 문제는 없나요?
- A : 개인이 비상업적 용도로 사용한다면 문제없습니다.
-----
- Q : 바이러스가 있나요?
- A : 없으나 Github에서 다운로드 받아야 안전합니다. [다운로드 링크](https://github.com/cottons-kr/YourFavorite/releases)
-----
- Q : 버그가 있어요.
- A : 아직 개발중이기 때문에 많이 있을 수 있습니다. [Issues](https://github.com/cottons-kr/YourFavorite/issues) 탭에 문의해주세요. (로그인 필요)
