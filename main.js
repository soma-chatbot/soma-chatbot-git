const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const work = require('./libs/kakaowork-api');
const template = require('./libs/template');
const logger = require('morgan');
const fs = require('fs').promises;

const SETTING_FILE_PATH = path.join(__dirname, 'user_setting.json');

let users = [];			// List of all users
let userSetting = {}; 	// Weather location setting for user

async function init() {
	users = await work.getUserList();

	// Initialize user setting
	users.forEach(user => {
		userSetting[user.id] = {
			location: '09140550',
			day: 1
		};
	});
	console.log(`Total ${users.length} users detected`);

	// If user setting file already exists, override it.
	try {
		const settingJSONStr = await fs.readFile(SETTING_FILE_PATH);
		userSetting = { ...userSetting, ...JSON.parse(settingJSONStr) };
	} catch (_) {

	}
}
init();

const app = express();

app.use(logger(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());

// 정적 파일 서비스
app.use(express.static(path.join(__dirname, 'public')));

// 카카오워크 모달 응답 콜백
app.post('/request', async (req, res) => {
	let setting = await template.getSetting();
	res.json({ view: setting });
});

// 카카오워크 버튼 콜백
app.post('/callback', async (req, res) => {
	// Message button press response comes here.
	let { body } = req;

	let userID = body.react_user_id;;
	let roomID = body.message.conversation_id;
	let action = body.action_name;

	if (body.type == 'submission') {
		action = 'submission';
	}

	async function send(...args) {
		let [typeStr, ...params] = args;
		let blocks = await template['get' + typeStr](...params);
		let msgret = await work.sendMessage({ id: roomID }, blocks);
		return msgret;
	}

	switch (action) {
		case 'corona':
			await send('Covid');
			break;
		case 'news':
			await send('News');
			break;
		case 'finedust':
			await send('Air', userSetting[userID].location);
			break;
		case 'weather':
			await send('Weather', userSetting[userID].location);
			break;
		case 'call-chat-bot':
			await send('Brief', userSetting[userID].location);
			break;
		case 'submission':
			let location = body.actions['area-select'];
			let day = body.actions['day-select'];
			userSetting[userID] = { ...userSetting[userID], location, day };
			let settingStr = JSON.stringify(userSetting);
			fs.writeFile(SETTING_FILE_PATH, settingStr);
			break;
	}
	res.send({ res: 'ok' });
});

// 테스트 페이지 서비스
app.get('/', (req, res) => {
	res.send(path.join(__dirname, 'public', 'index.js'));
});

// 깃허브 Webhook push 이벤트 콜백
app.post('/git/pull', async (req, res) => {
	console.log('Git pull requested.');
	try {
		const { stdout, stderr } = await exec(path.join(__dirname, 'git-pull.sh'));
		console.log(stdout);
		console.log(stderr);
		console.log('Git pull finished.');
	} catch (e) {
		console.log(e.stdout);
		console.log(e.stderr);
		console.log('Error occurred.');
		res.send({ status: 'Err' });
		return;
	}
	res.send({ status: 'OK' });
});

// 테스트 페이지 테스트 `전송` 버튼 콜백
app.post('/test', async (req, res) => {
	try {
		let { username, blocks } = req.body;
		console.log(username);
		let user = users.filter(x => x.name == username)[0];
		if (user) {
			let conv = await work.openConversations(user);
			blocks = JSON.parse(blocks);
			let msgret = await work.sendMessage(conv, blocks);
			res.send(msgret);
		} else {
			res.send('그런 유저가 없습니다.');
		}
	} catch (e) {
		res.send({ 'state': '서버 내부 에러 발생', 'errMsg': e.message });
	}
});

// 모든 유저에게 브리핑 봇 보내기 /chatbot
// https://www.notion.so/SW-12-485750b970e54c15adee96b539c6c127
app.post('/chatbot', async (req, res) => {
	let n = new Date().getDay();
	let isWeekend = (n === 0) || (n === 6);
	/*
	n = 현재 요일
	0 = 일요일
	1 = 월요일
	...
	6 = 토요일
	*/

	let result = await Promise.all(users.map(async user => {
		try {
			let setting = userSetting[user.id];

			// 평일만 메시지를 받기로 설정한 유저는 오늘이 주말일 경우 메시지를 보내지 않는다.
			if ((setting.day === '2') && isWeekend) return null;
			let conv = await work.openConversations(user);
			let msgRet = await work.sendMessage(conv, await template.getBrief(setting.location));
			return msgRet;
		} catch (err) {
			return err;
		}
	}));
	res.send(result);
});

// 특정 유저에게 브리핑 봇 보내기 /summonBot/{이름}
app.get('/summonBot/:name', async (req, res) => {
	try {
		let user = users.filter(x => x.name == req.params.name)[0];
		if (user) {
			let conv = await work.openConversations(user);
			let msgRet = await work.sendMessage(conv, await template.getBrief(userSetting[user.id].location));
			res.send(msgRet);
		} else {
			res.send('그런 유저가 없습니다.');
		}
	} catch (err) {
		res.send({ 'state': '서버 내부 에러 발생', 'errMsg': err.message });
	}
});

app.listen(80, () => {
	console.log("Chatbot server started");
});