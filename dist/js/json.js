/*! stanhua 2016-10-10 21:10:25 */
$(function(){var a="";$(".am-city-select-order").each(function(){var b="";a+='{alp:"'+$(this).text()+'",',$(this).next(".am-city-select-list").find("li").each(function(){var a=$(this).children("a").text();b+='{name:"'+decToHex(a.substring(0,a.indexOf("+"))),b+='",code:'+a.substring(a.indexOf("+")+1)+"},"}),a+="list:["+b.substring(0,b.length-1)+"]},"}),console.log(a.substring(0,a.length-1)+"}")});var decToHex=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=("00"+a.charCodeAt(c).toString(16)).slice(-4);return"\\u"+b.join("\\u")},hexToDec=function(a){return a=a.replace(/\\/g,"%"),unescape(a)};