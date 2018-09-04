var back_data = {}; // 接口返回数据

var isLogin = 0;
var slfy = '';
var sort_id = [];
var sjfy = '';
var features = '';
var zs_date = '';
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
//---------------------------全文拼接----------------------------
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
                // console.log(data);
                back_data = data;
                _this.spellDetail(data);
                //移动滚动轴，调到指定关键词位置
                if (Request2("choseStatus") == 'true') {
                    if (Request2("choseType") == "alyz_content") {
                        if ($(".case_message_item div").html().toLowerCase().indexOf("<b>")) {
                            $("html,body").animate({ scrollTop: $(".case_message_item div").find("b").offset().top - 60 + "px" }, 500);
                        }
                    } else {
                        if ($(".left_details div").html().indexOf("<b>")) {
                            $("html,body").animate({ scrollTop: $(".left_details div").find("b").offset().top - 60 + "px" }, 500);
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
//函数拼接
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
render.prototype.spellDetail = function(obj) {
    if (obj.zs_date && !isEmpty(obj.zs_date)) {
        obj.zs_date = Qm.dateCheck(obj.zs_date, '-')
    }
    slfy = checkEle(obj.zsfy_id_content);
    var sort_id_content = checkEle(obj.sort_id_content);
    for(var i=0;i<sort_id_content.length;i++){
        if(!isEmpty(sort_id_content[i])){
            sort_id.push(sort_id_content[i])
        }
    }
    features = checkEle(obj.features);
    //文章title
    var title = isEmpty(obj.alyz_tite) ? "" : replaceBTag(obj.alyz_tite);
    document.title = title;
    collection.title = title;
    collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）
    //获取上级法院
    //先获取zsfy_id，并拆分
    var fyBox;
    if (obj.zsfy_id && !isEmpty(obj.zsfy_id)) {
        fyBox = stringToArray(obj.zsfy_id.substring(obj.zsfy_id.lastIndexOf("#") + 2))
        if (fyBox.length == 3) {
            sjfy = fyBox[1]
        } else {
            sjfy = '';
        }
    }
    // console.log(sjfy)
    this.spellLeftPage(obj);
    this.spellRightPage(obj);
    this.getSameSLFYcase();
    this.getSameSJFYcase();
    this.getSamecase();
};

//-----------------------左侧页面详情拼接-------------------------
render.prototype.spellLeftPage = function(obj) {

    //title信息
    var html = "";
    if (obj.alyz_tite && !isEmpty(obj.alyz_tite)) { //要旨标题
        html += '<h2>' + obj.alyz_tite + '</h2>'
    }
    if (obj.title && !isEmpty(obj.title)) { //案例标题
        html += '<h3>' + obj.title + '</h3>';
    }
    $(".case_main_title").html(html);

    //正文
    var detail_arr = [{ "key": "alyz_content", "value": "案例要旨" }, { "key": "fulltext", "value": "案例全文" },{"key":"fypl","value":"法律评论"}];
    html = "";
    for (var i = 0, lengD = detail_arr.length; i < lengD; i++) {
        var item = detail_arr[i];
        if (!isEmpty(obj[item.key])) {
            html += '<div class="left_item">' +
                '<h3><i></i>' + item.value + '</h3>' +
                '<div>' + obj[item.key] + '</div>' +
                '</div>';
        }

    }
    $(".left_details").html(html);
    if ($(".left_item:eq(0) h3").text().indexOf("案例要旨") != -1) {
        $(".left_item:eq(0)").addClass("case_message_item");
    }
};
//---------------------右侧页面详情拼接------------------------
render.prototype.spellRightPage = function(obj) {
    //-----------------------------基本信息拼接
    var basic_arr = [{ "key": "ajzh", "value": "案号" }, { "key": "casesort_id_content", "value": "案件类型" }, { "key": "zsfy_id_content", "value": "审理法院" }, { "key": "slcx_id_content", "value": "审理程序" }, { "key": "zs_date", "value": "裁判日期" }, { "key": "cpsxz_id_content", "value": "文书性质" }, { "key": "comefrom_id_content", "value": "案例来源" }];
    if (obj.zs_date && !isEmpty(obj.zs_date)) {
        obj.zs_date = Qm.dateCheck(obj.zs_date, '-')
    }
    var html = '';
    var li = '';
    var a = '',
        court = '',
        ajzh = '';
    //---------------------------------处理案由
    if (obj.sort_id_content && !isEmpty(obj.sort_id_content)) {
        if (typeof obj.sort_id_content == "string") {
            var newFString = obj.sort_id_content.substring(obj.sort_id_content.lastIndexOf("[") + 1, obj.sort_id_content.lastIndexOf("]"));
            var newFObj = stringToArray(newFString);
            for (var n = 0, lenLi = newFObj.length; n < lenLi; n++) {
                if (newFObj[n].lastIndexOf('<b>') != -1) {
                    var bLabel = newFObj[n].trim().replace(/<b>|<\/b>/g, "");
                    a += '<a href="javascript:void(0)" name="sort_id_content" title="' + bLabel + '"><b>' + bLabel + '</b></a>   ';
                } else {
                    a += '<a href="javascript:void(0)" name="sort_id_content" title="' + newFObj[n] + '"><b>' + newFObj[n] + '</b></a>   ';
                }
            }
        } else {
            for (var m = 0, length = obj.sort_id_content.length; m < length; m++) {
                a += '<a href="javascript:void(0)" name="sort_id_content" title="' + obj.sort_id_content[m] + '">' + obj.sort_id_content[m] + '</a>   ';
            }

        }
    }



    //其他
    for (var i = 0, lengB = basic_arr.length; i < lengB; i++) {
        var itemB = basic_arr[i];
        if (obj[itemB.key] && !isEmpty(obj[itemB.key])) {
            if (itemB.value == '案号') {
                // if(typeof obj[itemB.key])
                li += '<li>' + itemB.value + '：<a href="javascript:void(0)" name="' + itemB.key + '" title="' + obj[itemB.key] + '">' + obj[itemB.key] + '</a></li>';
            }

            //处理法院
            else if (itemB.value == '审理法院') {
                if (typeof obj[itemB.key] == "string") {
                    var newFString = obj[itemB.key].substring(obj[itemB.key].lastIndexOf("[") + 1, obj[itemB.key].lastIndexOf("]"));
                    var newFObj = stringToArray(newFString);
                    for (var n = 0, lenLi = newFObj.length; n < lenLi; n++) {
                        if (newFObj[n].lastIndexOf('<b>') != -1) {
                            var bLabel = newFObj[n].trim().replace(/<b>|<\/b>/g, "");
                            li += '<li>' + itemB.value + '：<a href="javascript:void(0)" name="zsfy_id_content" title="' + bLabel + '"><b>' + bLabel + '</b></a></li>  ';
                        } else {
                            li += '<li><a href="javascript:void(0)" name="zsfy_id_content" title="' + newFObj[n] + '"><b>' + newFObj[n] + '</b></a></li> ';
                        }
                    }
                } else {
                    li += '<li>' + itemB.value + '：<a href="javascript:void(0)" name="' + itemB.key + '" title="' + obj[itemB.key] + '">' + obj[itemB.key] + '</a></li>';
                }

            }
            // else if(itemB.value=='案例来源'){
            //     li+='<li>' + itemB.value + '：<a href="javascript:void(0)" class="ally" title="'+obj[itemB.key]+'">' + obj[itemB.key] + '</a></li>';
            // }
            else {
                li += '<li>' + itemB.value + '：<span title="' + obj[itemB.key] + '">' + obj[itemB.key] + '</span></li>';
            }
        }

    }
    //文书id去拼接，裁判文书网提示无此文书
    // var original_str=obj.uniqid;
    // var dst_str='';
    // for(var i=0;i<original_str.length;i++){
    //     dst_str+=original_str.charAt(i);
    //     if(i==7||i==11||i==15||i==19)
    //         dst_str+='-';
    // }
    // console.log(li)
    html += '<h3>基本信息</h3>' +
        '<ul><li>案由：' + a + '</li>' +
        li +
        '</ul>';
    $(".basic_item").html(html);
    //基本信息a链接点击事件
    var is = '';
    $(".basic_item").on("click", "a", function() {
        // console.log(back_data)
        click_loginVerify(); // 校验token 是否失效
        if (!click_tokenYX) return;
        //传session条件
        is = $(this).attr("name");
        var zsfy_id_content = [];
        var sort_id_content = [];
        var _is = '';
        var _text;
        var _level;
        var court;
        var m_is, m_text;
        switch (is) {
            case 'sort_id_content': // 案由
                for (var k in back_data) {
                    if (k != 'sort_id_content' && k.indexOf('sort_id') > -1 && JSON.stringify(back_data[k]).lastIndexOf($(this).text()) > -1 && k != 'casesort_id_content') {
                        // if(back_data.)
                        // console.log(k)
                        m_text = $(this).text();
                        _is = k;
                    }

                }
                if (!isEmpty(back_data.sort_id)) {
                    var sort_id_arr = back_data.sort_id.substring(back_data.sort_id.indexOf("#") + 2, back_data.sort_id.length - 1)
                    var sort_id_arr2 = sort_id_arr.split("|");
                    for (var i = 0, len = sort_id_arr2.length; i < len; i++) {
                        if (sort_id_arr2[i].indexOf($(this).text()) > -1) {
                            var sort_id_arr3 = stringToArray(sort_id_arr2[i]);
                            for (var m = 0, lenm = sort_id_arr3.length; m < lenm; m++) {
                                var _text = sort_id_arr3[m];
                                // console.log(_text)
                                var casecause = {};
                                casecause["count"] = lenm;
                                casecause["id"] = 'sort_id_' + (m + 1);
                                if (lenm != 6) {
                                    casecause["isEnd"] = false;
                                } else {
                                    casecause["isEnd"] = true;
                                }
                                casecause["level"] = m;
                                casecause["name"] = _text;
                                casecause["pid"] = "sort_id_" + m;
                                sort_id_content.push(casecause);
                                sort_id_content.sort(function(a, b) {
                                    return b.level - a.level;
                                })
                            }
                        }
                    }
                }
                sessionStorage.setItem('sort_id_content', JSON.stringify(sort_id_content));
                // console.log(sort_id_content)
                break;
            case 'zsfy_id_content': // 审理法院
                // _is = k;
                for (var k in back_data) {
                    if (k != 'zsfy_id_content' && k.indexOf('zsfy_id') > -1 && back_data[k] == $(this).text()) {
                        // console.log(k)
                        // console.log(back_data[k])
                        m_text = back_data[k].toString();
                        _is = k;
                    }

                }
                if (!isEmpty(back_data.zsfy_id)) {
                    var zsfy_id_arr = stringToArray(back_data.zsfy_id.substring(back_data.zsfy_id.indexOf("#") + 2, back_data.zsfy_id.length - 1))
                    for (var m = 0, lenm = zsfy_id_arr.length; m < lenm; m++) {
                        var _text = zsfy_id_arr[m];
                        var court = {};
                        court["count"] = lenm;
                        court["id"] = 'zsfy_id_' + (m + 1);
                        if (lenm != 3) {
                            court["isEnd"] = false;
                        } else {
                            court["isEnd"] = true;
                        }
                        court["level"] = m;
                        court["name"] = _text;
                        court["pid"] = "zsfy_id_" + m;
                        zsfy_id_content.push(court);
                        zsfy_id_content.sort(function(a, b) {
                            return b.level - a.level;
                        })
                    }
                }
                sessionStorage.setItem('zsfy_id_content', JSON.stringify(zsfy_id_content));
                // console.log(zsfy_id_content)
                break;
            case 'ajzh': //案号
                _is = 'ajzh';
                m_text = $(this).text();
                break;
            default:
                // statements_def
                break;
        }

        var news = {};
        news["condition"] = {};
        news["condition"][_is] = m_text;
        news["name"] = m_text;
        news["cType"] = "or";
        news["elementType"] = _is;
        sessionStorage.setItem('stackCache', JSON.stringify([news]));
        if (is.lastIndexOf('zsfy_id') != -1 || is.lastIndexOf('sort_id') != -1) {
            sessionStorage.setItem('stackCache', JSON.stringify([]));
            sessionStorage.setItem('CacheV', JSON.stringify([news]));
        } else {
            sessionStorage.setItem('stackCache', JSON.stringify([news]));
            // Qm.removeSession("zsfy_id_content");
            // Qm.removeSession("sort_id_content");
        }

        if (window.localStorage.getItem('Token')) {
            window.open('./result.html?token=' + window.localStorage.getItem('Token'));
        } else {
            window.open('./result.html');
        }
        if (sessionStorage.getItem('CacheV') != undefined) {
            Qm.removeSession("CacheV");
        }
        if (sessionStorage.getItem('stackCache') != undefined) {
            Qm.removeSession("stackCache");
        }
        if (sessionStorage.getItem('zsfy_id_content') != undefined) {
            Qm.removeSession("zsfy_id_content");
        }
        if (sessionStorage.getItem('sort_id_content') != undefined) {
            Qm.removeSession("sort_id_content");
        }
        // Qm.removeSession("CacheV");
        // Qm.removeSession("stackCache");
        // Qm.removeSession("zsfy_id_content");
        // Qm.removeSession("sort_id_content");
    });

    // //案例来源点击事件
    // $(".basic_item").on("click","a.ally",function (e) {
    //     window.open("index.html");
    //     e.stopPropagation();
    // });
    //-----------------------------------------不利因素
    html = '';
    var li = '';
    var badfactorBox;
    // console.log(obj)
    if (obj.badfactor_id_content && !isEmpty(obj.badfactor_id_content)) {
        if (obj.badfactor_id_content == "无") {
            li += '<li>' + obj.badfactor_id_content + '</li>';
        } else {
            if (obj.badfactor_id && !isEmpty(obj.badfactor_id)) {
                //数据处理，截取#后边数据
                badfactorBox = obj.badfactor_id.substring(obj.badfactor_id.lastIndexOf("#") + 1).split("|")
                // 如果有空元素就清掉
                for (var i = 0, len = badfactorBox.length; i < len; i++) {
                    if (isEmpty(badfactorBox[i])) {
                        badfactorBox.splice(i, 1)
                    }
                }
                //重新遍历循环，替换，为：
                for (var m = 0, len = badfactorBox.length; m < len; m++) {
                    if (badfactorBox[m].indexOf(",") != -1) {
                        badfactorBox[m] = badfactorBox[m].replace(",", " ：")
                    }
                    li += '<li>' + badfactorBox[m] + '</li>'
                }
            }
        }
        html += '<h3>不利因素</h3>' +
            '<ul>' + li + '</ul>';
    }
    $(".adverse_item").html(html);


    //-----------------------法信码
    if (obj.faxin_code_path && !isEmpty(obj.faxin_code_path)) {
        var array = obj.faxin_code_path[0].split("$");
        var a = '';
        html = '';
        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] == "" || typeof(array[i]) == "undefined") {
                array.splice(i, 1);
            }
        }
        for (var k = 0; k < array.length; k++) {
            a += '<a target="_blank" href="fxmDetails.html?id=' + array[k].substring(array[k].indexOf("|") + 1) + '">' + array[k].substring(0, array[k].indexOf("|")) + '</a> <i style="padding:0 5px;">|</i> ';
        }
        html += '<h3>法信码路径</h3>' +
            '<p>' + a + '</p>';
    }
    $(".fxm_item").html(html);
    $(".fxm_item p i:last-child").remove()
};




//---------------------该院同类案例---------------------------

render.prototype.getSameSLFYcase = function() {
    if (isEmpty(slfy)) {
        $(".same_type_item1").html('<h3>该院同类案例</h3><p class="nothing">暂无信息</p>')
    } else {
        var url = ip + '/witnet/search/document';
        var param = {
            "condition": {
                "andcondition": {
                    "zsfy_id_content": slfy,
                    "sort_id_content": sort_id
                }
            },
            "type": 'alyz',
            "from": 0,
            "size": 4
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
                    // console.log(res)
                    if (res.count > '1') {
                        var data = JSON.parse(res.result);
                        // console.log(data);
                        if (res.count > 3) {
                            _this.spellSameSLFYpage(data);
                            //点击换一换
                            $(".same_type_item1").on("click", ".changeBtn", function() {
                                var dataReturn = _this.changeContent(param, url)
                                _this.spellSameSLFYpage(dataReturn);
                            })
                        } else {
                            _this.spellSameSLFYpage(data);
                            $(".same_type_item1 .changeBtn").hide()
                        }
                    } else {
                        $(".same_type_item1").html('<h3>该院同类案例</h3><p class="nothing">暂无信息</p>')
                    }
                }

                ,
            error: function(error) {
                // console.log(error);
            }
        })
    }
    // }
}
//-------------------同法院相似案例拼接
render.prototype.spellSameSLFYpage = function(obj) {
    var html = '';
    var li = '';
    var arr = [];

    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i].uniqid != uniqID) {
            arr.push(obj[i])
            if (arr.length >= 3) {
                break
            } else {
                continue;
            }
        }

    }
    if (arr.length == 0) {
        html += '<h3>该院同类案例</h3>' +
            '<p class="nothing">暂无信息</p>';
    } else {
        for (var k = 0, lenSa1 = arr.length; k < lenSa1; k++) {
            if (arr[k].title && !isEmpty(arr[k].title)) {
                li += '<li><i></i><a target="_blank" href="alyzDetails.html?uniqid=' + arr[k].uniqid + '&type=' + Request2("type") + '&flag=0&title='+encodeURI(encodeURI(arr[k].title))+'" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[k].title + '</a></li>';
            }

        }
        html += '<h3>该院同类案例</h3>' +
            '<a href="javascript:void (0);" class="changeBtn">换一换</a>' +
            '<ul>' +
            li +
            '</ul>';
        $(".same_type_item1").html(html);
    }
};

//--------------------------上级法院同类案例-----------------------------

render.prototype.getSameSJFYcase = function() {
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "andcondition": {
                "zsfy_id_content": sjfy,
                "sort_id_content": sort_id
            }
        },
        "type": 'alyz',
        "from": 0,
        "size": 4
    };
    var _this = this;
    if (isEmpty(sjfy)) {
        var html = '';
        html += '<h3>上级法院同类案例</h3>' +
            '<p class="nothing">暂无信息</p>';
        $(".same_type_item2").html(html);
    } else {
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
                    if (res.count > 3) {
                        _this.spellSameSJFYpage(data);
                        //点击换一换
                        $(".same_type_item2").on("click", ".changeBtn", function() {
                            var dataReturn = _this.changeContent(param, url)
                            _this.spellSameSJFYpage(dataReturn);
                        })
                    } else {
                        _this.spellSameSJFYpage(data);
                        $(".same_type_item2 .changeBtn").hide()
                    }

                } else {
                    $(".same_type_item2").html('<h3>上级法院同类案例</h3><p class="nothing">暂无信息</p>');
                }
            },
            error: function(error) {
                // console.log(error);
            }
        })
    }
};

//------------------拼接上级法院同类案例
render.prototype.spellSameSJFYpage = function(obj) {
    var html = '';
    var li = '';
    var arr = [];
    for (var i = 0, lenS2 = obj.length; i < lenS2; i++) {
        if (obj[i].uniqid != uniqID) {
            arr.push(obj[i])
            if (arr.length >= 3) {
                break
            } else {
                continue;
            }
        }
    }
    if (arr.length == 0) {
        html += '<h3>上级法院同类案例</h3>' +
            '<p class="nothing">暂无信息</p>';
    } else {
        for (var k = 0, lenSa2 = arr.length; k < lenSa2; k++) {
            if (arr[k].title && !isEmpty(arr[k].title)) {
                li += '<li><i></i><a target="_blank" href="alyzDetails.html?uniqid=' + arr[k].uniqid + '&type=' + Request2("type") + '&flag=0&title='+encodeURI(encodeURI(arr[k].ttile))+'" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[k].title + '</a></li>';
            }
        }
        html += '<h3>上级法院同类案例</h3>' +
            '<a href="javascript:void (0);" class="changeBtn">换一换</a>' +
            '<ul>' +
            li +
            '</ul>';
        $(".same_type_item2").html(html);

    }

};


//--------------------------相关案例-----------------------------

render.prototype.getSamecase = function() {
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "orcondition": {
                "features": features,
                "sort_id_content": sort_id
            }
        },
        "type": 'alyz',
        "from": 0,
        "size": 4
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
            if (res.count > '1') {
                // console.log(res)
                var data = JSON.parse(res.result);
                // console.log(data)
                if (res.count > 3) {
                    _this.spellSamepage(data);
                    //点击换一换
                    $(".related_item").on("click", ".changeBtn", function() {
                        var dataReturn = _this.changeContent(param, url)
                        _this.spellSamepage(dataReturn);
                    })
                } else {
                    _this.spellSamepage(data);
                    $(".related_item .changeBtn").hide()
                }

            } else {
                $(".related_item").html('<h3>相关案例</h3><p class="nothing">暂无信息</p>');
            }
        },
        error: function(error) {
            // console.log(error);
        }
    })

};

//------------------拼接相关案例
render.prototype.spellSamepage = function(obj) {
    var html = '';
    var li = '';
    var arr = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        if (obj[i].uniqid != uniqID) {
            arr.push(obj[i])
            if (arr.length >= 3) {
                break
            } else {
                continue;
            }
        }
    }
    if (arr.length == 0) {
        html += '<h3>相关案例</h3>' +
            '<p class="nothing">暂无信息</p>';
    } else {
        for (var k = 0; k < arr.length; k++) {
            if (arr[k].title && !isEmpty(arr[k].title)) {
                li += '<li><i></i><a target="_blank" href="alyzDetails.html?uniqid=' + arr[k].uniqid + '&type=' + Request2("type") + '&flag=0&title='+encodeURI(encodeURI(arr[k].title))+'" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[k].title + '</a></li>';
            }
        }
        html += '<h3>相关案例</h3>' +
            '<a href="javascript:void (0);" class="changeBtn">换一换</a>' +
            '<ul>' +
            li +
            '</ul>';
        $(".related_item").html(html);
    }
};


//---------------------换一换-------------------
render.prototype.changeContent = function(param, url) {
    param["from"] += 3;
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
            if (data.length < 4) {
                param["from"] = -3;
            }
        },
        error: function(error) {
            // console.log(error)
        }
    });
    return data;
};

var Render = new render();
Render.getDocumentData();

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