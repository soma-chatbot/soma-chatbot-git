const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const work = require('./libs/kakaowork-api');
const template = require('./libs/template');
const logger = require('morgan');

let users = []; // List of all users
let rooms = []; // List of chat rooms of all users
async function init() {
	users = await work.getUserList();
	rooms = await Promise.all(users.map(user => work.openConversations(user)));
}
init();

async function sendToAllUsers(block) {
	await Promise.all(rooms.map(async room => {
		await work.sendMessage(room, block);
	}));
}

const app = express();

app.use(logger(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/request', (req, res) => {
	let { body } = req;
	console.log('REQ: ', body);
	res.send({ res: 'ok' });
});

app.post('/callback', async (req, res) => {
	// Message button press response comes here.
	let { body } = req;
	let id = body.message.conversation_id;
	let action = body.action_name;

	async function send(typeStr) {
		let blocks = await template['get' + typeStr]();
		let msgret = await work.sendMessage({ id }, blocks);
		console.log(msgret);
	}

	console.log(action);

	switch (action) {
		case 'corona':
			await send('Covid');
			break;
		case 'news':
			await send('News');
			break;
		case 'finedust':
			await send('Air');
			break;
		case 'weather':
			await send('Weather');
			break;
		case 'call-chat-bot':
			await send('Brief');
			break;
	}
	res.send({ res: 'ok' });
});

// 테스트 페이지 접근
app.get('/', (req, res) => {
	res.send(path.join(__dirname, 'public', 'index.js'));
});

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

app.get('/brief', async (req, res) => {
	/**
	 * 이런 식으로 모든 유저에게 동일한 메시지를 보낼 수 있다.
	 * 이 route를 crontab 등으로 trigger함으로써 매일 일정한 시간에 유저에게 메시지를 보낸다.
	 */
	await sendToAllUsers({});
	res.send('ok');
});

// 테스트 페이지 작성
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
	await sendToAllUsers(await template.getBrief());
	res.send('success');
});

app.get('/testModules', async (req, res) => {
	let blk = await template.getBrief();
	await sendToAllUsers(blk);

	blk = await template.getCovid();
	await sendToAllUsers(blk);

	blk = await template.getNews();
	await sendToAllUsers(blk);

	blk = await template.getWeather();
	await sendToAllUsers(blk);

	blk = await template.getAir();
	await sendToAllUsers(blk);
});

// 특정 유저에게 브리핑 봇 보내기 /summonBot/{이름}
app.get('/summonBot/:name', async (req, res) => {
	try {
		let user = users.filter(x => x.name == req.params.name)[0];
		if (user) {
			let conv = await work.openConversations(user);
			let msgRet = await work.sendMessage(conv, await template.getBrief());
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