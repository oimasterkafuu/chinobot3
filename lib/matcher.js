function render(s) {
    console.log(s);

    // {year} - 年
    // {month} - 月
    // {date} - 日
    // {hour} - 时
    // {minute} - 分
    // {day} - 星期，返回「星期一」的格式
    // 例如，「今天是 {month} 月 {date} 日，{day}」会被替换为「今天是 5 月 18 日，星期四」。

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var day = d.getDay();

    var dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    s = s.replaceAll('{year}', year);
    s = s.replaceAll('{month}', month);
    s = s.replaceAll('{date}', date);
    s = s.replaceAll('{hour}', hour);
    s = s.replaceAll('{minute}', minute);
    s = s.replaceAll('{day}', dayMap[day]);

    console.log(s);
    return s;
}

exports.matcher = render;