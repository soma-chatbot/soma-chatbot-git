const fs = require('fs').promises;
const path = require('path');

const read = fs.readFile;

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
			text: "모닝 브리핑이 도착했습니다!",
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
					text: '　　　*🌤  오늘의 날씨 🌥*',
					markdown: true,
				},
				{
					type: 'description',
					term: '기온',
					content: {
						type: 'text',
						text: `${data.weather.temperature}C`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '강수확률',
					content: {
						type: 'text',
						text: `${data.weather.humidity}`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　　　　*🌫  미세먼지 🌫*',
					markdown: true,
				},
				{
					type: 'description',
					term: '미세먼지',
					content: {
						type: 'text',
						text: `${data.air.micro_dust}`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '초미세',
					content: {
						type: 'text',
						text: `${data.air.ultra_micro_dust}`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　　*📈  코로나 확진자 수 📉*',
					markdown: true,
				},
				{
					type: 'description',
					term: '신규확진',
					content: {
						type: 'text',
						text: data.covid.inside,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　　　*📋  뉴스 헤드라인 📋*',
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
					text: '　　　*🔎  자세히 보기 🔍*',
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
					text: 'SETTING',
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
					text: '　　　　　*일일 확진자*',
					markdown: true,
				},
				{
					type: 'description',
					term: '국내발생',
					content: {
						type: 'text',
						text: data.covid.inside,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '해외유입',
					content: {
						type: 'text',
						text: data.covid.outside,
						markdown: false,
					},
					accent: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　　　　　*국내 현황*',
					markdown: true,
				},
				{
					type: 'description',
					term: '확진환자',
					content: {
						type: 'text',
						text: data.covid.coronic,
						markdown: false,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '검사중',
					content: {
						type: 'text',
						text: data.covid.check,
						markdown: false,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '격리해제',
					content: {
						type: 'text',
						text: data.covid.free,
						markdown: false,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '사망',
					content: {
						type: 'text',
						text: data.covid.death,
						markdown: false,
					},
					accent: true,
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
							action_name: 'go-fine-dust-site',
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
					text: '　　　　　*🤦  정치  🤦‍♀️*',
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
					text: '　　　　　*💸   경제  💸*',
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
					text: '　　　　　*🖥   IT/과학  🔬*',
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
							action_name: 'go-fine-dust-site',
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

	getWeather: async () => {
		await updateData();
		let weather = data.weather;
		return {
			text: '오늘의 날씨 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/z1OQed.png',
				},

				{
					type: 'text',
					text: '　　　　*🌤 오늘의 날씨 🌥*',
					markdown: true,
				},
				{
					type: 'description',
					term: '🌤 날씨',
					content: {
						type: 'text',
						text: weather.weather,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '🌡 기온',
					content: {
						type: 'text',
						text: `${weather.temperature}C`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '👧 체감',
					content: {
						type: 'text',
						text: `${weather.apparent_temperature}C`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '🔺 최고',
					content: {
						type: 'text',
						text: `${weather.highest_temperature}C`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '🔻 최저',
					content: {
						type: 'text',
						text: `${weather.lowest_temperature}C`,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '💦 습도',
					content: {
						type: 'text',
						text: weather.humidity,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'description',
					term: '🌂 강수',
					content: {
						type: 'text',
						text: weather.precipitation_probability,
						markdown: true,
					},
					accent: true,
				},
				{
					type: 'text',
					text: '13시에 비올 확률이 가장 높습니다',
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　🔈 업데이트 12:05 [기상청] 🔈',
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

	getAir: async () => {
		await updateData();
		let air = data.air;
		return {
			text: '오늘의 미세먼지 안내',
			blocks: [
				{
					type: 'image_link',
					url: 'https://ifh.cc/g/MilyAl.png',
				},
				{
					type: 'text',
					text: `🌬 *미세먼지*　　　😄  ${air.micro_dust}`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬇ 가장 적은 시간　　　　${air.lowest_micro_dust.hour}시`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬆ 가장 많은 시간　　　　${air.highest_micro_dust.hour}시`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: `💨 *초미세먼지*　　 😔  ${air.ultra_micro_dust}`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬇ 가장 적은 시간　　　　${air.lowest_ultra_micro_dust.hour}`,
					markdown: true,
				},
				{
					type: 'text',
					text: `⬆ 가장 많은 시간　　　　${air.highest_ultra_micro_dust.hour}`,
					markdown: true,
				},
				{
					type: 'divider',
				},
				{
					type: 'text',
					text: '　🔈 업데이트 12:05 [기상청] 🔈',
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
};

module.exports = template;