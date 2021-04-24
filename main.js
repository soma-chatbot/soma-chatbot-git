const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const work = require('./libs/kakaowork-api');
const fs = require('fs');
const logger = require('morgan');

let users = [];
async function init() {
	users = await work.getUserList();
}
init();

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/request', (req, res) => {
	console.log('REQ: ', res.data);
});

app.post('/callback', (req, res) => {
	// Message button press response comes here.
	console.log('CB: ', res.data);
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