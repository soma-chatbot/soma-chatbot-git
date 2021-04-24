const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const work = require('./libs/kakaowork-api');
const fs = require('fs');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.send(path.join(__dirname, 'public', 'index.js'));
});

app.get('/request', (req, res) => {
	console.log('REQ: ', res);
});

app.get('/callback', (req, res) => {
	console.log('CB: ', res);
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

app.listen(80, () => {
	console.log("Chatbot server started");
});