# 정용훈
import json
import requests
from bs4 import BeautifulSoup


def create_soup(url):  # url --> soup
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    return soup


# 헤드라인 뉴스
def scrape_headline_news():
    # print("[헤드라인 뉴스]")
    result = []
    url = "https://news.naver.com"
    soup = create_soup(url)
    news_list = soup.find(
        "ul", attrs={"class": "hdline_article_list"}).find_all("li", limit=3)

    for index, news in enumerate(news_list):
        title = news.find("a").get_text().strip()
        link = url + news.find("a")["href"]
        result.append({
            "title": title,
            "link": link
        })
    return result


# 정치 속보
def scrape_politics_news():
    result = []
    # print("[정치 뉴스]")
    url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=100"
    soup = create_soup(url)
    news_list = soup.find(
        "ul", attrs={"class": "type06_headline"}).find_all("li", limit=20)
    count = 0
    for index, news in enumerate(news_list):
        if count == 3:
            break

        img = news.find("img")
        if img is None:
            continue

        a_indx = 1
        src = img.get("src")
        count = count + 1
        title = news.find_all("a")[a_indx].get_text().strip()
        link = news.find_all("a")[a_indx]["href"]
        result.append({
            "title": title,
            "link": link,
            "img_src": src
        })
    return result


# 경제 속보
def scrape_economy_news():
    result = []
    url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=101"
    soup = create_soup(url)
    news_list = soup.find(
        "ul", attrs={"class": "type06_headline"}).find_all("li", limit=20)
    count = 0
    for index, news in enumerate(news_list):
        if count == 3:
            break

        img = news.find("img")
        if img is None:
            continue

        a_indx = 1
        src = img.get("src")
        count = count + 1
        title = news.find_all("a")[a_indx].get_text().strip()
        link = news.find_all("a")[a_indx]["href"]
        result.append({
            "title": title,
            "link": link,
            "img_src": src
        })
    return result


# IT 속보
def scrape_it_news():
    result = []
    # print("[IT 뉴스]")
    url = "https://news.naver.com/main/list.nhn?mode=LSD&mid=sec&sid1=105"
    soup = create_soup(url)
    news_list = soup.find(
        "ul", attrs={"class": "type06_headline"}).find_all("li", limit=20)
    count = 0
    for index, news in enumerate(news_list):
        if count == 3:
            break

        img = news.find("img")
        if img is None:
            continue

        a_indx = 1
        src = img.get("src")
        count = count + 1
        title = news.find_all("a")[a_indx].get_text().strip()
        link = news.find_all("a")[a_indx]["href"]
        result.append({
            "title": title,
            "link": link,
            "img_src": src
        })
    return result


if __name__ == "__main__":
    result = {
        "result": "success",
        "msg": "성공적으로 크롤링이 완료되었습니다.",
        "data": {}
    }

    data = result['data']

    data['headline'] = scrape_headline_news()
    data['politics'] = scrape_politics_news()
    data['economy'] = scrape_economy_news()
    data['it'] = scrape_it_news()

    print(json.dumps(result))
