const { bot } = require('../index');
const { isCommand } = require('../lib/command');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { matcher } = require('../lib/matcher');

const alarmPath = path.join(__dirname, '../bot/alarm.json');
var alarm = {};

try {
    alarm = JSON.parse(fs.readFileSync(alarmPath));
} catch (e) {
    console.log(e);
}

// alarm format
// {
//     '904220534:0 8 * * *': '你好，我是 Chinobot3，一个基于 Node.js 的 QQ 机器人。'
//     'groupId:cron': 'reply'
// }

bot.on('message.private', (msg) => {
    if (isCommand(msg, 'alarm')) {
        msg.reply('这个功能只在群聊中可用哦！')
    }
});

const doCronJob = (cron) => {
    console.log('do cron job');
    for (var key in alarm) {
        if (key.split(':')[1] == cron) {
            bot.sendGroupMsg(key.split(':')[0], matcher(alarm[key]));
        }
    }
}

var cronJobs = [];
var hasCron = [];

for (var key in alarm) {
    if (hasCron.indexOf(key.split(':')[1]) != -1) {
        continue;
    }

    cronJobs.push(cron.schedule(key.split(':')[1], () => {
        doCronJob(key.split(':')[1]);
    }));
    hasCron.push(key.split(':')[1]);
}

bot.on('message.group', (msg) => {
    if (isCommand(msg, 'alarm')) {
        console.log(msg.args);
        if (msg.args.length == 3 && msg.args[0] == 'add') {
            try {
                cron.validate(msg.args[1]);
            } catch (e) {
                console.log(e);
                msg.reply('cron 格式错误！');
                return;
            }
            var flag = false;
            for (var key in alarm) {
                if (key.split(':')[1] == msg.args[1]) {
                    flag = true;
                    break;
                }
            }
            alarm[msg.group.group_id + ':' + msg.args[1]] = msg.args[2];
            console.log(alarm);
            fs.writeFileSync(alarmPath, JSON.stringify(alarm));
            if (!flag) {
                console.log('add cron job', msg.args[1]);
                cronJobs.push(cron.schedule(msg.args[1], () => { doCronJob(msg.args[1]); }));
            }
            msg.reply('添加成功！');
        } else if (msg.args.length == 2 && msg.args[0] == 'remove') {
            try {
                try {
                    cron.validate(msg.args[1]);
                } catch (e) {
                    console.log(e);
                    msg.reply('cron 格式错误！');
                    return;
                }
                delete alarm[msg.group.group_id + ':' + msg.args[1]];
                console.log(alarm);
                fs.writeFileSync(alarmPath, JSON.stringify(alarm));
                // if there is no cron job with the same cron, remove it
                var flag = false;
                for (var key in alarm) {
                    if (key.split(':')[1] == msg.args[1]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    console.log('remove cron job', msg.args[1]);
                    cronJobs = cronJobs.filter((job) => {
                        if (job.cron == msg.args[1]) {
                            job.destroy();
                            return false;
                        }
                        return true;
                    });
                }
                msg.reply('删除成功！');
            } catch (e) {
                console.log(e);
                msg.reply('删除失败！');
            }
        } else {
            msg.reply(`这个命令需要参数哦！
/alarm add "<cron>" <内容> - 添加一个提醒。
/alarm remove "<cron>" - 删除一个提醒。

注意：两次输入的 <cron> 相同，后者会覆盖前者。
因为 cron 的格式包含空格，请记住在输入时 使用引号 包裹。
如果你不知道 cron 是什么，请参考 https://crontab.guru/

对于 <内容>，可以使用以下变量：
{year} - 年
{month} - 月
{date} - 日
{hour} - 时
{minute} - 分
{day} - 星期，返回「星期一」的格式
例如，「今天是 {month} 月 {date} 日，{day}」会被替换为「${matcher('今天是 {month} 月 {date} 日，{day}')}」。`);
        }
    }
});

exports.commands = {
    'alarm': '定时提醒'
};