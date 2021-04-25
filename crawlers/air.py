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
    result = {
        'result': '',
        'msg': '',
        'data': {}
    }

    data = result['data']

    # Check RLG
    location_code = rlg

    url = f'https://weather.naver.com/air/{location_code}'
    response = requests.get(url)

    # Check response status
    if response.status_code != 200:
        result['result'] = 'error'
        result['msg'] = f'Failed to load page. : {response.status_code}'
        print(json.dumps(result))
        return

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
        result['result'] = 'error'
        result['msg'] = f'Failed to load page. : {res.status_code}'
        print(json.dumps(result))
        return

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

    # Done
    result['result'] = 'success'

    if failure_items:
        result['msg'] = f'{len(failure_items)} elements could not be imported. :{", ".join(failure_items)}'
        data['failure_items'] = failure_items
    else:
        result['msg'] = 'The crawl has been successfully completed.'

    # Return
    print(json.dumps(result))
    return


if __name__ == '__main__':
    get_today_air(sys.argv[1])
