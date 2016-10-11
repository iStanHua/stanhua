$(function ()
{
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('mapContent', {
        resizeEnable: true
    });
    map.on('complete', function ()
    {
        $('#tip-panel').html("地图图块加载完毕！当前地图中心点为：" + map.getCenter());
    });
   
    //解析定位结果
    function onComplete(data)
    {
        var str = ['定位成功'];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        str.push('精度：' + data.accuracy + ' 米');
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        $('#tip-panel').html(str.join('<br>'));
    }
    //解析定位错误信息
    function onError(data)
    {
        $('#tip-panel').html('定位失败');
    }
});