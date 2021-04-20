const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const app = express();

app.get('/',(req,res)=>{
	res.send("Server is healthy now.")
})

app.get('/git/pull',async (req,res)=>{
	res.send({status:'OK'});
	try{
	 const { stdout, stderr } =	await exec(path.join(__dirname, 'git-pull.sh'));
		console.log('Git pulled : ')
		console.log(stdout);
	}catch{
		console.log('ERR')
	}
})

app.listen(80,()=>{
	console.log("Chatbot server started");
})