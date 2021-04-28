# 4. 미세먼지
# 미세먼지, 초미세 먼지 (얼굴 표정)
# 최고, 최저 미세먼지 (시간)
import sys
import json
import re
import requests
from bs4 import BeautifulSoup


def find_key(dict, val):
    return next(key for key, value in dict.items() if value == val)


# 오늘의 날씨
# 현재 기온, 하늘상태, 습도, 강수확률 (강조), 체감온도, 최저, 최고기온
def get_today_weather(rlg):  # rlg(Regional Local Government): 지역 이름
    data = {}

    # Check RLG
    location_code = rlg

    url = f'https://weather.naver.com/today/{location_code}'
    response = requests.get(url)

    # Check response status
    if response.status_code != 200:
        raise Exception(f'Failed to load page. : {response.status_code}')

    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    # Set data #
    failure_items = ['precipitation_probability',
                     'humidity', 'apparent_temperature']
    data['precipitation_probability'] = '0%'
    data['humidity'] = '0%'
    data['apparent_temperature'] = '0°'

    # Append default information
    data['type'] = 'weather'
    data['rlg'] = rlg
    data['url'] = url

    # Append 'precipitation probability', 'humidity', 'apparent temperature'
    summary_dom_list = soup.select('.summary_list > *')
    if summary_dom_list is None:
        summary_dom_list = []

    current_summary = None
    cnt = 0
    for i in summary_dom_list:

        # title
        if cnt % 2 == 0:
            if i.text == '강수':
                current_summary = 'precipitation_probability'
            elif i.text == '습도':
                current_summary = 'humidity'
            elif i.text == '체감':
                current_summary = 'apparent_temperature'
            else:
                current_summary = None

        # value
        else:
            if current_summary:
                data[current_summary] = i.text
                failure_items.remove(current_summary)

        cnt += 1

    # Append other value
    target_items = {
        'location': {
            'selector': '.location_name'
        },
        'temperature': {
            'selector': 'div.weather_area > strong',
            'regex': '-*[0-9]{1,3}[°]'
        },
        'weather': {
            'selector': 'div.weather_area > p > span.weather.before_slash'
        },
        'highest_temperature': {
            'selector': '.highest',
            'regex': '-*[0-9]{1,3}[°]'
        },
        'lowest_temperature': {
            'selector': '.data.lowest',
            'regex': '-*[0-9]{1,3}[°]'
        },
        'update_date': {
            'selector': 'div.time_weather > div.top_area > span',
            'regex': '[0-9]{1,2}[:][0-9]{1,2}'
        }
    }

    for name, option in target_items.items():
        dom = soup.select_one(option['selector'])
        if dom:
            if 'regex' in option:
                val = re.findall(option['regex'], dom.text)[0]
            else:
                val = dom.text
            data[name] = val

        else:
            failure_items.append(name)
            data[name] = None

    return data


locationCodeList = [
    '09140550',
    '08470690',
    '11200510',
    '06110517',
    '05140120',
    '07170630',
    '10140510',
    '17110250',
    '02830410',
    '01810350',
    '16760370',
    '15810320',
    '13750360',
    '12790330',
    '04170400',
    '03720415',
    '14110630'
]


if __name__ == '__main__':
    result = {'data': {}}
    for code in locationCodeList:
        result['data'][code] = get_today_weather(code)
    result['result'] = 'success'
    result['msg'] = '성공적으로 크롤링이 완료되었습니다.'

    print(json.dumps(result))
