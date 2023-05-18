const { bot } = require('../index');
const { isCommand } = require('../lib/command');

bot.on('message', (msg) => {
    if(isCommand(msg, 'faq'))
        msg.reply(`欢迎你使用 Chinobot3！
Chinobot3 是一个基于 Node.js 的 QQ 机器人，由 oimasterkafuu 编写。

1. 如何使用？
你可以在聊天窗口中输入 /help 来查看可用命令。

2. 源代码在哪里？
你可以在 https://github.com/oimasterkafuu/chinobot3 找到源代码。

3. 我的聊天记录会被记录吗？
Chinobot3 绝对不会记录你的聊天记录，更不会公开出去。

4. 这个机器人会有漏洞吗？
Chinobot3 会尽可能地保证安全，但是不排除可能存在的漏洞。
如果你发现了漏洞，请立即联系 oimasterkafuu。

5. 我能帮助你吗？
当然可以！oimasterkafuu 支持并鼓励所有向 Chinobot3 贡献的行为。
您可以下载源代码，修改后进行 Pull Request。
如果你不会编程，也可以向 oimasterkafuu 提出建议。

6. 为什么指令无法正确识别？
如果你的指令的某一项参数包含空格等特殊字符，请使用引号「"」将其括起来。请务必使用英文引号。
如果你需要输入引号，请使用「\\"」转义。

例如，「/test oimaster akioi "quote with space 114514 1919810" hey \\"quote\\"」将会被解析为：
指令：test；参数：oimaster, akioi, quote with space 114514 1919810, hey, "quote"`);
});

exports.commands = {
    'faq': '常见问答'
};