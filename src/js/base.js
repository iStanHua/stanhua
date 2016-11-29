/*
* @description: ui
* @author: zqh
* @update: 2016-07-28 20:48
*/
; (function ($) {
    stanUI = {};
    $.extend(stanUI, {
        version: '1.0.0',
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },
        ua: navigator.userAgent.toLowerCase(),
        pc: function () {
            return !(this.android() || this.iphone() || this.ipad() || /midp/.test(this.ua)
                || /symbianos/.test(this.ua) || /windows ce/.test(this.ua)
                || /windows mobile/.test(this.ua) || /windows phone/.test(this.ua))
        },
        android: function () { return /android/.test(this.ua) },
        iphone: function () { return /iphone/.test(this.ua) || /ipod/.test(this.ua) },
        ipad: function () { return /ipad/.test(this.ua) },
        weixin: function () { return /micromessenger/.test(this.ua) },
        /*进度html*/
        loaderHtml: '<div class="loading"><img src="dist/images/loading.gif"></div>',
        /*阻止事件冒泡*/
        stopPropagation: function (e) {
            var ev = e || window.event;
            if (ev.stopPropagation) ev.stopPropagation();
            else ev.cancelBubble = true;
        },
        /*阻止浏览器的默认行为*/
        preventDefault: function (e) {
            /*阻止默认浏览器动作*/
            if (e && e.preventDefault) e.preventDefault();
            /*IE中阻止函数器默认动作的方式*/
            else window.event.returnValue = false;
            return false;
        },
        target: function (e) {
            var evt = e || window.event;
            return evt.target || evt.srcElement;
        },
        /*获取页面的高度、宽度*/
        pageSize: function () {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else {
                if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
                    xScroll = document.body.offsetWidth;
                    yScroll = document.body.offsetHeight;
                }
            }
            var windowWidth, windowHeight;
            if (this.innerHeight) { // all except Explorer    
                if (document.documentElement.clientWidth) {
                    windowWidth = document.documentElement.clientWidth;
                } else {
                    windowWidth = this.innerWidth;
                }
                windowHeight = this.innerHeight;
            } else {
                if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    if (document.body) { // other Explorers    
                        windowWidth = document.body.clientWidth;
                        windowHeight = document.body.clientHeight;
                    }
                }
            }
            // for small pages with total height less then height of the viewport    
            if (yScroll < windowHeight) {
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport    
            if (xScroll < windowWidth) {
                pageWidth = xScroll;
            } else {
                pageWidth = windowWidth;
            }
            arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
            return arrayPageSize;
        },
        /*滚动条位置*/
        pageScroll: function () {
            var x, y;
            if (window.pageYOffset) {    // all except IE    
                y = window.pageYOffset;
                x = window.pageXOffset;
            }
            else if (document.documentElement && document.documentElement.scrollTop) {    // IE 6 Strict    
                y = document.documentElement.scrollTop;
                x = document.documentElement.scrollLeft;
            }
            else if (document.body) {    // all other IE    
                y = document.body.scrollTop;
                x = document.body.scrollLeft;
            }
            return { X: x, Y: y };
        },
        /*设置html的fontSize值*/
        setHtmlFont: function () {
            var $html = $('html');
            var docEl = document.documentElement,
                dpr = Math.min(window.devicePixelRatio, 2),
                baseWidth = 720,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function () {
                    var clientWidth = docEl.clientWidth,
                        clientHeight = docEl.clientHeight;
                    if (!clientWidth) { return; }
                    if (clientWidth > baseWidth) {
                        clientWidth = baseWidth;
                    }
                    if (!deviceInfo.isPC()) {
                        if (clientWidth > clientHeight) {
                            clientWidth = clientHeight;
                        }
                    }
                    //if (deviceInfo.isPC()) {
                    // dpr = 2;
                    //}
                    $html.css('font-size', 10 * dpr * (clientWidth / baseWidth) + 'px').attr('data-dpr', dpr);
                }
            recalc();
            if (!document.addEventListener) { return; }
            window.addEventListener(resizeEvt, recalc, false);
        },
        /*设置html对应class值*/
        setHtmlClass: function () {
            var $html = $('html');
            if (!this.pc()) {
                $html.addClass('mobile-html');
                if (this.android()) {
                    $html.addClass('android-html');
                }
                else if (this.iphone()) {
                    $html.addClass('iphone-html');
                }
                else if (this.ipad()) {
                    $html.addClass('ipad-html');
                }
                if (!this.weixin()) {
                    $html.addClass('app-html');
                }
            }
            else {
                if (this.weixin()) {
                    $html.addClass('wx-html');
                }
            }
        },
        /*回退*/
        goBack: function () {
            if (window.parent != window) {
                window.parent.stanLayer.close();
                return;
            }
            var referrer = document.referrer.toLowerCase(),
                flag = false;
            if (referrer == '') {
                flag = true;
            }
            else {
                if (referrer.indexOf('stan.com') > 0) {
                    flag = false;
                }
                else {
                    flag = true;
                }
            }
            if (flag == true) {
                history.back();
                location.replace('index.html');
            }
            else {
                history.back();
            }
        },
        winPopstate: function (callback) {
            if ('pushState' in history) {
                window.onpopstate = function (e) {
                    if ($('.layer').length > 0) {
                        stanLayer.close();
                        return false;
                    }
                    if (typeof callback === 'function') {
                        callback(e);
                    }
                };
            }
        },
        /*ajax*/
        ajax: function (options) {
            options = options || {};
            var defaults = {
                url: '',
                async: true,
                cache: false,
                type: 'post',
                data: {},
                dataType: 'json',
                timeout: 30000,
                tips: '正在努力加载....',
                beforeSend: null,
                success: null,
                error: null,
                complete: null
            },
                opts = $.extend(defaults, options),
                tips = opts.tips;
            if (tips != '') {
                stanLayer.loading(tips, { time: 3 });
            }
            $.ajax({
                url: opts.url,
                type: opts.type,
                async: opts.async,
                cache: opts.cache,
                data: opts.data,
                dataType: opts.dataType,
                timeout: opts.timeout,
                jsonp: opts.jsonp,
                jsonpCallback: opts.jsonpCallback,
                success: function (json) {
                    if (typeof opts.success === 'function') {
                        opts.success(json);
                    }
                },
                complete: function (xhr, textStatus) {
                    if (typeof opts.complete === 'function') {
                        opts.complete(xhr, textStatus);
                    }
                },
                error: function (xhr, textStatus) {
                    var status = xhr.status,
                        tips = '';
                    if (status == 404 || status == 500) {
                        tips = '服务器开小差了，点击屏幕重新加载';
                    }
                    else if (status == 0) {
                        tips = '网络开小差了，点击屏幕重新加载';
                    }
                    else if (status == 400) {
                        tips = '请求无效参数，点击屏幕重新加载';
                    }

                    alert(tips);
                    if (typeof opts.error === 'function') {
                        opts.error(xhr, textStatus);
                    }
                },
                beforeSend: function (xhr) {
                    if (typeof opts.beforeSend === 'function') {
                        opts.beforeSend(xhr);
                    }
                }
            });
        },
        httpRequest: function (options) {
            options = options || {};
            var defaults = {
                url: '',
                async: true,
                type: 'post',
                headerType: 'Content-type',
                headerValue: '',
                dataType: 'json',
                data: '',
                tips: '正在努力加载....',
                beforeSend: null,
                success: null,
                error: null,
                complete: null
            },
                opts = $.extend(defaults, options),
                tips = opts.tips,
                xmlhttp;
            if (tips != '') {
                stanLayer.loading(tips, { time: 3 });
            }
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open(opts.type, opts.url, opts.async);
            xmlhttp.setRequestHeader(opts.headerType, opts.headerValue);
            xmlhttp.send(opts.data);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (typeof opts.success === 'function') {
                        var data = xmlhttp.responseText;
                        if (opts.dataType === 'json') {
                            data = $.parseJSON(data);
                        }
                        opts.success(data);
                    }
                }
                else if (xmlhttp.status == 404) {
                    alert('服务器开小差了');
                }
                else if (xmlhttp.status == 0) {
                    alert('网络开小差了');
                }
            }
        }

    });
    $.fn.extend({
        /*新增动画值*/
        addAnimation: function (animation, callback) {
            this.each(function () {
                var $this = $(this);
                animation = animation || $this.attr('data-animation');
                if ($this.hasClass(animation + 'out')) {
                    $this.removeClass(animation + 'out');
                }
                if ($this.hasClass('out')) {
                    $this.removeClass('out');
                }
                $(this).addClass('in').addClass(animation + 'in').attr('data-animation', animation);
                if (typeof callback === 'function') {
                    callback($this);
                }
            });
        },
        /*移除动画值*/
        removeAnimation: function (animation, callback) {
            this.each(function () {
                var $this = $(this);
                animation = animation || $this.attr('data-animation');
                if ($this.hasClass(animation + 'in')) {
                    $this.removeClass(animation + 'in');
                }
                if ($this.hasClass('in')) {
                    $this.removeClass('in');
                }
                $(this).addClass('out').addClass(animation + 'out').attr('data-animation', animation);
                if (typeof callback === 'function') {
                    callback($this);
                }
            });
        },
        /*隐藏和显示切换*/
        stanToggle: function (options) {
            options = options || {};
            var defaults = {
                title: 'panel-title',
                content: 'panel-content',
                open: 'open',
                oneOpen: true,
                callback: null
            }
            var opts = $.extend(defaults, options),
                open = opts.open,
                oneOpen = opts.oneOpen;
            this.each(function (i) {
                $(this).children('.' + opts.title).on('click', function (e) {
                    var $this = $(this),
                        $parent = $this.parent(),
                        isOpen = false;
                    if ($parent.hasClass(open)) {
                        $parent.removeClass(open);
                        isOpen = false;
                    }
                    else {
                        if (oneOpen) {
                            $parent.addClass(open).siblings().removeClass(open);
                        }
                        else {
                            $parent.addClass(open);
                        }
                        isOpen = true;
                    }
                    if (typeof opts.callback === 'function') {
                        opts.callback(isOpen);
                    }
                });
            });
        },
        /*滚动加载*/
        stanScrollLoad: function (options) {
            options = options || {};
            var defaults = {
                scroll: $(window),
                offset: 0,
                page: 1,
                success: null
            }
            var opts = $.extend(defaults, options),
                $self = $(this),
                $scroll = opts.scroll,
                lock = false;
            function lockState(next) {
                if (next > 0) {
                    opts.page = next;
                    lock = false;
                }
                else {
                    lock = true;
                }
            };
            if (typeof opts.success === 'function') {
                lock = true;
                opts.success(opts.page, lockState);
            }
            $scroll.off('scroll').on('scroll', function () {
                var $this = $(this),
                    top = $this.scrollTop(),
                    height = $self.height() - $this.height() - opts.offset;
                if (top >= height) {
                    if (!lock) {
                        if (typeof opts.success === 'function') {
                            lock = true;
                            opts.success(opts.page, lockState);
                        }
                    }
                    else {
                        return;
                    }
                }
            });
        },
        /*iput输入变化*/
        stanInput: function (options) {
            options = options || {};
            var defaults = {
                time: 4,
                clear: false,
                success: null,
                emptyCallback: null,
                equalCallback: null,
                clearCallback: null
            },
                opts = $.extend(defaults, options),
                time = opts.time,
                $self = $(this);
            $self.each(function () {
                var inputTimer,
                    oldVal = '';
                $(this).off('focus change keyup paste input propertychange').on('focus change keyup paste input propertychange', function () {
                    var $this = $(this),
                        val = $.trim($this.val());
                    if (opts.clear) {
                        var $parent = $this.parent();
                        if ($parent.find('.clear').length == 0) {
                            $parent.append('<div class="i-right clear"><a class="icon i-cross"></a></div>');
                        }
                        var $clear = $parent.find('.clear');
                        if (val == '') {
                            $clear.hide();
                        }
                        else {
                            $clear.show();
                            $clear.off('click').on('click', function (e) {
                                stanUI.stopPropagation(e);
                                $this.val('');
                                $clear.hide();
                                if (typeof opts.clearCallback === 'function') {
                                    opts.clearCallback($this);
                                }
                            })
                        }
                    }
                    if (val == '') {
                        if (inputTimer) {
                            clearTimeout(inputTimer);
                            inputTimer = null;
                        }
                        if (typeof opts.emptyCallback === 'function') {
                            opts.emptyCallback($this);
                        }
                    }
                    else {
                        if (val === oldVal) {
                            if (inputTimer) {
                                clearTimeout(inputTimer);
                                inputTimer = null;
                            }
                            if (typeof opts.equalCallback === 'function') {
                                opts.equalCallback($this);
                            }
                            return false;
                        }
                        if (time > 0) {
                            if (inputTimer) {
                                clearTimeout(inputTimer);
                                inputTimer = null;
                            }
                            inputTimer = setTimeout(function () {
                                oldVal = val;
                                if (typeof opts.success === 'function') {
                                    opts.success($this);
                                }
                            }, time * 100);
                        }
                        else {
                            if (typeof opts.success === 'function') {
                                opts.success($this);
                            }
                        }
                    }
                });
            });
        },
        /*智能提示*/
        stanAutocomplete: function (options) {
            options = options || {};
            var defaults = {
                data: [],
                dataVal: '',
                dataId: '',
                parent: '',
                open: 'dropdown-on',
                success: null,
                clickCallback: null,
                emptyCallback: null
            },
                opts = $.extend(defaults, options),
                data = opts.data,
                dataVal = opts.dataVal,
                dataId = opts.dataId,
                parent = opts.parent,
                open = opts.open;
            if (data.length == 0) return;
            parent = parent == '' ? 'div' : parent;
            $(this).each(function () {
                var $this = $(this),
                    $parent = $this.closest(parent),
                    height = $parent.height() + 1,
                    html = '';
                $.each(data, function (name, val) {
                    var id = '',
                        value = val,
                        str = '';
                    if (dataId != '') {
                        id = val[dataId];
                        str = ' data-id="' + id + '"';
                    }
                    if (dataVal != '') {
                        value = val[dataVal];
                    }
                    html += '<a class="item"' + str + '>' + value + '</a>';
                });
                html += '</div>';
                if ($parent.children('.dropdown-menu').length > 0) {
                    $parent.children('.dropdow-menun').empty().html(html);
                }
                else {
                    $parent.append('<div class="dropdown-menu">' + html + '</div>');
                }
                $parent.addClass(open);
                $parent.children('.dropdown-menu').css({ 'top': height + 'px' }).off('click').on('click', function (e) {
                    var $target = $(stanUI.target(e));
                    if ($target.is('.item')) {
                        var id = $target.attr('data-id'),
                            val = $.trim($target.text()),
                            flag = false;
                        if (dataId != '' && dataVal != '') {
                            flag = true;
                        }
                        else {
                            flag = false;
                        }
                        if ($this.is('input')) {
                            if (flag) {
                                $this.val(val).attr('data-id', id);
                            }
                            else {
                                $this.val(val);
                            }
                        }
                        else {
                            if (flag) {
                                $this.text(val).attr('data-id', id);
                            }
                            else {
                                $this.text(val);
                            }
                        }
                        $parent.removeClass(open);
                        if (typeof opts.clickCallback == 'function') {
                            if (flag) {
                                opts.clickCallback(id, val);
                            }
                            else {
                                opts.clickCallback(val);
                            }
                        }
                    }
                });
                $(document).click(function (e) {
                    var $target = $(stanUI.target(e));
                    if ($target.closest('.' + open).length == 0) {
                        $parent.removeClass(open);
                    }
                });
            });
        }
    });

    stanUI.setHtmlClass();
    stanUI.winPopstate();
})(jQuery);

/*** 滚动导航 ***
$('.alp-box').stanScrollNav({
    $section:$('.moible-panel .panel-title'),
    item: 'item',
    active: 'active',
    filter: '',
    offset: 0,
    speed: 750,
    easing: 'swing'
});
*/
; (function ($, window, document, undefined) {
    var StanScrollNav = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.$win = $(window);
    };
    StanScrollNav.prototype = {
        defaults: {
            $section: $('.section'),
            item: 'item',
            active: 'active',
            filter: '',
            offset: 0,/*offset调整值*/
            easing: 'swing',
            speed: 750
        },
        init: function () {
            this.opts = $.extend(this.defaults, this.options);
            this.$section = this.opts.$section;
            this.$item = this.$elem.find('.' + this.opts.item);
            if (this.opts.filter !== '') {
                this.$item = this.$item.filter(this.opts.filter);
            }
            this.active = this.opts.active;
            this.resizeOffset = true;
            this.sections();
            var self = this;
            self.$win.on('scroll', function () { self.scrollChange(self) })
                .on('resize', function () {
                    self.resizeOffset = true;
                    self.sections();
                    self.scrollChange(self);
                });
            self.$item.on('click', function (e) {
                stanUI.preventDefault(e);
                var $this = $(this);
                if (typeof self.opts.start === 'function')
                    self.opts.start(self.$section, self.$elem);
                $this.addClass(self.active).siblings().removeClass(self.active);
                $('html,body').animate({ scrollTop: self.$section.eq($this.index()).offset().top - self.opts.offset },
                    self.opts.speed,
                    self.opts.easing,
                    function () {
                        if (typeof self.opts.end === 'function')
                            self.opts.end(self.$section, self.$elem);
                    });
            });
        },
        sections: function () {
            var self = this;
            if (self.resizeOffset) {
                self.sectionArray = [];
                self.$section.each(function () {
                    self.sectionArray.push($(this).offset().top);
                });
                self.resizeOffset = false;
            }
        },
        scrollChange: function (self) {
            var scrollTop = self.$win.scrollTop(),
                top = self.opts.top,
                index = 0,
                sectionLen = self.sectionArray.length;
            if (sectionLen == 0) return;
            if (self.opts.scrollChange) {
                self.opts.scrollChange(self.$section, self.$elem);
            }
            if (top > 0) {
                if (scrollTop >= top) {
                    self.$elem.show();
                } else {
                    self.$elem.hide();
                }
            }
            if (self.opts.last) {
                if (scrollTop > self.sectionArray[sectionLen - 1]) {
                    if (typeof self.opts.lastCallback === 'function')
                        self.opts.lastCallback(self.$section, self.$elem);
                }
            }
            $.each(self.sectionArray, function (i, t) {
                if (scrollTop >= t - self.opts.offset) {
                    index = i;
                    return;
                }
            });
            self.$section.eq(index).addClass(self.active).siblings().removeClass(self.active);
            self.$item.eq(index).addClass(self.active).siblings().removeClass(self.active);
        }
    };
    StanScrollNav.options = StanScrollNav.defaults;
    $.fn.stanScrollNav = function (options) {
        return this.each(function () {
            new StanScrollNav(this, options).init();
        });
    }
})(jQuery, window, document);

/*** dropdown ***
$('.dropdown').stanDropdown({
    open:'dropdown-on',
    position:true,
    success:null
});
*/
; (function ($, window, document, undefined) {
    var StanDropdown = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };
    StanDropdown.prototype = {
        defaults: {
            open: 'dropdown-on',
            position: true,
            success: null
        },
        init: function () {
            this.opts = $.extend(this.defaults, this.options);
            this.open = this.opts.open;
            this.position = this.opts.position;
            this.$toggle = this.$elem.children('.dropdown-toggle');
            this.$menu = this.$elem.children('.dropdown-menu');
            this.dataToggle = this.$toggle.attr('data-toggle');
            var self = this;
            self.$toggle.on('click', function (e) {
                stanUI.stopPropagation(e);
                self.toggle();
            });
            self.$menu.children('.item').on('click', function (e) {
                stanUI.stopPropagation(e);
                self.onClick($(this));
            });
            self.$elem.on('keydown', function (e) {
                self.keyDown(e, self);
            });
            $(document).on('click', function (e) {
                var $target = $(stanUI.target(e));
                if ($target.closest('.' + self.open).length == 0) {
                    self.clear();
                }
            });
        },
        toggle: function () {
            var $this = this.$toggle;
            if ($this.is('.disabled, :disabled')) return;
            if (this.$menu.length > 0) {
                if (!this.$elem.hasClass(this.open)) {
                    this.$elem.attr('tabindex', 0).siblings().removeClass(this.open);
                    this.$elem.focus();
                    this.$elem.addClass(this.open).siblings().removeAttr('tabindex');
                    if (this.position) {
                        var eHeight = this.$elem.outerHeight(),
                            diff = 5;
                        this.$menu.removeAttr('style');
                        if ($(window).height() - (this.$elem.offset().top - $(window).scrollTop()) <= this.$menu.outerHeight() + eHeight + diff)
                            this.$menu.css('bottom', (eHeight + diff) + 'px');
                        else
                            this.$menu.css('top', (eHeight + diff) + 'px');
                        if ($(window).width() - this.$elem.offset().left > this.$menu.outerWidth())
                            this.$menu.css('left', 0);
                        else
                            this.$menu.css('right', 0);
                    }
                }
                else {
                    this.$elem.removeClass(this.open);
                    this.$elem.removeAttr('tabindex');
                }
            }
            return false;
        },
        onClick: function ($this) {
            if ($this.is('.disabled, :disabled')) return;
            this.setValue($this, true);
        },
        keyDown: function (e, self) {
            if (!/(38|40|27)/.test(e.keyCode)) return;
            stanUI.preventDefault(e);
            stanUI.stopPropagation(e);
            if (!self.$elem.hasClass(this.open)) return;
            var $item = self.$menu.children('.item'),
                len = $item.length,
                index = self.$menu.children('.active').index();
            index = $item.index($item.filter('.active'));
            /*esc*/
            if (e.keyCode == 27) {
                self.$elem.removeAttr('tabindex').removeClass(self.open);
                return;
            }
            /*up*/
            if (e.keyCode == 38 && index > 0) index--;
            /*down*/
            if (e.keyCode == 40 && index < len - 1) index++;
            self.setValue($item.eq(index), false);
        },
        setValue: function ($item, hide) {
            $item.addClass('active').siblings().removeClass('active');
            if (hide) {
                this.$elem.removeClass(this.open).removeAttr('tabindex');
            }
            if (this.dataToggle === 'select') {
                this.$toggle.children('span').text($item.children().text());
                if (typeof this.opts.success === 'function') this.opts.success($(this));
            }
        },
        clear: function () {
            var self = this;
            self.$elem.each(function () {
                var $this = $(this);
                if ($this.hasClass(self.open) && $this.children('.dropdown-menu').length > 0) {
                    $this.removeAttr('tabindex').removeClass(self.open);
                }
            });
        }
    };
    StanDropdown.options = StanDropdown.defaults;
    $.fn.stanDropdown = function (options) {
        return this.each(function () {
            new StanDropdown(this, options).init();
        });
    }
})(jQuery, window, document);

/*** tabs ***
$('.tabs').stanTabs({
    setWidth: true,**是否设置tabs的宽度
    actived: false, **是否active触发点击事件
    speed: 750, **动画速度
    easing: 'swing', **动画效果
    success:null **点击成功事件
});
*/
; (function ($, window, document, undefined) {
    var StanTabs = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };
    StanTabs.prototype = {
        defaults: {
            setWidth: true,
            actived: true,
            speed: 750,
            easing: 'swing',
            success: null
        },
        init: function () {
            this.opts = $.extend(this.defaults, this.options);
            this.$item = this.$elem.children('.item');
            this.len = this.$item.length;
            this.$line = this.$elem.children('.line');
            var self = this;
            if (self.len == 0) return;
            if (self.$line.length > 0) {
                self.setTabsWidth(self);
                var $active = self.$elem.children('.active');
                if ($active.length == 0) {
                    $active = self.$elem.children('.item').eq(0);
                    $active.addClass('active');
                }
                self.$line.animate(
                    { left: $active.position().left, width: $active.innerWidth() },
                    self.opts.speed,
                    self.opts.easing);
            }
            self.$item.on('click', function (e) {
                var $this = $(this);
                if ($this.hasClass('active')) {
                    if (self.opts.actived) return;
                }
                $this.addClass('active').siblings().removeClass('active');
                if (self.$line.length > 0) {
                    self.$line.stop(true, true).animate(
                        { left: $this.position().left, width: $this.innerWidth() },
                        self.opts.speed,
                        self.opts.easing);
                }
                if (typeof self.opts.success === 'function')
                    self.opts.success($this.index(), self.$elem);

            });
        },
        setTabsWidth: function (self) {
            if (self.opts.setWidth) {
                var w = 0;
                self.$item.each(function () {
                    w += $(this).innerWidth();
                });
                self.$elem.css('width', w + 'px');
            }
        }
    };
    StanTabs.options = StanTabs.defaults;
    $.fn.stanTabs = function (options) {
        return this.each(function () {
            new StanTabs(this, options).init();
        });
    }
})(jQuery, window, document);


/*** switch ***
$('.switch-box').stanSwitch({
    active: 'switch-on',
    actived: false,
    text: [],
    speed: 750, **动画速度
    easing: 'swing', **动画效果
    success:null **点击成功事件
});
*/
; (function ($, window, document, undefined) {
    var StanSwitch = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };
    StanSwitch.prototype = {
        defaults: {
            active: 'switch-on',
            actived: false,
            text: [],
            speed: 750,
            easing: 'swing',
            success: null
        },
        init: function () {
            this.opts = $.extend(this.defaults, this.options);
            this.active = this.opts.active;
            this.actived = this.opts.actived;
            this.$switch = this.$elem.children('.switch');
            this.$handle = this.$switch.children('.switch-handle');
            var self = this,
                isActive = false,
                left = Math.floor(self.$elem.width() - self.$handle.innerWidth());
            self.$elem.on('click', function (e) {
                var $this = $(this);
                if ($this.hasClass(self.active)) {
                    $this.removeClass(self.active);
                    self.handlePosition(self, 0);
                    isActive = false;
                }
                else {
                    $this.addClass(self.opts.active);
                    self.handlePosition(self, left);
                    isActive = true;
                }

                if (typeof self.opts.success === 'function')
                    self.opts.success(isActive);

            });
        },
        handlePosition: function (self, left) {
            if (self.$handle.length > 0) {
                self.$handle.stop(true, true).animate(
                    { 'left': left },
                    self.opts.speed,
                    self.opts.easing);
            }
        }
    };
    StanSwitch.options = StanSwitch.defaults;
    $.fn.stanSwitch = function (options) {
        return this.each(function () {
            new StanSwitch(this, options).init();
        });
    }
})(jQuery, window, document);


/*** num keyBoard ***
$('.board-box').numKeyBoard({
    showDot: false,
    clickCallback:null **点击事件
});
*/
; (function ($, window, document, undefined) {
    var NumKeyBoard = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };
    NumKeyBoard.prototype = {
        defaults: {
            showDot: false,
            clickCallback: null
        },
        init: function () {
            this.opts = $.extend(this.defaults, this.options);
            var showDot = this.opts.showDot,
                clickCallback = this.opts.clickCallback;
            var html = "<div class='boardview'>";
            for (var i = 1; i < 10; i++) {
                if (i % 3 == 1) {
                    html += "<div class='gradview'>";
                }
                html += "<a class='item'><span>" + i + "</span></a>";
                if (i % 3 == 0) {
                    html += "</div>";
                }
            }
            html += "<div class='gradview'>";
            if (showDot) {
                html += "<a class='item'><span>.</span></a>";
            }
            else {
                html += "<a class='item empty'></a>";
            }
            html += "<a class='item'><span>0</span></a>";
            html += "<a class='item backspace'><b class='m-icon m-backspace'></b></a>";
            html += "</div></div>";
            this.$elem.empty().html(html);
            this.$elem.children('.boardview').find('.item').off('click').on('click', function () {
                var $this = $(this);
                if ($this.hasClass('empty')) {
                    return;
                }
                if (typeof clickCallback === 'function') {
                    clickCallback($this);
                }
            });
        }
    };
    NumKeyBoard.options = NumKeyBoard.defaults;
    $.fn.numKeyBoard = function (options) {
        return this.each(function () {
            new NumKeyBoard(this, options).init();
        });
    }
})(jQuery, window, document);


/*** layer ***
stanLayer({
    type: 0, 弹窗类型 
    hash: false, hash值 
    mask: true, 是否显示遮罩层 
    clickClose: false, 点击遮罩层是否关闭弹窗 
    skin: '', 遮罩层风格 
    width: 0, 弹窗宽度 
    height: 0, 弹窗高度 
    animation: '', 弹窗动画值 
    time: 0, 几秒之后关闭弹窗 
    title: '', 弹窗标题 
    titleTips: '', 弹窗提示标题 
    back: '', 返回按钮值 
    ok: '', 确定按钮值 
    content: '', 弹窗内容 
    url: '', iframe的url地址 
    btns: [], 弹窗底部按钮值 
    success: null, 弹窗成功执行事件 
    timeCallback: null, 定时器执行事件 
    backCallback: null, 返回按钮执行事件 
    okCallback: null, 确定按钮执行事件 
    yesCallback: null, 弹窗底部按确定钮执行事件 
    cancelCallback: null 弹窗底部按取消钮执行事件 
});
*/
; (function ($, window, document, undefined) {
    var StanLayer = function () {
        this.layerIndex = 0;
        this.layerZindex = 100;
        this.layerType = ['page', 'open', 'iframe', 'loading', 'msg', 'alert', 'confirm'];
    },
        defaults = {
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
    function setDefaults() {
        defaults = {
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
    };
    StanLayer.prototype = {
        init: function (options) {
            this.layerIndex++;
            this.layerZindex += this.layerIndex;
            this.opts = $.extend(defaults, options);
            setDefaults();
            var zindex = this.layerZindex + 1,
                opts = this.opts,
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
            styleStr = height > 0 ? styleStr + 'height:' + height + 'px;' : styleStr;
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
                layerHtml += '<div class="layer-mask layer-' + typeStr + '-mask" style="z-index:' + this.layerZindex + ';opacity:.5"></div>';
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
                    btnHtml += '<a class="yes full">' + btns[0] + '</a>';
                }
                else {
                    btnHtml += '<a class="cancel lf">' + btns[0] + '</a><a class="yes lr">' + btns[1] + '</a><div class="line"></div>';
                }
                btnHtml += '</div>';
            }
            layerHtml += '<div class="layer layer' + this.layerIndex + tipsStr + ' layer-' + typeStr + posStr + iframeStr + '" data-index="';
            layerHtml += this.layerIndex + '" style="z-index:' + zindex + ';' + styleStr + '">';
            layerHtml += '<div class="layer-box">' + titleHtml;
            layerHtml += '<div class="layer-content">' + opts.content + '</div>';
            layerHtml += btnHtml + '</div></div>';
            $('body').append(layerHtml);
            if (!$('html').hasClass('layer-on'))
                $('html').addClass('layer-on');
            if (opts.hash) {
                if ('pushState' in history) {
                    history.pushState('layer', title, location.href);
                }
                else {
                    location.hash = typeStr;
                }
            }
            var $currentLayer = $('.layer' + this.layerIndex);
            if (animation != '')
                $currentLayer.addAnimation(animation);
            if (type == 0) {
                $('.page').removeAnimation('fadeP', function ($this) {
                    $this.hide(650);
                });
            }
            this.events($currentLayer);
            if (typeof opts.success === 'function')
                opts.success($currentLayer);
            if (type > 2)
                this.refresh($currentLayer);
            if (width > 0 || height > 0)
                this.refresh($currentLayer);
        },
        events: function ($layer) {
            var self = this,
                opts=self.opts
                $layerbtn = $layer.find('.layer-btn');
            if (opts.clickClose) {
                var $mask = $layer.prev('.layer-mask');
                if ($mask.length > 0) {
                    $mask.off('click').on('click', function (e) {
                        self.close(self.layerIndex);
                    });
                }
                else {
                    $layer.off('click').on('click', function (e) {
                        self.close(self.layerIndex);
                    });
                }
            }
            if (opts.back != '') {
                $layer.find('.t-left').off('click').on('click', function () {
                    opts.backCallback ? opts.backCallback($layer) : self.close(self.layerIndex);;
                });
            }
            if (opts.ok != '') {
                $layer.find('.t-right').off('click').on('click', function () {
                    opts.okCallback ? opts.okCallback($layer) : self.close(self.layerIndex);;
                });
            }
            if ($layerbtn.length > 0) {
                $layerbtn.children('.yes').off('click').on('click', function () {
                    opts.yesCallback ? opts.yesCallback($layer) : self.close(self.layerIndex);;
                });
                if (opts.btns.length == 2) {
                    $layerbtn.children('.cancel').off('click').on('click', function () {
                        opts.cancelCallback ? opts.cancelCallback($layer) : self.close(self.layerIndex);;
                    });
                }
            }
            if (opts.time > 0) {
                if (typeof timeCallback == 'function') {
                    opts.timeCallback($layer);
                }
                else {
                    $layer.delay(opts.time * 1000).show(opts.time * 1000, function () {
                        self.close(self.layerIndex);;
                    });
                }
            }
        },
        refresh: function ($layer) {
            var top = -Math.floor($layer.height() / 2) + 'px',
                left = -Math.floor($layer.width() / 2) + 'px';
            $layer.css({ 'top': '50%', 'left': '50%', 'margin-top': top, 'margin-left': left });
        },
        close: function (id) {
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
                            history.replaceState(null, null, location.href);
                        }
                    }
                    if ($html.hasClass('layer-on')) {
                        $html.removeClass('layer-on');
                    }
                }
            }
        },
        closeAll: function () {
            var $html = $('html'),
                $layer = $html.find('.layer'),
                self = this,
                len = $layer.length;
            if (len > 0) {
                if (len > 1) {
                    for (var i = 0; i < len - 1; i++) {
                        $layer.eq(i).remove();
                    }
                }
                $layer.eq(len - 1).delay(2000).show(1000, function () {
                    self.close($layer.eq(len - 1).attr('data-index'));
                });
            }
        },
        page: function (options) {
            options = $.extend({ type: 0 }, options == undefined ? {} : options);
            this.init(options);
        },
        open: function (position, options) {
            options = $.extend({ type: 1, position: position }, options == undefined ? {} : options);
            this.init(options);
        },
        loading: function (content, options) {
            var $loading = $('.layer-loading');
            if(content==undefined||content==null){
                content = '<p>正在努力加载</p>';
            }
            else if(content==''){    
                content = '';
            }
            else{    
                content = '<p>' + content + '</p>';
            }
            content = stanUI.loaderHtml + content;
            if ($loading.length > 0) {
                $loading.find('.layer-content').empty().html(content);
            }
            else {
                options = $.extend({ type: 3, time: 2, content: content }, options == undefined ? {} : options);
                this.init(options);
            }
        },
        closeLoading: function () {
            var $loading = $('.layer-loading');
            if ($loading.length > 0) {
                close($loading.attr('data-value'));
            }
        },
        msg: function (content, time, options) {
            var $msg = $('.layer-msg');
            if ($msg.length > 0) {
                $msg.find('.layer-content').empty().html(content);
            }
            else {
                options = $.extend({ type: 4, content: content, time: time }, options == undefined ? {} : options);
                this.init(options);
            }
        },
        closeMsg: function () {
            var $msg = $('.layer-msg');
            if ($msg.length > 0) {
                close($msg.attr('data-value'));
            }
        },
        alert: function (content, btn, yesCallback, options) {
            btn = btn || '知道了';
            options = $.extend({ 
                type: 5, content: content, btns: [btn], yesCallback: yesCallback }, 
                options == undefined ? {} : options);
            this.init(options);
        },
        confirm: function (content, btns, cancelCallback, yesCallback, options) {
            options = $.extend({ 
                type: 6, content: content, btns: btns, yesCallback: yesCallback, cancelCallback: cancelCallback }, 
                options == undefined ? {} : options);
            this.init(options);
        },
        payPwd: function (options) {
            var defaults = {
                position: 'bottom',
                title: '请输入支付密码',
                titleTips: '',
                back: '取消',
                showPwd: true,
                success: null,
                cancelCallback: null,
                submitCallback: null
            },
                pts = $.extend(defaults, options),
                pwdhtml = '<div class="layer-view"><div class="pay-box"></div>';
            if (pts.showPwd) {
                var strHtml = '<div class="pwd-box"><div class="pwd-view">';
                for (var i = 1; i < 7; i++) {
                    var classname = '';
                    if (i == 1) {
                        classname = ' first';
                    }
                    else if (i == 6) {
                        classname = ' last';
                    }
                    strHtml += '<div class="pwd"' + classname + '"><span><span></div>';
                }
                strHtml += '</div></div>';
                strHtml += '<div class="board-box"></div>';
                pwdhtml += strHtml;
            }
            pwdhtml += '</div>';
            this.open({
                hash: true,
                position:pts.position,
                skin: 'pwd',
                title: pts.title,
                titleTips: pts.titleTips,
                back: pts.back,
                success: function ($con) {
                    $con.empty().html(pwdhtml);
                    if (typeof pts.success==='function') {
                        pts.success($con);
                    }
                    var $pwd = $con.find('.pwd-box').find('.pwd'),
                        $box = $con.find('.board-box'),
                        pwdIndex = 0;
                    $box.numKeyBoard({
                        showDot: false,
                        clickCallback:function($this) {
                            var pwd = '';
                            if ($this.hasClass('backspace')) {
                                if (pwdIndex <= 0) {
                                    return;
                                }
                                pwdIndex--;
                                $pwd.eq(pwdIndex).removeClass('used').children('span').text('');
                                pwd = getPwd();
                                return;
                            }
                            if (pwdIndex > 5) {
                                return;
                            }
                            $pwd.eq(pwdIndex).addClass('used').children('span').text($.trim($this.children('span').text()));
                            pwdIndex++;
                            pwd = getPwd();
                            if (pwdIndex == 6) {
                                if (typeof pts.submitCallback === 'function') {
                                    pts.submitCallback(pwd);
                                }
                            }
                        }
                    });
                    function getPwd() {
                        var pwd = '';
                        for (var i = 0; i < 6; i++) {
                            pwd += $.trim($pwd.eq(i).children('span').text());
                        }
                        return pwd;
                    };
                },
                backCallback: function ($con) {
                    if (typeof pts.cancelCallback === 'function') {
                        pts.cancelCallback($con);
                    }
                    else {
                        this.close();
                    }
                }
            });
        }
    };
    this.stanLayer = new StanLayer();
})(jQuery, window, document);




