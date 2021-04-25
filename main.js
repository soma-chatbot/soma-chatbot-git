const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const work = require('./libs/kakaowork-api');
const fs = require('fs');
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

app.post('/callback', (req, res) => {
	// Message button press response comes here.
	let { body } = req;
	console.log('CB: ', body);
	res.send({ res: 'ok' });
});

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

app.listen(80, () => {
	console.log("Chatbot server started");
});