import sys
import json
import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup


def find_key(dict, val):
    return next(key for key, value in dict.items() if value == val)

# 오늘의 공기
# 미세먼지, 초미세 먼지 (얼굴 표정), 최고, 최저 미세먼지 (시간)


def get_today_air(rlg):  # rlg(Regional Local Government): 지역 이름
    data = {}

    # Check RLG
    location_code = rlg

    url = f'https://weather.naver.com/air/{location_code}'
    response = requests.get(url)

    # Check response status
    if response.status_code != 200:
        raise Exception(f'Failed to load page. : {response.status_code}')

    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    # Set data #
    failure_items = []

    # Append default information
    data['type'] = 'air'
    data['rlg'] = rlg
    data['url'] = url

    # Append value
    target_items = {
        'location': {
            'selector': '.location_name'
        },
        'micro_dust': {
            'selector': '#_idDustChart > div:nth-child(1) > span',
            'regex': '[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,4}'
        },
        'ultra_micro_dust': {
            'selector': '#_idDustChart > div:nth-child(2) > span',
            'regex': '[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,4}'
        },
        'update_date': {
            'selector': 'div.card.card_dust > p',
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

    # Append micro dust timeline
    res = requests.get(
        f'https://weather.naver.com/air/api/airTrend?regionCode={location_code}&trendType=hourly')

    if res.status_code != 200:
        raise Exception('Status code is not 200')

    now = datetime.now().strftime('%Y%m%d')
    timeline_list = json.loads(res.text)

    data['highest_micro_dust'] = {
        'hour': '0',
        'state': '',
        'station': 0
    }

    data['lowest_micro_dust'] = {
        'hour': '0',
        'state': '',
        'station': 999
    }

    data['highest_ultra_micro_dust'] = {
        'hour': '0',
        'state': '',
        'station': 0
    }

    data['lowest_ultra_micro_dust'] = {
        'hour': '0',
        'state': '',
        'station': 999
    }

    cnt = 0
    for timeline in timeline_list['airHourlyTrendList']:
        if timeline['aplYmd'] != now:
            continue

        if timeline['stationPM10'] > data['highest_micro_dust']['station']:
            data['highest_micro_dust']['station'] = timeline['stationPM10']
            data['highest_micro_dust']['state'] = timeline['stationPM10Legend1']
            data['highest_micro_dust']['hour'] = timeline['aplTm']

        elif timeline['stationPM10'] < data['lowest_micro_dust']['station']:
            data['lowest_micro_dust']['station'] = timeline['stationPM10']
            data['lowest_micro_dust']['state'] = timeline['stationPM10Legend1']
            data['lowest_micro_dust']['hour'] = timeline['aplTm']

        if timeline['stationPM25'] > data['highest_ultra_micro_dust']['station']:
            data['highest_ultra_micro_dust']['station'] = timeline['stationPM25']
            data['highest_ultra_micro_dust']['state'] = timeline['stationPM25Legend1']
            data['highest_ultra_micro_dust']['hour'] = timeline['aplTm']

        elif timeline['stationPM25'] < data['lowest_ultra_micro_dust']['station']:
            data['lowest_ultra_micro_dust']['station'] = timeline['stationPM25']
            data['lowest_ultra_micro_dust']['state'] = timeline['stationPM25Legend1']
            data['lowest_ultra_micro_dust']['hour'] = timeline['aplTm']

        cnt += 1

        if cnt == 24:
            break

    # Return
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
        result['data'][code] = get_today_air(code)
    result['result'] = 'success'
    result['msg'] = '성공적으로 크롤링이 완료되었습니다.'

    print(json.dumps(result))
