/*layer*/
(function ($) {
    stanLayer = function (options) {
        options = options || {};
        var defaults = {
            type: 0,/*弹窗类型*/
            hash: false,/*hash值*/
            mask: true,/*是否显示遮罩层*/
            clickClose: false,/*点击遮罩层是否关闭弹窗*/
            skin: '',/*遮罩层风格*/
            width: 0,/*弹窗宽度*/
            height: 0,/*弹窗高度*/
            animation: '',/*弹窗动画值*/
            time: 0,/*几秒之后关闭弹窗*/
            title: '',/*弹窗标题*/
            titleTips: '',/*弹窗提示标题*/
            back: '',/*返回按钮值*/
            ok: '',/*确定按钮值*/
            content: '',/*弹窗内容*/
            url: '',/*iframe的url地址*/
            btns: [],/*弹窗底部按钮值*/
            success: null,/*弹窗成功执行事件*/
            timeCallback: null,/*定时器执行事件*/
            backCallback: null,/*返回按钮执行事件*/
            okCallback: null,/*确定按钮执行事件*/
            yesCallback: null,/*弹窗底部按确定钮执行事件*/
            cancelCallback: null/*弹窗底部按取消钮执行事件*/
        };
        this.layerZindex = 100;
        this.layerType = ['page', 'open', 'iframe', 'loading', 'msg', 'alert', 'confirm'];
        this.options = $.extend({}, defaults, options);
        init();
        function init() {
            stanUI.layerIndex++;
            this.layerZindex += stanUI.layerIndex;
            var zindex = this.layerZindex + 1,
                opts = this.options,
                type = opts.type > this.layerType.length ? 0 : opts.type,
                mask = opts.mask,
                width = opts.width,
                height = opts.height,
                animation = opts.animation,
                btns = opts.btns,
                btnsLen = btns.length,
                typeStr = this.layerType[type],
                posStr = '',
                iframeStr = '',
                tipsStr = '',
                layerHtml = '',
                styleStr = '',
                titleHtml = '',
                btnHtml = '';
            styleStr = width > 0 ? 'width:' + width + 'px;' : '';
            styleStr = styleStr + height > 0 ? 'height:' + height + 'px;' : '';
            if (type == 1) {
                var position = opts.position;
                position = position == '' ? 'middle' : position;
                posStr = ' layer-open-' + position;
                if (position == 'top') {
                    if (animation == '') {
                        animation = 'fadeT';
                    }
                }
                else if (position == 'bottom') {
                    if (animation == '') {
                        animation = 'fadeB';
                    }
                }
                else if (position == 'left') {
                    if (animation == '') {
                        animation = 'fadeL';
                    }
                }
                else if (position == 'right') {
                    if (animation == '') {
                        animation = 'fadeR';
                    }
                }
            }
            if (type == 4) {
                mask = false;
            }
            if (type > 2) {
                tipsStr = ' layer-tips';
                if (animation == '') {
                    animation = 'bounce';
                }
            }
            if (type == 0) animation = animation == '' ? 'fadeR' : animation;
            else animation = animation == '' ? 'bounce' : animation;
            if (mask) {
                layerHtml += '<div class="layer-mask layer-' + typeStr + '-mask" style="z-index:' + this.layerZindex + '"></div>';
            }
            var title = opts.title,
                titleTips = opts.titleTips;
            if (title != '') {
                if (titleTips != '') {
                    titleHtml = '<div class="layer-title layer-title-tips">';
                }
                else {
                    titleHtml = '<div class="layer-title">';
                }
                if (opts.back != '') {
                    titleHtml += '<a class="t-item t-left">' + opts.back + '</a>';
                }
                if (titleTips != '') {
                    titleHtml += '<div class="title"><div class="main">' + title + '</div><div class="tips">' + titleTips + '</div></div>';
                }
                else {
                    titleHtml += '<div class="title">' + title + '</div>';
                }
                if (opts.ok != '') {
                    titleHtml += '<a class="t-item t-right">' + opts.ok + '</a>';
                }
                titleHtml += '</div>';
            }
            if (opts.url != '') {
                iframeStr = ' layer-iframe';
                opts.content = "<iframe class='stanIframe' name='stanIframe' src='" + opts.url + "'></iframe>";
            }
            if (btnsLen > 0 && btnsLen < 3) {
                btnHtml = '<div class="layer-btn">';
                if (btnsLen == 1) {
                    btnHtml += '<a class="yes w100">' + btns[0] + '</a>';
                }
                else {
                    btnHtml += '<a class="cancel w50">' + btns[0] + '</a><a class="yes w50">' + btns[1] + '</a>';
                }
                btnHtml += '</div>';
            }
            layerHtml += '<div class="layer layer' + stanUI.layerIndex + tipsStr + ' layer-' + typeStr + posStr + iframeStr + '" data-index="';
            layerHtml += stanUI.layerIndex + '" style="z-index:' + zindex + ';' + styleStr + '">';
            layerHtml += '<div class="layer-box">' + titleHtml;
            layerHtml += '<div class="layer-content">' + opts.content + '</div>';
            layerHtml += btnHtml + '</div></div>';
            $('body').append(layerHtml);
            if (!$('html').hasClass('layer-on')) {
                $('html').addClass('layer-on');
            }
            if (opts.hash) {
                if ('pushState' in history) {
                    history.pushState('layer', title, location.href);
                }
                else {
                    location.hash = typeStr;
                }
            }
            var $currentLayer = $('.layer' + stanUI.layerIndex);
            events($currentLayer);
            if (animation != '') {
                $currentLayer.addAnimation(animation);
            }
            if (type == 0) {
                $('.page').removeAnimation('fadeP', function ($this) {
                    $this.hide(650);
                });
            }
            if (typeof success === 'function') {
                success($currentLayer);
            }
            if (type > 2) {
                stanLayer.refresh($currentLayer);
            }
        };
        function events($layer) {
            var opts = this.options,
                $layerbtn = $layer.find('.layer-btn');
            if (opts.clickClose) {
                var $mask = $layer.prev('.layer-mask');
                if ($mask.length > 0) {
                    $mask.off('click').on('click', function (e) {
                        stanLayer.close(stanUI.layerIndex);
                    });
                }
                else {
                    $layer.off('click').on('click', function (e) {
                        stanLayer.close(stanUI.layerIndex);
                    });
                }
            }
            if (opts.back != '') {
                $layer.find('.t-left').off('click').on('click', function () {
                    opts.backCallback ? opts.backCallback($layer) : stanLayer.close(stanUI.layerIndex);
                });
            }
            if (opts.ok != '') {
                $layer.find('.t-right').off('click').on('click', function () {
                    opts.okCallback ? opts.okCallback($layer) : stanLayer.close(stanUI.layerIndex);
                });
            }
            if ($layerbtn.length > 0) {
                $layerbtn.children('.yes').off('click').on('click', function () {
                    opts.yesCallback ? opts.yesCallback($layer) : stanLayer.close(stanUI.layerIndex);
                });
                if (opts.btns.length == 2) {
                    $layerbtn.children('.cancel').off('click').on('click', function () {
                        opts.cancelCallback ? opts.cancelCallback($layer) : stanLayer.close(stanUI.layerIndex);
                    });
                }
            }
            if (opts.time > 0) {
                if (typeof timeCallback == 'function') {
                    opts.timeCallback($layer);
                }
                else {
                    $layer.delay(opts.time * 1000).show(opts.time * 1000, function () {
                        stanLayer.close(stanUI.layerIndex);
                    });
                }
            }
        }
    };
    stanLayer.refresh = function ($layer) {
        var top = -Math.floor($layer.height() / 2) + 'px',
            left = -Math.floor($layer.width() / 2) + 'px';
        $layer.css({ 'margin-top': top, 'margin-left': left });
    };
    stanLayer.close = function (id) {
        var $html = $('html'),
            $page = $html.find('.page'),
            $layer = $html.find('.layer'),
            len = $layer.length,
            $currLayer;
        if (len > 0) {
            if (id == undefined) {
                $currLayer = $layer.eq(len - 1);
            }
            else {
                $currLayer = $html.find('.layer' + id);
            }
            if ($currLayer.prev('.layer-mask').length > 0) {
                $currLayer.prev('.layer-mask').remove();
            }
            var animation = $currLayer.attr('data-animation');
            if (animation == undefined) {
                $currLayer.remove();
            }
            else {
                $currLayer.removeAnimation(animation, function ($this) {
                    $this.delay(650).show(10, function () {
                        $this.remove();
                    });
                });
            }
            if ($currLayer.hasClass('layer-page')) {
                var pageAnimation = $page.attr('data-animation');
                if (pageAnimation != undefined) {
                    $page.addAnimation(pageAnimation, function ($this) {
                        $this.show();
                    });
                }
            }
            if (len == 1) {
                if ('replaceState' in history) {
                    if (history.state != null) {
                        history.back();
                        history.replaceState(null, null, href);
                    }
                }
                if ($html.hasClass('layer-on')) {
                    $html.removeClass('layer-on');
                }
            }
        }
    };
    stanLayer.closeAll = function () {
        var $html = $('html'),
            $layer = $html.find('.layer'),
            len = $layer.length;
        if (len > 0) {
            if (len > 1) {
                for (var i = 0; i < len - 1; i++) {
                    $layer.eq(i).remove();
                }
            }
            $layer.eq(len - 1).delay(2000).show(1000, function () {
                stanLayer.close($layer.eq(len - 1).attr('data-index'));
            });
        }
    };
    stanLayer.page = function (options) {
        stanLayer($.extend({
            type: 0
        }, options == undefined ? {} : options));
    };
    stanLayer.open = function (position, options) {
        stanLayer($.extend({
            type: 1,
            position: position
        }, options == undefined ? {} : options));
    };
    stanLayer.loading = function (content, options) {
        var $loading = $('.layer-loading');
        content = '<p>' + content + '</p>' || '<p>正在努力加载</p>';
        content = stanUI.loaderHtml + content;
        if ($loading.length > 0) {
            $loading.find('.layer-content').empty().html(content);
        }
        else {
            stanLayer($.extend({
                type: 3,
                time: 2,
                content: content
            }, options == undefined ? {} : options));
        }
    };
    stanLayer.closeLoading = function () {
        var $loading = $('.layer-loading');
        if ($loading.length > 0) {
            stanLayer.close($loading.attr('data-value'));
        }
    };
    stanLayer.msg = function (content, time, options) {
        var $msg = $('.layer-msg');
        if ($msg.length > 0) {
            $msg.find('.layer-content').empty().html(content);
        }
        else {
            stanLayer($.extend({
                type: 4,
                content: content,
                time: time
            }, options == undefined ? {} : options));
        }
    };
    stanLayer.closeMsg = function () {
        var $msg = $('.layer-msg');
        if ($msg.length > 0) {
            stanLayer.close($msg.attr('data-value'));
        }
    };
    stanLayer.alert = function (content, btn, yesCallback, options) {
        btn = btn || '知道了';
        stanLayer($.extend({
            type: 5,
            content: content,
            btns: [btn],
            yesCallback: yesCallback
        }, options == undefined ? {} : options));
    };
    stanLayer.confirm = function (content, btns, cancelCallback, yesCallback, options) {
        return stanLayer($.extend({
            type: 6,
            content: content,
            btns: btns,
            yesCallback: yesCallback,
            cancelCallback: cancelCallback
        }, options == undefined ? {} : options));
    };
    stanLayer.password = function (options) {
        var defaults = {
            title: '请输入支付密码',
            titleTips: '',
            back: '取消',
            showPassword: true,
            success: null,
            cancelCallback: null,
            submitCallback: null
        },
            opts = $.extend(defaults, options),
            pwdhtml = "<div class='layer-view'><div class='pay-box'></div>";
        if (opts.showPassword) {
            var strHtml = "<div class='password-box'><div class='password-view'>";
            for (var i = 1; i < 7; i++) {
                var classname = '';
                if (i == 1) {
                    classname = ' first';
                }
                else if (i == 6) {
                    classname = ' last';
                }
                strHtml += "<div class='pwd" + classname + "'><span><span></div>";
            }
            strHtml += "</div></div>";
            strHtml += "<div class='board-box'></div>";
            pwdhtml += strHtml;
        }
        pwdhtml += '</div>';
        stanLayer.open({
            hash: true,
            position: 'bottom',
            skin: 'password',
            title: opts.title,
            back: opts.back,
            success: function ($con) {
                $con.empty().html(pwdhtml);
                if (opts.success) {
                    opts.success($con);
                }
                var $pwd = $con.find('.password-box').find('.pwd'),
                    $box = $con.find('.board-box'),
                    pwdindex = 0;
                numberKeyBoard($box, false, function ($this) {
                    var pwd = '';
                    if ($this.hasClass('backspace')) {
                        if (pwdindex <= 0) {
                            return;
                        }
                        pwdindex--;
                        $pwd.eq(pwdindex).removeClass('used').children('span').text('');
                        pwd = getPassword();
                        return;
                    }
                    if (pwdindex > 5) {
                        return;
                    }
                    $pwd.eq(pwdindex).addClass('used').children('span').text($.trim($this.text()));
                    pwdindex++;
                    pwd = getPassword();
                    if (pwdindex == 6) {
                        if (typeof opts.submitCallback === 'function') {
                            opts.submitCallback(pwd);
                        }
                    }
                });
                function getPassword() {
                    var pwd = '';
                    for (var i = 0; i < 6; i++) {
                        pwd += $.trim($pwd.eq(i).children('span').text());
                    }
                    return pwd;
                };
            },
            backCallback: function ($con) {
                if (typeof opts.cancelCallback === 'function') {
                    opts.cancelCallback($con);
                }
                else {
                    stanLayer.close();
                }
            }
        });
    },
        numberKeyBoard = function ($obj, showDot, callback) {
            var html = "<div class='boardview'>";
            for (var i = 1; i < 10; i++) {
                if (i % 3 == 1) {
                    html += "<div class='gradview'>";
                }
                html += "<a class='item'>" + i + "</a>";
                if (i % 3 == 0) {
                    html += "</div>";
                }
            }
            html += "<div class='v-line v-one'></div>";
            html += "<div class='v-line v-two'></div>";
            html += "<div class='gradview'>";
            if (showDot) {
                html += "<a class='item'>.</a>";
            }
            else {
                html += "<a class='item empty'></a>";
            }
            html += "<a class='item'>0</a>";
            html += "<a class='item backspace'><b class='m-icon m-backspace'></b></a>";
            html += "</div></div>";
            $obj.empty().html(html);
            bamyClick($obj.children('.boardview').find('.item'), function ($this) {
                if ($this.hasClass('empty')) {
                    return;
                }
                if (typeof callback === 'function') {
                    callback($this);
                }
            });
        }
})(jQuery);
