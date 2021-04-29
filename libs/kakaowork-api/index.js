const secrets = require('./secrets.js')
const axios = require('axios')
 
const API_KEY = secrets.API_KEY;
const kakaoInstance = axios.create({
    baseURL: 'https://api.kakaowork.com',
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    },
});

// 유저 목록 검색
exports.getUserList = async () => {
  let res = await kakaoInstance.get('/v1/users.list?limit=100');
let users =  res.data.users;
	while (res.data.cursor){
res=		await kakaoInstance.get('/v1/users.list?cursor='+res.data.cursor)
		users = [...users,...res.data.users]
	}
	return users
};

// 채팅방 생성
exports.openConversations = async ({ id }) => {
  const data = { user_id: id };
  const res = await kakaoInstance.post('/v1/conversations.open', data);
  return res.data.conversation;
};

// 메시지 전송
exports.sendMessage = async (conversation, blocks) => {
  const data = {
    conversation_id: conversation.id,
 	text:'test',
    ...blocks,
  };
  const res = await kakaoInstance.post('/v1/messages.send', data);
  return res.data;
};