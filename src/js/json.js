$(function () {
    var moibleStr = '';
    $('.am-city-select-order').each(function () {
        var listObject = '',
            listArray = '';
        moibleStr += '{alp:"' + $(this).text() + '",';
        $(this).next('.am-city-select-list').find('li').each(function () {
            var obj = '',
                name = $(this).children('a').text();
            listArray += '{name:"' + decToHex(name.substring(0, name.indexOf('+')));
            listArray += '",code:' + name.substring(name.indexOf('+') + 1) + '},';
        });
        moibleStr += 'list:[' + listArray.substring(0, listArray.length - 1) + ']},';
    });
    console.log(moibleStr.substring(0, moibleStr.length - 1) + '}');
});
/*
*js Unicode编码转换
*/
var decToHex = function (str) {
    var res = [];
    for (var i = 0; i < str.length; i++)
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u" + res.join("\\u");
}
var hexToDec = function (str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}