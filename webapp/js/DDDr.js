/**
 * Created by QingM on 2018/3/26.
 */

/**
 *
 * 代码库 ver1.0
 *
 * */




var qingm=function(){


    this.formData;      //文件变量
    this.package=[];
    this.checkImg;
    this.sortIndex={"1":"first",
        "2":"second",
        "3":"third",
        "4":"forth",
        "5":"fifth",
        "":"sixth"

    };
    this.lTrans=[
        {"eName": "reportName", "cName": "报告名称","backName":"title", "type": "string"},
        {"eName": "reportType", "cName": "报告类型","backName":"classes", "type": "string"}
    ];
};


//函数
qingm.prototype= {
    Init: function () {
        //    初始化
    },
    GetData: function (event) {

        return event;
    },
    /**
     * 单继承
     * */
    extendOne:function(target,source){
        //遍历对象中属性
        for(var property in source){
            target[property]=source[property];
        }
        //返回对象
        return target;
    },
    /**
     * 多继承
     * */
    extendmix:function(target,source){
    },
    /**  寄生继承
     * 子类
     * 父类
     * */
    inheritPrototype: function (child, father) {
        this.isOjectCreate();
        var prototype = Object.create(father.prototype);
        prototype.constructor = child;
        child.prototype = prototype;
    },
    /**  事件委托
     * 选择器   eg:body
     * 绑定事件 eg:click
     * 回调函数 eg:function
     * */
    OnEvent: function (selector, event, fun) {
        $('body').on(selector, event, fun);
    },

    /**     跳转事件
     * 地址   eg:---------------------
     * 跳转方式 eg:local
     * */
    Jump: function (url, type) {

        if (type === "local") {
            location.href = url;
        }
        else if (type === "window") {
            window.open(url);
        }
    },

    /**     字符串截取
     * 长度
     * 字符串 eg:local
     * 目标选择器
     * 截取方式
     * */
    Op_split: function (length, text, selector, type) {

        if (type == 1) {
            if (text.length > length) {
                selector.text(text.substring(0, length - 4) + "..");
            }
            else {
                selector.text(text);
            }
            selector.attr("title", text);
        }

        else {
            selector.text(text);
            selector.attr("title", text);
        }

    },
    StringSplit:function(string,length){
        if(string.length>length)
        {
            return string.substring(0,length)+"...";

        }else{
            return string;
        }
    },
    /**     Ajax
     * url
     * 传递方式 get or post
     * 数据
     * */
    Ajax: function (url, type, data) {

        var newUrl;
        if (type == "get") {
            newUrl = url + "参数";
        }else {
            var newData = data;
            var dtd = $.Deferred();
            $.ajax({
                url: newUrl,
                type: type,
                //data: newData,
                //dataType:"json",
                // 告诉jQuery不要去处理发送的数据
                //processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                //contentType: false,
                timeout: 600, //超时时间设置，单位毫秒
                beforeSend: function () {
                }
            })
                .then(function (data) {
                    dtd.resolve(data);
                    //成功
                }, function (data) {
                    dtd.reject(data);
                    //失败
                })
                .always(function () {
                });
            return dtd.promise();
        }
    },

    /**     翻页插件
     * 数据
     * 数据总量
     * 每页展示条数
     * 回调函数
     * */
    Page: function (data, totalCount, showdata, fun) {

        /*翻页函数(插件)*/
        $('.page').pagination({
            pageCount: totalCount / showdata, //初始化时总页数
            totalData: totalCount,  //数据总量
            showData: showdata,     //每页数据量
            isHide: true,   ///当前页数为0页或者1页时显示分页
            callback: function (api) {
                fun;
            }
        });
    },

    /**     文件上传 formData
     * 选择器
     * 文件类型
     * formData
     *
     * html
     *<span class="btn_Upload UploadR select">选取文件
     *<input type="file" class="file" accept="application/pdf" readonly="">
     *</span>
     *
     * */
    UpLoad: function (selector, type) {

        var $selector = selector;
        if (!$selector[0].value) {
            //未选择文件退出函数
            return;
        }
        //取文件路径
        var filePath = $selector.val();//文件名路径
        var names = filePath.split("\\");

        var fileName = names[names.length - 1];//文件名
        var pos = "." + filePath.replace(/.+\./, ""); //文件后缀

        var file = $selector[0].files[0];

        //校验上传格式
        if (!this.FileCkeck_Type(pos, type)) {
            return;
        }
        //校验图片尺寸
        this.ImgCkeck_Size(file, type/*,width*//*,height*/);
        setTimeout(function () {
            if (!Qm.checkImg && type == 1) {
                //判断图片尺寸
                return;
            }
            //校验文件大小
            if (!this.FileCkeck_Size(file, type)) {
                return;
            }
            if (window.FormData) {   //ie9+
                this.formData = new FormData();
                this.formData.append("carousel_p", file);
                this.formData.append("name", "/upload" + fileName);
            }
            else {
                /*兼容*/
            }
        }, 50);

    },

    /**     文件类型限制
     * 选择器
     * 文件类型
     * formData
     * */
    FileCkeck_Type: function (pos, type) {
        if ((type == 1 && pos != '.jpg' && pos != '.png') ||
            (type == 2 && pos != '.pdf')) {
            //限制上传格式
            alert("上传格式错误");
            return false;
        }
        else {
            return true;
        }
    },

    /**     图片尺寸限制
     * 文件
     * 限制条件
     * */
    ImgCkeck_Size: function (file, type, width, height) {

        if (type == 1) {
            //限制校验条件
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload = function () {
                    var imgWidth = image.width;
                    var imgHeight = image.height;
                    if (imgWidth != width && imgHeight != height) {
                        alert("尺寸错误！");
                        Qm.checkImg = false;
                    }
                    else {
                        Qm.checkImg = true;
                    }
                };
                image.src = data;
            };
            reader.readAsDataURL(file);
        }
    },
    /**     文件大小限制
     * 文件
     * 限制条件
     * */
    FileCkeck_Size: function (file, type) {

        if (type == 1 && file.size > 256 * 1024) {
            alert("文件大小请限制在256k");
            return false;
        }
        else if (type == 2 && file.size > 1024 * 1024 * 10) {
            alert("文件大小请限制在10m");
            return false;
        }
        else {
            return true;
        }
    },
    /**
     * 能区分IE版本
     * 无法判断IE11
     * Edge被检测为Chrome
     *
     */
    MyBrowser: function () {
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
            //console.log(fIEVersion);
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
    },
    /**
     * 限制IE9+以下浏览器
     * 跳转至指定页面
     */
    Ie9PlusLimit:function(type,url){
        if(type=="IE55"||
            type=="IE6"||
            type=="IE7"||
            type=="IE8"
        ){
            alert('您的浏览器版本过低，请使用“IE9+”、“google chrome”等浏览器，如使用国产双核浏览器，请切换到极速内核模式');
            if(url)
            {
                location.href=url;
            }
        }
    },
    /**
     * 名词转换
     * {eName:"Featrue",cName:"案情",bName:"feature"}
     * */
    TypeTrans: function (tranArray,element, type, ifAll) {
        /*名称转换*/
        var reAll = "";
        var reElement = "";
        for (var e = 0, elen = tranArray.length; e < elen; e++) {
            if (type == "eTOc" && element == tranArray[e].eName) {
                //"eTOc" ： 英转中
                reElement = tranArray[e].cName;
                reAll = tranArray[e];
            }
            else if (type == "cTOe" && element == tranArray[e].cName) {
                //"cTOe" ： 中转英
                reElement = tranArray[e].eName;
                reAll = tranArray[e];
            }
            else if (type == "bTOe" && element == tranArray[e].bName) {
                //"bTOe 后转前
                reElement = tranArray[e].eName;
                reAll = tranArray[e];
            }
            else if (type == "eTOb" && element == tranArray[e].eName) {
                //eTOb 前转后
                reElement = tranArray[e].bName;
                reAll = tranArray[e];
            }
            else if (type == "bTOc" && element == tranArray[e].bName) {
                //"bTOc" ： 后转中
                reElement = tranArray[e].cName;
                reAll = tranArray[e];
            }
            else if (type == "cTOb" && element == tranArray[e].cName) {
                //"cTOb" ： 中转后
                reElement = tranArray[e].eName;
                reAll = tranArray[e];
            }
        }
        if (ifAll === "all") {
            return reAll;       //返回对象
        }
        else {
            return reElement;   //返回翻译对象
        }
    },
    /**
     * 字符串转数组
     * */
    stringToArray:function (string) {
        var arr = new Array();

        if (string.indexOf(',') == -1) {
            arr.push(this.trim(string));
            return arr;
        } else {
            arr = string.split(',');
            return arr;
        }
    },
    /**
     * 阻止事件冒泡兼容
     * */
    stopPropagation:function(e) {
        e = window.event || e;
        if (document.all) { //只有ie识别
            e.cancelBubble = true;
        } else {
            e.stopPropagation();
        }
    },
    /**
     *   去除两端空格
     * */
    trim:function(string) {
   //     console.log(string);
        return string.replace(/(^\s*)|(\s*$)/g, "");
    },
    /**
     *   流程处理函数
     * */
    manamge:function(){},
    /**
     * pid/id转树结构
     * 递归
     * */
    arrayToJson:function(data) {
        //深拷贝
        var treeArray=JSON.parse(JSON.stringify(data));
        var tree = [];
        var tmpMap ={};

        for (var i=0, l=treeArray.length; i<l; i++) {
            // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
            tmpMap[treeArray[i]["id"]]= treeArray[i];
        }

        for (i=0, l=treeArray.length; i<l; i++) {
            var key=tmpMap[treeArray[i]["pid"]];

            //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
            if (key) {
                if (!key["children"]){
                    key["children"] = [];
                    key["children"].push(treeArray[i]);
                }else{
                    key["children"].push(treeArray[i]);
                }
            } else {
                //如果没有这个Key值，那就代表没有父级,直接放在最外层
                tree.push(treeArray[i]);
            }
        }
        return tree;
    },
    /**
     * 添加新数据*/
    render:function(treeJson,extra){
        var that=this;
    if(!Array.isArray(treeJson)||treeJson.length<=0)
    {
        return "";
    }
    var dl=document.createElement('dl');
        dl.setAttribute("style","display:none;");
        if(extra==2){
            dl.className = "third";
        }else{
            dl.className = "second";
        }
    treeJson.forEach(function(item,i){
        var dd=document.createElement('dd');
        dd.className="stair";
        //I标签
        if(item.children!=undefined) {
            var i = document.createElement('i');
            i.className = 'fa fa-caret-right fa-lg';
            i.setAttribute('aria-hidden', 'true');
            dd.appendChild(i);
        }
        //键值
        var a=document.createElement('a');
        a.setAttribute('href','javascript:void(0);');
        a.setAttribute('title',item["key"]);
        a.setAttribute('value',item["key"]);
        dd.appendChild(a);

        var atxt=document.createTextNode(item["key"]);
        a.appendChild(atxt);
        //数值
        var span=document.createElement('span');
        span.appendChild((document.createTextNode(item["doc_count"])));
        dd.appendChild(span);
        if(Array.isArray(item.children)&&item.children.length>0) {
            var level=item.id.length/2;
            dd.appendChild(that.render(item.children,level));
        }
        dl.appendChild(dd);
    });
    return dl;
},
    renderP:function(treeJson,type){
        var that=this;
        if(!Array.isArray(treeJson)||treeJson.length<=0)
        {
            return "";
        }
        var dl=document.createElement('dl');
        dl.setAttribute("style","display:none;");
        var level=Qm.sortIndex[treeJson[0].level+1];
        dl.className=level;
        if(level!="first"){
            if(type=="court"){
                dl.setAttribute('bType',"court");
            }else{
                dl.setAttribute('bType',treeJson[0].id);
            }
        }
        treeJson.forEach(function(item,i){
            var dd=document.createElement('dd');
            dd.className="stair";
            //I标签
            var i = document.createElement('i');
            if(item.children!=undefined||
                item["isEnd"]!=undefined&&item["isEnd"]==false) {
                i.className = 'fa fa-caret-right fa-lg';
                i.setAttribute('aria-hidden', 'true');
            }
            dd.appendChild(i);

            //键值
            var a=document.createElement('a');
            a.setAttribute('href','javascript:void(0);');
            a.setAttribute('title',item["name"]);
            a.setAttribute('value',item["name"]);

            dd.appendChild(a);

            var atxt=document.createTextNode(item["name"]);
            a.appendChild(atxt);
            //数值
            var span=document.createElement('span');
            span.appendChild((document.createTextNode(item["count"])));
            dd.appendChild(span);
            if(Array.isArray(item.children)&&item.children.length>0) {
                dd.appendChild(that.renderP(item.children,type));
            }else if(item["isEnd"]!=undefined&&item["isEnd"]==false){
                var i = document.createElement('i');
                var dls=document.createElement('dl');
                var levels=Qm.sortIndex[treeJson[0].level+2];
                dls.className=levels;
                dls.setAttribute("style","display:none;");
                dd.appendChild(dls);
            }
            dl.appendChild(dd);
        });
        return dl;
    },
    produceInit:function(){},
    cheakType:function(element){

        if(typeof element =="object")
        {
            if(element instanceof Array)
            {
                //值是对象
                return "array";
            }else{
                //值是数组
                return "object";
            }
        }
        else if(typeof element=="string"){
            //值是字符串
            return "string";
        }
    },
    stringHandle:function(string,type,length){
        switch (type){
            case 'slice':
                return string.length>length?string.substring(0,length)+"...":string;
            case '/':
                return string.substring(string.lastIndexOf('/'));

        }
    },
    checkType:function(string){
  //      console.log(string);
        var type=typeof string;
        if(type=="undefined"){
            return "";
        }else{
            if(type=="boolean"){
                return string==true?"true":"false";
            }
            else if(type=="string") {

                return this.trim(string.replace(/\[|\]/g,""));
            }else{
                return this.trim(string[0]!=undefined?string[0]:"");
            }
        }
    },
    dateCheck:function(string,element){
        if(string==undefined||string==""){
            return;
        }
        var string_=string.replace(/(\/)|(\.)|(\-)/g,element);
        var year=string_.substring(0,string_.indexOf(element));
        var mon=string_.substring(string_.indexOf(element)+1,string_.lastIndexOf(element));
        var day=string_.substring(string_.lastIndexOf(element)+1);

        var mon_s=mon.length<2?"0"+mon:mon;
        var day_s=day.length<2?"0"+day:day;

        return year+"-"+mon_s+"-"+day_s;
    },
    /**
     * 取id
     * */
     Request:function() {
    var strHref = decodeURI(window.document.location.href);
    var intPos = strHref.indexOf("?");
        if(intPos==-1){
            return ""
        }
    var strRight = strHref.substr(intPos + 1);
    var result = {};
    var arrTmp = strRight.split("&");
    for (var i = 0; i < arrTmp.length; i++) {
        var arrTemp = arrTmp[i].split("=");
        if (arrTemp != undefined && arrTemp[0] != "") {
           // if ($.inArray(arrTemp[0], loacal) != -1) {
                result[arrTemp[0]] = this.stringToArray(arrTemp[1]);
          //  }
            /*           if ($.inArray(arrTemp[0], stringArr) != -1) {
             result[arrTemp[0]] = arrTemp[1];
             } else if ($.inArray(arrTemp[0], arrayArr) != -1) {
             result[arrTemp[0]] = stringToArray(arrTemp[1]);
             }*/
        }
    }
    return result;
},
    /**
     * session相关
     * */
    // 获取session
    getSession: function(key) {
        if (window.sessionStorage.getItem(key)) {
            return window.sessionStorage.getItem(key);
        }
    },
    //设置session
    setSession: function(key, val) {
        if (val!=-1) {
            window.sessionStorage.setItem(key, JSON.stringify(val));
        }
    },
    // 移除session
    removeSession: function(key) {
        window.sessionStorage.removeItem(key);
    },
    // 清空session
    clearSession: function() {
        window.sessionStorage.clear();
    },
    /**
     * 兼容
    * */
    isCompatible:function(){
        this.islastIndexOf();
        this.isOBjectkeys();
        this.isOjectCreate();
        this.isForEach();
        this.isaddEvntListener();
        this.isArray();
    },
    isaddEvntListener:function (){
/*
//判断IE7\8 兼容性检测
        var isIE=!!window.ActiveXObject;
        var isIE6=isIE&&!window.XMLHttpRequest;
        var isIE8=isIE&&!!document.documentMode;
        var isIE7=isIE&&!isIE6&&!isIE8;

        if(isIE8 || isIE7){
            li.attachEvent("onclick",function(){
                _marker.openInfoWindow(_iw);
            })
        }else{
            li.addEventListener("click",function(){
                _marker.openInfoWindow(_iw);
            })
        }
*/

},
    isArray:function(){
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
},
    islastIndexOf:function(){
        if (!Array.prototype.lastIndexOf) {
            Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
                'use strict';

                if (this === void 0 || this === null) {
                    throw new TypeError();
                }

                var n, k,
                    t = Object(this),
                    len = t.length >>> 0;
                if (len === 0) {
                    return -1;
                }

                n = len - 1;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n != n) {
                        n = 0;
                    }
                    else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }

                for (k = n >= 0
                    ? Math.min(n, len - 1)
                    : len - Math.abs(n); k >= 0; k--) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }
                return -1;
            };
        }
    },
    isOBjectkeys:function(){
        if (!Object.keys) Object.keys = function(o) {
            if (o !== Object(o))
                throw new TypeError('Object.keys called on a non-object');
            var k=[],p;
            for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
            return k;
        }
    },
    isOjectCreate:function(){
        if (!Object.create) {
            Object.create = (function(){
                function F(){}

                return function(o){
                    if (arguments.length != 1) {
                        throw new Error('Object.create implementation only accepts one parameter.');
                    }
                    F.prototype = o;
                    return new F()
                }
            })()
        }
    },
    isForEach:function(){
        if ( !Array.prototype.forEach ) {
            Array.prototype.forEach = function forEach( callback, thisArg ) {
                var T, k;
                if ( this == null ) {
                    throw new TypeError( "this is null or not defined" );
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if ( typeof callback !== "function" ) {
                    throw new TypeError( callback + " is not a function" );
                }
                if ( arguments.length > 1 ) {
                    T = thisArg;
                }
                k = 0;
                while( k < len ) {
                    var kValue;
                    if ( k in O ) {
                        kValue = O[ k ];
                        callback.call( T, kValue, k, O );
                    }
                    k++;
                }
            };
        }
    },
};
//初始化
var Qm=new qingm();


