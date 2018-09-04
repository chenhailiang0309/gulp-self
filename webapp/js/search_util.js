/**
 * 工具类
 */
var Utils = {
    // 阻止事件冒泡兼容
    stopPropagation: function(e) {
        e = window.event || e;
        if (document.all) { //只有ie识别
            e.cancelBubble = true;
        } else {
            e.stopPropagation();
        }
    },
    //去除两端空格
    trim: function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //截取地址栏参数
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        // var gg =decodeURI(r[2]);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    // 取文件名 带后缀
    getFileName: function(filepath) {
        if (filepath != "") {
            var names = filepath.split("\\");
            return names[names.length - 1];
        }
    },
    // 取文件后缀名
    getFileExt: function(filepath) {
        if (filepath != "") {
            var pos = "." + filepath.replace(/.+\./, "");
            return pos;
        }
    },
    // 日期格式化
    formatDate: function(obj) { //2017-12-02 10:10:10
        var date = new Date(obj);
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);

        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    },
    /**
     * 使用循环的方式判断一个元素是否存在于一个数组中
     * @param {Object} arr 数组
     * @param {Object} value 元素值
     */
    isInArray: function(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value === arr[i]) {
                return true;
            }
        }
        return false;
    },
    /**
     * 能区分IE版本
     * 无法判断IE11
     * Edge被检测为Chrome
     *
     */
    myBrowser: function() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
        if (isIE) {
            var IE5 = IE55 = IE6 = IE7 = IE8 = IE9 = IE10 = IE11 = false;
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            IE55 = fIEVersion == 5.5;
            IE6 = fIEVersion == 6.0;
            IE7 = fIEVersion == 7.0;
            IE8 = fIEVersion == 8.0;
            IE9 = fIEVersion == 9.0;
            IE10 = fIEVersion == 10.0;
            IE11 = fIEVersion == 11.0;
            if (IE55) {
                return "IE55";
            }
            if (IE6) {
                return "IE6";
            }
            if (IE7) {
                return "IE7";
            }
            if (IE8) {
                return "IE8";
            }
            if (IE9) {
                return "IE9";
            }
            if (IE10) {
                return "IE10";
            }
            if (IE11) {
                return "IE11";
            }
        } //isIE end
        if (isEdge) {
            return "Edge";
        }
        if (isFF) {
            return "FF";
        }
        if (isOpera) {
            return "Opera";
        }
        if (isSafari) {
            return "Safari";
        }
        if (isChrome) {
            return "Chrome";
        }
    }
}


/**
 * 搜索
 */
var Search = {
    type: 'key', // 默认 文本搜索
    file_cache: '', // 缓存文件名
    file_stream_cache: '', // 缓存文件流
    fileBackData: {}, // 文件返回的数据
    session_val: [], // session 缓存条件组
    // A1、全局关键字搜索
    getType: function(val) {
        //判断关键词/问题
        //取空格区分，左右均小于5长度，为关键词，否则为问题
        //
        var typeV = "and";
        if (val.lastIndexOf(' ') != -1) {
            var valIndex = val.split(' ');
            for (var i = 0, lenI = valIndex.length; i < lenI - 1; i++) {
                if (valIndex[i].length > 4 || valIndex[i + 1].length > 4) {
                    typeV = "or";
                    break;
                }
            }
        } else {
            typeV = "or";
        }
        return typeV;
    },
    key: function() {
        var val = Utils.trim($('#search_inp').val());
        if (!val) return;

        var Index = store.getSession('Index');

        var session_val = {
            name: val,
            condition: {
                commonfields: [val]
            },
            elementType: 'commonfields'
        };

        var typeV = this.getType(val);
        session_val["cType"] = typeV == "or" ? "or" : "and";

        this.all_pass_condition(val, session_val, typeV, 'commonfields', Number(Index));
        /*   var Index = store.getSession('Index');

           var session_val = {
               name: val,
               condition: {
                   commonfields: [val]
               },
               elementType: 'commonfields',
               cType: "and"
           };
           this.all_pass_condition(val, session_val, "and", 'commonfields', Number(Index));*/
    },
    // A2、结果中关键字搜索
    result: function() {
        var val = Utils.trim($('#search_inp').val());
        if (!val) return;

        var session_val = {
            name: val,
            condition: {
                commonfields: [val]
            },
            elementType: 'commonfields'
        };
        var typeV = this.getType(val);
        // session_val["cType"] = typeV == "or" ? "or" : "and";
        session_val["cType"] = typeV == "or" ? "and" : "and";

        var Index = store.getSession('Index');
        this.result_pass_condition(val, session_val, session_val["cType"], 'commonfields', Number(Index));
        /* var session_val = {
             name: val,
             condition: {
                 commonfields: [val]
             },
             elementType: 'commonfields',
             cType: "and"
         };

         var Index = store.getSession('Index');
         this.result_pass_condition(val, session_val, "and", 'commonfields', Number(Index));*/
    },
    // B1、全局以文检索
    file: function() {
        // console.log(this.file_cache);
        // console.log(this.file_stream_cache);

        this.all_pass_condition(Search.fileBackData.name, Search.fileBackData, "or", 'file', 3);
    },
    // B2、结果中以文检索
    file_R: function() {
        this.result_pass_condition(Search.fileBackData.name, Search.fileBackData, "or", 'file', 3);
    },
    // C、下拉框搜索
    drop: function(type, val) {
        switch (type) {
            // 法规
            case 'law':
                var session_val = {
                    name: val,
                    condition: {
                        title: [val]
                    },
                    elementType: 'title',
                    cType: "and"
                };
                // console.log(session_val);
                this.all_pass_condition(val, session_val, "and", 'title', 1);
                break;

                // 问答
            case 'qa':
                var session_val = {
                    name: val,
                    condition: {
                        // Question: [val]
                        typ_question: [val]
                    },
                    // elementType: 'Question',
                    elementType: 'typ_question',
                    cType: "and"
                };
                // console.log(session_val);
                // this.all_pass_condition(val, session_val, "and", 'Question', 0);
                this.all_pass_condition(val, session_val, "and", 'typ_question', 0);
                break;
            default:
                break;
        }
    },
    //全文搜索传值
    all_pass_condition: function(val, session_val, relation, type, Index) {
        $(".search_inp").val(''); // 清空搜索框

        store.setSession('stackCache', [session_val]); //全文搜索  覆盖session 只有一个条件

        if (this.judge_cur_page() == 'result') { // 结果页
            wisdom.stackCache = [];
            wisdom.sCacheS = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]; //副条件组
            $('.main_top .trans').remove(); //只有全文搜索有
            wisdom.getElement(val, session_val.condition, relation, type);
            wisdom.pageManage("", "", "search");
        } else if (this.judge_cur_page() == 'details') { // 详情页

            window.location.href = './result.html';
        }
        store.setSession("Index", Index);
        wisdom.tabIndex = Index;
    },
    //结果中搜索传值
    result_pass_condition: function(val, session_val, relation, type, Index) {
        $(".search_inp").val(''); // 清空搜索框

        var stackCache = [];
        if (window.sessionStorage.getItem('stackCache')) {
            // 先获取session中的条件  Object
            stackCache = JSON.parse(store.getSession('stackCache'));
            stackCache.push(session_val);

        } else {
            stackCache = [session_val];
        }

        store.setSession('stackCache', stackCache); //结果中搜索 追加条件

        if (this.judge_cur_page() == 'result') { // 结果页
            wisdom.getElement(val, session_val.condition, relation, type);
            wisdom.pageManage("", "", "search");
        } else if (this.judge_cur_page() == 'details') { // 详情页
            window.location.href = './result.html';
        }

        store.setSession("Index", Index);
        wisdom.tabIndex = Index;
    },
    //显示文件名
    showFilename: function() {
        $('#filename').text(this.file_cache);
        $('#filename').attr('title', this.file_cache);
        $('#filename-wrapper-js').show();
    },
    //隐藏文件名
    hideFilename: function() {
        this.type = 'key'; //重置为关键字搜素
        $('#search_inp').val(''); // 清空搜索文本框 
        // 清空 文件 缓存  ！！！避免执行$('#upFile').val('')时  chang事件中的程序 再次执行
        this.file_cache = '';
        this.file_stream_cache = '';
        Search.fileBackData = {}; //重置 文件返回条件
        this.reset_Input_File(); //重新生成上传控件

        // 清空文件 上传同个文件 不执行change事件  
        // $('#upFile').val('');

        $('#filename-wrapper-js').hide();
        $('#filename').text('');
        $('#filename').attr('title', '');
    },
    //重新生成上传控件
    reset_Input_File: function() {
        var html = '<input type="file" name="upFile" id="upFile" onkeydown="if(event.keyCode==13)return false;">';
        $('#upload').html(html);
    },
    //判断当前是结果页还是详情页
    judge_cur_page: function() {
        var url = window.location.href;
        if (url.indexOf('Details.html') > -1) { // 详情页
            return 'details';
        } else if (url.indexOf('result.html') > -1) { // 结果页
            return 'result';
        }
    }
};

// 联想词下拉框
function KeyDropdown() {
    this.val = '';
    this.mapping = {
        '|01|#|现行有效|': 'valid',
        '|02|#|已被修改|': 'revised',
        '|03|#|失效|': 'losed',
        '|04|#|部分失效|': 'not_losed'
    }
}

KeyDropdown.prototype = {
    constructor: KeyDropdown,
    init: function(val) {
        this.val = val;

        var jsonData = {
                size: 5,
                from: 0,
                keyword: val,
            },
            that = this;

        $.ajax({
            type: 'post',
            url: ip + '/witnet/search/relatedword',
            data: JSON.stringify(jsonData),
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
                // 点击过按钮 不执行后续代码
                if (clickTag) return;
                // console.log(res)
                var result_flfg = JSON.parse(res.result_flfg);
                // console.log(result_flfg)
                var result_xzwd = JSON.parse(res.result_xzwd);
                // console.log(result_xzwd)

                that.render(result_flfg, result_xzwd);
            },
            error: function(error) {

            }
        })
    },
    render: function(flfg, xzwd) {
        if (flfg.length == 0 && xzwd.length == 0) {
            $('#dropdown-wrapper').hide();
            $('#dropdown-wrapper').html('');
            // $('#dropdown-wrapper').stop().slideUp(300);
            return;
        }

        var html = '<ul id="dropdown" class="dropdown">';
        // 法规
        if (flfg.length > 0) {
            html += '<li class="category"><h5>法规</h5></li>';
            for (var i = 0, l = flfg.length; i < l; i++) {
                var tmp = flfg[i];
                html +=
                    '<li class="law-item"  title="' + delete_b(tmp.title) + '"><a href="javascript:void(0);">' + tmp.title + '</a><span class="' + this.mapping[tmp.shixiao_id] + '">' + tmp.shixiao_id.replace(/#|\d|\|/g, '') + '</span></li>';
            }
        }

        // 问答
        if (xzwd.length > 0) {
            html += '<li class="category"><h5>问答</h5></li>'
            for (var i = 0, l = xzwd.length; i < l; i++) {
                var tmp = xzwd[i];
                html +=
                    '<li class="qa-item" title="' + delete_b(tmp.typ_question) + '"><a href="javascript:void(0);">' + tmp.typ_question + '</a></li>';
            }
        }

        html += '</ul>';

        // $('#dropdown').html(html);
        $('#dropdown-wrapper').html(html);

        $('#dropdown-wrapper').show();
        // $('#dropdown-wrapper').stop().slideDown(300);
    }
}

// 上传文件
function Uploading() {

}

Uploading.prototype = {
    constructor: Uploading,
    init: function(file) {
        // console.log(file);
        // console.log(Search.file_stream_cache);

        $('.shadow').fadeIn(300); // 显示loading框

        if (window.FormData) {
            this._formData(file);
        } else {
            this._uploadAjax(file);
        }
    },
    // IE10+ 上传文件
    _formData: function(file) {
        // console.log(file)

        var formData = new FormData();
        formData.append("file", Search.file_stream_cache);
        formData.append("name", "/upload" + file);

        var that = this;

        $.ajax({
            url: ip + '/witnet/search/documentAnalyseByFile',
            type: 'post',
            async: false,
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function(res) {
                // console.log(res);
                // var _condition = {}; //保存对象  避免删除时会修改原来的condition
                // var caseid = '';
                // for (var k in res.condition) {
                //     _condition[k] = res.condition[k];
                // }

                Search.fileBackData = {
                    name: file,
                    condition: res.condition,
                    elementType: 'file',
                    cType: 'or'
                }

                // console.log(_condition)
                // if (res.condition.caseid) {
                //     Search.fileBackData.caseid = res.condition.caseid;
                //     delete _condition.caseid;
                // }

                // Search.fileBackData.condition = _condition;

                // console.log(Search.fileBackData)
                $('.shadow').fadeOut(300); // 隐藏loading框
            },
            error: function(error) {
                $('.shadow').fadeOut(300); // 隐藏loading框
            }
        })
    },
    // IE89上传文件
    _uploadAjax: function(file) {
        jQuery.support.cors = true;
        var form = $("#fileForIE89");
        var that = this;
        var uuid = this.getuuid();
        var ajaxFormOption = {
            type: "post", //提交方式 
            url: ip + '/witnet/search/uploadFileForIE89', //请求url 
            data: {
                fileName: $("#upload #upFile").val(),
                uuid: uuid
            }, //自定义数据参数，视情况添加
            dataType: "text",
            secureuri: false,
            success: function(data) { //提交成功的回调函数 
                that.aajax(uuid, that, file);
            },
            error: function(XmlHttpRequest, textStatus, e) {
                $('.shadow').fadeOut(300); // 隐藏loading框
            }
        };

        form.ajaxSubmit(ajaxFormOption);
    },
    aajax: function(uuid, that, file) {
        $.ajax({
            url: ip + '/witnet/search/getFeatureForIE89',
            type: 'post',
            dataType: 'json',
            data: {
                fileName: $("#upload #upFile").val(),
                uuid: uuid
            },
            success: function(res) {
                // console.log(res);
                // var _condition = {}; //保存对象  避免删除时会修改原来的condition
                // var caseid = '';
                // for (var k in res.condition) {
                //     _condition[k] = res.condition[k];
                // }

                Search.fileBackData = {
                    name: file,
                    condition: res.condition,
                    elementType: 'file',
                    cType: 'or'
                }

                // console.log(_condition)
                // if (res.condition.caseid) {
                //     Search.fileBackData.caseid = res.condition.caseid;
                //     delete _condition.caseid;
                // }

                // Search.fileBackData.condition = _condition;

                // console.log(Search.fileBackData)
                $('.shadow').fadeOut(300); // 隐藏loading框
            },
            error: function(error) {
                $('.shadow').fadeOut(300); // 隐藏loading框
            }
        });
    },
    S4: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    getuuid: function() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }
}

// 删除b标签
function delete_b(str) {
    return str.replace(/<b>|<\/b>/g, "");
}

// 超出长度显示。。。
// function ellipsis(str, keyword) {
//     var str1 = delete_b(str);
//     if (str1.length > 26) {
//         var str2 = str1.slice(0, 26) + ' ...';
//         var str3 = str2.replace(keyword, '<b>' + keyword + '</b>');
//         return str3
//     } else {
//         return str;
//     }
// }