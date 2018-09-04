$(function() {
    details = new Details();
    details.init();
})

// 查看更多 专家观点
$('#expert_load_more').on('click', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    details.load_more_exports(this);
});

// 查看更多 法律法规
$('#laws_load_more').on('click', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    details.load_more_laws(this);
});

// 换一换 参考案例
$('.reference_case_wrapper ').on('click', '.change_more', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    details.change_more_ckal();
});

// 换一换 相关问题
$('.related_ques_wrapper').on('click', '.change_more', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    details.change_more_xgwt();
});

// 法院  跳到裁判文书tab页
$('#introduce').on('click', '#court', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_condition('court', val);
});

// 案号 跳到裁判文书详情页
$('#introduce').on('click', '#causeId', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var caseid = $(this).text();
    var jsonData = {
            condition: {
                andcondition: {
                    caseid: caseid
                }
            },
            from: 0,
            size: 10,
            sort: "_score",
            type: "cpws"
        },
        _this = this;
    jQuery.support.cors = true;
    $.ajax({
        type: 'POST',
        url: ip + '/witnet/search/document',
        data: JSON.stringify(jsonData),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            // console.log(res)
            if (res.result == '[]' || res.result == '' || res.result == undefined) {
                alert('暂无相关信息');
                return;
            }

            var data = JSON.parse(res.result);
            // console.log(data)
            var uniqid = data.uniqid;
            var title = data.title;
            window.open('./refereeDocDetails.html?uniqid=' + uniqid + '&type=3&flag=0&title=' + encodeURI(encodeURI(title)));
        },
        error: function(error) {

        }
    });
});

//专家观点来源      进入 图书/期刊详情页】
$('#expert_opinion').on('click', '.law-origin', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).parent().parent().index();
    var _data = details.export_all_arr[index];
    // console.log(_data);

    var _zhubian = _data.zhubian;
    // 前端正则                          "（主编）"  |     " 主编"         |        " 编著"      |    " 编"      |     " 著"
    var book_author = _zhubian ? _zhubian.replace(/\（\u4e3b\u7f16\）|[\u0020]+\u4e3b\u7f16|[\u0020]+\u7f16\u8457|[\u0020]+\u7f16|[\u0020]+\u8457/g, '') : '';

    var _comefrom_name = _data.comefrom_name;
    var book_title = getZjgd(_comefrom_name);
    // console.log(book_title);

    var param = {
            "condition": {
                "andcondition": {
                    "book_title": book_title
                }
            },
            "type": "ts",
            "from": 0,
            "size": 6
        },
        _this = this;

    // 主编 存在再传值
    if (book_author != '') {
        param.condition.andcondition.book_author = book_author;
    }

    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: ip + '/witnet/search/document',
        data: JSON.stringify(param),
        datatype: 'json',
        contentType: "application/json",
        success: function(res) {
            // console.log(res)
            if (res.result == '' || res.result == '[]') {
                alert('暂无相关信息');
                return;
            }
            var data = JSON.parse(res.result);
            // console.log(data);

            // 数量为零 不跳转
            if (res.count == '0') {
                alert('暂无相关信息');
                return;
            }

            var data_book_title = data[0].book_title.replace(/<b>|<\/b>/g, '');
            // console.log(data_book_title)

            if (book_title == data_book_title) {
                var uniqid = data[0].uniqid;
                window.open('./booksDetails.html?uniqid=' + uniqid + '&type=5&flag=0$title=' + encodeURI(encodeURI(data_book_title)));
            } else {
                alert('暂无相关信息');
            }
        }
    })
})

// 专家观点内容  跳到法律观点详情页
$('#expert_opinion').on('click', '.p-wrapper p', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).parent().index(),
        uniqid = details.export_all_arr[index].uniqid,
        title = $(this).text();
    // console.log(title)
    window.open('./pointDetails.html?uniqid=' + uniqid + '&type=4&flag=0&title=' + encodeURI(encodeURI(title)));
})

// 法律法规  跳到法律法规详情页
$('#laws').on('click', '.p-wrapper', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).index(),
        uniqid = details.laws_all_arr[index].uniqid,
        title = $(this).children('h4').text();
    // console.log(title)
    window.open('./lawsDetails.html?uniqid=' + uniqid + '&type=1&flag=0&title=' + title);
})

// 关键词
$('.keyword_wrapper ').on('click', 'li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_condition('typ_guan_jian_ci', Utils.trim(val));
})

// 参考案例  跳转到案例要旨详情页
$('.reference_case_wrapper ').on('click', 'li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).index(),
        uniqid = details.ckal_all_arr[index].uniqid,
        title = $(this).text();
    window.open('./alyzDetails.html?uniqid=' + uniqid + '&type=2&flag=0&title=' + encodeURI(encodeURI(title)));
})

// 相关问题  跳到法信问答详情页
$('.related_ques_wrapper').on('click', '#related_ques_ul li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).index(),
        title = details.xgwt_all_arr[index].typ_question;
    window.open('./zhidaoDetails.html?title=' + encodeURI(encodeURI(title)) + '&type=0&flag=0');
})

// 存session
function pass_condition(key, val) {
    var session_val = {
        name: val,
        condition: {},
        elementType: key,
        cType: "or"
    };
    session_val.condition[key] = [val];
    store.setSession('stackCache', [session_val]);
    store.setSession("Index", Number(Request2('type')));

    if (window.localStorage.getItem('Token')) {
        window.open('./result.html?token=' + window.localStorage.getItem('Token'));
    } else {
        window.open('./result.html');
    }
}

function Details() {
    this.succ_num = 0;
    this.arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
    // this.condition = {};
    this.andcondition = {};
    this.orcondition = {};
    this.uniqID = Request2('uniqid');
    this.type = this.arr[Request2("type")];
    this.faxin_code = 0;
    // 专家观点
    this.export_three_height = 0;
    this.export_all_height = 0;
    this.export_all_arr = [];
    // 法律法规
    this.laws_three_height = 0;
    this.laws_all_height = 0;
    this.laws_all_arr = [];
    // 参考案例
    this.ckal_index = 0;
    this.ckal_all_arr = [];
    // 相关问题
    this.xgwt_index = 0;
    this.xgwt_all_arr = [];
}

Details.prototype = {
    constructor: Details,
    init: function() {
        this.xzzd_init(); // 小智知道 | 法信问答
    },
    // 小智知道  | 法信问答
    xzzd_init: function() {
        var conditionBox = [];
        var stackCache = sessionStorage.getItem('stackCache');
        var session = JSON.parse(stackCache);
        /*if (!isEmpty(session)) {
            for (var i = 0, leni = session.length; i < leni; i++) {
                conditionBox.push(session[i].condition)
            }
            for (var k = 0, len = conditionBox.length; k < len; k++) {
                for (var key in conditionBox[k]) {
                    if (this.condition[key] != undefined) {
                        this.condition[key].push(conditionBox[k][key][0]);
                    } else {
                        this.condition[key] = [];
                        if (typeof conditionBox[k][key] == 'string') {
                            this.condition[key].push(conditionBox[k][key]);
                        } else {
                            this.condition[key].push(conditionBox[k][key][0]);
                        }
                    }
                }
            }
        }*/

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

        var userid = '';
        if (window.localStorage.getItem('UserInfo')) {
            userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
        }

        if (Request2("flag") == '0') {
            var param = {
                "typ_question": decodeURI(decodeURI(Request2('title'))),
                "type": this.type
            };
        } else {
            // if (JSON.stringify(this.condition) != '{}') {
            //     var param = {
            //         // "condition": {
            //         //     "andcondition": this.condition
            //         // },
            //         "typ_question": decodeURI(decodeURI(Request2('title'))),
            //         "type": this.type
            //     };
            // } else {
            //     var param = {
            //         "typ_question": decodeURI(decodeURI(Request2('title'))),
            //         "type": this.type
            //     };
            // }
            if (JSON.stringify(this.andcondition) == '{}' && JSON.stringify(this.orcondition) == '{}') { // 两个都为{}
                var param = {
                    "typ_question": decodeURI(decodeURI(Request2('title'))),
                    "type": this.type
                };
            } else if (JSON.stringify(this.andcondition) != '{}' && JSON.stringify(this.orcondition) != '{}') { // 两个都不为{}
                var param = {
                    "condition": {
                        "andcondition": this.andcondition,
                        "orcondition": this.orcondition
                    },
                    "typ_question": decodeURI(decodeURI(Request2('title'))),
                    "type": this.type
                };
            } else if (JSON.stringify(this.andcondition) != '{}' && JSON.stringify(this.orcondition) == '{}') { // or为空
                var param = {
                    "condition": {
                        "andcondition": this.andcondition
                    },
                    "typ_question": decodeURI(decodeURI(Request2('title'))),
                    "type": this.type
                };
            } else if (JSON.stringify(this.andcondition) == '{}' && JSON.stringify(this.orcondition) != '{}') { // and为空
                var param = {
                    "condition": {
                        "orcondition": this.orcondition
                    },
                    "typ_question": decodeURI(decodeURI(Request2('title'))),
                    "type": this.type
                };
            }
        }

        param.userid = userid;
        param.docinfo = Request2('title'); // 加了两次

        var that = this;
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
                // console.log(res)
                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    that.none(0);
                    return;
                }
                // console.log(res.result)
                var data = JSON.parse(res.result);
                console.log(data);
                fxwd_uniqid = data.uniqid; // 下载使用uniqid

                collection.title = data.typ_question.replace(/<b>|<\/b>/g, ''); // 调用国双收藏接口时 使用
                // 在详情页js执行前执行  获取不到title
                collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）

                that.faxin_code = data.faxin_code;
                that.xzzd_bind(data);

                // 专家观点
                that.zjgd_init(data);
                // 法律法规
                that.flfg_init(data);
                // 参考案例
                that.ckal_init();
                // 相关问题
                that.xgwt_init();
            },
            error: function(error) {
                that.none(1);
            }
        });
    },
    xzzd_bind: function(data) {
        this.render_introduce(data); // 顶部
        // this.render_keyword(data); // 关键词
    },
    // 顶部
    render_introduce: function(data) {
        document.title = data.typ_question.replace(/<b>|<\/b>/g, '');

        var guan_jian_ci = _toArray(data.typ_guan_jian_ci);
        var html =
            (data.typ_question ? ('<h2>' + data.typ_question + '</h2>' + //data.typ_question.replace(/<b>|<\/b>/g, '')
                '<div class="features-wrapper">') : '');

        if (guan_jian_ci.length <= 0) {
            return;
        }

        for (var i = 0, l = guan_jian_ci.length; i < l; i++) {
            html += '<span>' + guan_jian_ci[i] + '</span>';
        }

        html += '</div>';

        var arr = data.typ_answer.split(/\n/);

        for (var j = 0, l = arr.length; j < l; j++) {
            html += '<p>' + arr[j] + '</p>';
        }

        html +=
            '<div class="span-wrapper clearfix">' +
            (data.category ? '<span id="category" class="category">' + data.category + '</span>' : '') +
            (data.xxx ? '<span id="court" class="court">长沙市中级人民法院</span>' : '') +
            ((data.source_type == 'cpws' && data.source_content != '') ? '<span id="causeId" class="causeId">' + data.source_content + '</span>' : '') +
            '</div>';
        $('#introduce').html(html);

        for (var i = 0, l = $('#introduce p').length; i < l; i++) {
            if (Utils.trim($('#introduce p').eq(i).text()) == '') {
                $('#introduce p').eq(i).remove();
            }
        }

        $('#introduce .span-wrapper span').eq(0).addClass('first_span')
    },
    // 关键词
    render_keyword: function(data) {
        var typ_guan_jian_ci = _toArray(data.typ_guan_jian_ci);
        if (typ_guan_jian_ci.length > 0) {
            var html =
                '<h5>关键词</h5>' +
                '<ul id="keyword_ul" class="keyword_ul clearfix">';
            for (var i = 0, l = typ_guan_jian_ci.length; i < l; i++) {
                html += '<li>' + typ_guan_jian_ci[i] + '</li>';
            }

            html += '</ul>';
            $('.keyword_wrapper').html(html);
        } else {
            $('.keyword_wrapper').hide();
        }
    },
    // 专家观点
    zjgd_init: function(data) {
        /*console.log(data)
        var html =
            '<h3>专家观点</h3>' +
            '<div id="expert_container" class="container" style="overflow:hidden;">';
        if (data.title) {
            html +=
                '<div class="p-wrapper">' +
                '<p>' +
                '<span class="b_4px"></span> ' +
                data.source_content +
                '</p>' +
                '<div class="professor-wrapper clearfix">' +
                (data.xxx ? '<span class="professor">杜万华</span>' : '') +
                (data.xxx ? '<span class="law-origin">' + data.xxx + '</span>' : '') +
                '</div>' +
                '</div>';
        } else {
            html += '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>';
        }

        html += '</div>';

        $('#expert_opinion .more-wrapper').before(html);*/
        var that = this;
        jQuery.support.cors = true;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/queryinfobyfaxincode?type=zjgd&faxincode=' + that.faxin_code,
            success: function(res) {
                that.succ_num++;
                if (succ_num = 4) {
                    // 隐藏加载动画
                    $('.shadow').fadeOut();
                }

                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    var html =
                        '<h3>专家观点</h3>' +
                        '<div id="expert_container" class="container" style="overflow:hidden;">' +
                        '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>' +
                        '</div>';
                    $('#expert_opinion .more-wrapper').before(html);
                    return;
                }

                var data = JSON.parse(res.result);
                that.export_all_arr = data;
                // console.log(data)
                that.render_expert_opinion(data);
            },
            error: function(error) {
                var html =
                    '<h3>专家观点</h3>' +
                    '<div id="expert_container" class="container" style="overflow:hidden;">' +
                    '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>' +
                    '</div>';
                $('#expert_opinion .more-wrapper').before(html);
            }
        });
    },
    render_expert_opinion: function(data) {
        var html =
            '<h3>专家观点</h3>' +
            '<div id="expert_container" class="container" style="overflow:hidden;">';

        if (data.length > 0) {
            $('.more_num_export').html('(' + data.length + ')');
            for (var i = 0; i < data.length; i++) {
                html +=
                    '<div class="p-wrapper">' +
                    '<p>' +
                    '<span class="b_4px"></span> ' +
                    data[i].title +
                    '</p>' +
                    '<div class="professor-wrapper clearfix">' +
                    (data[i].zhubian ? '<span class="professor">杜万华</span>' : '') +
                    (data[i].comefrom_name ? '<span class="law-origin">' + getZjgd(data[i].comefrom_name) + '</span>' : '') +
                    '</div>' +
                    '</div>';
            }
        } else {
            html += '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>';
        }

        html += '</div>';

        $('#expert_opinion .more-wrapper').before(html);

        for (var i = 0, l = $('#expert_opinion .professor-wrapper').length; i < l; i++) {
            var tmp = $('#expert_opinion .professor-wrapper').eq(i);
            tmp.children('span').eq(0).addClass('first_span');
        }

        // 设置高度
        if (data.length > 3) {
            $('#expert_load_more').show();

            for (var i = 0, l = data.length; i < l; i++) {
                this.export_all_height += ($('#expert_container .p-wrapper').eq(i).height() + 10); //所有p的高度
                if (i < 3) {
                    this.export_three_height += ($('#expert_container .p-wrapper').eq(i).height() + 10); // 前三个p的高度
                }
            }
            // 固定容器高度
            $('#expert_container').height(this.export_three_height + 'px'); // 三个p的高度
        } else {
            $('#expert_load_more').hide();
        }
    },
    // 法律法规
    flfg_init: function(data) {
        /*var law_arr = [];
        var html =
            '<h3>法律法规</h3>' +
            '<div id="laws_container" class="container" style="overflow:hidden;">';
        if (data.applicable_law != '') {
            law_arr = data.applicable_law.split(',');

            $('.more_num_laws').html('(' + law_arr.length + ')');
            for (var i = 0, l = law_arr.length; i < l; i++) {
                var tmp = law_arr[i];
                // console.log(tmp)
                html +=
                    '<div class="p-wrapper">' +
                    '<h4><span class="b_4px"></span>' + tmp + '</h4>' +
                    // '<p><span>【家庭关系】</span>夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;</p>' +
                    '</div>';
            }
        } else {
            html += '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>';
        }
        html += '</div>';

        $('#laws .more-wrapper').before(html);

        // 设置高度
        if (law_arr.length > 3) {
            $('#laws_load_more').show();

            for (var i = 0, l = law_arr.length; i < l; i++) {
                this.laws_all_height += ($('#laws_container .p-wrapper').eq(i).height() + 10); //所有p的高度
                if (i < 3) {
                    this.laws_three_height += ($('#laws_container .p-wrapper').eq(i).height() + 10); // 前三个p的高度
                }
            }

            // 固定容器高度
            $('#laws_container').height(this.laws_three_height + 'px'); // 三个p的高度
        } else {
            $('#laws_load_more').hide();
        }*/

        var that = this;
        jQuery.support.cors = true;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/queryinfobyfaxincode?type=fvfg&faxincode=' + that.faxin_code,
            success: function(res) {
                that.succ_num++;
                if (succ_num = 4) {
                    // 隐藏加载动画
                    $('.shadow').fadeOut();
                }

                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    var html =
                        '<h3>法律法规</h3>' +
                        '<div id="laws_container" class="container" style="overflow:hidden;">' +
                        '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>' +
                        '</div>';
                    $('#laws .more-wrapper').before(html);
                    return;
                }

                var data = JSON.parse(res.result);
                that.laws_all_arr = data;
                // console.log(data)
                that.render_laws(data);
            },
            error: function(error) {
                var html =
                    '<h3>法律法规</h3>' +
                    '<div id="laws_container" class="container" style="overflow:hidden;">' +
                    '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>' +
                    '</div>';
                $('#laws .more-wrapper').before(html);
            }
        });
    },
    render_laws: function(data) {
        var html =
            '<h3>法律法规</h3>' +
            '<div id="laws_container" class="container" style="overflow:hidden;">';
        if (data.length > 0) {
            $('.more_num_laws').html('(' + data.length + ')');
            for (var i = 0, l = data.length; i < l; i++) {
                var tmp = data[i];
                // console.log(tmp)
                html +=
                    '<div class="p-wrapper">' +
                    '<h4><span class="b_4px"></span>' + tmp.title + '</h4>' +
                    // '<p><span>【家庭关系】</span>夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;夫妻应当互相忠实，互相尊重;</p>' +
                    '</div>';
            }
        } else {
            html += '<div class="no_msg" style="padding-left: 40px;">暂无信息</div>';
        }
        html += '</div>';

        $('#laws .more-wrapper').before(html);

        // 设置高度
        if (data.length > 3) {
            $('#laws_load_more').show();

            for (var i = 0, l = data.length; i < l; i++) {
                this.laws_all_height += ($('#laws_container .p-wrapper').eq(i).height() + 10); //所有p的高度
                if (i < 3) {
                    this.laws_three_height += ($('#laws_container .p-wrapper').eq(i).height() + 10); // 前三个p的高度
                }
            }

            // 固定容器高度
            $('#laws_container').height(this.laws_three_height + 'px'); // 三个p的高度
        } else {
            $('#laws_load_more').hide();
        }
    },
    // 参考案例
    ckal_init: function() {
        var that = this;
        jQuery.support.cors = true;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/queryinfobyfaxincode?type=ckal&faxincode=' + that.faxin_code,
            success: function(res) {
                that.succ_num++;
                if (succ_num = 2) {
                    // 隐藏加载动画
                    $('.shadow').fadeOut();
                }

                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    var html =
                        '<h5>参考案例<span class="change_more" style="display: none;">换一换</span></h5>' +
                        '<ul id="reference_case_ul" class="reference_case_ul">' +
                        '<div style="padding-left:35px;">暂无信息</div>' +
                        '</ul>';
                    $('.reference_case_wrapper').html(html);
                }

                // console.log(JSON.parse(res.result));
                that.ckal_all_arr = JSON.parse(res.result);
                var html =
                    '<h5>参考案例<span class="change_more" style="display: none;">换一换</span></h5>' +
                    '<ul id="reference_case_ul" class="reference_case_ul">';
                if (that.ckal_all_arr.length > 0) {
                    html += that.render_reference_case(0);
                } else {
                    html += '<div style="padding-left:35px;">暂无信息</div>';
                }

                html += '</ul>';

                $('.reference_case_wrapper').html(html);

                if (that.ckal_all_arr.length > 5) {
                    $('.reference_case_wrapper  .change_more').show();
                }
            },
            error: function(error) {
                var html =
                    '<h5>参考案例<span class="change_more" style="display: none;">换一换</span></h5>' +
                    '<ul id="reference_case_ul" class="reference_case_ul">' +
                    '<div style="padding-left:35px;">暂无信息</div>' +
                    '</ul>';
                $('.reference_case_wrapper').html(html);
            }
        });
    },
    render_reference_case: function(index) {
        var html = '';
        for (var i = index, l = index + 5; i < l; i++) {
            var tmp = this.ckal_all_arr[i];
            if (tmp) {
                html += '<li><span class="bl"></span>' + tmp.title + '</li>';
            }

        }
        return html;
    },
    // 相关问题
    xgwt_init: function() {
        if (!this.faxin_code) {
            var html =
                '<h5>相关问题<span class="change_more" style="display: none;">换一换</span></h5>' +
                '<ul id="related_ques_ul" class="related_ques_ul">' +
                '<div style="padding-left:35px;">暂无信息</div>' +
                '</ul>';
            $('.related_ques_wrapper').html(html);
            return
        }
        var jsonData = {
                condition: {
                    andcondition: {
                        faxin_code: this.faxin_code
                    }
                },
                from: 0,
                size: 10,
                sort: "_score",
                type: "xzzd"
            },
            that = this;

        jQuery.support.cors = true;
        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/document',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: "application/json",
            success: function(res) {
                that.succ_num++;
                if (succ_num = 2) {
                    // 隐藏加载动画
                    $('.shadow').fadeOut();
                }
                if (res.result == "[]" || res.result == "" || res.result == undefined) {
                    var html =
                        '<h5>相关问题<span class="change_more" style="display: none;">换一换</span></h5>' +
                        '<ul id="related_ques_ul" class="related_ques_ul">' +
                        '<div style="padding-left:35px;">暂无信息</div>' +
                        '</ul>';
                    $('.related_ques_wrapper').html(html);
                    return;
                }
                // console.log(JSON.parse(res.result));
                that.xgwt_all_arr = JSON.parse(res.result);
                var html =
                    '<h5>相关问题<span class="change_more" style="display: none;">换一换</span></h5>' +
                    '<ul id="related_ques_ul" class="related_ques_ul">';
                if (that.xgwt_all_arr.length > 0) {
                    html += that.render_related_ques(0);
                } else {
                    html += '<div style="padding-left:35px;">暂无信息</div>';
                }

                html += '</ul>';

                $('.related_ques_wrapper').html(html);

                if (that.xgwt_all_arr.length > 5) {
                    $('.related_ques_wrapper  .change_more').show();
                }
            },
            error: function(error) {
                var html =
                    '<h5>相关问题<span class="change_more" style="display: none;">换一换</span></h5>' +
                    '<ul id="related_ques_ul" class="related_ques_ul">' +
                    '<div style="padding-left:35px;">暂无信息</div>' +
                    '</ul>';
                $('.related_ques_wrapper').html(html);
            }
        });
    },
    render_related_ques: function(index) {
        var html = '';
        for (var i = index, l = index + 5; i < l; i++) {
            if (this.xgwt_all_arr[i]) {
                var tmp = this.xgwt_all_arr[i];
                if (tmp) {
                    html += '<li><span class="bl"></span>' + tmp.typ_question + '</li>';
                }
            }
        }
        return html;
    },
    // 查看更多 专家观点
    load_more_exports: function(obj) {
        if ($(obj).hasClass('open_more')) {
            $(obj).children('.expert_more_text').text('查看更多');
            $(obj).removeClass('open_more');
            $('#expert_container').animate({ height: this.export_three_height + 'px' })
        } else {
            $(obj).children('.expert_more_text').text('点击收起');
            $(obj).addClass('open_more');
            $('#expert_container').animate({ height: this.export_all_height + 'px' })
        }
    },
    // 查看更多 法律法规
    load_more_laws: function(obj) {
        if ($(obj).hasClass('open_more')) {
            $(obj).children('.laws_more_text').text('查看更多');
            $(obj).removeClass('open_more');
            $('#laws_container').animate({ height: this.laws_three_height + 'px' })
        } else {
            $(obj).children('.laws_more_text').text('点击收起');
            $(obj).addClass('open_more');
            $('#laws_container').animate({ height: this.laws_all_height + 'px' })
        }
    },
    // 换一换 参考案例
    change_more_ckal: function() {
        this.ckal_index += 5;

        if (this.ckal_index >= this.ckal_all_arr.length) {
            this.ckal_index = 0;
        }

        var html = this.render_reference_case(this.ckal_index);
        $('#reference_case_ul').html(html);
    },
    // 换一换 相关问题
    change_more_xgwt: function() {
        this.xgwt_index += 5;

        if (this.xgwt_index >= this.xgwt_all_arr.length) {
            this.xgwt_index = 0;
        }

        var html = this.render_related_ques(this.xgwt_index);
        $('#related_ques_ul').html(html);
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


// 回到顶部
$('#backtop_btn').on('click', function() {
    $("html,body").animate({ scrollTop: 0 }, 300);
})

// 显示目录
$('#catalog_btn').on('click', function() {
    $('.catalog_box').toggleClass('hide');
})

// more_box 显示隐藏
$('#more_btn').on('click', function(e) {
    $('#more_box ').toggleClass('hide');
    stopBubble(e);
})

$(document).on('click', function() {
    $('#more_box ').addClass('hide');
})

function _toArray(str) {
    // console.log(str)
    // console.log(typeof(str))
    if (typeof(str) == 'object') { // 是数组
        return str;
    } else { // 是字符串
        var str2 = str.replace(/"|\[|\]/g, "");
        return str2.split(',');
    }
}

// 截取专家来源名称
function getZjgd(str) {
    var index_1 = str.indexOf('|');
    // console.log(index_1)
    var index_2 = str.lastIndexOf('$');
    // console.log(index_2)
    var book_title = '';
    if (index_1 > -1 && index_2 > -1) {
        book_title = str.slice(index_1 + 1, index_2);
    } else {
        book_title = str;
    }
    // console.log(book_title);
    return book_title;
}