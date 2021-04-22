const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

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
		res.send({status:'Err'});
		return;
	}
	res.send({status:'OK'});
});

app.listen(80, () => {
	console.log("Chatbot server started");
});