/*! stanhua 2016-10-10 21:10:25 */
$(function(){var a;a=new AMap.Map("mapContent",{resizeEnable:!0}),a.on("complete",function(){$("#tip-panel").html("地图图块加载完毕！当前地图中心点为："+a.getCenter())})});