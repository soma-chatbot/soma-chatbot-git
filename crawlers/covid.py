import json
import requests
from bs4 import BeautifulSoup


def create_soup(url):  # url --> soup
    res = requests.get(url)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")
    return soup


def scrape_politics_news():
    # print("[코로나 확진자]")
    url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%98+%ED%99%95%EC%A7%84%EC%9E%90"
    soup = create_soup(url)

    # coronic : 코로나 확진자, check : 검사 수, free : 격리 해제, death : 사망자
    # var : variation
    coronic, check, free, death = soup.find(
        "div", class_="status_info").find_all("p", class_="info_num")
    # print(coronic.text, check.text, free.text, death.text)
    coronic_var, check_var, free_var, death_var = soup.find(
        "div", class_="status_info").find_all("em", class_="info_variation")
    # print(coronic_var.text, check_var.text, free_var.text, death_var.text)

    # inside : 국내 확진, outside : 해외 유입
    inside, outside = soup.find(
        "div", class_="status_today").find_all("em", class_="info_num")
    # print(inside.text, outside.text)

    # date
    date_res = requests.get(
        'https://m.search.naver.com/p/csearch/content/nqapirender.nhn?where=nexearch&pkid=9005&key=diffV2API')
    date_json = json.loads(date_res.text)
    notice_date = str(date_json['result']['list'][-1]['date'])

    data = {
        "coronic": coronic.text,
        "check": check.text,
        "free": free.text,
        "death": death.text,
        "inside": inside.text,
        "outside": outside.text,
        "date": notice_date
    }

    result = {
        "result": "success",
        "msg": "The crawl has been successfully completed.",
        "data": data
    }

    print(json.dumps(result))


if __name__ == "__main__":
    scrape_politics_news()
