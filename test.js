const work = require('./libs/kakaowork-api');
const template = require('./libs/template');

let testUserNames = ['Joonho Gwon', '황희영'];
let testUsers = [];
let testConversations = [];

console.log(testUserNames);

async function init() {
	users = await work.getUserList();
	testUsers = users.filter(x => testUserNames.indexOf(x.name) >= 0);
	testConversations = await Promise.all(testUsers.map(testUser => work.openConversations(testUser)));
	let blocks = template.getBrief();
	console.log(blocks);
	let msgret = await Promise.all(testConversations.map(c => work.sendMessage(c, blocks)));
	console.log(msgret);
}

init();