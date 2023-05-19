const { bot } = require('../index');
const { isCommand } = require('../lib/command');
const fs = require('fs');
const path = require('path');

const helperPath = path.join(__dirname, '../bot/helper.json');
var helper = {};

try {
    helper = JSON.parse(fs.readFileSync(helperPath));
} catch (e) {
    console.log(e);
}

// helper format
// {
//     '904220534:hello|bot': '你好，我是 Chinobot3，一个基于 Node.js 的 QQ 机器人。'
//     'groupId:keyword|keyword2|...': 'reply'
// }

bot.on('message.private', (msg) => {
    if (isCommand(msg, 'helper')) {
        msg.reply('这个功能只在群聊中可用哦！')
    }
});
bot.on('message.group', (msg) => {
    if (isCommand(msg, 'helper')) {
        if (msg.args.length == 3 && msg.args[0] == 'add') {
            helper[msg.group.group_id + ':' + msg.args[1]] = msg.args[2];
            console.log(helper);
            fs.writeFileSync(helperPath, JSON.stringify(helper));
            msg.reply('添加成功！');
        } else if (msg.args.length == 2 && msg.args[0] == 'remove') {
            try {
                delete helper[msg.group.group_id + ':' + msg.args[1]];
                fs.writeFileSync(helperPath, JSON.stringify(helper));
                msg.reply('删除成功！');
            } catch (e) {
                console.log(e);
                msg.reply('删除失败！');
            }
        } else {
            msg.reply(`这个命令需要参数哦！
/helper add <关键词> <回复> - 添加一个快捷回复。可以一次添加多个关键词，在 <关键词> 中通过「|」分割。
/helper remove <关键词> - 删除一个快捷回复。你需要保证 <关键词> 的唯一性。

注意：当一句消息包含 所有 的关键词，会激活回复。两次输入的 <关键词> 相同，后者会覆盖前者。`);
        }
    } else {
        for (var key in helper) {
            if (key.split(':')[0] == msg.group.group_id) {
                var keywords = key.split(':')[1].split('|');
                var flag = true;
                for (var keyword of keywords) {
                    if (msg.raw_message.indexOf(keyword) == -1) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    msg.reply(helper[key]);
                }
            }
        }
    }
});

exports.commands = {
    'helper': '快捷回复一些简单的问题'
};