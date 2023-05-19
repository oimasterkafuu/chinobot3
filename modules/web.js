const { bot } = require('../index');
const { segment } = require('icqq');
const { isCommand } = require('../lib/command');
const shotScreen = require('../lib/shotScreen');

const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')));

const webScreenCachePath = path.join(__dirname, '../bot/webScreenCache.png');
if (fs.existsSync(webScreenCachePath)) {
    fs.unlinkSync(webScreenCachePath);
}

bot.on('message', async (msg) => {
    if (isCommand(msg, 'web')) {
        if (msg.sender.user_id !== config.master) {
            msg.reply('你没有权限使用这个命令哦！');
            return;
        } else if (msg.args.length == 1) {
            msg.reply('请稍等，正在截取网页截图……');
            const url = msg.args[0];
            let retry = 3;
            while (retry--) {
                try {
                    await shotScreen(url, webScreenCachePath);
                    msg.reply(segment.image(webScreenCachePath));
                    break;
                } catch (e) {
                    console.log(e);
                    if (retry == 0) msg.reply('截取网页截图失败！');
                    else if (retry == 3 - 1) msg.reply('截取网页截图失败，正在重试……');
                }
            }
        }
        else {
            msg.reply(`这个命令需要参数哦！
/web <网址> - 截取网页截图。`);
        }
    }
});

exports.commands = {
    'web': '截取网页截图'
};