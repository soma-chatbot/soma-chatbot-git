const fs = require('fs').promises;
const path = require('path');

const read = fs.readFile;

const files = {
	covid: 'covid.json',
	news: 'news.json',
	air: 'air.json',
	weather: 'weather.json'
};
const data = {};

async function updateData() {
	const ps = Object.entries(files).map(async ([key, value]) => {
		const dataPath = path.join(__dirname, '../../crawlers', value);
		const content = await read(dataPath, { encoding: 'utf-8' });
		data[key] = JSON.parse(content).data;
	});
	await Promise.all(ps);
}
updateData();

const template = {
	getBrief: async () => {
		await updateData();
		return {
			"blocks": [
				{
					"type": "image_link",
					"url": "https://ifh.cc/g/JhUhof.png"
				},
				{
					"type": "text",
					"text": "😄 안녕하세요 <span style='font-weight: bold; color: #FFAA00;'>아침 브리핑</span> 챗봇 입니다. 어떤 정보를 원하시나요?",
					"markdown": true
				},
				{
					"type": "text",
					"text": "✋ 아침 브리핑은 <span style='font-weight: bold; color: #004680;'>'오늘의 날씨'</span>, <span style='font-weight: bold; color: #626262;'>'미세먼지'</span>, <span style='font-weight: bold; color: #DB003A;'>'코로나 확진자 수'</span>, <span style='font-weight: bold; color: #00C119;'>'뉴스 헤드라인'</span> 4가지 종류의 데이터를 제공하고 있습니다.",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold; color: #004680;'>🌤 오늘의 날씨 🌥</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>🌡 기온</span>30 °C</span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>🌂 강수확률</span>20 %</span>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold; color: #626262;'>🌫 미세먼지 🌫</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>🌬 미세먼지</span><span style='font-weight: bold; color: #00A50B;'>좋음 (10)</span></span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>💨 초미세먼지</span><span style='font-weight: bold; color: #A30000;'>나쁨 (30)</span></span>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold; color: #DB003A;'>📈 코로나 확진자 수 📉</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>😷 신규 확진자</span>🔺  797</span>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold; color: #00C119;'>📋 뉴스 헤드라인 📋</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<div style='font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;'>[경제] 암호화폐 광풍에 칼뺀 정부... 코인러들은 '부글부글'</div>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<div style='font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;'>[IT] 암호화폐 광풍에 칼뺀 정부... 코인러들은 '부글부글'</div>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold;'>🔎 자세히 보기 🔍</center>",
					"markdown": true
				},
				{
					"type": "action",
					"elements": [
						{
							"type": "button",
							"text": "날씨",
							"style": "primary",
							"action_type": "submit_action",
							"action_name": "weather",
							"value": ""
						},
						{
							"type": "button",
							"text": "미세먼지",
							"style": "primary",
							"action_type": "submit_action",
							"action_name": "finedust",
							"value": ""
						}
					]
				},
				{
					"type": "action",
					"elements": [
						{
							"type": "button",
							"text": "코로나",
							"style": "primary",
							"action_type": "submit_action",
							"action_name": "corona",
							"value": ""
						},
						{
							"type": "button",
							"text": "뉴스",
							"style": "primary",
							"action_type": "submit_action",
							"action_name": "news",
							"value": ""
						}
					]
				}
			]
		};
	},

	getCovid: async () => {
		await updateData();
		return {
			"text": "Push alarm message",
			"blocks": [
				{
					"type": "image_link",
					"url": "https://ifh.cc/g/3LTuUo.png"
				},
				{
					"type": "text",
					"text": "　　　　　*일일 확진자*",
					"markdown": true
				},
				{
					"type": "description",
					"term": "국내발생",
					"content": {
						"type": "text",
						"text": data.covid.inside,
						"markdown": true
					},
					"accent": true
				},
				{
					"type": "description",
					"term": "해외유입",
					"content": {
						"type": "text",
						"text": data.covid.outside,
						"markdown": false
					},
					"accent": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "　　　　　*국내 현황*",
					"markdown": true
				},
				{
					"type": "description",
					"term": "확진환자",
					"content": {
						"type": "text",
						"text": data.covid.coronic,
						"markdown": true
					},
					"accent": true
				},
				{
					"type": "description",
					"term": "검사중",
					"content": {
						"type": "text",
						"text": data.covid.check,
						"markdown": false
					},
					"accent": true
				},
				{
					"type": "description",
					"term": "격리해제",
					"content": {
						"type": "text",
						"text": data.covid.free,
						"markdown": true
					},
					"accent": true
				},
				{
					"type": "description",
					"term": "사망",
					"content": {
						"type": "text",
						"text": data.covid.death,
						"markdown": false
					},
					"accent": true
				},
				{
					"type": "divider"
				},
				{
					"type": "action",
					"elements": [
						{
							"type": "button",
							"text": "COVID-19 이동",
							"style": "default",
							"action_type": "open_inapp_browser",
							"action_name": "go-fine-dust-site",
							"value": "http://ncov.mohw.go.kr/"
						},
						{
							"type": "button",
							"text": "챗봇 부르기",
							"style": "primary",
							"action_type": "submit_action",
							"action_name": "call-chat-bot",
							"value": ""
						}
					]
				}
			]
		};
	}
};

module.exports = template;