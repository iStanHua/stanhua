/*! stanhua 2016-10-10 21:10:25 */
function ajaxJsonpData(a,b){var c={};c.output="jsonp",$.ajax({url:a,type:"post",dataType:"jsonp",jsonp:"callback",jsonpCallback:"success_jsonpCallback",data:c,success:function(a){b&&b(a)},error:function(a){alert("服务端错误，请刷新浏览器后重试")}})}function getLocation($page,mapKey){$.ajax({url:"http://webapi.amap.com/maps/ipLocation?key="+mapKey,success:function(data){var json=eval(data),code=json.adcode;getWeatherInfo($page,mapKey,code,"base"),getWeatherInfo($page,mapKey,code,"all")}})}function getWeatherInfo(a,b,c,d){var e="http://restapi.amap.com/v3/weather/weatherInfo?key="+b+"&city="+c+"&extensions="+d;$.ajax({url:e,success:function(b){if("1"==b.status)if("base"==d){var c=a.find(".location-panel"),e=b.lives[0];c.children(".city").text(e.city),c.children(".weather").text(e.weather),c.children(".temp").text(e.temperature+"℃"),c.children(".wind").text(e.winddirection+"风"+e.windpower+"级"),c.children(".update").text(e.reporttime)}else{var f=b.forecasts[0].casts,g=[],h=[],i=[],j=[];$.each(f,function(a,b){if(0!=a){var c={},d=getWeekDay(b.week,!1);h.push(d),i.push(parseInt(b.daytemp)),j.push(parseInt(b.nighttemp)),c.Date=b.date,c.Week=d,c.DayWeather=b.dayweather,c.DayTemp=b.daytemp,c.DayWind=b.daywind,c.DayPower=b.daypower,c.NightWeather=b.nightweather,c.NightTemp=b.nighttemp,c.NightWind=b.nightwind,c.NightPower=b.nightpower,g.push(c)}});var k={};k.Data=g,a.find(".weathers-panel").children(".gridview").append(template("weatherTmpl",k)),a.find(".chart-panel").highcharts({chart:{type:"spline"},title:{text:""},xAxis:{categories:h},yAxis:{title:{text:""},labels:{formatter:function(){return this.value+"°C"}}},tooltip:{crosshairs:!0,shared:!0,valueSuffix:"°C"},legend:{enabled:!1},series:[{name:"白天",marker:{symbol:"square"},data:i},{name:"晚上",marker:{symbol:"diamond"},data:j}]})}}})}function getWeekDay(a,b){var c="周";switch(1==b&&(c="星期"),a){case"0":return c+"日";case"1":return c+"一";case"2":return c+"二";case"3":return c+"三";case"4":return c+"四";case"5":return c+"五";case"6":return c+"六"}}$(function(){var a=$(".weather-page"),b="4a7b766a71843d4be7208ff9307d9a61";getLocation(a,b)});