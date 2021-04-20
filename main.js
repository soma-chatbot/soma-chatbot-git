const express = require("express");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const app = express();

app.get('/',(req,res)=>{
	res.send("Server is healthy now.")
})

app.get('/git/pull',async (req,res)=>{
	console.log('Git pull requested.')
	try{
	 const { stdout, stderr } =	await exec(path.join(__dirname, 'git-pull.sh'));
		console.log('Git pulled : ')
		console.log(stdout);
		console.log(stderr);
	}catch(e){
		console.log('Error occurred.')
		console.log(e.stdout);
		console.log(e.stderr);
		res.send({status:'Err'});
		return;
	}
	res.send({status:'OK'});
})

app.listen(80,()=>{
	console.log("Chatbot server started");
})