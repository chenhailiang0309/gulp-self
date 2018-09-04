// 下载
/*$('#main').on('click','.download_btn', function() {
    window.open(ip + '/witnet/search/downloadDocument?uniqid=' + Request2("uniqid") + '&type=flgd')
})*/

var type = '';
var uniqID = Request2('uniqid');
var arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
type = arr[Request2("type")];
if (!sessionStorage.getItem('stackCache')) {
    sessionStorage.setItem('stackCache', JSON.stringify([]))
}
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


//法信码详情显示与隐藏
$(".fxm_box>a").click(function() {
    if ($(".fxm_details").hasClass('hide')) {
        $(".fxm_details").removeClass("hide");
    } else {
        $(".fxm_details").addClass("hide");
    }
});
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

    var userid = '';
    if (window.localStorage.getItem('UserInfo')) {
        userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
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
                _this.spellPointsDetail(data);
                //移动滚动轴，调到指定关键词位置
                if (Request2("choseType") == "fulltext") {
                    if (Request2("choseStatus") == 'true') {
                        if ($(".content_box div").html().toLowerCase().indexOf("<b>") > -1) {
                            $("html,body").animate({ scrollTop: $(".content_box").find("b").offset().top - 60 + "px" }, 500);
                        }
                    }
                }
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
render.prototype.spellPointsDetail = function(obj) {
    var title = isEmpty(obj.title) ? "" : replaceBTag(obj.title);
    document.title = title;
    collection.title = title;
    collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）
    var html = '';
    //-------------------------基本信息
    //观点标题
    if (obj.title && !isEmpty(obj.title)) {
        $(".main_title").html('<h2>' + obj.title + '</h2>');
    }
    $(".title_keywords").find('span:last-child').css("border", "none");
    var points_box = [{ 'key': 'comefrom_name', 'val': '来源' }, { 'key': 'zhubian', 'val': '主编' }, { 'key': 'sort_id', 'val': '法学分类' }, { 'key': 'chuban_time', 'val': '出版日期' }];
    html = '';
    var li = '';
    //基本信息
    for (var i = 0, len = points_box.length; i < len; i++) {
        var item = points_box[i];
        if (obj[item.key] && !isEmpty(obj[item.key])) {
            if (item.val == '来源') {
                if (obj[item.key].indexOf("|") != -1) {
                    li += '<li>' + item.val + '：<span>' + obj[item.key].substring(obj[item.key].indexOf("|") + 1, obj[item.key].length - 1) + '</span></li>';
                } else {
                    li += '<li>' + item.val + '：<span>' + obj[item.key] + '</span></li>';
                }
            } else if (item.val == '法学分类') {
                if (obj[item.key].indexOf("#") != -1) {
                    li += '<li>' + item.val + '：<span>' + obj[item.key].substring(obj[item.key].indexOf("#") + 2, obj[item.key].length - 1) + '</span></li>';
                } else {
                    li += '<li>' + item.val + '：<span>' + obj[item.key] + '</span></li>';
                }
            } else {
                li += '<li>' + item.val + '：<span>' + obj[item.key] + '</span></li>';
            }
        }
    };
    html += '<ul>' +
        li +
        '</ul>';
    $(".keywords").html(html);
    //法信码


    //-----------------------------主全文信息
    html = '';
    if (obj.fulltext && !isEmpty(obj.fulltext)) {
        html += '<div>' + obj.fulltext + '</div>';
    }else{
        html='<div class="none"">' +
            '    <img src="../images/none.png" alt="" />' +
            '    <span class="img_text">详情页内容为空</span>' +
            '</div>'
    }
    $(".content_box").html(html);
};
var Render = new render();
Render.getDocumentData();