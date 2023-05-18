function isCommand(msg, command) {
    if ((!msg.raw_message.startsWith('/' + command + ' ')) && (msg.raw_message !== ('/' + command)))
        return false;
    try {
        msg.args = msg.raw_message.slice(command.length + 2);
        // args = 'oimaster akioi "quote with space 114514 1919810" hey \"quote\"'
        // return ['oimaster', 'akioi', 'quote with space 114514 1919810', 'hey', '"quote"']
        msg.args = msg.args.match(/(?:[^\s"]+|"[^"]*")+/g);
        msg.args = msg.args.map((arg) => {
            if (arg.startsWith('"') && arg.endsWith('"'))
                return arg.slice(1, -1);
            else if (arg.startsWith('\\"') && arg.endsWith('\\"'))
                return "\"" + arg.slice(2, -2) + "\"";
            return arg;
        });
    } catch (e) {
        msg.args = [];
    }
    return true;
}

exports.isCommand = isCommand;