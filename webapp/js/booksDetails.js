// 下载
/*$('#main').on('click', '.download_btn', function() {
    window.open(ip + '/witnet/search/downloadDocument?uniqid=' + Request2("uniqid") + '&type=ts')
})*/

var type = '';
var uniqID = Request2('uniqid');
var arr = ["xzzd", "flfg", "alyz", "cpws", "flgd", "ts", "qk", "fxm"];
type = arr[Request2("type")];
var isLogin = 0;
var author = '';
var flts_sort = '';
var subject_dh= '';
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
// var conditionBox = [];
// var condition = {};
// var ctype='';
// if (!isEmpty(session)) {
//     for (var i = 0, leni = session.length; i < leni; i++) {
//         conditionBox.push(session[i].condition)
//         // console.log(conditionBox)
//         // ctype=session[i].cType;
//     }
//     for (var k = 0, len = conditionBox.length; k < len; k++) {
//         for (var key in conditionBox[k]) {
//             if (condition[key] != undefined) {
//                 condition[key].push(conditionBox[k][key][0]);
//             } else {
//                 condition[key] = [];
//                 if (typeof conditionBox[k][key] == 'string') {
//                     condition[key].push(conditionBox[k][key]);
//                 } else {
//                     condition[key].push(conditionBox[k][key][0]);
//                 }
//             }
//         }
//     }
// }
//判断userId是否存在
var render = function() {

};
//---------------------------获取图书信息数据-----------------------------------
render.prototype.getBookDetails = function() {
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
            // console.log(res)
            if (res.result == '') {
                $('.shadow').fadeOut();
                $(".funtags").addClass("hide");
                $(".main ").addClass("hide");
                $(".none").find('span').text('详情页内容为空');
                $(".none").fadeIn();
                return;
            }
            var data = JSON.parse(res.result);
            // console.log(data)
            // // 截取fullText字数
            // // var fullText = data.fulltext;
            // // // console.log(fullText)
            // // if (data.fulltext && data.fulltext.length > 0) {
            // //     var hide_h5 = '<h5 id="hide_h5" style="display:none;position:absolute;left:9999px;">' + fullText + '</h5>';
            // //     $('body').append(hide_h5)
            // //     data.zishu = $('#hide_h5').text().replace(/<!--page=[0-9]+-->|\s|\$/g, '').length;
            //     // console.log($('#hide_h5').text().replace(/<!--page=[0-9]+-->|\s|\$/g, ''));
            //     // console.log(data.zishu);
            //     // 方法二 保留
            //     /*console.log(data.fulltext.match(/[\u4e00-\u9fa5]+/g))
            //     var arr = data.fulltext.match(/[\（\）\《\》\——\；\，\。\“\”\<\>\！\u4e00-\u9fa5]+/g);
            //     var num = 0;
            //     for (var i = 0; i < arr.length; i++) {
            //         num += arr[i].length
            //     }
            //     console.log(num)*/
            // // } else {
            // //     data.zishu = 0;
            // // }

            _this.spellBooksDetail(data);
        },
        error: function(error) {
            // console.log(error);
            $('.shadow').fadeOut();
            $(".funtags").addClass("hide");
            $(".main ").addClass("hide");
            $(".none").find('span').text('404，页面跑丢了');
            $(".none").fadeIn();
        }
    });
};

//-------------------------拼接图书介绍详情
render.prototype.spellBooksDetail = function(obj) {
    author = isEmpty(obj.book_author) ? '' : replaceBTag(obj.book_author);
    flts_sort = isEmpty(obj.flts_sort) ? '' : obj.flts_sort
    subject_dh = isEmpty(obj.subject_dh) ? '' : obj.subject_dh
    var title = isEmpty(obj.book_title) ? "" : replaceBTag(obj.book_title);
    document.title = title;
    collection.title = title;
    collection.getUserID(); // 校验是否已收藏 （从localStorage中获取用户信息）
    this.spellBooksLeft(obj);
    this.spellBooksRight(obj);
};

//--------------------拼接左侧详情
render.prototype.spellBooksLeft = function(obj) {
    //图书封面图片
    var fengmian_path = '';
    if (obj.fengmian_pic_path && !isEmpty(obj.fengmian_pic_path)) {
        if (obj.fengmian_pic_path.indexOf('upload') > -1) {
            fengmian_path = obj.fengmian_pic_path.substring(obj.fengmian_pic_path.indexOf('upload') + 6);
        }
        $(".img_box img").attr('src', 'http://img.faxin.cn' + fengmian_path);
    }

    //拼接图书基本信息
    var bookArr = [{ 'key': 'book_author', 'val': '作者' }, { 'key': 'publish_dh', 'val': '出版社' },
        { 'key': 'publish_date', 'val': '出版日期' }, { 'key': 'page_all_num', 'val': '图书页数' }, //publish_year
        { 'key': 'fulltext_len', 'val': '字数' }, { 'key': 'book_sn', 'val': 'ISBN' }
    ];

    var html = '',
        li = '',
        h2 = '';

    //图书标题
    if (obj.book_title && !isEmpty(obj.book_title)) {
        h2 += '<h2>' + obj.book_title + '</h2>'
    }

    //图书基本信息
    if (obj.publish_date && !isEmpty(obj.publish_date)) {
        obj.publish_date = Qm.dateCheck(obj.publish_date, '-');
    }
    for (var i = 0, lenbook = bookArr.length; i < lenbook; i++) {
        var item = bookArr[i];
        if (obj[item.key] && !isEmpty(obj[item.key])) {
            li += '<li>' + item.val + '：' + obj[item.key] + '</li>';
        }
    }
    if (obj.flts_zt && !isEmpty(obj.flts_zt)) {
        if (obj.flts_sort && !isEmpty(obj.flts_sort)) {
            html += h2 +
                '<ul>' + li + '</ul>' +
                '<div class="other_box trans">' +
                '    <span class="book_collect_btn"><i></i></span>' +
                // '    <input type="button" value="原版阅读" class="olderBtn">' +
                '    <input type="button" value="文本阅读" class="txtBtn">' +
                '    <input type="button" value="' + obj.flts_sort + '专题" class="ztBtn">' +
                '</div>';
        }
    } else {
        html += h2 +
            '<ul>' + li + '</ul>' +
            '<div class="other_box trans">' +
            '    <span class="book_collect_btn"><i></i></span>' +
            // '    <input type="button" value="原版阅读" class="olderBtn">' +
            '    <input type="button" value="文本阅读" class="txtBtn">' +
            '</div>';
    }
    $(".basic_box").html(html);

    $(".basic_box").on("click", ".txtBtn", function() {
        click_loginVerify(); // 校验token 是否失效
        if (!click_tokenYX) return;
        window.open('./textDetails.html?uniqid=' + uniqID + '&type=' + Request2("type") + '&title=' + encodeURI(encodeURI(obj.book_title)))
    })
    //内容简介
    //判断是否为空，不为空拼接html
    html = '';
    if (obj.tushu_miaoshu && !isEmpty(obj.tushu_miaoshu)) {
        html += ' <h3>内容简介</h3>' +
            '<p>' + obj.tushu_miaoshu + '</p>';
    }
    $(".book_brief").html(html);


};
//------------------------------拼接右侧详情-------------------------------
render.prototype.spellBooksRight = function() {
    this.getAuthorBooks();
    this.getSametypeBooks();
};


//-----------------------作者其他图书
render.prototype.getAuthorBooks = function() {
    // console.log(author)
    var author_name = '';
    // String[] filterWords = {" 主编", " 编","主编", "编"," 编著","（主编）"," 等著","著"};  // 后台es库
    // 前端正则                          "（主编）"  |     " 主编"         |        " 编著"      |     " 编"      |     " 等著"          |      " 著"
    author_name = author.replace(/\（\u4e3b\u7f16\）|[\u0020]+\u4e3b\u7f16|[\u0020]+\u7f16\u8457|[\u0020]+\u7f16|[\u0020]+\u7b49\u8457|[\u0020]+\u8457/g, '')
    author_name = author_name.replace(/[\，|\； |\、|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, " ");
    // console.log(author_name);


    var _this = this;
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "andcondition": {
                "book_author": author_name,
            }
        },
        "type": "ts",
        "from": 0,
        "size": 6
    };
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        datatype: 'json',
        contentType: "application/json",
        success: function(res) {
            // console.log(res)
            // console.log(JSON.parse(res.result))
            if (res.count == '1' || res.count == '0') {
                $(".author_books").html("<h3>作者其他图书</h3><p class='nothing'>暂无信息</p>");
            } else {
                var data = JSON.parse(res.result);
                if (res.count > 3) {
                    // console.log(data)
                    _this.spellAuthorBooks(data);
                    //点击换一换
                    $(".author_books ").on("click", ".changeBtn", function() {
                        var dataReturn = _this.changeContent(param, url)
                        _this.spellAuthorBooks(dataReturn);
                    })
                } else {
                    _this.spellAuthorBooks(data);
                    $(".author_books .changeBtn").hide()
                }



            }
        }
    })
};
// 拼接作者其他图书
render.prototype.spellAuthorBooks = function(obj) {
    var li = '',
        html = '';
    var arr = [];
    for (var i = 0, len2 = obj.length; i < len2; i++) {
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
        html += '<h3>作者其他图书</h3>' +
            '<p class="nothing">暂无信息</p>';
    } else {
        var fengmian_path = '';
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].fengmian_pic_path && !isEmpty(arr[i].fengmian_pic_path)) {
                if (arr[i].fengmian_pic_path.indexOf('upload') > -1) {
                    fengmian_path = 'http://img.faxin.cn' + arr[i].fengmian_pic_path.substring(arr[i].fengmian_pic_path.indexOf('upload') + 6)
                }
            } else {
                fengmian_path = '../images/book_pic.png';
            }
            li += '<li><i></i>' +
                '<a href="./booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title))+'" target="_blank" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[i].book_title + '</a>' +
                '<div class="books_info hide clearfix">' +
                '<div class="books_img fl" onclick="click_loginVerify();if(!click_tokenYX) return ; window.open(\'' + './booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title)) + '\')">' +
                // '<img src="'+arr[i].fengmian_pic_path+'" alt="">'+
                '<img src="' + fengmian_path + '" alt="" style="cursor: pointer">' +
                '</div>' +
                '<a href="./booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title))+'" target="_blank" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[i].book_title + '</a>' +
                '<div class="fr" style="width: 170px;">' +
                '<span>[著]' + arr[i].book_author + '</span><span>' + arr[i].publish_dh + '</span><span>' + arr[i].publish_year + '</span>' + //Qm.dateCheck(arr[i].publish_date, '-')
                '</div>' +
                '</div>' +
                '</li>';
        }
        html += '<h3>作者其他图书</h3>' +
            '<a href="javascript:void (0);" class="changeBtn">换一换</a>' +
            '<ul>' + li + '</ul>';
        $(".author_books").html(html);
    }
};

//--------------------------同类型图书
render.prototype.getSametypeBooks = function() {
    var _this = this;
    var url = ip + '/witnet/search/document';
    var param = {
        "condition": {
            "andcondition": {
                "subject_dh": subject_dh,
            }
        },
        "type": "ts",
        "from": 0,
        "size": 6
    };
    jQuery.support.cors = true;
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(param),
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {

            if (res.count != '0' || !isEmpty(res.result)) {
                var data = JSON.parse(res.result);
                // console.log(data);
                if (res.count > 5) {
                    _this.spellSametypeBooks(data);
                    //点击换一换
                    $(".same_type_books").on("click", ".changeBtn", function() {
                        var dataReturn = _this.changeContent(param, url)
                        _this.spellSametypeBooks(dataReturn);
                    })
                } else {
                    _this.spellSametypeBooks(data);
                    $(".same_type_books .changeBtn").hide()
                }

            } else {
                $(".same_type_books").html("<h3>同类型图书</h3><p class='nothing'>暂无信息</p>");

            }
        },
        error: function(error) {
            // console.log(error);
        }
    })
};
render.prototype.spellSametypeBooks = function(obj) {
    var li = '',
        html = '';
    var arr = [];
    for (var i = 0, len2 = obj.length; i < len2; i++) {
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
        html += '<h3>同类型图书</h3>' +
            '<p class="nothing">暂无信息</p>';
    } else {
        var fengmian_path = '';
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].fengmian_pic_path && !isEmpty(arr[i].fengmian_pic_path)) {
                if (arr[i].fengmian_pic_path.indexOf('upload') > -1) {
                    fengmian_path = 'http://img.faxin.cn' + arr[i].fengmian_pic_path.substring(arr[i].fengmian_pic_path.indexOf('upload') + 6)
                }
            } else {
                fengmian_path = '../images/book_pic.png';
            }
            li += '<li><i></i>' +
                '<a href="./booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title))+'" target="_blank" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[i].book_title + '</a>' +
                '<div class="books_info hide clearfix">' +
                '<div class="books_img fl" onclick="click_loginVerify();if(!click_tokenYX) return ;window.open(\'' + './booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title)) + '\')">' +
                // '<img src="'+arr[i].fengmian_pic_path+'" alt="">'+
                '<img src="' + fengmian_path + '" alt="" style="cursor: pointer">' +
                '</div>' +
                '<a href="./booksDetails.html?uniqid=' + arr[i].uniqid + '&type=5&flag=0&title='+encodeURI(encodeURI(arr[i].book_title))+'" target="_blank" onclick="click_loginVerify();if(!click_tokenYX) return ; ">' + arr[i].book_title + '</a>' +
                '<div class="fr" style="width: 170px;">' +
                '<span>[著] ' + arr[i].book_author + '</span><span>' + arr[i].publish_dh + '</span><span>' + arr[i].publish_year + '</span>' + //Qm.dateCheck(arr[i].publish_date, '-')
                '</div>' +
                '</div>' +
                '</li>';
        }
        html += '<h3>同类型图书</h3>' +
            '<a href="javascript:void (0)" class="changeBtn">换一换</a>' +
            '<ul>' + li + '</ul>';
        $(".same_type_books").html(html);
    }
};
$(".same_type_item").on("mouseenter", "ul li>a", function() {
    $(this).addClass("hide");
    $(this).siblings(".books_info").removeClass("hide");
});
$("body").on("mouseleave", ".same_type_item .books_info", function() {
    $(this).addClass("hide");
    $(this).siblings("a").removeClass("hide");
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
            if (data.length < 5) {
                param["from"] = -5;
            }
            // return data;
        },
        error: function(error) {
            // console.log(error)
        }
    });
    return data;
};

//点击收藏
//先判断是否登录，再判断是否收藏
//

var Render = new render();
Render.getBookDetails();