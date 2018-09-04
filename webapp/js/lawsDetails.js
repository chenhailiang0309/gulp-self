// 下载
/*$('#main').on('click', '.download_btn', function() {
    window.open(ip + '/witnet/search/downloadDocument?uniqid=' + Request2("uniqid") + '&type=flfg')
})*/



var type = '';
var ygTitle='';
var uniqID = Request2('uniqid');
var arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
var arrTabs = [{ 'key': 'alyz', 'val': '案例要旨', 'bName': 'alyz' }, { 'key': 'viewpoint', 'val': '法律观点', 'bName': 'flgd' }, { 'key': 'documents', 'val': '裁判文书', 'bName': 'cpws' }, { 'key': 'tushu', 'val': '图书', 'bName': 'ts' }, { 'key': 'xzwd', 'val': '法信问答', 'bName': 'xzzd' }, { 'key': 'qikan', 'val': '期刊', 'bName': 'qk' }, { 'key': 'alllaw', 'val': '法律法规', 'bName': 'flfg' }]
type = arr[Request2("type")];
var userid = '';
if (window.localStorage.getItem('UserInfo')) {
    userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
}

if (!sessionStorage.getItem('stackCache')) {
    sessionStorage.setItem('stackCache', JSON.stringify([]))
}
var gid = '';
var sort_id = '';
var session = sessionStorage.getItem('stackCache');
var stackCache = JSON.parse(session);
var mergePush = function(array, element) {
    if (typeof array == "undefined") {
        array = [];
    }
    if (element instanceof Array) {
        for (var i = 0, lenI = element.length; i < lenI; i++) {
            array.push(element[i]);
        }
    } else {
        array.push(element);
    }
    return array;
};
var sCache = {};
var merge = function() {
    //全局合并
    for (var i = 0, lenI = stackCache.length; i < lenI; i++) {
        var cType = stackCache[i]["cType"] + "condition"; //condition类型
        for (var j in stackCache[i]["condition"]) {
            var key = j; //键值
            if (typeof sCache[cType] == "undefined") {
                sCache[cType] = {}; //新建condition
            }
            sCache[cType][key] = mergePush(sCache[cType][key], stackCache[i]["condition"][key]);
        }
    }
}
// console.log(sCache)
merge()
var conditionBox = [];
var condition = {};
var title, tiao = '';
var ctype = '';
if (!isEmpty(session)) {
    for (var i = 0, leni = session.length; i < leni; i++) {
        conditionBox.push(session[i].condition)
        ctype = session[i].cType;
    }
    for (var k = 0, len = conditionBox.length; k < len; k++) {
        for (var key in conditionBox[k]) {
            if (condition[key] != undefined) {
                condition[key].push(conditionBox[k][key][0]);
            } else {
                condition[key] = [];
                if (typeof conditionBox[k][key] == 'string') {
                    condition[key].push(conditionBox[k][key]);
                } else {
                    condition[key].push(conditionBox[k][key][0]);
                }
            }
        }
    }
}

function checkEle(type) {
    if (isEmpty(type)) {
        return;
    }
    if (typeof type == 'string') {
        return stringToArray(type);
    } else {
        return type;
    }
}

//判断userId是否存在
var render = function() {

};

render.prototype.getDocumentData = function() {
    var _this = this;
    var url = ip + '/witnet/search/documentDetail';
    if (Request2('flag') == '0') {
        var param = {
            "uniqid": uniqID,
            "type": type
        };
    } else {
        if (JSON.stringify(sCache) != '{}') {
            var param = {
                "condition": sCache,
                "uniqid": uniqID,
                "type": type,
            };
            if (param["condition"]["orcondition"] != undefined) {
                param.issecondquery = true
            } else {
                param.issecondquery = false
            }
        } else {
            var param = {
                "uniqid": uniqID,
                "type": type
            };

        }
    }



    param.userid = userid;
    param.docinfo = Request2('title'); // 加了两次
    jQuery.support.cors = true;
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        beforeSend: function() {
            $('.shadow').fadeIn();
        },
        success: function(res) {
            $('.shadow').fadeOut();
            if (!isEmpty(res.result)) {

                var data = JSON.parse(res.result);
                // console.log(data)
                _this.spellDetail(data);
                //跳到页面指定关键词位置
                if (Request2("choseType") == "fulltext") {
                    if (Request2("choseStatus") == 'true') {
                        if ($(".full_text_item").html().toLowerCase().indexOf("<b>") > -1) {
                            $("html,body").animate({ scrollTop: $(".full_text_item").find("b").offset().top - 60 + "px" }, 500);
                        }
                    }
                }
                //当从沿革信息跳转页面时，跳到指定条位置
                if (window.location.hash) {
                    var hash = window.location.hash.substring(window.location.hash.indexOf("#") + 1);
                    for (var i = 0, len = $(".c_tiao").length; i < len; i++) {
                        if ((i + 1) == hash) {
                            $("html,body").animate({ scrollTop: $(".left_details .c_tiao").eq(i).offset().top - 10 + "px" }, 500);
                        }
                    }
                }
                // 获取full_text_item整个html
                var full_text_item_html = $('.full_text_item div').html();
                var li = '';
                if ($(".c_tiao").length == 0) {
                    li += '<li>暂无目录信息</li>'
                } else {
                    for (var i = 0; i < $(".c_tiao").length; i++) {
                        //目录过长时不显示
                        if ($(".c_tiao")[i].innerText.length > 10) {
                            li += '';
                            // li += '<li><a href="#' + (i + 1) + '">' + $(".c_tiao")[i].innerText.substring(0,5) + '</a></li>';
                        } else {
                            //获取第几条
                            // var title_num = $(".c_tiao")[i].innerText.replace(/[\s]*/,'');
                            var title_num = $(".c_tiao")[i].innerText;
                            // 获取第一个span的html
                            var cur_c_tiao_html = $(".c_tiao").eq(i).prop("outerHTML");
                            // console.log(cur_c_tiao_html);
                            var index_1 = full_text_item_html.indexOf(cur_c_tiao_html) + cur_c_tiao_html.length;
                            // 获取第二个span的html
                            var cur_dt_html = $('.dt').eq(i).prop("outerHTML");
                            // console.log(cur_dt_html)
                            // 截取两个span之间的html
                            var index_2 = full_text_item_html.indexOf(cur_dt_html);
                            var _html = full_text_item_html.slice(index_1, index_2);
                            // console.log(_html)
                            // 正则去掉两个span标签间的a标签
                            var _text = _html.replace(/<a[\s]+(href\="javascript:void\(0\);")[\s]+fid="[a-zA-Z0-9]*"[\s]+tiao="[0-9]*"[\s]+class="[a-z]*">|<\/a>|<br>|\n|[\s]*/g, '');
                            // console.log(_text)
                            li += '<li><a href="#' + (i + 1) + '">' + title_num + '&nbsp;&nbsp;' + _text + '</a></li>';
                        }
                    }
                }
                $(".catalog_box ul").html(li);
            } else {
                $('.shadow').fadeOut();
                $(".funtags").addClass("hide");
                $(".main ").addClass("hide");
                $(".none").find('span').text('详情页内容为空');
                $(".none").fadeIn();
            }
        },
        error: function(error) {
            // console.log('失败');
            $('.shadow').fadeOut();
            $(".funtags").addClass("hide");
            $(".main ").addClass("hide");
            $(".none").find('span').text('404，页面跑丢了');
            $(".none").fadeIn();
        }
    });
};
//函数拼接
render.prototype.spellDetail = function(obj) {
    // console.log(obj)
    title = isEmpty(obj.title) ? "" : replaceBTag(obj.title);
    ygTitle=title;
    document.title = title;
    collection.title = title;
    collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）
    gid = isEmpty(obj.gid) ? '' : obj.gid;
    sort_id = checkEle(obj.sort_id_content);
    this.spellLeftPage(obj);
    this.spellRightPage(obj);
    this.otherGuide(obj);
    this.showYGresult();
    this.getIcondata();
    // this.relatedCased();
    //添加引用统计icon
    // if(obj.xiaoli_id_content=='法律'){
    //     if($("span").hasClass("dt")){
    //         for(var i=0,len=$(".dt").length;i<len;i++){
    //             tiao=$(".c_tiao")[i].innerHTML.trim();
    //             var a='<a target="_blank" class="tj" title="引用统计" onmouseover="showTJbox(\''+title+'\',\''+tiao+'\',\''+(i+1)+'\')"></a>' +
    //                 '<div class="fg_link hide" id="link'+(i+1)+'" tiao="'+tiao+'" ></div>'
    //             $(".dt")[i].innerHTML+=a;
    //         }
    //     }
    // }else{
    //     // $(".yytj_box,.sy_box").removeClass("hide");
    // }
};

//左侧页面详情拼接
render.prototype.spellLeftPage = function(obj) {

    //title信息
    var html = '',
        h2 = '',
        span = '';
    if (obj.fdate && !isEmpty(obj.fdate) || obj.ssrq && !isEmpty(obj.ssrq)) {
        obj.fdate = Qm.dateCheck(obj.fdate, '-');
        obj.ssrq = Qm.dateCheck(obj.ssrq, '-')
    }
    var arr = [{ "key": "shixiao_id_content", "value": "时效性" }, { "key": "fdate", "value": "发布日期" }, { "key": "ssrq", "value": "实施日期" }];
    if (obj.title && !isEmpty(obj.title)) {
        h2 += '<h2>' + obj.title + '</h2>';
    }
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        if (obj[item.key] && !isEmpty(obj[item.key])) {
            span += '<span>' + item.value + '：' + obj[item.key] + '</span>'
        }
    }
    html += h2 +
        '<div>' + span + '</div>';
    $(".main_title").html(html);
    $(".main_title div span:last-child").css("borderRight", "none");
    //目录

    //正文
    html = '';
    if (obj.fulltext && !isEmpty(obj.fulltext)) {
        html += '<div>' + obj.fulltext + '</div>';
    }
    $(".full_text_item").html(html);
    if ($(".full_text_item div").hasClass('title_m')) {
        $(".title_m").remove()
    }
};

//右侧页面详情拼接
render.prototype.spellRightPage = function(obj) {
    //-----------------------------基本信息拼接
    var basic_arr = [{ "key": "xiaoli_id_content", "value": "效力级别" }, { "key": "shixiao_id_content", "value": "时效性" }, { "key": "fdate", "value": "发布日期" }, { "key": "ssrq", "value": "实施日期" }, { "key": "lawType", "value": "地域范围" }, { "key": "fdep_id_content", "value": "发布机关" }];

    var html = '';
    var li = '';
    for (var i = 0, lengB = basic_arr.length; i < lengB; i++) {
        var itemB = basic_arr[i];
        if (obj[itemB.key] && !isEmpty(obj[itemB.key])) {
            li += '<li>' + itemB.value + '：<span title="' + obj[itemB.key] + '">' + obj[itemB.key] + '</span></li>'
        }
    }
    html += '<h3>基本信息</h3>' +
        '<ul>' +
        li +
        '</ul>';
    $(".basic_item").html(html);
};

//----------------------------相关法规&期刊---------------------------------
render.prototype.otherGuide = function(obj) {
    if (obj.xiaoli_id_content != '法律') {
        $(".otherGuide").remove()
    }
    this.relatedCased();
    // this.getQKdata();
};
//--------------------------相关法规
render.prototype.relatedCased = function() {
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "andcondition": {
                "sort_id_content": sort_id,
                "xiaoli_id_content": "司法解释"
            }
        },
        "type": type,
        "from": 0,
        "size": 6
    };

    var _this = this;
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            if (res.count > '0') {
                var data = JSON.parse(res.result);
                // console.log(data)
                _this.spellFgItem(data)
                //点击换一换
                $(".laws_item").on("click", ".changeBtn", function() {
                    var dataReturn = _this.changeContent(param, url);
                    _this.spellFgItem(dataReturn);
                })
            } else {
                $(".laws_item").html('<h3>相关法规</h3><p class="nothing">暂无信息</p>');
            }
        },
        error: function(error) {
            // console.log(error);
        }
    })
};
//----------------------------相关法规--------------------------------
render.prototype.spellFgItem = function(obj) {
    var html = '';
    var li = '';
    var arr = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i].uniqid != uniqID) {
            arr.push(obj[i])
            if (arr.length >= 5) {
                break
            } else {
                continue;
            }
        }
    }
    if (arr.length == 0) {
        html += '<h3>相关法规</h3>' +
            '<p class="nothing">暂无信息</p>';
        // $(".laws_item").html(html);
    } else {
        for (var k = 0, length = arr.length; k < length; k++) {
            if (arr[k].title && !isEmpty(arr[k].title)) {
                li += '<li><i></i><a target="_blank" href="lawsDetails.html?uniqid=' + arr[k].uniqid + '&type=' + Request2("type") + '&flag=0&title='+encodeURI(encodeURI(arr[k].title))+'" onclick="click_loginVerify();if(!click_tokenYX) return ; " >' + arr[k].title + '</a></li>'
            }
        }
        html += '<h3>相关法规</h3>' +
            '<a href="javascript:void (0);" class="changeBtn">换一换</a>' +
            '<ul>' +
            li +
            '</ul>';
        $(".laws_item ").html(html);
    }

}
//--------------------------期刊----------------------------
render.prototype.getQKdata = function() {
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "andcondition": {
                "sort_id_content": sort_id,
                "xiaoli_id_content": "司法解释"
            }
        },
        "type": "qk",
        "from": 0,
        "size": 5
    };
    var _this = this;
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            var data = JSON.parse(res.result);
            // console.log(data)
            _this.spellQKitem(data)
        },
        error: function(error) {
            // console.log(error);
        }
    })
};
render.prototype.spellQKitem = function(obj) {
    var html = '';
    var li = '';
    var arr = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i].uniqid != uniqID) {
            arr.push(obj[i])
            if (arr.length >= 5) {
                break
            } else {
                continue;
            }
        }
    }
    // if(arr.length==0){
    html += '<h3>期刊</h3>' +
        '<p class="nothing">暂无信息</p>';
    $(".periodicals_item").html(html);
    // }else {
    //     for (var k = 0, length = arr.length; k < length; k++) {
    //         if (arr[k].title && !isEmpty(arr[k].title)) {
    //             li += '<li><i></i><a target="_blank" href="lawsDetails.html?uniqid='+arr[k].uniqid+'&type='+Request2("type")+'">' + arr[k].title + '</a></li>'
    //         }
    //     }
    //     html += '<h3>期刊</h3>' +
    //         '<a href="javascript:void (0);" class="changeBtn">换一换</a>'+
    //         '<ul>' +
    //         li +
    //         '</ul>';
    //     $(".periodicals_item").html(html);

    // }

}

var Render = new render();
Render.getDocumentData();


//点击目录显示隐藏
$(".catalog_btn").click(function() {
    if ($(".catalog_box").hasClass("hide")) {
        $(".catalog_box").removeClass("hide");
        $(this).addClass("on");

    } else {
        $(".catalog_box").addClass("hide");
        $(this).removeClass("on");
    }

    //目录滚动
    $(window).scroll(function() {
        /*  获取游标距顶部距离*/
        var winTop = $(this).scrollTop() + 30;
        var arr = [];
        var index = 0;
        var len = $(".c_tiao").length;
        var begin = 5,
            end = len - 4;
        for (var i = 0, length = len; i < length; i++) {
            arr.push($(".c_tiao").eq(i).offset().top);
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
            $(".catalog_box ul li").find("a").removeClass("on");
        }
    })

});
//---------------------换一换-------------------
render.prototype.changeContent = function(param, url) {
    param["from"] += 5;
    var _this = this;
    var data = {};
    jQuery.support.cors = true;
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        async: false,
        contentType: "application/json",
        success: function(res) {
            data = JSON.parse(res.result);
            // return data;
            if (data.length < 5) {
                param["from"] = -5;
            }

        },
        error: function(error) {
            // console.log(error)
        }
    });
    return data;
};


function stringToArray(string) {
    var arr = new Array();
    if (string.indexOf(',') == -1) {
        arr.push(string.trim());
        return arr;
    } else {
        arr = string.split(',');
        return arr;
    }
}
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


//-------------------------icon显示设置-----------------------
render.prototype.getIcondata = function() {
    this.showSYicon();
    this.showYGicon();
    this.showRightTJData(title);
    this.showTJicon();
};
//---------------------------------释义
render.prototype.showSYicon = function() {
    var param = {
        "gid": gid,
        // "tiao":"0"
    };
    var url = ip + '/witnet/search/queryparaphrasecat';
    jQuery.support.cors = true;
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            if (!$.isEmptyObject(res.result)) {
                var data = JSON.parse(res.result);
                // console.log(data)
                if (isEmpty(data)) {
                    $(".sy_box .nothing").removeClass("hide");
                    $(".sy_box ul").remove();
                } else
                if (data.length == 1) {
                    var li = '<li>' +
                        '<a href="javascript:void (0)">' + 法条释义 + '<span class="fr">' + 1 + '</span></a>' +
                        '</li>'
                    $(".sy_box ul").html(li);
                } else {
                    $(".sy_box").addClass("hide");
                    for (var i = 0; i < data.length; i++) {
                        var tiao = data[i].tiao;
                        $("#t_" + tiao).html('<a target=\"_blank\"  title=\"释义\" class=\"sy\" href="lawsParaphraseDetails.html?gid=' + gid + '&tiao=' + tiao + '" onclick=\"click_loginVerify();if(!click_tokenYX) return ; \"></a>' + $("#t_" + tiao).html());
                    }
                }
            }
        }
    });
};



//------------------------------右侧沿革信息渲染

render.prototype.showYGresult = function() {
    var param = {
        "gid": gid,
        "tiao": "0"
    };
    var url = ip + '/witnet/search/queryevolution';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            var html = '';
            if (!isEmpty(res.result) && res.result != 'fail') {
                var data = JSON.parse(res.result)
                // console.log(data)
                var arrLink = stringToArray2(data[0].linkContent.substring(0, data[0].linkContent.lastIndexOf("#@#@")));
                var arr = [];
                for (var i = 0, lengLink = arrLink.length; i < lengLink; i++) {
                    var ygInfo = arrLink[i].substring(1, arrLink[i].lastIndexOf("]"));
                    arr.push(ygInfo.split("["))
                }
                arr.reverse() //反转时间数组
                var li = '';
                for (var i = 0, lenI = arr.length; i < lenI; i++) {
                    var s = '';
                    //修改时间格式
                    for (var k = 0, len0 = arr[i][1].length; k < len0; k++) {
                        s += arr[i][1][k];
                        if (k == 3 || k == 5) {
                            s += '-';
                        }
                    }
                    //拼接单条数据
                    li += '<li>' +
                        '   <span>' + s + '</span>' +
                        '<' + arr[i][0] + '</a>' +
                        '</li>'
                }
                //拼接右侧整个沿革信息数据
                html += '<h3>沿革信息</h3>' +
                    ' <div class="side_info_item">' +
                    '<div class="sideBar"></div>' +
                    '<ul>' +
                    li +
                    '</ul>' +
                    '</div>';
                $(".evolution_item").html(html);
                for(var i=0,length=$(".evolution_item ul li").length;i<length;i++){
                    if($(".evolution_item ul li").eq(i).find('a').text()==ygTitle){
                        $(".evolution_item ul li").eq(i).find('a').css("color",'#0086dd')
                    }
                }
                var h = $(".evolution_item ul").height() - $(".evolution_item ul li:last-child").height();
                $(".sideBar").css("height", h)
            } else {
                html += '<h3>沿革信息</h3>' +
                    '<p class="nothing">暂无信息</p>';
                $(".evolution_item").html(html);
            }
        },
        error: function(error) {}
    })
}


//----------------------沿革信息icon渲染----------------------------
render.prototype.showYGicon = function() {
    var param = {
        "gid": gid,
        // "tiao":"0"
    };
    var url = ip + '/witnet/search/queryevolutioncat';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            var html = '';
            if (!isEmpty(res.result) && res.result != 'fail') {
                var data = JSON.parse(res.result)
                // console.log(data)
                if (data.length > 1) {
                    //分割成数组，名称+时间
                    for (var i = 1; i < data.length; i++) {
                        var tiao = data[i].tiao;
                        $("#t_" + tiao).html($("#t_" + tiao).html() + '<a target=\"_blank\" id="ygxx' + tiao + '"  class=\"yg\" title=\"沿革信息\" onclick="ShowLSYGDiv(\'' + gid + '\',\'' + tiao + '\')"></a>');
                    }
                }

            }

        },
        error: function(error) {
            // console.log(error)
        }
    });
};
//沿革信息转数组
function stringToArray2(string) {
    var arr = new Array();
    if (string.indexOf(',') == -1) {
        arr.push(string.trim());
        return arr;
    } else {
        arr = string.split('#@#@修改#@');
        return arr;
    }
}
//沿革信息弹框信息展示
function ShowLSYGDiv(gid, tiao) {
    $(".ygTitle h3").html('第 ' + tiao + ' 条 沿革信息');
    var param = {
        "gid": gid,
        "tiao": tiao
    };
    var url = ip + '/witnet/search/queryevolution';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            if (!isEmpty(res.result)) {
                var data = JSON.parse(res.result);
                // console.log(data)
                //for循环查找当前法条信息
                // for(var i=0,length=data.length;i<length;i++){
                // var item=data[i].linkContent
                // if(item.indexOf("添加")!=-1){
                //     console.log(i)
                // }
                // if(i==tiao){
                //拆分当前linkcontent为每个版本的数组
                var item = data[0].linkContent;
                //判断是否存在#@#@，即添加
                if (item.indexOf("#@#@") != -1) {
                    item = data[0].linkContent.replace("#@#@", "");
                }
                var arr;
                if (item.indexOf("。”#@") > -1) {
                    item = item.replace("。”#@", "。#@")
                }
                arr = item.split("。#@");
                // console.log(arr)
                //反转数组
                arr.reverse();
                for (var m = 0, lenm = arr.length; m < lenm; m++) {
                    if (arr[m].indexOf("添加") != -1) {

                        arr.push(arr[m].substring(arr[m].indexOf("添加")))
                        arr.push(arr[m].substring(0, arr[m].indexOf("添加")))
                        arr.splice(m, 1)
                    }
                }
                var li = '';
                if (isEmpty(arr[0])) {
                    for (var k = 1, leng = arr.length; k < leng; k++) {
                        //拆分为是否修改，a链接，法条内容的数组
                        var linkArr = arr[k].split("#@");
                        //判断当前每个数组中的第一个元素是否存在修改字段，没有的话添加空数据到最前边
                        if (linkArr.length < 3) {
                            linkArr.unshift("&nbsp;&nbsp;&nbsp;")
                            linkArr.push("&nbsp;&nbsp;&nbsp;")
                        }
                        //拼接单条li数据
                        li += '<li>' +
                            '   <span class="changeText fl">' + linkArr[0] + '</span>' +
                            linkArr[1] +
                            '<p>' + linkArr[2] + '</p>' +
                            '</li>';

                        $(".box_item ul").html(li);
                    }
                } else {
                    for (var k = 0, leng = arr.length; k < leng; k++) {
                        //拆分为是否修改，a链接，法条内容的数组
                        var linkArr = arr[k].split("#@");
                        // console.log(linkArr)
                        //判断当前每个数组中的第一个元素是否存在修改字段，没有的话添加空数据到最前边
                        if (linkArr.length < 3) {
                            linkArr.unshift("&nbsp;&nbsp;&nbsp;")
                            linkArr.push("&nbsp;&nbsp;&nbsp;")
                        }
                        //拼接单条li数据
                        li += '<li>' +
                            '   <span class="changeText fl">' + linkArr[0] + '</span>' +
                            linkArr[1] +
                            '<p>' + linkArr[2] + '</p>' +
                            '</li>';

                        $(".box_item ul").html(li);
                    }
                }

                // }
                // }
                $(".ygbox").show();
                $(".mask").removeClass('hide');
                var w1 = $(window).width();
                $('html').addClass('fancybox-lock-test');
                var w2 = $(window).width();
                $('head').find('style').remove();
                $("<style type='text/css'>.fancybox-right{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
                $('body').addClass('fancybox-right');

                $(".box_bar").css('height', $(".box_item ul").height() - $(".box_item ul li:last-child").height());
                if ($(".box_item ul").height() >= 450) {
                    $(".box_detail ").css("overflowY", "scroll")
                } else {
                    $(".box_detail ").css("overflowY", "hidden")
                }
            } else {
                $(".box_detail ").html("查询失败")
            }
        }
    });
    //点击关闭
    $(".closeBtn").click(function() {
        $(".mask").addClass("hide");
        $(".ygbox").hide();
        $('body').removeClass('fancybox-right');
        $('html').removeClass('fancybox-lock-test');
    })

}
//沿革信息跳转
function FXC(gid, index) {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;
    var param = {
        "gid": gid,
        "tiao": index
    }
    $.ajax({
        type: 'post',
        url: ip + '/witnet/search/querylawbygid',
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            // console.log(res)
            if (!isEmpty(res.result)) {
                var data = JSON.parse(res.result);
                // console.log(data);
                var uniqid = data[0].uniqid;
                var encodeTitle=encodeURI(encodeURI(data[0].title))
                window.open('./lawsDetails.html?uniqid=' + uniqid + '&type=1&flag=0&title='+encodeTitle+'#' + index);
            } else {
                alert("暂无信息")
            }
        }
    })
}
//引用统计icon查询渲染
render.prototype.showTJicon = function() {
    if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("))
    }
    if (title.indexOf("（") > -1) {
        title = title.substring(0, title.indexOf("（"))
    }
    var param = {
        "relatedlaw": title
    }
    var url = ip + '/witnet/search/relatedlaw';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            var html = '';
            if (!isEmpty(res.result) && res.result != 'fail') {
                var queryDatas = JSON.parse(res.result)
                var data = queryDatas.queryDatas.aggsDatas
                // console.log(formatDate(new Date().getTime()))
                $.each(data, function(m) {
                    for (var i = 0; i < $(".c_tiao").length; i++) {
                        if ($(".c_tiao")[i].innerText.indexOf(m) >= 0) {
                            var html = '<a target="_blank" class="tj" title="引用统计" onmouseenter="showTJbox(\'' + title + '\',\'' + m + '\',\'' + (i + 1) + '\')"><div class="fg_link hide" id="link' + (i + 1) + '" tiao="' + m + '" ></div></a>';
                            var l = $(".c_tiao").parent().find(".dt")[i].getAttribute('id');
                            $("#" + l).append(html);
                            break;
                        }
                    }
                });
                // console.log(formatDate(new Date().getTime()))
            }
        },
        error: function(error) {
            // console.log(error)
        }
    });
};


//----------------------------------引用统计
//鼠标悬停icon
function showTJbox(title, tiao, i) {
    //去掉文书版本
    if (title.indexOf("（") > -1) {
        title = title.substring(0, title.indexOf("（"))
    }
    if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("))
    }
    $(".fg_link").addClass("hide");
    var laws = title + tiao;
    var param = {
        "condition": {
            "andcondition": {
                "applicable_lawonly": [laws]
            }
        },
        "type": "cpws",
        "from": 0,
        "size": 0
    };
    var url = ip + '/witnet/search/document';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            if (!isEmpty(res)) {
                if (res.count != '0') {
                    //判断统计信息不为空时数据显示
                    $('#link' + i).removeClass("hide").html('<a href="jacascript:void(0)" class="back_result" style="cursor: pointer">裁判文书：' + res.count + '篇</a>')
                } else {
                    $('#link' + i).removeClass("hide").html('暂无信息')
                }
            }
        },
        error: function(error) {
            // console.log(error)
        }
    })
}
//点击单条引用统计里边的裁判文书跳转至结果页，存stackCache
$("body").on('click', '.fg_link a', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;
    if (title.indexOf("（") > -1) {
        title = title.substring(0, title.indexOf("（"))
    }
    if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("))
    }
    var tiao = $(this).parent(".fg_link").attr('tiao');
    var news = {};
    news["condition"] = {};
    news["condition"]['applicable_lawonly'] = [title + tiao];
    news["name"] = title + tiao;
    news["cType"] = "or";
    news["elementType"] = 'applicable_lawonly';
    sessionStorage.setItem('stackCache', JSON.stringify([news]));
    //对应到裁判文书tab页
    window.sessionStorage.setItem('Index', 3);
    if (window.localStorage.getItem('Token')) {
        window.open('./result.html?token=' + window.localStorage.getItem('Token'));
    } else {
        window.open('./result.html');
    }
    Qm.removeSession("stackCache");
})

//鼠标离开法规盒子
$("body").on("mouseleave", ".fg_link", function() {
    $(this).addClass("hide")
});

//除法律外右侧引用统计数据显示

render.prototype.showRightTJData = function(title) {
    if (title.indexOf("（") > -1) {
        title = title.substring(0, title.indexOf("（"))
    }
    if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("))
    }
    var li = '';
    var param = {
        "condition": {
            "andcondition": {
                "applicable_law": [title]
            }
        }
        // "type": "cpws",
        // "from": 0,
        // "size": 0
    };
    var url = ip + '/witnet/search/statisall';
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: "application/json",
        success: function(res) {
            var totals = JSON.parse("{" + res.result + "}").queryDatas.totals;
            // console.log(totals)
            for (var i = 0, len = arrTabs.length; i < len; i++) {
                var item = arrTabs[i];
                //暂时去掉小智知道
                if (totals[i].total != 0 && totals[i].index != 'xzwd') {
                    li += '<li class="clearfix" name="' + item.bName + '">' +
                        '<a href="javascript:void (0)">' + arrTabs[i].val + '<span class="fr">' + totals[i].total + '</span></a>' +
                        '</li>';
                }
            }

            $(".yytj_box ul").html(li);
            if (isEmpty($(".yytj_box ul").text())) {
                $(".yytj_box ul").remove();
                $(".yytj_box .nothing").removeClass("hide");
            }
        }
    })
}
$("body").on('click', '.yytj_box ul li', function() {
    click_loginVerify(); // 校验token 是否失效
    if (!click_tokenYX) return;
    if (title.indexOf("（") > -1) {
        title = title.substring(0, title.indexOf("（"))
    }
    if (title.indexOf("(") > -1) {
        title = title.substring(0, title.indexOf("("))
    }
    var news = {};
    news["condition"] = {};
    news["condition"]['applicable_law'] = [title];
    news["name"] = title;
    news["cType"] = "or";
    news["elementType"] = 'applicable_law';
    sessionStorage.setItem('stackCache', JSON.stringify([news]));
    //对应到裁判文书tab页
    for (var n = 0, len = arr.length; n < len; n++) {
        if (arr[n] == $(this).attr('name')) {
            window.sessionStorage.setItem('Index', n);
        }
    }
    if (window.localStorage.getItem('Token')) {
        window.open('./result.html?token=' + window.localStorage.getItem('Token'));
    } else {
        window.open('./result.html');
    }
    Qm.removeSession("stackCache");

})
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/*
　　filter()兼容旧环境
　　filter 被添加到 ECMA-262 标准第 5 版中，因此在某些实现环境中不被支持。可以把下面的代码插入到脚本的开头来解决此问题，
　　该代码允许在那些没有原生支持 filter 的实现环境中使用它。该算法是 ECMA-262 第 5 版中指定的算法
*/

/*Array.prototype.filter = Array.prototype.filter || function(func) {
    var arr = this;
    var r = [];
    for (var i = 0; i < arr.length; i++) {
        if (func(arr[i], i, arr)) {
            r.push(arr[i]);
        }
    }
    return r;
}*/