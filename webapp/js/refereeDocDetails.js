var in_person_map = [
    '委托诉讼代理人：', '委托代理人：', '申请执行人：', '被执行人：', '法定代表人：',
    '原告：', '被告：',
    '被上诉人（原审原告）：', '被上诉人（原审被告）：', '上诉人（原审原告）：', '上诉人（原审被告）：',
    '案外人（异议人）:', '案外人：', '案外人:', '第三人：', '申诉人（赔偿请求人）：', '申诉人（原赔偿请求人）：', '申诉人：', '被申诉人：', '复议机关：', '被申请人：',
    '被上诉人（原审原告）', '被上诉人（原审被告）', '上诉人（原审原告）', '上诉人（原审被告）',
    '申请人（案外人）', '被申请人（申请执行人）', '被申请人（被执行人）',
    '原告', '被告',
    '赔偿请求人', '委托诉讼代理人', '法定代理人', '案外人', '异议人', '委托代理人', '指定代理人：', '申请执行人', '被执行人', '被申请人', '申请人', '法定代表人', '赔偿义务机关'
];

// 数组从小到大排序
function arr_s2b(Arr) {
    var min;
    for (var i = 0; i < Arr.length; i++) {
        for (var j = i; j < Arr.length; j++) {
            if (Arr[i] > Arr[j]) {
                min = Arr[j];
                Arr[j] = Arr[i];
                Arr[i] = min;
            }
        }
    }
    return Arr;
}

/*
 * 查找一个字符串中的所有子串的位置
 */
function searchSubStr(str, subStr) {
    var positions = [];
    var pos = str.indexOf(subStr);
    while (pos > -1) {
        positions.push(pos);
        pos = str.indexOf(subStr, pos + 1);
    }
    return positions;
}

// 找出当事人中的人名并加a标签标蓝
function height_pname(str) {
    var obj = {
            '（': -1,
            '(': -1,
            '，': -1,
            ',': -1,
            '。': -1
        },
        arr = [],
        start_index = -1,
        end_index = -1;
    for (var k in obj) {
        arr.push.apply(arr, searchSubStr(str, k))
        // if (str.indexOf(k) > -1) {
        //     obj[k] = str.indexOf(k);
        //     arr.push(str.indexOf(k))
        // }
    }
    // console.log(arr)

    var end_index = arr[0];

    for (var i = 0, l = in_person_map.length; i < l; i++) {
        var tmp = in_person_map[i];
        if (str.indexOf(tmp) > -1) {
            start_index = str.indexOf(tmp);
            // 原告江西金泰新能源有限公司   (无标点)
            if (arr.length == 0) {
                var pname = str.slice(start_index + tmp.length, str.length);
                return str.replace(pname, '<a href="javascript:void(0);">' + pname + '</a>');
            }

            if (end_index > -1) {
                var pname = '';
                // 被申请人：（案外人）牛旭霞，女，1980年11月17日出生，住一四二团。
                if ((start_index + tmp.length) == end_index) {
                    end_index = arr[1];

                    if (str.indexOf('）') > -1) {
                        // console.log(str.indexOf('）'))
                        start_index = str.indexOf('）') + 1;
                        pname = str.slice(start_index, end_index);
                    }
                    if (str.indexOf(')') > -1) {
                        start_index = str.indexOf(')') + 1;
                        pname = str.slice(start_index, end_index);
                    }
                    // console.log(pname);
                    return str.replace(pname, '<a href="javascript:void(0);">' + pname + '</a>');
                }

                // 申诉人（赔偿请求人）：
                if (start_index + tmp.length > end_index) {
                    start_index += tmp.length
                    end_index = arr[1];
                    pname = str.slice(start_index, end_index);
                    // console.log(pname);
                } else if (start_index + tmp.length <= end_index) { // 正常的
                    pname = str.slice(start_index + tmp.length, end_index);
                    // console.log(pname);
                    // var reg = new RegExp(pname);
                }

                // 异议人张万伦称：异议人与被执行人向宏云已于2015年3月26日协议离婚并在婚姻登记机关办理离婚登记手续，
                // var action_arr = ['以', '请求', '称'];
                if (pname.indexOf('请求') > -1) {
                    var pname2 = pname.slice(0, pname.indexOf('请求'));
                    return str.replace(pname2, '<a href="javascript:void(0);">' + pname2 + '</a>');
                }

                if (pname.indexOf('以') > -1 && pname.indexOf('为') > -1) {
                    var pname2 = pname.slice(0, pname.indexOf('以'));
                    return str.replace(pname2, '<a href="javascript:void(0);">' + pname2 + '</a>');
                }

                if (pname.indexOf('称') > -1) {
                    var pname2 = pname.slice(0, pname.indexOf('称'));
                    return str.replace(pname2, '<a href="javascript:void(0);">' + pname2 + '</a>');
                }

                // 申请执行人耿德庆、庞金茹、郭辉、耿云喆。
                if (pname.indexOf('、') > -1) {
                    var dun_arr = pname.split('、'),
                        // console.log(dun_arr);
                        html = '';
                    for (var i = 0, l = dun_arr.length; i < l; i++) {
                        html += dun_arr[i].replace(dun_arr[i], '<a href="javascript:void(0);">' + dun_arr[i] + '</a>、');
                    }
                    // console.log(html.slice(0,html.length-1))
                    return str.replace(pname, html.slice(0, html.length - 1));
                }

                // 委托代理人：程刚，该局法制大队副大队长（特别授权代理）。
                var aa = [];
                for (var k in obj) {
                    aa.push.apply(aa, searchSubStr(pname, k))
                }
                // console.log(aa)
                if (aa.length > 0) {
                    pname = pname.slice(0, aa[0]);
                }

                return str.replace(pname, '<a href="javascript:void(0);">' + pname + '</a>');
            }
        }
    }
}

$(function() {
    page = new Paging();
    page.init();
})

// 案由
$('#basic').on('click', '.casecause', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('casecause', val);
});

// 审理法院
$('#basic').on('click', '.court', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('court', val);
});

// 执行长
$('#basic').on('click', '.executive', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 执行员
$('#basic').on('click', '.executor', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 审判长
$('#basic').on('click', '.chiefjudge', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 审判员
$('#basic').on('click', '.judge', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 代理审判员
$('#basic').on('click', '.assistantjudge', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 人民陪审员
$('#basic').on('click', '.peoplesjury', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('judge_member', val);
});

// 当事人
/*$('#parties').on('click', 'a', function() {
    var pname = $(this).text(),
        str = $(this).parent().text(),
        val = pname;
    var province = ['北京市', '天津市', '上海市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区'];
    for (var i = 0, l = province.length; i < l; i++) {
        var tmp = province[i];
        if (str.indexOf(tmp) > -1) {
            val += '，' + tmp;
        }
    }

    pass_session('involved_person', val);
});*/

// 适用法律
$('#applicable-law').on('click', 'li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).text();
    pass_session('applicable_law', val);
});

// 历审案例
$('#history-case').on('click', 'li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var val = $(this).children('.h_caseid').text();
    pass_session('caseid', val);
})
// 类案推送  跳转到裁判文书详情页
$('#case-push').on('click', 'li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    var index = $(this).index(),
        uniqid = page.case_push_arr[index].uniqid,
        title = $(this).text();
    // console.log(title)
    window.open('./refereeDocDetails.html?uniqid=' + uniqid + '&type=3&flag=0&title=' + encodeURI(encodeURI(title)));
});

// 存session
function pass_session(key, val) {
    var session_val = {
        name: val,
        condition: {},
        elementType: key,
        cType: "or"
    };
    session_val.condition[key] = [val];
    // console.log(session_val);
    store.setSession('stackCache', [session_val]);
    store.setSession("Index", Number(Request2('type')));

    if (window.localStorage.getItem('Token')) {
        window.open('./result.html?token=' + window.localStorage.getItem('Token'));
    } else {
        window.open('./result.html');
    }
}

// 加载更多
$('#applicable-law').on('click', '#load-more', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    // console.log(page.applicable_law)
    if (page.applicable_law.length > 6) {
        page.load_more_laws(this, page.applicable_law);
    }
});

// 换一换 类案推送
$('#case-push').on('click', '.change-more', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;

    // page.case_push_index += 5;
    page.case_push_data();
})

//点击目录显示隐藏
$(".catalog_btn").click(function() {
    if ($(".catalog_box").hasClass("hide")) {
        $(".catalog_box").removeClass("hide");
        $(this).addClass("on");

    } else {
        $(".catalog_box").addClass("hide");
        $(this).removeClass("on");
    }
});

//目录滚动
$(window).scroll(function() {
    // 获取游标距顶部距离
    var winTop = $(this).scrollTop() + 30;
    var arr = [];
    var index = 0;
    var len = $(".part").length;
    var begin = 5,
        end = len - 4;
    for (var i = 0, length = len; i < length; i++) {
        arr.push($(".part").eq(i).offset().top);
    }
    for (var j = 0, lengths = len; j < lengths; j++) {
        if (j < len - 1) {
            if (winTop > arr[j] && winTop <= arr[j + 1]) {
                index = j;
                if (!$(".catalog_box  ul li a").eq(index).hasClass("on")) {
                    $(".catalog_box  ul li a").eq(index).addClass("on").parents("li").siblings("li").find("a").removeClass("on");
                    if (j > begin && j < end) {
                        var top = -30 * (j - (begin - 1));
                        $(".catalog_box ul").stop().animate({ "top": top }, "slow");
                    } else if (j <= begin) {
                        $(".catalog_box ul").stop().animate({ "top": "0" }, "slow");
                    } else if (j > end) {
                        var top_e = -30 * (end - 4);
                        $(".catalog_box ul").stop().animate({ "top": top_e }, "slow");
                    }
                }
            }
        } else {
            if (winTop >= arr[j]) {
                index = j;
                if (!$(".catalog_box ul li a").eq(index).hasClass("on")) {
                    $(".catalog_box ul li a").eq(index).addClass("on").parents("li").siblings("li").find("a").removeClass("on");
                }
            }
        }
    }
    if (winTop == 30) {
        $(".catalog_box ul").stop().animate({ "top": "10px" }, "fast");
        // console.log($(".catalog_box ul li").eq(0).text())
        $(".catalog_box ul li").find("a").removeClass("on");
    }
})


function Paging() {
    this.arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
    this.andcondition = {}; // andcondition
    this.orcondition = {}; // orcondition
    this.uniqID = Request2('uniqid');
    this.type = this.arr[Request2("type")];
    this.applicable_law = []; // 适用法律
    this.six_li_height = 0; //前六个li高度
    this.all_li_height = 0; //所有li高度
    this.case_push_index = -5; //类案推送索引
    this.succ_num = 0; //ajax成功个数
    this.case_push_arr = []; //保存案例推送
    this.cp_orcondition = {}; //类案推送查询条件
}

Paging.prototype = {
    constructor: Paging,
    init: function() {
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

        // console.log(decodeURI(decodeURI(param.docinfo)))

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

                var data = JSON.parse(res.result);
                console.log(data)

                // _toArray
                var _casecause = data.casecause.replace(/<b>|<\/b>/g, '');
                // console.log(_casecause)
                that.cp_orcondition.casecause = [_casecause];
                // console.log(data.case_feature)

                var _case_feature = [];
                if (data.case_feature) {
                    if (typeof data.case_feature == 'object') { // 数组
                        for (var i = 0, l = data.case_feature.length; i < l; i++) {
                            _case_feature.push(data.case_feature[i].replace(/<b>|<\/b>/g, ''))
                        }

                    } else if (typeof data.case_feature == 'string') { // 数组字符串 
                        // if (data.case_feature.indexOf('<b>') > -1) {
                        _case_feature = _toArray(data.case_feature.replace(/<b>|<\/b>/g, ''));
                        // } else {
                        // _case_feature = data.case_feature;
                        // }

                    }
                    // console.log(_case_feature)
                    that.cp_orcondition.case_feature = _case_feature;
                }

                // console.log(_case_feature);

                // console.log(that.cp_orcondition)

                that.bind(data);
            },
            error: function(error) {
                that.none(1);
            }
        });
    },
    bind: function(data) {
        var quanwen = data.全文;
        // console.log(quanwen)
        this.render_top(data); //顶部
        this.render_applicable_law(data); //适用法律
        this.render_history_case(data); //历审案件
        this.case_push_data(); //类案推送

        var quanwen_obj = {};
        // 将全文数组 转为全文对象
        for (var i = 0, l = quanwen.length; i < l; i++) {
            var tmp = quanwen[i];
            // console.log(tmp)
            for (var k in tmp) {
                quanwen_obj[k] = tmp[k]
            }
        }
        // console.log(quanwen_obj);

        // 基本信息
        this.render_basic(data, quanwen_obj);
        //当事人
        this.render_parties(quanwen_obj.当事人);
        //审理经过
        this.render_trial_after(quanwen_obj.审理经过);
        //诉称
        this.render_allegation(quanwen_obj.诉称);
        //辩称
        this.render_defender_opinion(quanwen_obj.辩称);
        //本院认为
        this.render_court_consider(quanwen_obj.本院认为);
        //本院查明
        this.render_court_find(quanwen_obj.本院查明);
        //裁判结果
        this.render_judge_result(quanwen_obj.裁判结果);

        // 根据url中的参数 跳到对应部分
        this.choseType_scroll();
    },
    // 根据url中的参数 跳到对应部分
    choseType_scroll: function() {
        var choseType = Request2("choseType"),
            part_id = '';
        /*court_consider 本院认为
        trialprocess 审理经过
        court_ascertained 本院查明
        defender_opinion 辩称
        appellant_opinion 诉称*/
        switch (choseType) {
            case 'trialprocess': // 审理经过
                part_id = 'trial_after';
                break;
            case 'appellant_opinion': // 诉称
                part_id = 'allegation';
                break;
            case 'defender_opinion': // 辩称
                part_id = 'defender_opinion';
                break;
            case 'court_consider': // 本院认为
                part_id = 'court_consider';
                break;
            case 'court_ascertained': // 本院查明
                part_id = 'court_find';
                break;
            default:
                // statements_def
                break;
        }

        if (Request2("choseType") == choseType) {
            if (Request2("choseStatus") == 'true') {
                if ($("#" + part_id + " p").html().toLowerCase().indexOf("<b>") > -1) {
                    $("html,body").animate({ scrollTop: $("#" + part_id + " p").find("b").offset().top - 20 + "px" }, 500);
                } else {

                }
            }
        }
    },
    // 渲染顶部
    render_top: function(data) {
        if (data.title) {
            collection.title = data.title.replace(/<b>|<\/b>/g, ''); // 调用国双收藏接口时 使用
            // 在详情页js执行前执行  获取不到title
            collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）

            document.title = data.title.replace(/<b>|<\/b>/g, '');
            $('#title').html(data.title);
        }

        $('#features-wrapper').html(keyHandle(data.case_feature));
    },
    // 基本信息
    render_basic: function(data, quanwen_obj) {
        // console.log(quanwen_obj.审判人员)
        if (!data.casecause && !data.caseid && !data.court && !data.casetype && !data.judgedate && !quanwen_obj.审判人员) {
            $('#basic').html('<h3><span></span>基本信息</h3><ul id="basic_ul"><li>暂无信息</li></ul>');
            return;
        }
        var html = '<h3><span></span>基本信息</h3><ul id="basic_ul">';
        if (data.casecause.indexOf('、') > -1) {
            var arr = data.casecause.split('、');
            html += '<li><span>案由 :</span>';
            for (var i = 0, l = arr.length; i < l; i++) {
                html += '<a href="javascript:void(0);" class="casecause">' + arr[i] + '</a>';
            }
            html += '</li>';

        } else {
            html += (data.casecause ? '<li><span>案由 :</span><a href="javascript:void(0);" class="casecause">' + data.casecause + '</a></li>' : '');
        }

        html += (data.caseid ? ('<li><span>案号 :</span><span class="caseid">' + data.caseid + '</span></li>') : '') +
            (data.court ? ('<li><span>审理法院 :</span><a href="javascript:void(0);" class="court">' + data.court + '</a></li>') : '') +
            (data.casetype ? ('<li><span>案件类型 :</span>' + data.casetype + '</li>') : '') +
            (data.proceduretype ? ('<li><span>审理程序 :</span>' + data.proceduretype + '</li>') : '') +
            (data.judgedate ? ('<li><span>裁判时间 :</span>' + data.judgedate + '</li>') : '');

        if (quanwen_obj.审判人员) {
            html +=
                '<li class="clearfix">' +
                '<span class="fl">审判人员 :</span>' +
                '<ul class="judge_member_ul fl clearfix">';
            var arr = quanwen_obj.审判人员.split('\n');
            // console.log(arr)
            for (var i = 0, l = arr.length; i < l; i++) {
                var tmp = arr[i].replace(/<b>|<\/b>/g, '');
                var no_kong_tmp = tmp.replace(/\s/g, '');
                // console.log(tmp)
                if (Utils.trim(tmp) != '') { // 去除两端空格后不为空
                    if (no_kong_tmp.indexOf('执行长') > -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('长') + 1, tmp.length));

                        html += '<li><span class="jm_key">执&nbsp;&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;长</span><a href="javascript:void(0);" class="jm_val executive">' + str + '</a></li>';
                    }

                    if (no_kong_tmp.indexOf('执行员') > -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('员') + 1, tmp.length));

                        html += '<li><span class="jm_key">执&nbsp;&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;员</span><a href="javascript:void(0);" class="jm_val executor">' + str + '</a></li>';
                    }

                    /*if (no_kong_tmp.indexOf('审　判　长') > -1) {
                        var str = Utils.trim(tmp.slice('审　判　长'.length, tmp.length));

                        html += '<li><span class="jm_key">审&nbsp;&nbsp;&nbsp;判&nbsp;&nbsp;&nbsp;长</span><a href="javascript:void(0);" class="jm_val chiefjudge">' + str + '</a></li>';
                    }*/

                    if (no_kong_tmp.indexOf('审判长') > -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('长') + 1, tmp.length));

                        html += '<li><span class="jm_key">审&nbsp;&nbsp;&nbsp;判&nbsp;&nbsp;&nbsp;长</span><a href="javascript:void(0);" class="jm_val chiefjudge">' + str + '</a></li>';
                    }

                    /*if (no_kong_tmp.indexOf('审　判　员') > -1) {
                        var str = Utils.trim(tmp.slice('审　判　员'.length, tmp.length));

                        html += '<li><span class="jm_key">审&nbsp;&nbsp;&nbsp;判&nbsp;&nbsp;&nbsp;员</span><a href="javascript:void(0);" class="jm_val judge">' + str + '</a></li>';
                    }*/

                    if (no_kong_tmp.indexOf('审判员') > -1 && no_kong_tmp.indexOf('代理审判员') == -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('员') + 1, tmp.length));

                        html += '<li><span class="jm_key">审&nbsp;&nbsp;&nbsp;判&nbsp;&nbsp;&nbsp;员</span><a href="javascript:void(0);" class="jm_val judge">' + str + '</a></li>';
                    }

                    if (no_kong_tmp.indexOf('代理审判员') > -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('员') + 1, tmp.length));

                        html += '<li><span class="jm_key">代理审判员</span><a href="javascript:void(0);" class="jm_val assistantjudge">' + str + '</a></li>';
                    }

                    if (no_kong_tmp.indexOf('人民陪审员') > -1) {
                        var str = Utils.trim(tmp.slice(tmp.indexOf('员') + 1, tmp.length));

                        html += '<li><span class="jm_key">人民陪审员</span><a href="javascript:void(0);" class="jm_val peoplesjury">' + str + '</a></li>';
                    }
                }

            }

            html += '</ul></li></ul>';
        }

        $('#basic').html(html);
    },
    // 当事人
    render_parties: function(data) {
        var html = '<h3><span></span>当事人</h3><ul id="parties_ul" class="part_detail">';

        if (data && data.length > 0) {
            var arr = data.split(/\n/);
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] != '') {
                    html += '<li>' + arr[i] + '</li>';
                }
            }
        } else {
            html += '<li>暂无信息</li>';
        }
        html += '</ul>';

        $('#parties').html(html)
    },
    // 审理经过
    render_trial_after: function(data) {
        var html =
            '<h3><span></span>审理经过</h3>' +
            '<div class="part_detail">';
        if (data && data.length > 0) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#trial_after').html(html);
    },
    // 诉称
    render_allegation: function(data) {
        var html =
            '<h3><span></span>诉称</h3>' +
            '<div class="part_detail">';
        if (data) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#allegation').html(html);
    },
    // 辩称
    render_defender_opinion: function(data) {
        var html =
            '<h3><span></span>辩称</h3>' +
            '<div class="part_detail">';
        if (data) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#defender_opinion').html(html);
    },
    // 本院认为
    render_court_consider: function(data) {
        var html =
            '<h3><span></span>本院认为</h3>' +
            '<div class="part_detail">';
        if (data) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#court_consider').html(html);
    },
    // 本院查明
    render_court_find: function(data) {
        var html =
            '<h3><span></span>本院查明</h3>' +
            '<div class="part_detail">';
        if (data) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#court_find').html(html);
    },
    // 裁判结果
    render_judge_result: function(data) {
        var html =
            '<h3><span></span>裁判结果</h3>' +
            '<div class="part_detail">';
        if (data) {
            html += '<p>' + data + '</p>';
        } else {
            html += '<p>暂无信息</p>';
        }
        html += '</div>';

        $('#judge_result').html(html);
    },
    //适用法律
    render_applicable_law: function(data) {
        var html =
            '<h5>适用法律</h5>' +
            '<div style="overflow-x: hidden;overflow-y: scroll;width: 370px;">' +
            '<ul id="applicable-law_ul">';
        var laws_arr = [];
        if (data.applicable_law) {
            var laws_arr = data.applicable_law.split(' ');
            // console.log(laws_arr)
            for (var i = 0; i < laws_arr.length; i++) {
                var tmp = laws_arr[i].replace(/\、\u7b2c/g, '&第');
                // console.log(tmp);
                if (tmp) {
                    // 多条合并为一条的处理
                    if (tmp.indexOf('&') > -1) {
                        var item_arr = tmp.split('&');
                        var item_name = item_arr[0].slice(0, tmp.indexOf('第'));
                        html += '<li><span></span>' + item_arr[0] + '</li>';
                        this.applicable_law.push(item_arr[0]);

                        for (var j = 1, l = item_arr.length; j < l; j++) {
                            html += '<li><span></span>' + (item_name + item_arr[j]) + '</li>';
                            this.applicable_law.push(item_name + item_arr[j]);
                        }
                    } else { // 就是一条的
                        html += '<li><span></span>' + tmp + '</li>';
                        this.applicable_law.push(tmp);
                    }
                }
            }
        } else {
            html += '<div style="padding-left:12px;">暂无信息</div>';
            // $('#applicable-law').hide();
        }


        html +=
            '</ul>' +
            '</div>' +
            '<div class="btn-wrapper" style="visibility: hidden;">' +
            '<button id="load-more" class="load-more">加载更多</button>' +
            '</div>';

        $('#applicable-law').html(html);

        //保存高度
        if ($('#applicable-law li').length > 6) {
            for (var i = 0, l = $('#applicable-law li').length; i < l; i++) {
                this.all_li_height += $('#applicable-law_ul li').eq(i).height(); //所有li高度
                if (i < 6) {
                    this.six_li_height += $('#applicable-law_ul li').eq(i).height(); //前六个li高度
                }
            }
            this.all_li_height += ($('#applicable-law li').length * 10);
            this.six_li_height += 6 * 10;
            // 固定ul高度
            $('#applicable-law_ul').parent().height(this.six_li_height + 'px');

            $('.btn-wrapper').css('visibility', 'visible');
        }
    },
    //历审案件
    render_history_case: function(data) {
        var html = '';

        if (data.caseid) {
            var param = {
                    "caseid": data.caseid
                    // "caseid": '（2013）嘉秀商初字第601号'
                },
                that = this;
            jQuery.support.cors = true;
            $.ajax({
                type: 'POST',
                url: ip + '/witnet/search/precase',
                data: JSON.stringify(param),
                dataType: 'json',
                contentType: "application/json",
                success: function(res) {
                    that.succ_num++;
                    if (that.succ_num == 2) {
                        // 隐藏加载动画
                        $('.shadow').fadeOut();
                    }
                    // console.log(JSON.parse(res.result));

                    // if (!res.result || JSON.parse(res.result).length == 0) {
                    if (res.result == "[]" || res.result == "" || res.result == undefined) {
                        html += '<h5>历审案件</h5><ul id="history_cases_ul"><div style="padding-left:12px;">暂无信息</div></ul>';
                        $('#history-case').html(html);
                        return;
                    }

                    var result = JSON.parse(res.result);
                    html += '<h5>历审案件</h5><div style="overflow:hidden;"><ul id="history_cases_ul" class="history_cases_ul"><div class="border_l"></div>';
                    for (var i = 0, l = result.length; i < l; i++) {
                        var tmp = result[i];
                        html +=
                            '<li class="' + (tmp.currentCase ? 'cur' : '') + '">' +
                            '<span class="circle"></span>' +
                            '<div class="h_caseid">' + tmp.caseid + '</div>' +
                            '<div class="clearfix">' +
                            '<div class="h_curProcedure fl">' + tmp.curProcedure + '</div>' +
                            '<div class="h_judgedate fr">' + tmp.judgedate + '</div>' +
                            '</div>' +
                            '<div class="court">' + tmp.court + '</div>' +
                            '</li>';
                    }
                    html += '</ul></div>';
                    $('#history-case').html(html);
                    var bl_height = 0;
                    for (var i = 0, l = $('#history-case li').length - 1; i < l; i++) {
                        bl_height += $('#history-case li').eq(i).height()
                    }

                    bl_height += 10 * ($('#history-case li').length - 1);
                    // console.log(bl_height)
                    $('#history-case .border_l').height(bl_height + 'px')
                },
                error: function(error) {
                    var html = '<h5>历审案件</h5><ul id="history_cases_ul"><div style="padding-left:12px;">暂无信息</div></ul>';
                    $('#history-case').html(html);
                }
            });
        } else {
            html += '<h5>历审案件</h5><ul id="history_cases_ul" class="history_cases_ul"><div style="padding-left:12px;">暂无信息</div></ul>';
            $('#history-case').html(html);
        }

    },
    // 类案推送
    case_push_data: function() {
        // console.log(this.case_push_index)
        this.case_push_index += 5;
        var that = this;
        var jsonData = {
            "condition": {
                "orcondition": this.cp_orcondition
            },
            "from": this.case_push_index,
            "size": 5,
            "sort": "_score",
            "type": "cpws"
        };
        // console.log(jsonData)

        $.ajax({
            type: 'POST',
            url: ip + '/witnet/search/document',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: "application/json",
            success: function(res) {
                // console.log(res)
                that.succ_num++;
                if (that.succ_num == 2) {
                    // 隐藏加载动画
                    $('.shadow').fadeOut();
                }
                var result = JSON.parse(res.result);
                // console.log(result);
                that.case_push_arr = result;

                // 测试用
                /*var obj = {
                    casetype: "民事",
                    court: "龙陵县人民法院",
                    title: "原告黄某某与被告杨某某离婚纠纷一审民事判决书",
                    uniqid: "06e0f8a1-0a90-41f0-b1dd-54b560462ccd"
                };

                if (that.case_push_index == 0) {
                    result = [];
                }

                console.log(result);*/

                var html = '<h5>类案推送<button class="change-more" style="display: none;">换一换</button></h5><ul id="case_push_ul">';
                if (result.length > 0) {
                    html +=
                        that.render_case_push(result) +
                        '</ul>';
                    $('#case-push').html(html);

                    // 初始化时就隐藏 换一换
                    if (result.length < 5 && that.case_push_index == 0) {
                        // 隐藏换一换
                        $('#case-push .change-more').hide();
                    } else {
                        // 显示换一换
                        $('#case-push .change-more').show();
                    }

                    if (result.length < 5) {
                        that.case_push_index = -5;
                    }

                } else {
                    // 索引为0是 就没有数据  才显示  暂无信息
                    if (that.case_push_index == 0) {
                        html +=
                            '<div style="padding-left:12px;">暂无信息</div>' +
                            '</ul>';
                        $('#case-push').html(html);
                        // 隐藏换一换
                        $('#case-push .change-more').hide();
                    } else {
                        that.case_push_index = -5;
                        that.case_push_data();
                    }
                }

                /* if (that.case_push_index == -5 && result.length < 5) {
                     // 隐藏换一换
                     $('#case-push .change-more').hide();
                 } else {
                     // 显示换一换
                     $('#case-push .change-more').show();
                 }*/
                // console.log(that.case_push_index)
            },
            error: function(error) {
                var html = '<h5>类案推送</h5><ul id="case_push_ul"><div style="padding-left:12px;">暂无信息</div></ul>';
                $('#case-push').html(html);
            }
        })
    },
    render_case_push: function(data) {
        // console.log(data)
        var li_html = '';
        // var arr = [];
        // for (var i = 0, l = data.length; i < l; i++) {
        //     var tmp = data[i];
        //     if (tmp.uniqid != this.uniqID) {
        //         arr.push(tmp)

        //     }else{
        //         console.log(tmp)
        //     }
        // }
        // console.log(arr)
        for (var i = 0; i < 5; i++) {
            if (data[i]) {
                li_html += '<li><span></span>' + data[i].title + '</li>';
            }
        }
        return li_html;
    },
    // 加载更多 适用法条
    load_more_laws: function(obj, laws) {
        // console.log(this.six_li_height)
        if ($(obj).hasClass('open_more')) {
            $(obj).text('加载更多');
            $(obj).removeClass('open_more');
            $('#applicable-law_ul').parent().animate({ height: this.six_li_height + 'px' })
        } else {
            $(obj).text('点击收起');
            $(obj).addClass('open_more');
            $('#applicable-law_ul').parent().animate({ height: this.all_li_height + 'px' })
        }
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


// 阻止冒泡兼容函数
function stopBubble(e) {
    // 如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation) {
        // 因此它支持W3C的stopPropagation()方法 
        e.stopPropagation();
    } else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

// 截取案情特征
function slice_casefeature(str) {
    return str.slice(str.lastIndexOf('/') + 1, str.length)
}

// more_box 显示隐藏
$('#more_btn').on('click', function(e) {
    $('#more_box ').toggleClass('hide');
    stopBubble(e);
})

$(document).on('click', function() {
    $('#more_box ').addClass('hide');
})


function _toArray(str) {
    if (typeof(str) == 'object') { // 是数组
        return str;
    } else { // 是字符串
        var str2 = str.replace(/"|\[|\]/g, "");
        return str2.split(',');
    }
}

/**
 * keyword处理
 * */
function keyHandle(element) {
    var type = typeof element;
    var html_key = "";
    if (type == "string") {
        var stringT = element.substring(element.lastIndexOf('[') + 1, element.lastIndexOf(']'));
        var array = stringT.split(",");
        for (var h = 0, lenH = array.length; h < lenH; h++) {
            if (array[h].lastIndexOf('<b>') != -1) {
                var newstring = Utils.trim(array[h].replace(/<b>|<\/b>/g, ""));
                html_key += '<span><b>' + newstring.substring(newstring.lastIndexOf('/') + 1) + '</b></span>';
            } else {
                html_key += '<span>' + array[h].substring(array[h].lastIndexOf('/') + 1) + '</span>';
            }
        }
    } else if (type == "object") {
        for (var v = 0, lenV = element.length; v < lenV; v++) {
            html_key += '<span>' + element[v].substring(element[v].lastIndexOf('/') + 1) + '</span>';
        }
    } else {
        html_key = "";
    }
    return html_key;
};