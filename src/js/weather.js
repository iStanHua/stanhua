
$(function ()
{
    var $page = $('.weather-page'),
        mapKey = '4a7b766a71843d4be7208ff9307d9a61';
    getLocation($page, mapKey);　
    
});

function ajaxJsonpData(url,callback) {
    var data = {};
    data.output = 'jsonp';
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'jsonp',
          jsonp:"callback",
          jsonpCallback:"success_jsonpCallback",
        data: data,
        success: function (json) {
            if (callback) {
                callback(json);
            }
        },
        error: function (err) {
            alert('服务端错误，请刷新浏览器后重试');
        }
    })
};
function getLocation($page,mapKey)
{
    $.ajax(
    {
        url: 'http://webapi.amap.com/maps/ipLocation?key=' + mapKey,
        success: function (data)
        {
            var json = eval(data),
            code = json.adcode;
            getWeatherInfo($page, mapKey, code, 'base');
            getWeatherInfo($page, mapKey, code, 'all');
        }
    });
};

function getWeatherInfo($page,mapKey,adcode,extensions)
{
    var url = 'http://restapi.amap.com/v3/weather/weatherInfo?key=' + mapKey + '&city=' + adcode + '&extensions=' + extensions;
    $.ajax(
    {
        url: url,
        success: function (json)
        {
            if (json.status == '1')
            {
                if (extensions == 'base')
                {
                    var $location = $page.find('.location-panel'),
                lives = json.lives[0];
                    $location.children('.city').text(lives.city);
                    $location.children('.weather').text(lives.weather);
                    $location.children('.temp').text(lives.temperature + '℃');
                    $location.children('.wind').text(lives.winddirection + '风' + lives.windpower + '级');
                    $location.children('.update').text(lives.reporttime);
                }
                else
                {
                    var forecasts = json.forecasts[0].casts,
                        listArray = [],
                        xAxis = [],
                        dayTemp = [],
                        nightTemp = [];
                    $.each(forecasts, function (i, data)
                    {
                        if (i == 0)
                        {
                            return;
                        }
                        var listObject = {},
                            week = getWeekDay(data.week, false);
                        xAxis.push(week);
                        dayTemp.push(parseInt(data.daytemp));
                        nightTemp.push(parseInt(data.nighttemp));
                        listObject.Date = data.date;
                        listObject.Week = week;
                        listObject.DayWeather = data.dayweather;
                        listObject.DayTemp = data.daytemp;
                        listObject.DayWind = data.daywind;
                        listObject.DayPower = data.daypower;
                        listObject.NightWeather = data.nightweather;
                        listObject.NightTemp = data.nighttemp;
                        listObject.NightWind = data.nightwind;
                        listObject.NightPower = data.nightpower;
                        listArray.push(listObject);
                    });
                    var weatherObject ={};
                    weatherObject.Data=listArray;
$page.find('.weathers-panel').children('.gridview').append(template('weatherTmpl',weatherObject));

                    $page.find('.chart-panel').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories: xAxis
                        },
                        yAxis: {
                            title: {
                                text: ''
                            },
                            labels: {
                                formatter: function ()
                                {
                                    return this.value + '°C';
                                }
                            }
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true,
                            valueSuffix: '°C'
                        },
                        legend: {
                            enabled:false
                        },
                        series: [{
                            name: '白天',
                            marker: {
                                symbol: 'square'
                            },
                            data: dayTemp

                        }, {
                            name: '晚上',
                            marker: {
                                symbol: 'diamond'
                            },
                            data: nightTemp
                        }]
                    });
                }
            }
        }
    }); 
};

function getWeekDay(week, flag)
{
    var str = '周';
    if (flag == true)
    {
        str = '星期';
    }
    switch (week)
    {
        case '0':
            return str + '日'; break;
        case '1':
            return str + '一'; break;
        case '2':
            return str + '二'; break;
        case '3':
            return str + '三'; break;
        case '4':
            return str + '四'; break;
        case '5':
            return str + '五'; break;
        case '6':
            return str + '六'; break;
    }
}