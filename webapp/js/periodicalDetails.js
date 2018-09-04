// 下载
/*$('#main').on('click','.download_btn', function() {
    window.open(ip + '/witnet/search/downloadDocument?uniqid=' + Request2("uniqid") + '&type=qk')
})*/

var userid = '';
if (window.localStorage.getItem('UserInfo')) {
    userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
}
var pdf_path='';
//期刊详情
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
                // console.log(data);
                _this.spellPointsDetail(data);
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
    pdf_path=obj.pdf_cn_path;
    collection.title = title;
    collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）
    var html = '';
    //-------------------------基本信息
    //标题
    if (obj.title && !isEmpty(obj.title)) {
        $(".main_title h2").html(obj.title);
    }
    //关键词

    !isEmpty(obj.comefrom_text) ? html += '<span>' + obj.comefrom_text + '</span>' : '';
    !isEmpty(obj.qk_sort_id_content) ? html += '<span>' + obj.qk_sort_id_content + '</span>' : '';
    !isEmpty(obj.keyword_cn) ? html += '<span>' + obj.keyword_cn + '</span>' : '';
    $(".keywords_box").html(html);
    $(".keywords_box").find('span:last-child').css("border", "none");
    var periodical_box = [{ 'key': 'kanming_id', 'val': '期刊名称' }, { 'key': 'sort_id', 'val': '学科分类' }, { 'key': 'author_unit', 'val': '作者单位' }, { 'key': 'author', 'val': '作者' }];
    html = '';
    var li = '';
    //基本信息
    for (var i = 0, len = periodical_box.length; i < len; i++) {
        var item = periodical_box[i];
        if (obj[item.key] && !isEmpty(obj[item.key])) {
            // if(item.val=='期刊名称'||item.val=='学科分类'){
            if (obj[item.key].indexOf("#") != -1) {
                var s = obj[item.key].substring(obj[item.key].indexOf('#') + 2, obj[item.key].length - 1);
                if (!isEmpty(s)) {
                    if (s.indexOf("|")) {
                        s = s.replace("|", ",")
                        li += '<li>' + item.val + '：<span>' + s + '</span></li>';
                    } else {
                        li += '<li>' + item.val + '：<span>' + s + '</span></li>';
                    }
                }
            } else {
                li += '<li>' + item.val + '：<span>' + obj[item.key] + '</span></li>';
            }
            // }
            // else{
            //     li+='<li>'+item.val+'：<span>'+obj[item.key]+'</span></li>';
            // }
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
        html += '<p>' + obj.fulltext + '</p>';
    }else{
        if(obj.pdf_cn_path &&!isEmpty(obj.pdf_cn_path)){
            html+='<a class="downloadPdf" target="_blank" style="font-weight: 800;font-size: 18px;color: #0086dd;cursor: pointer;">下载PDF查看全文</a>';
        }else{
            html+='<div class="none"">' +
                '    <img src="../images/none.png" alt="" />' +
                '    <span class="img_text">详情页内容为空</span>' +
                '</div>'
        }
    }
    $(".content_box").html(html);
    $(".content_box").on("click",".downloadPdf",function () {
        var token='';
        // var url = 'http://192.168.10.186:8080' + '/witnet/search/getEncryptData';
        var url = ip + '/witnet/search/getEncryptData';
        if (window.localStorage.getItem('Token')) {
            token= window.localStorage.getItem('Token');
            var cip=returnCitySN.cip;
            var sendTime=new Date().getTime();
            var param= {
                "cipherText": "userid=" + userid + "&token=" + token + "&sendtime=" + sendTime + "&timeout=300&ip=" + cip + "&filepath=" + pdf_path,
                "secretKey" : "T5aM7o0Spk3Mvl9L",
                "iv": "UISwD9fW6cFh9SNS",
                "hexString" :false,
                "strategy" : "CBC"
            };
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(param),
                async: true,
                dataType: 'json',
                contentType: "application/json",
                beforeSend: function() {
                    $('.shadow').fadeIn();
                },
                success: function(res) {
                    $('.shadow').fadeOut();
                    if(!isEmpty(res.result)){
                        window.open("http://img.faxin.cn/fz_download_file.aspx?where="+res.result)
                    }
                },
                error: function(error) {
                    // console.log(error)
                }
            });
        }else{
            $(".tip_shadow").show()
        }
    })
};
var Render = new render();
Render.getDocumentData();