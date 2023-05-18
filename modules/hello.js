const { bot } = require('../index');
const { isCommand } = require('../lib/command');

bot.on('message', (msg) => {
    if (isCommand(msg, 'hello')) {
        const nickname = msg.sender.nickname;
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            msg.reply(`早上好，${nickname}！今天也要元气满满，让我们一起加油！`);
        } else if (hour >= 12 && hour < 18) {
            msg.reply(`下午好，${nickname}！今天已经过去一半了，你是否已经完成了今天的计划呢？`);
        } else if (hour >= 18 && hour < 23) {
            msg.reply(`晚上好，${nickname}！今天过得怎么样？`);
        } else {
            msg.reply(`夜深了，${nickname}，早点休息吧，不然会对身体不好的！`);
        }
    }
});

exports.commands = {
    'hello': '打招呼'
};