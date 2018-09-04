// var ip = 'http://192.168.10.111:8085';
// var ip = 'http://192.168.10.204';
// var ip = 'http://103.254.65.115:18090';
var ip = 'http://' + document.location.host;

// var gs_URL = 'http://118.26.171.151:8002'; // 国双开发环境
var gs_URL = 'http://103.254.65.115:18094'; // 出版社线上环境

$(function() {
    if (window.location.href.indexOf('result.html') > -1) { // 结果页
        if (Request2('token') == '') { //  url中没有token 直接跳到登录页
            // 清除session 
            if (window.localStorage.getItem('Token')) {
                window.localStorage.removeItem('Token');
            }

            if (window.localStorage.getItem('UserInfo')) {
                window.localStorage.removeItem('UserInfo');
            }
            tip_shadow('请您先登录！')
        } else { // url中有token 检验是否已过期  过期跳到登录页
            var userObj = new User();
            userObj.init(); // 获取token 和 用户信息
        }
    } else { // 详情页
        // 有token 校验token 获取用户信息
        if (window.localStorage.getItem('Token')) {
            var userObj = new User();
            userObj.token = window.localStorage.getItem('Token')
            userObj.loginVerify();
        } else { // 没有token 跳到登录页
            tip_shadow('请您先登录！')
        }
    }
})

// 登录提示框
function tip_shadow(text) {
    // 本地环境不检验是否登录 true 不检验
    if (window.location.href.indexOf('192.168.10.111') > -1 || window.location.href.indexOf('localhost') > -1) {
        return true;
    } else {
        $('.tip_text').text(text);
        $('.tip_shadow').show();
        return false;
    }
}

var click_tokenYX = true; // token是否失效 true有效 false失效
// bb71591b-e3a7-4614-8e85-472328fd6568
// 点击事件 验证是否登录
function click_loginVerify() {
    if (!window.localStorage.getItem('Token')) {
        if (tip_shadow('请您先登录！')) {
            click_tokenYX = true;
        } else {
            click_tokenYX = false;
        }

        return;
    }

    var token = window.localStorage.getItem('Token');
    if (Request2('token') != '') {
        token = Request2('token')
        window.localStorage.setItem('Token', Request2('token'))
    }
    var jsonData = {
        "Token": token
    };

    $.ajax({
        type: 'post',
        url: gs_URL + '/api/User/LoginVerify',
        async: false, // 同步
        data: JSON.stringify(jsonData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            // console.log(res);
            if (res.Result) { // token有效
                click_tokenYX = true

            } else { // token失效
                click_tokenYX = false

                // 清除session 
                if (window.localStorage.getItem('Token')) {
                    window.localStorage.removeItem('Token');
                }
                // 清除用户信息
                if (window.localStorage.getItem('UserInfo')) {
                    window.localStorage.removeItem('UserInfo');
                }

                tip_shadow('登录已过期，请重新登录！')
            }
        },
        error: function(error) {}
    })
}

// 点击智能问答   http://103.254.65.115:18092
$('#fazhi_link').on('click', function() {
    clickLoginVerify('fazhi_link')
})
// 点击一站式搜索
$('#witnet_link').on('click', function() {
    // 置空搜索条件
    window.sessionStorage.setItem('stackCache', JSON.stringify([]));
    window.sessionStorage.setItem('Index', 0);

    clickLoginVerify('witnet_link')
})
// 点击类案推送
$('#caa_link').on('click', function() {
    clickLoginVerify('caa_link')
})
// 顶部点击三个链接 校验是否登录
function clickLoginVerify(id) {
    if (!window.localStorage.getItem('Token')) {
        // 提示框
        tip_shadow('请您先登录！')
        return false;
    }

    var token = window.localStorage.getItem('Token'),
        jsonData = {
            "Token": token
        };
    $.ajax({
        type: 'post',
        url: gs_URL + '/api/User/LoginVerify',
        data: JSON.stringify(jsonData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            // console.log(res);
            if (res.Result) {
                switch (id) {
                    case 'fazhi_link': // 智能问答
                        window.open('http://103.254.65.115:18092')
                        break;
                    case 'witnet_link': // 一站式
                        window.location.href = './result.html?flag=0&token=' + token;
                        break;
                    case 'caa_link': // 类案推送
                        window.open('http://124.205.50.166:8082/caa_v3.1/jsp/index.html?flag=0&token=' + token)
                        break;
                    default:
                        // statements_def
                        break;
                }
            } else {
                // 清除session 
                if (window.localStorage.getItem('Token')) {
                    window.localStorage.removeItem('Token');
                }

                if (window.localStorage.getItem('UserInfo')) {
                    window.localStorage.removeItem('UserInfo');
                }

                tip_shadow('登录已过期，请重新登录！')
            }
        },
        error: function(error) {}
    })
}


// 面包屑 第二个a标签 点击跳转到结果页，并清除session
$('.bread a').eq(1).on('click', function() {
    // 置空搜索条件
    window.sessionStorage.setItem('stackCache', JSON.stringify([]));
    window.sessionStorage.setItem('Index', Number(Request2('type')));

    if (window.localStorage.getItem('Token')) { // 有token拼到url后面
        window.location.href = './result.html?' + window.localStorage.getItem('Token');
    } else {
        window.location.href = './result.html';
    }
})

// 用户名下拉框
$('.user-info-module').on('click', '.login-text-wrapper', function(e) {
    $('.gs-dropdown').toggleClass('dropdown-open');
    $('.gs-dropdown-menu').toggle();
    Utils.stopPropagation(e);
})
$('.gs-dropdown-link').on('click', function(e) {
    Utils.stopPropagation(e);
})
$(document).on('click', function() {
    $('.gs-dropdown').removeClass('dropdown-open');
    $('.gs-dropdown-menu').hide();
})

// 退出登录
$('#logout').on('click', function() {
    if (window.localStorage.getItem('Token')) {
        var token = window.localStorage.getItem('Token'),
            jsonData = {
                "Token": token
            },
            _this = this;

        $.ajax({
            type: 'post',
            url: gs_URL + '/api/User/Logout',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
                // console.log(res);
                // 清除session 
                window.localStorage.removeItem('Token');
                window.localStorage.removeItem('UserInfo');
                // 修改html
                var html = '<a class="login-text" href="http://103.254.65.115:18092/#/login">登录</a>'
                $('.user-info-module').html(html);

                // 返回首页 (不管是注销成功还是失败 都跳到首页)
                window.location.href = "http://103.254.65.115:18092";
            },
            error: function(error) {
                alert('注销失败');
            }
        })
    } else {
        // 置空搜索条件
        window.sessionStorage.setItem('stackCache', JSON.stringify([]));
        window.sessionStorage.setItem('Index', Number(Request2('type')));
        window.location.reload(); // 刷新页面
    }
})

// 关闭操作提示模态框
$('.tip_shadow').on('click', '.close_tip', function() {
    $('.tip_shadow').fadeOut(300);
})

var fxwd_uniqid = ''; // 法信问答的uniqid
//下载
$('.download_btn').on('click', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId,
        arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"],
        type = arr[Request2("type")];
    if (window.location.href.indexOf('zhidaoDetails.html') > -1) {
        window.open(ip + '/witnet/search/downloadDocument?uniqid=' + fxwd_uniqid + '&type=' + type + '&userid=' + userid + '&docinfo=' + encodeURI(encodeURI(collection.title)));
    } else {
        window.open(ip + '/witnet/search/downloadDocument?uniqid=' + Request2("uniqid") + '&type=' + type + '&userid=' + userid + '&docinfo=' + encodeURI(encodeURI(collection.title)));
    }
})

// 图书详情页的收藏
$('.main').on('click', '.book_collect_btn', function() {
    if (window.location.href.indexOf('booksDetails.html') > -1) {
        $('.main_top .collect_btn').trigger('click');
    }
})

// 收藏
$('.main_top').on('click', '.collect_btn', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    if (collection.ifCollected) { //当前已收藏  取消收藏
        collection.gs_cancleCollected();
    } else {
        collection.gs_goCollection(); //当前未收藏  去收藏
    }
})

// 结果页 获取token 和 用户信息
function User() {
    this.token = '';
}

User.prototype = {
    init: function() {
        this.getToken();
    },
    getToken: function() {
        if (Request2('flag') != '' && Request2('flag') == 0) {
            // 置空搜索条件
            store.setSession('stackCache', []);
            window.sessionStorage.setItem('Index', 0);
            //避免先登录后 调到结果也 返回智能问答退出登录，session没清除
            window.localStorage.setItem('Token', '');
        }
        // this.token = "7e248018-80f4-4ad2-b4af-fc95256a14cd";
        this.token = Request2('token');
        this.loginVerify(); //验证登录后  去获取用户信息  并设置用户名
    },
    // 验证是否登录
    loginVerify: function() {
        if (this.token == '') {
            return false;
        }
        var _this = this,
            jsonData = {
                "Token": this.token
            };
        $.ajax({
            type: 'post',
            url: gs_URL + '/api/User/LoginVerify',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
                // console.log(res);
                if (res.Result) {
                    // 获取用户信息
                    _this.getUserInfo();
                    // 存token
                    window.localStorage.setItem('Token', _this.token);
                } else {
                    // 清除session 
                    if (window.localStorage.getItem('Token')) {
                        window.localStorage.removeItem('Token');
                    }

                    if (window.localStorage.getItem('UserInfo')) {
                        window.localStorage.removeItem('UserInfo');
                    }

                    tip_shadow('登录已过期，请重新登录！')
                }
            },
            error: function(error) {}
        })
    },
    // 获取用户信息
    getUserInfo: function() {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: gs_URL + '/api/UserCenter/UserInfo',
            headers: {
                'X-Request-Token': _this.token
            },
            success: function(res) {
                // console.log(res);
                if (res.Success) {
                    var userInfo = res.Data;
                    window.localStorage.setItem('UserInfo', JSON.stringify(userInfo));
                    // console.log(userInfo);
                    var realName = userInfo.RealName;
                    // console.log(realName);
                    _this.renderUserNameHtml(realName);

                    if (userInfo.RoleName == '管理员') {
                        $('.gs-dropdown-items li').eq(3).after('<li class="gs-dropdown-item"><a href="http://103.254.65.115:18092/#/backend/user">后台设置</a></li>')
                    }

                } else {
                    _this.renderLoginHtml();
                }
            },
            error: function(error) {

            }
        })
    },
    renderLoginHtml: function() {
        var html = '<a class="login-text" href="http://103.254.65.115:18092/#/login">登录</a>'
        $('.user-info-module').html(html);
    },
    renderUserNameHtml: function(username) {
        // console.log(username)
        var html =
            '<div class="gs-dropdown user-list-module dropdown-close"">' +
            '<span class="login-text-wrapper">' +
            '<span class="login-text">' + username + '，您好</span>' +
            '<span class="gs-dropdown-link">' +
            '<i class="gs-icon-down"></i>' +
            '</span>' +
            '</span>' +
            '</div>';
        $('.user-info-module').html(html);
    }
}


var collection = {
    title: '', // 文书标题
    ifLogin: false, //是否已登陆
    ifCollected: false, // 是否已收藏
    userid: '', //用户id

    // 获取userid
    getUserID: function() {
        if (window.localStorage.getItem('UserInfo')) {
            this.userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId; //token
            this.gs_hasCollected();
        }
    },
    // 国双 校验是否已收藏（详情页获取到title后才去校验）
    gs_hasCollected: function() {
        var params = {
                "CollectType": Number(Request2('type')) + 1,
                "InputContent": this.title
            },
            _this = this;

        $.ajax({
            type: 'post',
            url: gs_URL + '/api/External/CollectVerify',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'X-Request-Token': window.localStorage.getItem('Token')
            },
            success: function(res) {
                // console.log(res);

                if (res.Data) { // 已收藏
                    _this.ifCollected = true;

                    $('.main_top .collect_btn').addClass('treasured');
                    if (window.location.href.indexOf('booksDetails.html') > -1) {
                        $('.main .book_collect_btn').addClass('book_collect_btn_on')
                    }
                } else { // 未收藏
                    _this.ifCollected = false;

                    $('.main_top .collect_btn').removeClass('treasured');
                    if (window.location.href.indexOf('booksDetails.html') > -1) {
                        $('.main .book_collect_btn').removeClass('book_collect_btn_on')
                    }
                }
            },
            error: function(error) {
                // alert('收藏失败')
            }
        })
    },
    // 国双 进行收藏
    gs_goCollection: function() {
        if (!this.ifCollected) {
            var params = {
                    "CollectType": Number(Request2('type')) + 1,
                    "InputContent": this.title
                },
                _this = this;

            $.ajax({
                type: 'post',
                url: gs_URL + '/api/External/Collect',
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'X-Request-Token': window.localStorage.getItem('Token')
                },
                success: function(res) {
                    // console.log(res);
                    if (res.Success) {
                        $('.main_top .collect_btn').addClass('treasured');
                        if (window.location.href.indexOf('booksDetails.html') > -1) {
                            $('.main .book_collect_btn').addClass('book_collect_btn_on')
                        }

                        _this.ifCollected = true;
                    } else {

                        _this.ifCollected = false;
                    }
                },
                error: function(error) {
                    alert('收藏失败')
                }
            })
        }
    },
    // 国双 取消收藏
    gs_cancleCollected: function() {
        // console.log(this.ifCollected)

        // 已收藏才去取消收藏
        if (this.ifCollected) {
            var params = {
                    "CollectType": Number(Request2('type')) + 1,
                    "InputContent": this.title
                },
                _this = this;

            $.ajax({
                type: 'POST',
                url: gs_URL + '/api/External/CancelCollect',
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'X-Request-Token': window.localStorage.getItem('Token')
                },
                success: function(res) {
                    // console.log(res);

                    if (res.Data) {
                        _this.ifCollected = false;

                        $('.main_top .collect_btn').removeClass('treasured');
                        if (window.location.href.indexOf('booksDetails.html') > -1) {
                            $('.main .book_collect_btn').removeClass('book_collect_btn_on')
                        }
                    } else {
                        alert('取消收藏失败');
                    }
                },
                error: function(error) {
                    alert('取消收藏失败');
                }
            })
        }

    }
}


// 关闭目录
$('.close_catalog').on('click', function() {
    $('.catalog_box').addClass('hide');
    $(".catalog_btn").removeClass('on');
})

//-----------------------------返回顶部--------------------------
$(document).ready(function() {
    //检测屏幕高度
    var height = $(window).height();
    //scroll() 方法为滚动事件
    $(window).scroll(function() {
        if ($(window).scrollTop() > height) {
            $("#backtop_btn").fadeIn(300);
        } else {
            $("#backtop_btn").fadeOut(300);
        }
    });
    $("#backtop_btn").click(function() {
        $('body,html').animate({ scrollTop: 0 }, 300);
        return false;
    });
});


// ---------------------------详情页滚动固定---------------------
//获取要定位元素距离浏览器顶部的距离
var tabHeight = $(".main_top").offset().top;
// 页面滚动到一定距离，固定tab栏
$(window).scroll(function() {
    //获取滚动条的滑动距离
    var scroH = $(this).scrollTop();
    // console.log(tabHeight)
    //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
    if (scroH >= tabHeight) {
        $('.out-header').css("margin-bottom", 71);
        $(".main_top").addClass('crumb_fixed');
    } else if (scroH < tabHeight) {
        $('.out-header').css("margin-bottom", 0);
        $(".main_top").removeClass('crumb_fixed');
    }
})

/**
 * session操作
 */
var store = {
    // 获取session
    getSession: function(key) {
        if (window.sessionStorage.getItem(key)) {
            return window.sessionStorage.getItem(key);
        }
    },
    //设置session
    setSession: function(key, val) {
        if (val) {
            window.sessionStorage.setItem(key, JSON.stringify(val));
        }
    },
    // 移除session
    removeSession: function(key) {
        window.removeItem(key);
    },
    // 清空session
    clearSession: function() {
        window.sessionStorage.clear();
    }
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
//判断是否为空
function isEmpty(str) {
    if (str == null || typeof str == undefined || $.trim(str) == "" || $.trim(JSON.stringify(str)) == "{}" || $.trim(str) == "[]" || str.length == 0) {
        return true;
    }
    return false;
}

function replaceBTag(str) {
    return str.replace(/<b>|<\/b>/g, "");
}
//截取地址栏
function Request2(strName) {
    var strHref = decodeURI(window.document.location.href);
    var intPos = strHref.indexOf("?");
    var endPos = strHref.indexOf("#");
    var strRight = endPos == -1 ? strHref.substr(intPos + 1) : strHref.substring(intPos + 1, endPos);
    var arrTmp = strRight.split("&");
    for (var i = 0; i < arrTmp.length; i++) {
        var arrTemp = arrTmp[i].split("=");
        if (arrTemp[0] == strName) {
            return arrTemp[1];
        }
    }
    return "";
}