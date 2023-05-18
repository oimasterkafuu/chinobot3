const { bot } = require('../index');
const { isCommand } = require('../lib/command');

bot.on('message.private', (msg) => {
    if(isCommand(msg, 'whereami')){
        msg.reply(`在 ${msg.sender.nickname}(${msg.sender.user_id}) 的私聊中。`);
    }
});
bot.on('message.group', (msg) => {
    if(isCommand(msg, 'whereami')){
        msg.reply(`在 ${msg.group.name}(${msg.group.group_id}) 的群聊中。`);
    }
});

exports.commands = {
    'whereami': '回复所在的聊天信息'
};