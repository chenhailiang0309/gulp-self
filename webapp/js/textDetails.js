$(function() {
    page = new Page();
    page.init();
})

var cur_mulu = 0;
// 点击目录 显示对应内容
$('#details-r').on('click', '#content_ul li', function() {
    // 显示加载动画
    $('.shadow').fadeIn();
    $(this).addClass('cur_content').siblings().removeClass('cur_content');

    cur_mulu = $(this).index();

    var now = page.mulu_arr[cur_mulu];
    // console.log(now)
    page._neirong_data(now.book_id, now.title, now.title_level);
})

// 上一节
$('#prev_page').on('click', function() {
    // 显示加载动画
    $('.shadow').fadeIn();

    cur_mulu--;

    var height_difference = 0; // ul和div的高度差
    var content_ul_height = $('#content_ul').height(); // div的高度
    var all_li_height = 0; // 所有li的高度
    for (var i = 0; i < $('#content_ul li').length; i++) {
        all_li_height += $('#content_ul li').eq(i).height()
    }

    height_difference = all_li_height - content_ul_height;

    if (cur_mulu < 0) {
        cur_mulu = $('#content_ul li').length - 1

        $('#content_ul').scrollTop(height_difference);
    } else {
        var last_li_height = 0;
        for (var i = cur_mulu + 1; i < $('#content_ul li').length; i++) {
            last_li_height += $('#content_ul li').eq(i).height()
        }

        // ul的滚动
        $('#content_ul').scrollTop(height_difference - last_li_height);
    }

    // li的高亮
    $('#content_ul li').removeClass('cur_content');
    $('#content_ul li').eq(cur_mulu).addClass('cur_content');

    // 对应内容的显示
    var now = page.mulu_arr[cur_mulu];
    // console.log(now)
    page._neirong_data(now.book_id, now.title, now.title_level);
})

// 下一页
$('#next_page').on('click', function() {
    // 显示加载动画
    $('.shadow').fadeIn();
    
    cur_mulu++;
    if (cur_mulu == $('#content_ul li').length) {
        cur_mulu = 0;
    }

    // li的高亮
    $('#content_ul li').removeClass('cur_content');
    $('#content_ul li').eq(cur_mulu).addClass('cur_content');

    // ul的滚动
    var h = 0;
    for (var i = 0; i < cur_mulu; i++) {
        h += $('#content_ul li').eq(i).height();
    }
    $('#content_ul').scrollTop(h);

    // 对应内容的显示
    var now = page.mulu_arr[cur_mulu];
    // console.log(now)
    page._neirong_data(now.book_id, now.title, now.title_level);
})


function Page() {
    this.condition = {};
    this.mulu_arr = [];
    this.andcondition = {};
    this.orcondition = {};
    this.arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
    this.uniqID = Request2('uniqid');
    this.type = this.arr[Request2("type")];
}

Page.prototype = {
    constructor: Page,
    init: function() {
        // this.getCondition(); // 获取session中的条件
        this.getBookID();
    },
    // 拼条件
    /* getCondition: function() {
         var conditionBox = [];
         var stackCache = sessionStorage.getItem('stackCache');
         var session = JSON.parse(stackCache);
         if (!isEmpty(session)) {
             for (var i = 0, leni = session.length; i < leni; i++) {
                 console.log(session)
                 conditionBox.push(session[i].condition)
             }
             for (var k = 0, len = conditionBox.length; k < len; k++) {
                 for (var key in conditionBox[k]) {
                     if (typeof conditionBox[k][key] == 'string') {
                         this.condition[key] = conditionBox[k][key];
                     } else {
                         if (this.condition[key] != undefined) {
                             this.condition[key].push(conditionBox[k][key][0]);
                         } else {
                             this.condition[key] = [];
                             this.condition[key].push(conditionBox[k][key][0]);
                         }
                     }

                 }

             }
         }
     },*/
    // 获取book_id
    getBookID: function() {
        var that = this;

        var conditionBox = [];
        var stackCache = sessionStorage.getItem('stackCache');
        var session = JSON.parse(stackCache);

        if (!isEmpty(session)) {
            for (var i = 0, leni = session.length; i < leni; i++) {
                conditionBox.push(session[i])
            }
            for (var j = 0, len = conditionBox.length; j < len; j++) {
                if (conditionBox[j].cType == 'and') {
                    // console.log(conditionBox[j])
                    var tmp = conditionBox[j].condition;
                    for (var k in tmp) {
                        // console.log(tmp[k]);
                        if (this.andcondition[k] != undefined) {
                            this.andcondition[k].push(tmp[k][0]);
                        } else {
                            this.andcondition[k] = [];
                            if (typeof tmp[k] == 'string') {
                                this.andcondition[k].push(tmp[k]);
                            } else {
                                this.andcondition[k].push(tmp[k][0]);
                            }
                        }
                    }

                } else if (conditionBox[j].cType == 'or') {
                    // console.log(conditionBox[j])
                    var tmp = conditionBox[j].condition;
                    for (var k in tmp) {
                        // console.log(tmp[k]);
                        if (this.orcondition[k] != undefined) {
                            this.orcondition[k] = this.orcondition[k].concat(tmp[k]);
                        } else {
                            // console.log(this.orcondition[k])
                            this.orcondition[k] = [];

                            if (typeof tmp[k] == 'string') {
                                this.orcondition[k].push(tmp[k]);
                            } else {
                                // console.log(tmp[k])
                                this.orcondition[k] = this.orcondition[k].concat(tmp[k]);
                            }

                        }
                    }
                }

            }
        }

        if (this.orcondition.caseid) {
            delete this.orcondition.caseid
        }

        if (Request2("flag") == '0') {
            var param = {
                "uniqid": this.uniqID,
                "type": this.type,
                "issecondquery": false
            };
        } else {
            if (JSON.stringify(this.andcondition) == '{}' && JSON.stringify(this.orcondition) == '{}') { // 两个都为{}
                var param = {
                    "uniqid": this.uniqID,
                    "type": this.type,
                    "issecondquery": false
                };
            } else if (JSON.stringify(this.andcondition) != '{}' && JSON.stringify(this.orcondition) != '{}') { // 两个都不为{}
                var param = {
                    "condition": {
                        "andcondition": this.andcondition,
                        "orcondition": this.orcondition
                    },
                    "uniqid": this.uniqID,
                    "type": this.type,
                    "issecondquery": true
                };
            } else if (JSON.stringify(this.andcondition) != '{}' && JSON.stringify(this.orcondition) == '{}') { // or为空
                var param = {
                    "condition": {
                        "andcondition": this.andcondition
                    },
                    "uniqid": this.uniqID,
                    "type": this.type,
                    "issecondquery": false
                };
            } else if (JSON.stringify(this.andcondition) == '{}' && JSON.stringify(this.orcondition) != '{}') { // and为空
                var param = {
                    "condition": {
                        "orcondition": this.orcondition
                    },
                    "uniqid": this.uniqID,
                    "type": this.type,
                    "issecondquery": true
                };
            }
        }

        var userid = '';
        if (window.localStorage.getItem('UserInfo')) {
            userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
        }

        param.userid = userid;
        param.docinfo = Request2('title'); // 加了两次

        jQuery.support.cors = true;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/documentDetail',
            data: JSON.stringify(param),
            dataType: 'json',
            contentType: "application/json",
            beforeSend: function() {
                $('.shadow').fadeIn();
            },
            success: function(res) {
                // 隐藏加载动画
                // $('.shadow').fadeOut();
                // console.log(res);

                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    that.none(0);
                    return;
                }
                var data = JSON.parse(res.result);
                console.log(data);
                collection.title = data.book_title.replace(/<b>|<\/b>/g, ""); // 调用国双收藏接口时 使用
                // 在详情页js执行前执行  获取不到title
                collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）

                // 网页title
                document.title = data.book_title.replace(/<b>|<\/b>/g, "");

                // 面包屑
                $('.current').text(data.book_title.replace(/<b>|<\/b>/g, ""));

                // 图书标题
                $('#title').html(data.book_title);

                var book_id = data.book_id;
                that._mulu_data(book_id)
            },
            error: function(error) {
                that.none(1);
            }
        });
    },
    // 获取目录数据
    _mulu_data: function(book_id) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/querytushuinfo?type=tushumulu&book_id=' + book_id,
            success: function(res) {
                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    that.none(0);
                    return;
                }
                var mulu_arr = JSON.parse(res.result);
                // 保存目录信息
                that.mulu_arr = mulu_arr;
                // console.log(mulu_arr)
                if (mulu_arr.length > 0) { // 有数据
                    $('.button-wrapper').show(); // 显示上一页下一页

                    that.render_mulu(mulu_arr);
                    var mulu_arr_0 = mulu_arr[0];
                    // console.log(mulu_arr_0)
                    that._neirong_data(mulu_arr_0.book_id, mulu_arr_0.title, mulu_arr_0.title_level)

                    // 标蓝第一个
                    $('#details-r li').eq(0).addClass('cur_content');

                    // 目录个数为1个时  不显示上一页下一页
                    if (mulu_arr.length == 1) {
                        $('.button-wrapper').hide()
                    }

                } else { // 无数据
                    that.none(0);
                }
                // that._neirong_data(title)
            },
            error: function(error) {
                that.none(1);
            }
        });
    },
    render_mulu: function(data) {
        var html = '<h3>目 录</h3><div class="content_wrapper"><ul id="content_ul" class="content_ul">';
        for (var i = 0, l = data.length; i < l; i++) {
            var tmp = data[i];
            html += '<li>' + tmp.title + '</li>';
        }
        html += '</ul></div>';
        $('.details-r').html(html);
    },
    // 整理内容数据
    _neirong_data: function(book_id, title, title_level) {
        click_loginVerify(); // 校验token 是否失效
        if (!click_tokenYX) return;

        var that = this;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/querytushuinfo?type=tushucontent&book_id=' + book_id + '&title=' + encodeURI(encodeURI(title)) + '&title_level=' + title_level,
            success: function(res) {
                // console.log(JSON.parse(res.result))
                if (JSON.parse(res.result).length > 0) {
                    var neirong = JSON.parse(res.result)[0];
                    that.render_neirong(neirong);
                }

                // 隐藏加载动画
                $('.shadow').fadeOut();
            },
            error: function(error) {
                that.none(1);
            }
        });
    },
    render_neirong: function(data) {
        //                                                                      |!--page=_001> |!--page=_001--  | !--page=+001--
        $('#text_details').html(data.replace(/&lt;|#lt;|&gt;|#gt;|!--page=[\d]*--|!--page=_[\d]*>|!--page=_[\d]*--|!--page=\+[\d]*--/g, ''))
    },
    none: function(num) {
        /**
         * 0    数据为空 
         * 1    ajax error
         */
        if (num == 0) {
            $('.none .img_text').text('详情页内容为空');
        } else if (num == 1) {
            $('.none .img_text').text('404，页面跑丢了');
        }
        // 隐藏加载动画
        $('.shadow').fadeOut();
        // 显示无结果
        $('.funtags').hide();
        $('.main_bottom').hide();
        $('.none').show();
    }
}