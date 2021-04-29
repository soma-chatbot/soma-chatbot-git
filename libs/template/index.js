const fs = require('fs').promises;
const path = require('path');

const files = {
	covid: 'covid.json',
	news: 'news.json',
	air: 'air.json',
	weather: 'weather.json',
};
const data = {};

async function updateData() {
	const ps = Object.entries(files).map(async ([key, value]) => {
		const dataPath = path.join(__dirname, '../../crawlers', value);
		const content = await fs.readFile(dataPath, { encoding: 'utf-8' });
		data[key] = JSON.parse(content).data;
	});
	await Promise.all(ps);
}
updateData();

/*
-----> 상황에 따른 사진 블록킷

1. 아침 브리핑 메인 > 오늘의 날씨 > 헤더 밑 상단의 이미지

- 맑음 : https://ifh.cc/g/KUhOmv.png
- 구름많음 : https://ifh.cc/g/rXOB0W.png
- 비옴 : https://ifh.cc/g/RWhaws.png

2. 아침 브리핑 메인 > 미세먼지 > 헤더 및 2개 이미지

- 좋음 : https://ifh.cc/g/OxiH3v.png
- 보통 : https://ifh.cc/g/MZiGVu.png
- 나쁨 : https://ifh.cc/g/bLtEWX.png
*/

const template = {
	getBrief: async (location) => {
		await updateData();
		return {
			text: '모닝 브리핑이 도착했습니다!',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/JhUhof.png',
				},
				{
					type: 'text',
					text: '😄  안녕하세요 *Morning Breifing* 챗봇 입니다. 어떤 정보를 원하시나요?',
					markdown: true,
				},
				{
					type: 'text',
					text:
						'✋  Morning Breifing은 *오늘의 날씨*, *미세먼지*, *코로나 확진자 수*, *뉴스 헤드라인* 4가지 종류의 데이터를 제공하고 있습니다.',
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*🌤  오늘의 날씨*',
					markdown: true,
				},
				{
					type: 'description',
					term: '🌡 기온',
					content: {
						type: 'text',
						text: `*${data.weather[location].temperature}C*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '🌂 강수',
					content: {
						type: 'text',
						text: `*${data.weather[location].humidity}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*🌫  미세먼지*',
					markdown: true,
				},
				{
					type: 'description',
					term: '🌬 미세',
					content: {
						type: 'text',
						text: `*${data.air[location].micro_dust}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '초미세',
					content: {
						type: 'text',
						text: `*${data.air[location].ultra_micro_dust}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*📈  코로나 확진자 수*',
					markdown: true,
				},
				{
					type: 'description',
					term: '😷 신규',
					content: {
						type: 'text',
						text: `🔺 *${data.covid.inside}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*📋  뉴스 헤드라인*',
					markdown: true,
				},
				{
					type: 'text',
					text: `[${data.news.headline[0].title}](${data.news.headline[0].link})`,
					markdown: true,
				},
				{
					type: 'text',
					text: `[${data.news.headline[1].title}](${data.news.headline[1].link})`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*🔎  자세히 보기*',
					markdown: true,
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: '날씨',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'weather',
							value: '',
						},
						{
							type: 'button',
							text: '미세먼지',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'finedust',
							value: '',
						},
					],
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: '코로나',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'corona',
							value: '',
						},
						{
							type: 'button',
							text: '뉴스',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'news',
							value: '',
						},
					],
				},
				{
					type: 'divider',
				},
				{
					type: 'button',
					text: '설정하기',
					style: 'default',
					action_type: 'call_modal',
					action_name: 'setting',
					value: '',
				},
			],
		};
	},

	getCovid: async () => {
		await updateData();
		return {
			text: '코로나 현황 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/3LTuUo.png',
				},
				{
					type: 'text',
					text: '*일일 확진자*',
					markdown: true,
				},
				{
					type: 'text',
					text: `🇰🇷  국내발생　*${data.covid.inside}*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `🌏  해외유입　*${data.covid.outside}*`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*국내 현황*',
					markdown: true,
				},
				{
					type: 'text',
					text: `😷  확진환자　*${data.covid.coronic}*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⚠️  검사중　　*${data.covid.check}*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `✅  격리해제　*${data.covid.free}*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `🙏🏻  사망　　   *${data.covid.death}*`,
					markdown: true,
				},

				{
					type: 'divider',
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: 'COVID-19 이동',
							style: 'default',
							action_type: 'open_inapp_browser',
							action_name: 'go-covid19-site',
							value: 'http://ncov.mohw.go.kr/',
						},
						{
							type: 'button',
							text: '챗봇 부르기',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'call-chat-bot',
							value: '',
						},
					],
				},
			],
		};
	},

	getNews: async () => {
		await updateData();
		let news = data.news;
		return {
			text: '뉴스 헤드라인 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/ls3vyh.png',
				},
				{
					type: 'text',
					text: '*🤦  정치  🤦‍♀️*',
					markdown: true,
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.politics[0].title}](${news.politics[0].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.politics[0].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.politics[1].title}](${news.politics[1].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.politics[1].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.politics[2].title}](${news.politics[2].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.politics[2].img_src,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*💸   경제  💸*',
					markdown: true,
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.economy[0].title}](${news.economy[0].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.economy[0].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.economy[1].title}](${news.economy[1].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.economy[1].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.economy[2].title}](${news.economy[2].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.economy[2].img_src,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '*🖥   IT/과학  🔬*',
					markdown: true,
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.it[0].title}](${news.it[0].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.it[0].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.it[1].title}](${news.it[1].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.it[1].img_src,
					},
				},
				{
					type: 'context',
					content: {
						type: 'text',
						text: `[${news.it[2].title}](${news.it[2].link})`,
						markdown: true,
					},
					image: {
						type: 'image_link',
						url: news.it[2].img_src,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: '뉴스 이동',
							style: 'default',
							action_type: 'open_inapp_browser',
							action_name: 'go-news-site',
							value: 'https://news.naver.com/',
						},
						{
							type: 'button',
							text: '챗봇 부르기',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'call-chat-bot',
							value: '',
						},
					],
				},
			],
		};
	},

	getWeather: async (location) => {
		await updateData();
		let weather = data.weather[location];
		return {
			text: '오늘의 날씨 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/z1OQed.png',
				},
				{	// 여기를 날씨에 맞게 수정하시면 됩니다
					type: "image_link",
					url: "https://ifh.cc/g/KUhOmv.png"
				},
				{
					type: 'description',
					term: '🌤 날씨',
					content: {
						type: 'text',
						text: `*${weather.weather}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '🌡 기온',
					content: {
						type: 'text',
						text: `*${weather.temperature}C*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '👧 체감',
					content: {
						type: 'text',
						text: `*${weather.apparent_temperature}C*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '🔺 최고',
					content: {
						type: 'text',
						text: `*${weather.highest_temperature}C*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '🔻 최저',
					content: {
						type: 'text',
						text: `*${weather.lowest_temperature}C*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '💦 습도',
					content: {
						type: 'text',
						text: `*${weather.humidity}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'description',
					term: '🌂 강수',
					content: {
						type: 'text',
						text: `*${weather.precipitation_probability}*`,
						markdown: true,
					},
					accent: false,
				},
				{
					type: 'text',
					text: '*_13시에 비올 확률이 가장 높습니다_*',
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: `*🔈 업데이트 ${weather.update_date} [네이버 날씨]*`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: '네이버 날씨 이동',
							style: 'default',
							action_type: 'open_inapp_browser',
							action_name: 'go-forecast-site',
							value: weather.url,
						},
						{
							type: 'button',
							text: '챗봇 부르기',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'call-chat-bot',
							value: '',
						},
					],
				},
			],
		};
	},

	getAir: async (location) => {
		await updateData();
		let air = data.air[location];
		return {
			text: '오늘의 미세먼지 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/MilyAl.png',
				},
				{
					type: 'text',
					text: `🌬 미세　　　  *${air.micro_dust}*`,
					markdown: true,
				},
				{	// 여기를 미세 먼지 상황에 따라 바꾸시면 됩니다
					type: "image_link",
					url: "https://ifh.cc/g/OxiH3v.png"
				},
				{
					type: 'text',
					text: `⬇ 가장 적은 시간　　　　*${air.lowest_micro_dust.hour}시*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬆ 가장 많은 시간　　　　*${air.highest_micro_dust.hour}시*`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: `💨 초미세　　  *${air.ultra_micro_dust}*`,
					markdown: true,
				},
				{	// 여기를 초미세 먼지 상황에 따라 바꾸시면 됩니다
					type: "image_link",
					url: "https://ifh.cc/g/bLtEWX.png"
				},
				{
					type: 'text',
					text: `⬇ 가장 적은 시간　　　　*${air.lowest_ultra_micro_dust.hour}*`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬆ 가장 많은 시간　　　　*${air.highest_ultra_micro_dust.hour}*`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: `*🔈 업데이트 ${air.update_date} [한국환경공단]*`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'action',
					elements: [
						{
							type: 'button',
							text: '한국환경공단 이동',
							style: 'default',
							action_type: 'open_inapp_browser',
							action_name: 'go-fine-dust-site',
							value: 'https://www.keco.or.kr/kr/main/index.do',
						},
						{
							type: 'button',
							text: '챗봇 부르기',
							style: 'primary',
							action_type: 'submit_action',
							action_name: 'call-chat-bot',
							value: '',
						},
					],
				},
			],
		};
	},

	getSetting: async () => {
		return {
			"title": "설정하기",
			"accept": "확인",
			"decline": "취소",
			"value": "{request_modal의 응답으로 전송한 value 값}",
			"blocks": [
				{
					"type": "label",
					"text": "*날씨 및 미세먼지를 확인할 지역을 선택하세요*",
					"markdown": true
				},
				{
					"type": "select",
					"name": "area-select",
					"options": [
						{
							"text": "서울특별시",
							"value": "09140550"
						},
						{
							"text": "부산광역시",
							"value": "08470690"
						},
						{
							"text": "인천광역시",
							"value": "11200510"
						},
						{
							"text": "대구광역시",
							"value": "06110517"
						},
						{
							"text": "광주광역시",
							"value": "05140120"
						},
						{
							"text": "대전광역시",
							"value": "07170630"
						},
						{
							"text": "울산광역시",
							"value": "10140510"
						},
						{
							"text": "세종특별자치시",
							"value": "17110250"
						},
						{
							"text": "경기도",
							"value": "02830410"
						},
						{
							"text": "강원도",
							"value": "01810350"
						},
						{
							"text": "충청북도",
							"value": "16760370"
						},
						{
							"text": "충청남도",
							"value": "15810320"
						},
						{
							"text": "전라북도",
							"value": "13750360"
						},
						{
							"text": "전라남도",
							"value": "12790330"
						},
						{
							"text": "경상북도",
							"value": "04170400"
						},
						{
							"text": "경상남도",
							"value": "03720415"
						},
						{
							"text": "제주특별자치도",
							"value": "14110630"
						},
					],
					"required": true,
					"placeholder": "지역을 선택해주세요"
				},
				{
					"type": "label",
					"text": "*Morning Breifing 챗봇 서비스를 이용하고 싶은 요일을 선택하세요*",
					"markdown": true
				},
				{
					"type": "select",
					"name": "day-select",
					"options": [
						{
							"text": "매일",
							"value": "1"
						},
						{
							"text": "평일만",
							"value": "2"
						}
					],
					"required": true,
					"placeholder": "요일을 선택해주세요"
				}
			]
		};
	},
};

module.exports = template;