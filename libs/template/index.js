module.exports = {
	getBrief: () => {
		return {
			"text": "Push alarm message",
			"blocks": [
				{
					"type": "image_link",
					"url": "https://ifh.cc/g/MilyAl.png"
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>🌬 미세먼지</span><span style='font-weight: bold; color: #00A50B;'>좋음 (10)</span></span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<center style='font-size: 80px; margin: 35px 0 35px 0;'>😄</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>⬇ 가장 적은 시간</span><span style='font-weight: bold; color: #00A50B;'>13시</span></span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>⬆ 가장 많은 시간</span><span style='font-weight: bold; color: #A30000;'>17시</span></span>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>💨 초미세먼지</span><span style='font-weight: bold; color: #A30000;'>나쁨 (30)</span></span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<center style='font-size: 80px; margin: 35px 0 35px 0;'>😔</center>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>⬇ 가장 적은 시간</span><span style='font-weight: bold; color: #00A50B;'>13시</span></span>",
					"markdown": true
				},
				{
					"type": "text",
					"text": "<span style='display: flex; justify-content: space-between;'><span style='font-weight: bold;'>⬆ 가장 많은 시간</span><span style='font-weight: bold; color: #A30000;'>17시</span></span>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "text",
					"text": "<center style='font-weight: bold;'>🔈 업데이트 12:05 [기상청] 🔈 </center>",
					"markdown": true
				},
				{
					"type": "divider"
				},
				{
					"type": "action",
					"elements": [
						{
							"type": "button",
							"text": "기상청 이동",
							"style": "default",
							"action_type": "open_inapp_browser",
							"action_name": "go-fine-dust-site",
							"value": "https://www.weather.go.kr/w/index.do"
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