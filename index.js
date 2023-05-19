const { createClient } = require('icqq');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
const { isCommand } = require('./lib/command');
const qq = config.qq;
const pwd = config.pwd;


const client = createClient({ platform: 6 });

client.on('system.login.slider', (e) => {
    console.log('Received slider' + e.url);
    process.stdin.once('data', (data) => {
        client.submitSlider(data.toString().trim());
    });
});
client.on('system.login.device', (e) => {
    console.log('Select: 1. sms code, 2. qr code');
    process.stdin.once('data', (data) => {
        if (data.toString().trim() === '1') {
            client.sendSmsCode();
            console.log('Please enter the sms code');
            process.stdin.once('data', (res) => {
                client.submitSmsCode(res.toString().trim());
            });
        } else {
            console.log('Please scan the qr code');
            process.stdin.once('data', () => {
                client.login();
            });
        }
    });
});
client.login(qq, pwd);

var commands = {
    'help': '显示帮助信息'
};

exports.bot = client;

const loadModules = () => {
    const modules = fs.readdirSync(path.join(__dirname, 'modules'));
    for (const module of modules) {
        console.log(`Loading module ${module}`);
        const m = require(path.join(__dirname, 'modules', module));
        if (m.commands) {
            for (const key in m.commands) {
                commands[key] = m.commands[key];
            }
        }
    }
};
loadModules();

client.on('message', (msg) => {
    if (isCommand(msg, 'help')) {
        let help = '可用命令：\n';
        for (const key in commands) {
            help += `/${key} - ${commands[key]}\n`;
        }
        msg.reply(help);
    }
});

process.on('uncaughtException', function (err) {
    console.log('Wow! uncaught exception: ' + err);
});
