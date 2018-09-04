/**
 * Created by QingM on 2018/4/24.
 */
var IntelLaw = function () {

    //数据
    this.pageData = {
        knows:{},
        law:{},
        cases:{},
        judge:{},
        point:{},
        book:{},
        periodical:{}
    };       //全页数据
    this.navData={
        knows:{},
        law:{},
        cases:{},
        judge:{},
        point:{},
        book:{},
        periodical:{}
    };
    this.navDataNew={
        knows:{},
        law:{},
        cases:{},
        judge:{},
        point:{},
        book:{},
        periodical:{}
    };
    //nav缓存数据
    this.onceData = {"nav": {}, "content": {},count:""};       //一页数据模板
    this.sinput={type:"",value:"",source:""};
    this.sCache = {};     //搜索缓存组
    this.sCacheV={};       //主条件组
    this.sCacheS=[[],[],[],[],[],[],[],[]]; //副条件组
    this.stackCache=[
        //{name:"",condition:{},cType:"and","elementType":""}
    ];
    this.typeS = ["法信问答", "法律法规", "案例要旨", "裁判文书", "法律观点", "图书", "期刊"];
    this.typeE = ["knows", "law", "cases", "judge", "point", "book", "periodical"];
    this.typeB=['xzwd','alllaw','alyz','documents','viewpoint','tushu','qikan'];

    this.transTab = [{"eName": "knows", "cName": "法信问答", "bName": "xzwd"},
        {"eName": "law", "cName": "法律法规", "bName": "alllaw"},
        {"eName": "cases", "cName": "案例要旨", "bName": "alyz"},
        {"eName": "judge", "cName": "裁判文书", "bName": "documents"},
        {"eName": "point", "cName": "法律观点", "bName": "viewpoint"},
        {"eName": "book", "cName": "图书", "bName": "tushu"},
        {"eName": "periodical", "cName": "期刊", "bName": "qikan"},


        {"eName": "judge_member", "cName": "审判人员", "bName": "judge_member"},

        {"eName": "tip1", "cName": "现行有效", "bName": ""},
        {"eName": "tip2", "cName": "已被修改", "bName": ""},
        {"eName": "tip3", "cName": "尚未生效", "bName": ""},
        {"eName": "tip4", "cName": "部分失效", "bName": ""},
        {"eName": "tip5", "cName": "失效", "bName": ""},
        {"eName": "tip6", "cName": "实际失效", "bName": ""}

    ];
    this.numtran=[
        {"eName": "first", "cName": "", "bName": "1"},
        {"eName": "second", "cName": "", "bName": "2"},
        {"eName": "third", "cName": "", "bName": "3"},
        {"eName": "forth", "cName": "", "bName": "4"},
        {"eName": "fifth", "cName": "", "bName": "5"},
        {"eName": "sixth", "cName": "", "bName": "6"}
    ];
    this.pagetrans={

    "knows":[
        {"eName": "category", "cName": "案由", "bName": "category"},
        {"eName": "typ_guan_jian_ci", "cName": "关键词", "bName": "typ_guan_jian_ci"},
        {"eName": "nat_guan_jian_ci", "cName": "关键词_1", "bName": "nat_guan_jian_ci"},
        {"eName": "typ_question", "cName": "问答标题", "bName": "typ_question"},
        {"eName": "caseid", "cName": "案号", "bName": "caseid"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}

    ],
    "law":[
        {"eName": "lawType", "cName": "法律分类", "bName": "sort_id"},
        {"eName": "alllaw_sort_id_content", "cName": "主题分类", "bName": "alllaw_sort_id_content"},
        {"eName": "sort_id_1", "cName": "主题分类_1", "bName": "sort_id_1"},
        {"eName": "sort_id_2", "cName": "主题分类_2", "bName": "sort_id_2"},
        {"eName": "sort_id_3", "cName": "主题分类_3", "bName": "sort_id_3"},
        {"eName": "sort_id_4", "cName": "主题分类_4", "bName": "sort_id_4"},

        {"eName": "xiaoli_id_content", "cName": "效力等级", "bName": "xiaoli_id_content"},
        {"eName": "shixiao_id_content", "cName": "时效性", "bName": "shixiao_id_content"},

        {"eName": "title", "cName": "法规标题", "bName": "title"},
        {"eName": "gjfl", "cName": "国家法律", "bName": "gjfl"},
        {"eName": "dffl", "cName": "地方法律", "bName": "dffl"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}
    ],
    "cases":[
        {"eName": "sort_id_content", "cName": "案由", "bName": "sort_id_content"},
        {"eName": "sort_id_1", "cName": "案由_1", "bName": "sort_id_1"},
        {"eName": "sort_id_2", "cName": "案由_2", "bName": "sort_id_2"},
        {"eName": "sort_id_3", "cName": "案由_3", "bName": "sort_id_3"},
        {"eName": "sort_id_4", "cName": "案由_4", "bName": "sort_id_4"},
        {"eName": "sort_id_5", "cName": "案由_5", "bName": "sort_id_5"},
        {"eName": "sort_id_6", "cName": "案由_6", "bName": "sort_id_6"},

        {"eName": "zsfy_id_content", "cName": "审理法院", "bName": "zsfy_id_content"},
        {"eName": "zsfy_id_1", "cName": "审理法院_1", "bName": "zsfy_id_1"},
        {"eName": "zsfy_id_2", "cName": "审理法院_2", "bName": "zsfy_id_2"},
        {"eName": "zsfy_id_3", "cName": "审理法院_3", "bName": "zsfy_id_3"},

        {"eName": "slcx_id_content", "cName": "审理程序", "bName": "slcx_id_content"},
        {"eName": "xingfa_id_content", "cName": "刑罚", "bName": "xingfa_id_content"},
        {"eName": "xingfa_id_1", "cName": "刑罚_1", "bName": "xingfa_id_1"},
        {"eName": "xingfa_id_2", "cName": "刑罚_2", "bName": "xingfa_id_1"},
        {"eName": "xingfa_id_3", "cName": "刑罚_3", "bName": "xingfa_id_1"},
        {"eName": "result_id_content", "cName": "裁判结果", "bName": "result_id_content"},
        {"eName": "ajzh", "cName": "案号", "bName": "ajzh"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}
    ],
    "judge":[
        {"eName": "case_feature", "cName": "关键词", "bName": "case_feature"},
        {"eName": "casecause", "cName": "案由", "bName": "casecause"},
        {"eName": "caseid", "cName": "案号", "bName": "caseid"},

        {"eName": "pjudgeentry", "cName": "判决项", "bName": "pjudgeentry"},
        {"eName": "judgeentry", "cName": "判决项_1", "bName": "judgeentry"},
        {"eName": "court", "cName": "审理法院_1", "bName": "court"},
        {"eName": "province", "cName": "审理法院", "bName": "province"},
        {"eName": "pproof", "cName": "证据", "bName": "pproof"},
        {"eName": "proof", "cName": "证据_1", "bName": "proof"},
        {"eName": "courtlevel", "cName": "法院级别", "bName": "courtlevel"},
        {"eName": "proceduretype", "cName": "审理程序", "bName": "proceduretype"},
        {"eName": "judgeyear", "cName": "裁判年份", "bName": "judgeyear"},

        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"},
        {"eName": "applicable_lawonly", "cName": "引用法条_1", "bName": "applicable_lawonly"},

        {"eName": "judge_member", "cName": "审判人员", "bName": "judge_member"},
        {"eName": "involved_person", "cName": "当事人", "bName": "involved_person"}
    ],
    "point":[
        {"eName": "lanmu_id", "cName": "观点分类", "bName": "lawpoint"},
        {"eName": "viewpoint_sort_id_content", "cName": "法学分类", "bName": "lawtype"},
        {"eName": "sort_id_1", "cName": "法学分类_1", "bName": "sort_id_1"},
        {"eName": "sort_id_2", "cName": "法学分类_2", "bName": "sort_id_2"},
        {"eName": "sort_id_3", "cName": "法学分类_3", "bName": "sort_id_3"},
        {"eName": "sort_id_4", "cName": "法学分类_4", "bName": "sort_id_4"},
        {"eName": "sort_id_5", "cName": "法学分类_5", "bName": "sort_id_5"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}

    ],
    "book":[
        {"eName": "publish_dh", "cName": "出版社", "bName": "publish_dh"},
        {"eName": "publish_year", "cName": "出版年份", "bName": "publish_year"},//publish_date
        {"eName": "flts_sort", "cName": "图书分类", "bName": "flts_sort"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}

    ],
    "periodical":[
        {"eName": "qk_sort_id_content", "cName": "期刊分类", "bName": "qk_sort_id_content"},
        {"eName": "kanming_id", "cName": "期刊名称", "bName": "kanming_id"},
        {"eName": "qikan_sort_id_content", "cName": "学科分类", "bName": "qikan_sort_id_content"},
        {"eName": "sort_id_1", "cName": "学科分类_1", "bName": "sort_id_1"},
        {"eName": "sort_id_2", "cName": "学科分类_2", "bName": "sort_id_2"},
        {"eName": "sort_id_3", "cName": "学科分类_3", "bName": "sort_id_3"},
        {"eName": "sort_id_4", "cName": "学科分类_4", "bName": "sort_id_4"},
        {"eName": "sort_id_5", "cName": "学科分类_5", "bName": "sort_id_5"},
        {"eName": "nianfen", "cName": "期刊年份", "bName": "nianfen"},
        {"eName": "applicable_law", "cName": "引用法条", "bName": "applicable_law"}
    ]
    };
    this.package=['Tips','Tabs'];

    this.pages=["zhidaoDetails","lawsDetails","alyzDetails","refereeDocDetails","pointDetails","booksDetails","periodicalDetails","lawsQuesAnsDetails"];
    //假数据
    this.fakeTab={
        tag:[
            {index:"knows",total:0},
            {index:"law",total:0},
            {index:"cases",total:0},
            {index:"judge",total:0},
            {index:"point",total:0},
            {index:"book",total:0},
            {index:"periodical",total:0}
        ]
    };
    this.firstArray=["xingfa_id","zsfy_id","sort_id"];                                       //父级

    //效果
    //标签序号
    this.tabIndex=0;
    this.tipIndex=-1;
    this.contentFlag=false;
};
Qm.inheritPrototype(IntelLaw, qingm);

    IntelLaw.prototype.Init=function(){
        //取数据
        if(location.href.lastIndexOf("content")!=-1){
            this.contentGet();
        }else if(location.href.lastIndexOf("id")!=-1){
            this.IDGet();
        }
        var sessionS=this.getSession("stackCache");
        //取默认页，不存在则取0
        this.tabIndex=this.getSession('Index')==undefined?0:parseInt(this.getSession('Index'));

        //案例要旨,特殊处理
        if(this.getSession('Index')==2) {
            //按副条件组处理
            if(this.getSession("zsfy_id_content")!=undefined) {
                var fy_id_content = JSON.parse(this.getSession("zsfy_id_content"));
                this.navData['cases']['zsfy_id_content'] = fy_id_content;
                var fyCache=JSON.parse(this.getSession("CacheV"))[0];
                this.getElement(fyCache.name, fyCache.condition, "and", fyCache.elementType, "extra");
                this.removeSession("zsfy_id_content");
                this.removeSession("CacheV");
            }
            else if(this.getSession("sort_id_content")!=undefined){
                var sort_id_content = JSON.parse(this.getSession("sort_id_content"));
                var cache=JSON.parse(this.getSession("CacheV"))[0];
                this.navData['cases']['sort_id_content'] = sort_id_content;
                this.getElement(cache.name, cache.condition, "and", cache.elementType, "extra");
                this.removeSession("sort_id_content");
                this.removeSession("CacheV");
            }
        }
        //
    if(sessionS!=undefined){
        var stackCache = JSON.parse(sessionS);
        if(stackCache instanceof Array) {
            this.stackCache=stackCache;
        }else{
            this.stackCache = [];
            this.stackCache.push(stackCache);
            this.setSession("stackCache",this.stackCache);
        }
    }
        //合并条件队列
    this.merge();
    var that=this;
        //全局统计
    $.when(this.Ajax('total',ip + "/witnet/search/statisall",this.sCacheV),
        this.Ajax('knows',ip + "/witnet/search/statis",this.sCache)).then(function(data,data1){
        //.then(function(data){
        $('.shadow').fadeOut();
        //取数据
           var knowsNum=JSON.parse(data1.totalcount);
        var totals=JSON.parse("{"+data.result+"}").queryDatas.totals;
          //  console.log(JSON.parse(data.result));
          //  var totals=JSON.parse(data.result).queryDatas.totals;

            for(var u= 0,lenU=that.fakeTab.tag.length;u<lenU;u++){
            if(u==0){
                that.fakeTab.tag[u].total=knowsNum;
                continue;
            }
            for(var v= 0,lenV=totals.length;v<lenV;v++){
                if(that.TypeTrans(that.transTab,totals[v].index,"bTOe")==that.fakeTab.tag[u].index){
                    that.fakeTab.tag[u].total=totals[v].total;
                }
            }
        }
        //生成tab和tips
        for(var q= 0,lenQ=that.package.length;q<lenQ;q++)
        {
            that.factory("produce"+that.package[q]);
        }
        that.pageManage('Init');
    });
};
/**
 * 数据存储部分
 * */
/**
 * 获取content
 * */
IntelLaw.prototype.contentGet=function() {
    var idKey=this.Request();
    if(idKey==""){
        return "";
    }
        var token=idKey["token"]!=undefined?"?token="+decodeURI(idKey["token"][0]):"";
    if(idKey["content"]!=undefined) {
        var key = decodeURI(idKey["content"][0]);
        var hh=decodeURI(idKey["elementType"]);
        var type = decodeURI(idKey["elementType"])!="undefined"?decodeURI(idKey["elementType"][0]):"commonfields";
        var ds = {name: key, condition: {}, cType: "or", "elementType":type};
        ds["condition"][type]=[key];
        var index=type=="title"?1:0;
        this.setSession('Index',index);
        this.stackCache.push(ds);
        this.setSession("stackCache", this.stackCache);
        this.Jump(location.href.substring(0, location.href.lastIndexOf('?'))+token, 'local');
    }
};
/**
 * 获取ID
 * */
IntelLaw.prototype.IDGet=function() {
    var idKey=this.Request();
    if(idKey==""){
        return "";
    }
    var token=idKey["token"]!=undefined?"?token="+decodeURI(idKey["token"][0]):"";
    var key =idKey.id[0];
    var name;
    if(idKey.filename[0]!=undefined){
        //防止出错
        name=decodeURI(idKey.filename[0]);
    }
    var that=this;
    $.when(this.Ajax('id',ip + "/witnet/search/queryConditionByIdFromGS",{uuid:key})).then(function(data){
       // console.log(data);
        if(data.message=="成功"){
            that.setSession('Index',3);
            var newData=JSON.parse(JSON.stringify(data.condition));
            newData.name=name!=""&&name!=undefined?name: newData.name;
            that.setSession("stackCache",newData);
            that.Jump(location.href.substring(0, location.href.lastIndexOf('?'))+token, 'local');
        }else{
            that.setSession('Index',0);
            that.setSession("stackCache",[]);
        }
    });
};
/**
 * 取统计数据
 * */
IntelLaw.prototype.dataTotal=function(){

    var dtp = $.Deferred();
    $.when(this.Ajax('total',ip + "/witnet/search/document",this.sCache)).then(function(data){
        $('.shadow').fadeOut();
        dtp.resolve(data);
        return dtp.promise();
    },function(){});
};
/**
 * 数据格式校验
 * */
/**
 * Ajax
 * */
IntelLaw.prototype.navIManage=function(page,condition,stype,obj){

    var firstArray=JSON.parse(JSON.stringify(obj));
    //stype0:本级ID stype1 父级ID stype2 全ID
    //层级
    var level=stype[0].substring(stype[0].lastIndexOf("_")+1);
    if(stype[1].lastIndexOf("content")==-1){
        level--;
    }
    //值
    var value=stype[0].substring(0,stype[0].lastIndexOf("_"));
    var  newCondition = {
        "condition": condition,
        "category": [stype[0]],
        "type": page,
        "level":level
    };
    newCondition[value]=stype[2];
    newCondition["category"].push(firstArray[value]);
    if($.inArray("sort_id_content",newCondition["category"])==-1){
        newCondition["category"].push("sort_id_content");
    }
    //法律观点页特殊处理
    if(page=="flgd")
    {
        newCondition["category"].push("lanmu_id");
    }
    //添加父级至condition
    if(JSON.stringify(stype[3])!="{}") {
        if(newCondition["condition"]["andcondition"]==undefined){
            newCondition["condition"]["andcondition"]={};
        }
        for (var n in stype[3]) {
            newCondition["condition"]["andcondition"][n] = stype[3][n];
        }
    }
    return newCondition;
};
/**
 * Ajax
 * */
IntelLaw.prototype.cManage=function(page,oldcondition,sort,from,stype) {
    var newCondition = {};
    var condition=JSON.parse(JSON.stringify(oldcondition));
    /**
     * 以文检索处理
     * */
    if(condition["orcondition"]!=undefined&&condition["orcondition"]["caseid"]!=undefined){
        var caseid=condition["orcondition"]["caseid"][0];
    }
    /**/
    switch (page) {
        case 'id':
            newCondition =condition;
            break;
        case 'total':
            //console.log('total');
                newCondition = {
                    "condition": condition
                };
            break;
        case 'knows':
            //小智知道
            if(sort!=undefined) {
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sort,
                    "type": "xzzdGS"
                    //"type": "xzzd"
                };
            }else{
                newCondition = {
                    "condition": condition,
                    "category":["category","typ_guan_jian_ci"],
                    //"category":['organ_id_content','sort_id_content',"slcx_id_content",'xingfa_id_1','result_id_content'],
                    "type": "xzzdGS"
                    //"type": "xzzd"
                };
            }
            break;break;
        case 'cases':
            //案例要旨
            if(sort!=undefined) {
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sort,
                    "type": "alyz"
                };
            }else{
                if(stype!=undefined){
                    var alyzArray={"xingfa_id":"xingfa_id_content","zsfy_id":"zsfy_id_content","sort_id":"sort_id_content"};
                    newCondition=this.navIManage("alyz",condition,stype,alyzArray);
                }else {
                    newCondition = {
                        "condition": condition,
                        "category": ['zsfy_id_1', 'sort_id_1', "slcx_id_content", 'xingfa_id_1', 'result_id_content'],
                        "type": "alyz"
                    };
                }
            }
            break;
        case 'law':
            //法律法规
            if(sort!=undefined) {
                if(sort=="_score"){
                    sorts="_score";
                }else if(sort=="fb_date"){
                    sorts="ssrq";
                }else{
                    sorts="fdate";
                }
                //var sorts= sort=="_score"?"ssrq":"fdate";
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sorts,
                    "type": "flfg"
                };
            }else{
                if(stype!=undefined){
                    var alyzArray={"alllaw_sort_id":"alllaw_sort_id_content","sort_id":"sort_id_content"};
                    newCondition=this.navIManage("flfg",condition,stype,alyzArray);
                }else {
                    newCondition = {
                        "condition": condition,
                        "category": ["lawType","sort_id_1","sort_id_content","xiaoli_id_content","shixiao_id_content"],
                        "type": "flfg"
                    };
                }
            }
            break;
        case 'judge':
            //裁判文书
            if(sort!=undefined) {
                var sorts= sort=="_score"?"_score":"judgedate";
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sorts,
                    "type": "cpws"
                };
            }else{
                if(stype!=undefined)
                {
                    //stype0:本级ID stype1 父级ID stype2 全ID
                    if(stype[0]!="province") {
                        var province = condition.andcondition["province"];
                        delete condition.andcondition["province"];

                        newCondition = {
                            "condition": condition,
                            "category": [stype[0]],
                            "type": "cpws"
                        };
                        newCondition[stype[1]] = province;
                    }else{
                        newCondition = {
                            "condition": condition,
                            "category": [stype[0]],
                            "type": "cpws"
                        };
                }
                }else {
                    newCondition = {
                        "condition": condition,
                        "category": ['province',"case_feature","casecause", "pjudgeentry","pproof", "courtlevel", "proceduretype", "judgeyear"],
                        "type": "cpws"
                    };
                }
            }
            break;
        case 'point':
            if(sort!=undefined) {
                var sorts= sort=="_score"?"_score":"chuban_time";
                    newCondition = {
                        "condition": condition,
                        "from": from,
                        "size": 20,
                        "sort": sorts,
                        "type": "flgd"
                    };
            }
            else {
                if (stype != undefined) {
                    var pointArray = {"viewpoint_sort_id": "viewpoint_sort_id_content",
                    "sort_id":"sort_id_content"};
                    newCondition = this.navIManage("flgd", condition, stype, pointArray);
                } else {
                    newCondition = {
                        "condition": condition,
                        "category": ["lanmu_id", "sort_id_1"],
                        "type": "flgd"
                    };
                }
            }
            break;
        case 'book':
            if(sort!=undefined) {
                var sorts= sort=="_score"?"_score":"publish_year";//publish_date
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sorts,
                    "type": "ts"
                };
            }else{
                newCondition = {
                    "condition": condition,
                    "category":["flts_sort", "publish_dh", "publish_year"],//publish_date
                    "type": "ts"
                };
            }
            break;
        case 'periodical':
            if(sort!=undefined) {
                var sorts= sort=="_score"?"_score":"nianfen";
                newCondition = {
                    "condition": condition,
                    "from": from,
                    "size": 20,
                    "sort": sorts,
                    "type": "qk"
                };
            }else{
                if (stype != undefined) {
                    var pointArray = {"qikan_sort_id": "qikan_sort_id_content",
                        "sort_id":"sort_id_content"};
                    newCondition = this.navIManage("qk", condition, stype, pointArray);
                }
                else{
                    newCondition = {
                        "condition": condition,
                        "category":["sort_id_1","kanming_id", "qk_sort_id_content", "nianfen"],
                        "type": "qk"
                    };
                }
            }
            break;
    }
    if (caseid!=undefined){
        newCondition.caseid=caseid;
        delete newCondition["condition"]["orcondition"]["caseid"];
    }
    //二次检索判断，存在"orcondition"，进行二次检索
    if(newCondition["condition"]["orcondition"]!=undefined&&JSON.stringify(newCondition["condition"]["orcondition"])!="{}"){
        newCondition["issecondquery"]=true;
    }else{
        newCondition["issecondquery"]=false;
    }
    return newCondition;
};
IntelLaw.prototype.Ajax=function(page,url,condition,sort,from,ptype){

    /**/
    var newData=this.cManage(page,condition,sort,from,ptype);
    var newUrl=url;
    if(newUrl.lastIndexOf("document")!=-1){
        var userid = '';
        if (window.localStorage.getItem('UserInfo')) {
            userid = JSON.parse(window.localStorage.getItem('UserInfo')).UserId;
        }
        newData.userid=userid;
    }
    var dtp = $.Deferred();
/*    if(page=="knows"){
        newUrl="http://118.26.171.151:8002"+"/api/External/SearchQuestionByContent";
    }*/
    jQuery.support.cors = true;
        $.ajax({
            url: newUrl,
            type: 'post',
            data: JSON.stringify(newData),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            timeout: 60000, //超时时间设置，单位毫秒
            beforeSend: function () {
                if(url.lastIndexOf("document")!=-1) {
                    $('.shadow').fadeIn();
                }
            }
        })
            .then(function (data) {
                window.setTimeout(function(){
                    dtp.resolve(data);
                    //成功
                },200);
            }, function (data) {
                dtp.reject(data);
                //失败
            })
            .always(function () {
            });
    return dtp.promise();
};
/**
 * 添加条件
 * */

IntelLaw.prototype.getElement=function(fileName,condition,cType,elementType,extra){
    var element={};
    element.name=fileName;
    element.condition=condition;
    element.cType=cType;
    element.elementType=elementType;

    wisdom.sinput["type"]=elementType;
    wisdom.sinput["value"]=fileName;
    wisdom.sinput["source"]=cType;
    if(extra!="extra") {
     return   wisdom.cacheManage(element, "add");
    }else{
     return   wisdom.cachesCheck(element, "add");
    }
};
/**
 * 分页管理模块
 * */
IntelLaw.prototype.pageManage = function (init,type,isSearch) {

    var that=this;
    //this.tabIndex=that.getSession('Index')==undefined?0:parseInt(that.getSession('Index'));
        if (init == "Init") {
            wisdom.tabClick($('.tabs').eq(this.tabIndex), "_score");
        } else {
            if(isSearch=='search'){
                //顶部搜索，修改条件组
                $.when(this.Ajax('total',ip + "/witnet/search/statisall",this.sCacheV),
                    this.Ajax('knows',ip + "/witnet/search/statis",this.sCache)).then(function(data,data1){
                   // .then(function(data){
                    $('.shadow').fadeOut();
                        var knowsNum=JSON.parse(data1.totalcount);
                        that.fakeTab.tag=JSON.parse("{"+data.result+"}").queryDatas.totals;

                    var tabs=wisdom.fakeTab["tag"];
                    var num=that.typeB;
                    for(var f= 0,lenF=num.length;f<lenF;f++) {
                        if(f==0){
                            $('.tab_box').find('li').eq(f).find('span').text(knowsNum);
                            continue;
                        }
                        for(var e= 0,lenE=tabs.length;e<lenE;e++) {
                            if (tabs[e]["index"] == num[f]) {
                                $('.tab_box').find('li').eq(f).find('span').text(tabs[e].total);
                            }
                        }
                    }
                    wisdom.tabClick($('.tabs').eq(that.tabIndex), type, init);
                });
            }else{
                wisdom.tabClick($('.tabs').eq(that.tabIndex), type, init);
            }
        }
};
/**
 * 单页存储
 * */
IntelLaw.prototype.onceManage = function (pageName,sort,isnav) {
  //  var navData = {};
  //  var contentData = {};
    if(JSON.stringify(this.navData[pageName])!="{}") {
        this.navDataNew[pageName]=this.navDataHandle(this.navData[pageName]);
    }
    if(pageName) {
        $.when(this.Ajax(pageName, ip + "/witnet/search/statis", this.sCache)
            , this.Ajax(pageName, ip + "/witnet/search/document", this.sCache, sort, 0)).then(function (data1, data2) {
                $('.shadow').fadeOut();
                wisdom.onceData = {};
                wisdom.onceData["nav"] = JSON.parse(data1.result);
                wisdom.onceData["content"] = JSON.parse(data2.result);
                wisdom.onceData["count"] = data2.count;

                wisdom.pageData[pageName] = wisdom.onceData;


                wisdom.page(wisdom.onceData,pageName,20,sort);

                if(isnav=="nav"||'tab'){
                    return;
                }
                var tabs=wisdom.fakeTab["tag"];
                var num=['xzwd','alllaw','alyz','documents','viewpoint','tushu','qikan'];
                for(var f= 0,lenF=num.length;f<lenF;f++) {
                    for(var e= 0,lenE=tabs.length;e<lenE;e++) {
                        if (tabs[e]["index"] == num[f]) {
                            $('.tab_box').find('li').eq(f).find('span').text(tabs[e].total);
                        }
                    }
                }
            }, function () {
                $('.shadow').fadeOut();
                $('.none').show();
                $('.main_left .nav_left').html("");
                $('.main_right .result_top').hide();
                $('.main_right .result_bottom ul').html("");
                $('.page').hide();
            });
    }else{
        wisdom.pageFactory(pageName, sort);
    }
};
/**
 * 修改sCache值
 * */
IntelLaw.prototype.sCacheManage = function () {

};
/**
 * 缓存合并
 * */
IntelLaw.prototype.dataMerge = function () {

};
/**
 * 功能部分
 * */
/**

/**
 * 滑块点击*/
IntelLaw.prototype.tabClick=function(selector,extra,isnav){

    var $selector=$(selector);
    /*确认页面*/
        this.tabIndex = $('.tab_box ul li').index(selector);
        this.setSession("Index",this.tabIndex);
    //切换页面
    $selector.addClass('tabChose')
        .siblings().removeClass('tabChose').end()
        .children('a').addClass('aChose').end()
        .siblings().children('a').removeClass('aChose').end().end()
        .find('span').addClass('spanChose').end()
        .siblings().find('span').removeClass('spanChose')
    ;
    $selector.siblings().find('i').hasClass('iC')? $selector.siblings().find('i').attr('class',''):"";
    $selector.find('i').addClass('iC iChose_'+this.tabIndex+'');

    if(extra=="null")
    {
     return;
    }
    //取序号
    this.tipIndex=this.tabIndex;
    this.produceTips("tab",this.sCacheS[this.tabIndex]);
    this.merge();
    this.onceManage(wisdom.transTab[wisdom.tabIndex].eName,"_score",isnav);
    //location.href=location.href+"#"+$selector.attr('id');
};
/**
 * 滑块切换*/
IntelLaw.prototype.tabTrans=function($selector,type){
    if(type=="enter"){
        for(var i= 0,lenI=$selector.find('.tabs').length;i<lenI;i++)
        {
            if($selector.find('.tabs').eq(i).hasClass("tabChose"))
            {
                wisdom.tabIndex=i;
                break;
            }
        }
        $selector.find('.tabs').removeClass('tabChose').end()
            .find('a').removeClass('aChose').end()
            .find('span').removeClass('spanChose').end()
            .find('i').hasClass('iC')? $selector.find('i').attr('class',''):"";
    }else if(type=="leave"){
        $selector.find('.tabs').eq(wisdom.tabIndex).addClass('tabChose').end()
            .eq(wisdom.tabIndex).find('a').addClass('aChose').end().end()
            .eq(wisdom.tabIndex).find('span').addClass('spanChose').end().end()
            .find('i').eq(wisdom.tabIndex).addClass('iC iChose_'+wisdom.tabIndex+'');
    }
};
/**
 * 导航栏点击(多级树数据特殊情况)
 * */
IntelLaw.prototype.navDataHandle=function(oldnavCache){

    var navCache=JSON.parse(JSON.stringify(oldnavCache));
    var newCache={};
    var stype="",ptype="",valueS="";
    var indexObj=[];
    var navCacheIJ;
    for(var i in navCache){

        for(var j=0,lenJ=navCache[i].length;j<lenJ;j++){
            navCacheIJ=navCache[i][j];
            if(j==0){
                if(navCacheIJ["isEnd"]!=true){
                    var key=navCacheIJ["id"].substring(0,navCacheIJ["id"].lastIndexOf("_"));
                    var level=navCacheIJ["id"].substring(navCacheIJ["id"].lastIndexOf("_")+1);
                    stype=key+"_"+(parseInt(level)+1);
                    valueS=navCacheIJ["name"];
                    ptype=navCacheIJ["id"];
                }else{
                    stype=ptype=navCacheIJ["id"];
                    valueS=navCacheIJ["name"];
                }
            }
            newCache[navCacheIJ["id"]]=navCacheIJ["name"];
        }
        //点击叶子
        indexObj.push({"type":i});
        $.when(this.Ajax(this.transTab[this.tabIndex].eName,ip + "/witnet/search/statis",this.sCache,undefined,undefined,[stype,ptype,valueS,newCache])).then(function(data) {
            var index;
            //取键名
                index=indexObj[0]["type"];
            //动态修改总数
                for (var l = 0, lenL = navCache[index].length; l < lenL; l++) {
                    navCache[index][l]["count"] = data.totalcount;
                }
                var result = JSON.parse(data.result)[index];
            //若存在子项，则插入子项
                if (result.length > 0) {
                    for (var m = 0, lenM = result.length; m < lenM; m++) {
                        var obj = {};
                        obj["id"] = result[m]["fields"];
                        obj["pid"] = obj["id"].substring(0, obj["id"].lastIndexOf("_") + 1) + (parseInt(obj["id"].substring(obj["id"].lastIndexOf("_") + 1)) - 1);
                        obj["isEnd"] = result[m]["isEnd"];
                        obj["name"] = result[m]["key"];
                        obj["count"] = result[m]["doc_count"];
                        obj["level"] = result[m]["level"] - 1;
                        navCache[index].push(obj);
                    }
                }
            //一次请求结束
            indexObj.splice(0,1);
        });
    }
    return navCache;
};
/**
 * 导航栏点击(多级树数据特殊情况)
 * */
IntelLaw.prototype.navClickTree=function($selector,type){
    var ptype=type.substring(0,type.lastIndexOf('_'));
     var btype=$selector.parents('li').find('dt').attr('btype').substring(0,$selector.parents('li').find('dt').attr('btype').lastIndexOf('_'));
    var firstArray=["xingfa_id","zsfy_id","sort_id","alllaw_sort_id","viewpoint_sort_id","qikan_sort_id"];                                       //父级
    if($.inArray(btype,firstArray)!=-1){
        var dObj=this.dlGet($selector.siblings('i'),'array');
        //console.log(dObj);
        var obj={};

        obj[btype+"_content"]=[];
        for(var y= 0,lenH=dObj.length;y<lenH;y++){
                var obq = {};
                obq["id"] = dObj[y]["type"];
                obq['pid'] = ptype + "_" + (parseInt(obq["id"].substring(obq["id"].lastIndexOf("_") + 1)) - 1);
                obq["name"] = dObj[y]["value"];
                obq["count"] = dObj[y]["count"];
                obq["isEnd"] = dObj[y]["isEnd"];
                obq["level"] = (parseInt(obq["id"].substring(obq["id"].lastIndexOf("_") + 1)) - 1);
            obj[btype + "_content"].push(obq);
        }
        this.navData[this.typeE[this.tabIndex]][btype+"_content"]=obj[btype+"_content"];
    //console.log(this.navData);
    }else{
        return "";
    }
};

/**
 * 导航栏点击
 * */
IntelLaw.prototype.navClick = function ($selector) {
    //nav点击
    var type=$selector.parents('dl').attr('bType')!=undefined?$selector.parents('dl').attr('bType'):$selector.parents('dl').children('dt').attr('bType');
    //type=type=="province"?"court":type;
    var value = $selector.attr("value");
    if(value.lastIndexOf("管辖")!=-1||
        value.lastIndexOf("其他审理")!=-1&&$selector.siblings('dl').length>0){
        return;
    }
    var firstArray=["xingfa_id","zsfy_id","sort_id","alllaw_sort_id","viewpoint_sort_id","qikan_sort_id"];                                       //父级
    this.navClickTree($selector,type);
        //数组结构
    var element = {};
    element.name = value;
    element.condition = {};
    //多级树第一层处理
    if(type.substring(0,type.indexOf('sort_id')).length>0&&type!="qk_sort_id_content"||
        type=="sort_id_content"){
        type="sort_id_1";
    }else if(type.indexOf('zsfy_id_content')!=-1){
        type="zsfy_id_1";
    }else if(type.indexOf('xingfa_id_content')!=-1){
        type="xingfa_id_1";
    }
    element.condition[type] = value;
    //
        if (!wisdom.getElement(element.name, element.condition, "and", type, "extra")) {
            return;
        }
    wisdom.pageManage("nav");
};
/**
 * 导航栏取父级及自己类名，值
 * */
IntelLaw.prototype.dlGet=function($selector,type){
    var I=$selector.siblings('a').attr('value');
    var vKey;
    var dObj={}; //返回对象
    var isEnd;
    var cArray=[];
    for(var q= 0,lenQ=$selector.parents('dl').length;q<lenQ;q++)
    {
        //循环获取键值对
        vKey=$selector.parents('dl').eq(q).attr('btype');
        isEnd=$selector.parents('dl').eq(q).attr('isend');
        vKey=vKey.lastIndexOf("content")!=-1?vKey.replace("content","1"):vKey;
        //特殊处理2
        var vKey_ex=vKey.substring(0,vKey.indexOf("_"));
        if(vKey_ex=="viewpoint"||
            vKey_ex=="alllaw"||
            vKey_ex=="qikan"){
            vKey=vKey.substring(vKey.indexOf("_")+1);
        }
        if(type=="array"){
            cArray[q]={};
            cArray[q]["type"]=vKey;
            if(q==0){
                cArray[q]["value"]=I;
                cArray[q]["count"]=$selector.siblings('span').text();
            }else{
                cArray[q]["value"]=$selector.parents('dl').eq(q-1).siblings('a').attr('value');
                cArray[q]["count"]=$selector.parents('dl').eq(q-1).siblings('span').text();
            }
            cArray[q]["isEnd"]=isEnd=="true"?true:false;
        }else{
            if(q==0){
                dObj[vKey]=I;
            }else{
                dObj[vKey]=$selector.parents('dl').eq(q-1).siblings('a').attr('value');
            }
        }
/*        cArray[q]={};
        if(q==0){
            dObj[vKey]=I;
            cArray[q][vKey]=I;
            cArray[q]["count"]=$selector.siblings('span').text();
        }else{
            dObj[vKey]=$selector.parents('dl').eq(q-1).siblings('a').attr('title');
            cArray[q][vKey]=$selector.parents('dl').eq(q-1).siblings('a').attr('title');
            cArray[q]["count"]=$selector.parents('dl').eq(q-1).siblings('span').text();
        }*/
    }
    if(type=="array"){
        return cArray;
    }else{
        return dObj;
    }
};
/**
 * 导航栏请求数据处理
 * */
IntelLaw.prototype.IdataHandle=function($selector){
    var typeA=["pjudgeentry","pproof"]; //二级树结构
    var typeB=["province"]; //二级子数据树
    var typeC=["xingfa_id_content","xingfa_id_1","xingfa_id_2","xingfa_id_3",
        "zsfy_id_content","zsfy_id_1","zsfy_id_2","zsfy_id_3"];   //多级子数据树
    var ptype,stype,dArray; //父,子级数据类型
    ptype = $selector.parents('dl').attr('bType');

    if($.inArray(ptype,typeC)!=-1){
        dArray= this.dlGet($selector);
    }
};
/**
 * 导航栏二级菜单展开
 * */
IntelLaw.prototype.navClickI = function ($selector) {
    var typeA=["pjudgeentry","pproof"]; //二级树结构
    var typeB=["province"]; //一次返回全子数据树
    var typeC=["xingfa_id_content","xingfa_id_1","xingfa_id_2","xingfa_id_3",
    "zsfy_id_content","zsfy_id_1","zsfy_id_2","zsfy_id_3",
    "sort_id_content","sort_id_1","sort_id_2","sort_id_3","sort_id_4","sort_id_5","sort_id_6",
    "alllaw_sort_id_content","viewpoint_sort_id_content","qikan_sort_id_content"];   //分次返回分组数据

    var firstArray=["xingfa_id","zsfy_id","sort_id","alllaw_sort_id","viewpoint_sort_id","qikan_sort_id"];                                       //父级
    var that=this;
    var ptype;
    //父类型
    ptype = $selector.parents('dl').attr('bType')==undefined?"":$selector.parents('dl').attr('bType');

    if($selector.hasClass("fa-caret-right fa-lg")){
        if(ptype=="province"||
            ptype=="court"||
            ptype=="xiaoli_id_content"||
            ptype.lastIndexOf("zsfy_id")!=-1
        ){
            $selector.removeClass("fa-caret-right fa-lg").addClass("fa-caret-down fa-lg")
                .parents(".navContent").addClass('overy_600');
        }else{
            $selector.removeClass("fa-caret-right fa-lg").addClass("fa-caret-down fa-lg")
                .parents(".navContent").addClass('overy_320');
        }
        if($selector.siblings('dl').html()==""){
            //取N级数据
            var dArray= this.dlGet($selector);
            var secondIndex={
                "pjudgeentry":"judgeentry",
                "pproof":"proof",
                "province":"court",
                "xingfa_id_content":"xingfa_id_2",
                "xingfa_id_2":"xingfa_id_3",
                "zsfy_id_content":"zsfy_id_2",
                "zsfy_id_2":"zsfy_id_3",
                "sort_id_content":"sort_id_2",
                "sort_id_2":"sort_id_3",
                "sort_id_3":"sort_id_4",
                "sort_id_4":"sort_id_5",
                "sort_id_5":"sort_id_6",
                "alllaw_sort_id_content":"sort_id_2",
                "viewpoint_sort_id_content":"sort_id_2",
                "qikan_sort_id_content":"sort_id_2"
            };
            var value=$selector.siblings('a').attr('value');
            var stype=secondIndex[ptype]!=undefined?secondIndex[ptype]:"";

            //校验andcondition
            this.sCache["andcondition"]=this.sCache["andcondition"] == undefined?{}:this.sCache["andcondition"];
            if($.inArray(ptype.substring(0,ptype.lastIndexOf("_")),firstArray)==-1) {
              //  if (this.sCache["andcondition"] == undefined) {
              //      this.sCache["andcondition"] = {};
              //      this.sCache["andcondition"][ptype] = value;
             //   } else {
                    this.sCache["andcondition"][ptype] = value;
             //   }
            }else{
              //  if (this.sCache["andcondition"] == undefined) {
             //       this.sCache["andcondition"] = {};
            //    }
                //this.sCache["andcondition"] = {};
            }
            $.when(this.Ajax(this.transTab[this.tabIndex].eName,ip + "/witnet/search/statis",this.sCache,undefined,undefined,[stype,ptype,value,dArray])).then(function(data){
                $('.shadow').fadeOut();
                delete  wisdom.sCache["andcondition"][ptype];
                var sdata;
                //取父前缀
                if($.inArray(ptype.substring(0,ptype.lastIndexOf('_')),firstArray)!=-1){
                   // console.log(stype.substring(0,stype.lastIndexOf('_'))+"_content");
                    var pName=$selector.parents('li').children('dl').attr('bType');
                     sdata=JSON.parse(data.result)[pName];
                }else{
                     sdata=JSON.parse(data.result)[stype];
                }
             //   console.log(sdata);
                var htmlChild="";
                    if (sdata.length > 0) {
                        if($.inArray(ptype,typeB)!=-1) {
                            //类型B
                            var newData=JSON.parse(JSON.stringify(sdata));
                            var treeData=that.arrayToJson(newData);
                            var html=that.renderP(treeData,"court");
                            var text=$('.text');
                            text.html(html);
                            htmlChild=text.find('dl').html();
                        }
                        else if($.inArray(ptype,typeA)!=-1) {
                            //类型A
                            for (var s = 0, lenS = sdata.length; s < lenS; s++) {
                                htmlChild += '<dd class="stair">' +
                                    '<i></i>' +
                                    '<a href="javascript:void (0)" value="' + sdata[s].key + '" title="' + sdata[s].key + '" >' + sdata[s].key + '</a>' +
                                    '<span>' + sdata[s].doc_count + '</span>' +
                                    '</dd>';
                            }
                        }
                        else if($.inArray(ptype,typeC)!=-1){
                            //类型C
                            for (var b = 0, lenB = sdata.length; b < lenB; b++) {
                                if(sdata[b].isEnd==true){
                                    //最后一级
                                    htmlChild += '<dd class="stair">' +
                                        '<i></i>' +
                                        '<a href="javascript:void (0)" value="' + sdata[b].key + '" title="' + sdata[b].key + '" >' + sdata[b].key + '</a>' +
                                        '<span>' + sdata[b].doc_count + '</span>' +
                                        '</dd>';
                                }else{
                                    htmlChild += '<dd class="stair">' +
                                        '<i class="fa fa-caret-right fa-lg" aria-hidden="true"></i>' +
                                        '<a href="javascript:void (0)" value="' + sdata[b].key + '" title="' + sdata[b].key + '" >' + sdata[b].key + '</a>' +
                                        '<span>' + sdata[b].doc_count + '</span>' +
                                        '<dl class="'+that.TypeTrans(that.numtran,""+(sdata[b].level+1)+"","bTOe")+'" style="display: none;"></dl>' +
                                        '</dd>';
                                }
                            }
                        }
                        $selector.siblings('dl').html(htmlChild);
                        $selector.siblings('dl').attr("btype", stype);
                        $selector.siblings('dl').attr("isend", sdata[0].isEnd);
                        $selector.siblings('dl').slideDown(300);
                    } else {
                        //console.log(121);
                        $selector.replaceWith('<i></i>');
                        //$selector.remove();
                    }
            });
        }else{
            $selector.siblings('dl').slideDown(300);
        }
    }else{
        if(ptype=="province"||
            ptype=="court"||
            ptype=="xiaoli_id_content"||
            ptype.lastIndexOf("zsfy_id")!=-1){
            $selector.removeClass("fa-caret-down fa-lg").addClass("fa-caret-right fa-lg")
                .siblings('dl').slideUp(300).end().removeClass('overy_600');
        }else{
            $selector.removeClass("fa-caret-down fa-lg").addClass("fa-caret-right fa-lg")
                .siblings('dl').slideUp(300).end()
                .parents(".navContent").removeClass('overy_320');
        }
    }
};
/** btn按钮点击
 * */
IntelLaw.prototype.MoreClick=function($selector){
    if($selector.text()=="更多") {
        $selector.siblings('div').animate({"maxHeight": "600px"}, "normal", "swing")
            .end().text("收起");
        //超过15条显示滚动
        if($selector.siblings('div').children('.navContent').find('dd').length>15)
        {
            $selector.siblings('div').children('.navContent').addClass('overy');
        }
    }
    else{
        $selector.siblings('div').animate({"maxHeight": "320px"}, "normal", "swing")
            .end().text("更多")
            .siblings('div').children('.navContent').removeClass('overy');
    }
};
/**
 * i标签响应
 * */
IntelLaw.prototype.navIClick = function ($selector) {
};
 /**
* sort事件
* */
IntelLaw.prototype.rSort=function($selector){

    //console.log($selector.attr('id'));

    if($selector.hasClass("case_taga_chose")){
        return;
    }else{
        $selector.addClass('case_taga_chose')
            .siblings().removeClass('case_taga_chose').end()
            .children().attr('src','../images/order1.png').end()
            .siblings().children().attr('src','../images/order2.png');
        if($selector.attr('id')=="score")
        {
            this.onceManage(wisdom.transTab[wisdom.tabIndex].eName,"_score");
        }else if($selector.attr('id')=="fb_date"){
            this.onceManage(wisdom.transTab[wisdom.tabIndex].eName,"fb_date");
        }else{
            this.onceManage(wisdom.transTab[wisdom.tabIndex].eName,"zs_date");
        }
    }
};
/**
 * 缓存校验
 * */
IntelLaw.prototype.cacheCheck = function (obj) {
    //遍历缓存组

    if (JSON.stringify(this.stackCache).lastIndexOf(JSON.stringify(obj["condition"])) != -1) {
        alert("数据已存在");
        return false;
    } else {
        this.stackCache.push(obj);
        return true;
    }
};
IntelLaw.prototype.cachesCheck=function(obj,type){

    if(type=="add") {
        var flag;
        var that = this;
            if (JSON.stringify(that.sCacheS[that.tabIndex]).lastIndexOf(JSON.stringify(obj["condition"])) != -1) {
                alert("数据已存在");
                flag = false;
            }
            else {
                var tabIndex=that.sCacheS[that.tabIndex];
                var tip;
                for(var j=0,lenJ=tabIndex.length;j<lenJ;j++){
                    if((tabIndex[j]["elementType"].lastIndexOf("judgeentry")!=-1&&obj["elementType"].lastIndexOf("judgeentry")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("proof")!=-1&&obj["elementType"].lastIndexOf("proof")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("xingfa_id")!=-1&&obj["elementType"].lastIndexOf("xingfa_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("zsfy_id")!=-1&&obj["elementType"].lastIndexOf("zsfy_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("sort_id")!=-1&&obj["elementType"].lastIndexOf("sort_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("alllaw_sort_id")!=-1&&obj["elementType"].lastIndexOf("alllaw_sort_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("viewpoint_sort_id")!=-1&&obj["elementType"].lastIndexOf("viewpoint_sort_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("qikan_sort_id")!=-1&&obj["elementType"].lastIndexOf("qikan_sort_id")!=-1)||
                        (tabIndex[j]["elementType"].lastIndexOf("province")!=-1&&obj["elementType"]=="court")||
                        (tabIndex[j]["elementType"]=="court"&&obj["elementType"].lastIndexOf("province")!=-1)
                    )
                    {
                        tip=j;
                    }
                }
                if(tip!=undefined) {
                    var tabSpan=$('.tabExtra').find('span');
                    var tip2;
                    for(var g = 0,lenG=tabSpan.length;g<lenG;g++)
                    {
                        if(tabSpan.eq(g).attr('title')==tabIndex[tip]["name"]){
                            tip2=g;
                        }
                    }
                    $('.tabExtra').find('span').eq(tip2).remove();
                    tabIndex.splice(tip,1);
                }
                tabIndex.push(obj);
                flag = true;
            }
            return flag;
/*        if (flag) {
            console.log(that.sCacheS);
            //this.factory("produceTips","","once");
        }*/
    }else if(type=="delete"){

    }
    this.merge();
};
/**
 * 合并数据
 * */
IntelLaw.prototype.mergePush=function(array,element){
    if (typeof array == "undefined") {
        array = [];
    }
    if(element instanceof Array){
        for(var i= 0,lenI=element.length;i<lenI;i++){
            array.push(element[i]);
        }
    }else{
        array.push(element);
    }
    return array;
};
IntelLaw.prototype.merge=function(){
    this.sCache={};
    //全局合并
    for (var i = 0, lenI = this.stackCache.length; i < lenI; i++) {
        var cType = this.stackCache[i]["cType"]+"condition";     //condition类型
        for(var j in this.stackCache[i]["condition"]) {
            var key = j;   //键值
            if (typeof this.sCache[cType] == "undefined") {
                this.sCache[cType] = {};      //新建condition
            }
            this.sCache[cType][key]=this.mergePush(this.sCache[cType][key],this.stackCache[i]["condition"][key]);
        }
    }
    //复制主条件组
    this.sCacheV=JSON.parse(JSON.stringify(this.sCache));
    //console.log(this.sCache);

    //子集合并
    var secData=this.sCacheS[this.tabIndex];
   // console.log(secData);
    for (var b = 0, lenB = secData.length; b < lenB; b++) {
        var bType = secData[b]["cType"]+"condition";     //condition类型
        for(var n in secData[b]["condition"]) {
            var keys = n;   //键值
            if (typeof this.sCache[bType] == "undefined") {
                this.sCache[bType] = {};      //新建condition
            }
            this.sCache[bType][keys]=this.mergePush(this.sCache[bType][keys],secData[b]["condition"][keys]);
        }
    }
};
/**
 * 缓存管理
 * */
IntelLaw.prototype.cacheManage = function (dataObj, type) {
    if (type == "add") {
        if (!this.cacheCheck(dataObj)) {
            return;
        }else{
            this.factory("produceTips","","once");
        }
    } else if (type == "delete") {
        this.tipDelete(dataObj);
    }
    //合并数据
    this.merge();
};
/**
 * tips删除
 * */
IntelLaw.prototype.tipDelete = function ($selector) {
    var selector=$selector;
    var num=$selector.attr('num');
    var obj={};
    obj["tName"]=selector.attr('tName');
    obj.cType=selector.attr("cType");

    if(num==undefined) {
        for (var j = 0, lenJ = this.stackCache.length; j < lenJ; j++) {
            if (obj["tName"] == this.stackCache[j].name &&
                this.stackCache[j]["cType"] == obj["cType"]) {
                this.stackCache.splice(j, 1);
                selector.remove();
                break;
            }
        }
    }else{
        var arr=this.sCacheS[num];
        var arrNav=this.navData[this.typeE[num]];
        for (var u = 0, lenU = arr.length; u < lenU; u++) {
            if (obj["tName"] == arr[u].name &&
                arr[u]["cType"] == obj["cType"]) {
                var ele=arr[u]["elementType"].substring(0,arr[u]["elementType"].lastIndexOf('_')+1)+"content";
                if(arrNav[ele]!=undefined){
                    delete arrNav[ele];
                }
                arr.splice(u, 1);
                selector.remove();
                break;
            }
        }
    }
    this.setSession("stackCache",this.stackCache);
    //合并数据
    this.merge();
    if(num==undefined){
        wisdom.pageManage("","","search");
    }else{
        wisdom.pageManage();
    }
};
/**
 * keyword处理
* */
IntelLaw.prototype.keyHandle=function(element){
    var type=typeof element;
    var html_key="";
    if(type=="string"){
        //期刊关键词
        if(element.lastIndexOf(";")!=-1){
            element="["+element.replace(/;/g,",")+"]";
        }
            var stringT = element.substring(element.lastIndexOf('[') + 1, element.lastIndexOf(']'));
            var array = stringT.split(",");
            for (var h = 0, lenH = array.length; h < lenH; h++) {
                //特殊处理，存在<b></b>，且<b></b>完全包含词条，则视为高亮
                if (array[h].lastIndexOf('<b>') != -1 && array[h].lastIndexOf('</b>') + 4 == array[h].length) {
                    var newstring = this.trim(array[h].replace(/<b>|<\/b>/g, ""));
                    html_key += '<span style="padding: 0 10px"><b>' + newstring.substring(newstring.lastIndexOf('/') + 1) + '</b></span>';
                } else {
                    html_key += '<span style="padding: 0 10px">' + array[h].substring(array[h].lastIndexOf('/') + 1) + '</span>';
                }
            }

    }else if(type=="object"){
            for(var v= 0,lenV=element.length;v<lenV;v++){
                html_key+='<span style="padding: 0 10px">'+element[v].substring(element[v].lastIndexOf('/')+1)+'</span>';
            }
    }else{
        html_key= "";
    }
    return html_key;
};
/**
 * 工厂部分
 * */
IntelLaw.prototype.pageFactory = function (page,sort) {

    this.pageInit(page,sort);
};
IntelLaw.prototype.pageInit = function (page,sort) {
    //取全页面数据
    //ajax 1次nav 1次结果
    //插入页面
    this.factory('produceNav', page);
    this.factory('producetTop', page,sort);
    this.factory('produceContent', page);
};
IntelLaw.prototype.factory = function (funName,page,extra) {
    switch (funName) {
        case 'produceTips':
            return  this.produceTips(extra,this.stackCache);
        case 'produceNav':
            return  this.produceNav(page,wisdom.onceData["nav"]);
        case 'producetTop':
            return  this.producetTop(page,wisdom.onceData["count"],extra);
        case 'produceContent':
            return  this.produceContent(page,wisdom.onceData["content"]);
        case 'produceTabs':
            return  this.produceTabs();
    }
};
/**
 * 生成导航栏
 * */
IntelLaw.prototype.produceNavEmt=function(type,data,isSecond){
    var htmlChild="";
    var childData=data;
    var tree=["slcx_id_content","proceduretype","xiaoli_id_content"];   //树型数据
    var second=["pjudgeentry","pproof","province","alllaw_sort_id_content","xingfa_id_content","zsfy_id_content",
        "sort_id_content","viewpoint_sort_id_content","qikan_sort_id_content"];        //数组含二级

    if($.inArray(isSecond,second)!=-1&&this.navDataNew[type][isSecond]!=undefined){
    //多级树保留数据
        if(data.length<1&&this.navDataNew[type][isSecond].length>0) {
        childData=this.navDataNew[type][isSecond];
        }
    }
    if(childData.length<1){
        return "";
    }
    //树型数据
    if($.inArray(isSecond,tree)!=-1||
    data.length<1&&childData.length>0
    ){
        var newData=JSON.parse(JSON.stringify(childData));
        var treeData=this.arrayToJson(newData);
        var html="";
        if($.inArray(isSecond,tree)!=-1){
             html=this.render(treeData);
        }else{
             html=this.renderP(treeData);
        }
        var text=$('.text');
        text.html(html);
        return text.find('dl').html();
    }
    //数组数据
    for(var h=0,lenH=childData.length;h<lenH;h++)
     {
     var element=childData[h];
         if(element.key.lastIndexOf("|")!=-1) {
             if(isSecond=="kanming_id"){
                 var oldKey=element.key.substring(element.key.lastIndexOf("#")+2,element.key.lastIndexOf("|"));
             var newKey = "";
             if (oldKey.lastIndexOf('《') == -1) {
                 newKey = "《" + oldKey + "》";
             } else {
                 newKey = oldKey;
             }
             htmlChild += '<dd class="stair">' +
                 '<a href="javascript:void (0)" value="' + element.key + '"  title="' + newKey + '" >' + newKey + '</a>' +
                 '<span>' + element.doc_count + '</span>' +
                 '</dd>';
         }else {
                 //取最后一级
                 var first = element.key.substring(0, element.key.lastIndexOf("|"));
                 htmlChild += '<dd class="stair">' +
                     '<i></i>' +
                     '<a href="javascript:void (0)" value="' + element.key + '" title="' + first.substring(first.lastIndexOf("|") + 1) + '" >' + first.substring(first.lastIndexOf("|") + 1) + '</a>' +
                     '<span>' + element.doc_count + '</span>' +
                     '</dd>';
             }
         }
         else if(element.key.lastIndexOf("/")!=-1){
             //取最后一级
             var first=element.key.substring(element.key.lastIndexOf("/")+1);
             htmlChild += '<dd class="stair">' +
                 '<i></i>'+
                 '<a href="javascript:void (0)" value="' + element.key + '"  title="' + first + '" >' + first + '</a>' +
                 '<span>' + element.doc_count + '</span>' +
                 '</dd>';
         }
         else {
             if($.inArray(isSecond,second)!=-1)
             {  //有子集
                     htmlChild += '<dd class="stair">' +
                         '<i class="fa fa-caret-right fa-lg" aria-hidden="true"></i>' +
                         '<a href="javascript:void (0)" value="' + element.key + '"  title="' + element.key + '" >' + element.key + '</a>' +
                         '<span>' + element.doc_count + '</span>' +
                         '<dl class="second" style="display: none;"></dl>' +
                         '</dd>';
             }else{
                 if(isSecond=="slcx_id_content"){
                     return "";
                 }
/*                 else if(isSecond=="nianfen"){
                     var real=element.key.substring(0,element.key.indexOf('-'));
                     htmlChild += '<dd class="stair">' +
                         '<a href="javascript:void (0)" value="' + element.key + '"  title="' +real + '" >' + real + '</a>' +
                         '<span>' + element.doc_count + '</span>' +
                         '</dd>';
                 }*/
                 else {
                     htmlChild += '<dd class="stair">' +
                         '<a href="javascript:void (0)" value="' + element.key + '"  title="' + element.key + '" >' + element.key + '</a>' +
                         '<span>' + element.doc_count + '</span>' +
                         '</dd>';
                 }
             }
         }
     }
    return htmlChild;
};
IntelLaw.prototype.produceNav = function (page,data) {
    /*各页面基本统一，只需判断数据结构是树or数组*/
    var navData=data;
    //console.log("nav",navData);
    var htmlNav="",htmlNavF="",htmlIsMore="";
    var arr={
        "knows":[/*"typ_guan_jian_ci",*/"category"],
        "law":['lawType','alllaw_sort_id_content','xiaoli_id_content','shixiao_id_content'],
        "cases":['zsfy_id_content','sort_id_content',"slcx_id_content",'xingfa_id_content','result_id_content'],
        "judge":["case_feature","casecause", "pjudgeentry","province", "pproof","courtlevel","proceduretype", "judgeyear"],
        "point":["lanmu_id","viewpoint_sort_id_content"],
        "book":['flts_sort','publish_dh','publish_year'],//publish_date
        "periodical":['qk_sort_id_content','kanming_id','qikan_sort_id_content','nianfen']
    };
    var aSelect=arr[page];
    for(var b= 0,lenB=aSelect.length;b<lenB;b++)
    {
        for(var g in navData){
            if(g!=aSelect[b]){
                continue;
            }else {
                    htmlNavF = '<div class="navContent">' + this.produceNavEmt(page, navData[g],g) + '</div>';
                    htmlIsMore = navData[g].length > 8 &&g!='slcx_id_content'&&g!='proceduretype'? '<span class="btnMore">更多</span>' : "";
                    htmlNav += '<li><dl bType="' + g + '">' + '<dt bType="' + g + '">' + wisdom.TypeTrans(wisdom.pagetrans[page], g, 'eTOc') +
                        '</dt>' +
                        '<div style="overflow-x: hidden;overflow-y: hidden;width:316px;">' +
                        htmlNavF + '' +
                        '</div>' +
                        htmlIsMore +
                        '</dl></li>';
            }
        }
    }
    $('.main_left ul').html(htmlNav);

    if($('.text').children.length>0){
        $('.text').html();
    }
    //特殊处理
    var ml_ul_li=$('.main_left ul').find('li');
    for(var h= 0,lenH=ml_ul_li.length;h<lenH;h++){
        if(ml_ul_li.eq(h).children('dl').attr("bType")=="lawType"){
            if(ml_ul_li.eq(h).find('.navContent dd a').eq(0).text()=="国家法律"){
            }else{
                ml_ul_li.eq(h).find('.navContent dd').eq(1).after(
                    ml_ul_li.eq(h).find('.navContent dd').eq(0)
                );
            }
        }
        if(ml_ul_li.eq(h).find('dd').length<1){
            ml_ul_li.eq(h).remove();
           // ml_ul_li.eq(h).find('.navContent').html( '<dd class="stair">无信息</dd>');
        }
    }
};
/**
 * 生成主体top部分
 * */
IntelLaw.prototype.producetTop = function (page, data,sort) {

    $('.result_top').show();
    $('.none').hide();
    var htmlTop='',htmlSort = '', htmlCount = '';
    var html_array={
        'knows':{"score":"相关性",date:""},
        'law':{"score":"相关性","fb_date":"实施日期",date:"发布日期"},
        'cases':{"score":"相关性",date:"裁判日期"},
        'judge':{"score":"相关性",date:"裁判日期"},
        'point':{"score":"相关性",date:"出版日期"},
        'book':{"score":"相关性",date:"出版日期"},
        'periodical':{"score":"相关性",date:"出版日期"},
        'lawCode':{"score":"实施日期",date:"发布日期"}
    };
    var count=data==undefined?1355:data;
    htmlSort+='<a href="javascript:void(0)">排序：</a>';
    if(page=="law"){
        if (sort == "_score") {
            htmlSort += '<span class="taga trans case_taga_chose" id="score">' + html_array[page]["score"] + '<img src="../images/order1.png" alt=""></span>' +
            '<span class="taga trans" id="date">' + html_array[page]["date"] + '<img src="../images/order2.png" alt=""></span>'+
                '<span class="taga trans" id="fb_date">' + html_array[page]["fb_date"] + '<img src="../images/order2.png" alt=""></span>';
        }else if(sort =="fb_date"){
            htmlSort += '<span class="taga trans" id="score">' + html_array[page]["score"] + '<img src="../images/order1.png" alt=""></span>' +
                '<span class="taga trans" id="date">' + html_array[page]["date"] + '<img src="../images/order2.png" alt=""></span>'+
                '<span class="taga trans case_taga_chose" id="fb_date">' + html_array[page]["fb_date"] + '<img src="../images/order2.png" alt=""></span>';
        }
        else {
            htmlSort += '<span class="taga trans" id="score">' + html_array[page]["score"] + '<img src="../images/order1.png" alt=""></span>' +
                '<span class="taga trans case_taga_chose" id="date">' + html_array[page]["date"] + '<img src="../images/order2.png" alt=""></span>'+
                '<span class="taga trans" id="fb_date">' + html_array[page]["fb_date"] + '<img src="../images/order2.png" alt=""></span>';
        }

    }else {
        if (sort == "_score") {
            htmlSort += '<span class="taga trans case_taga_chose" id="score">' + html_array[page]["score"] + '<img src="../images/order1.png" alt=""></span>' +
                '<span class="taga trans" id="date">' + html_array[page]["date"] + '<img src="../images/order2.png" alt=""></span>';
        }
        else {
            htmlSort += '<span class="taga trans" id="score">' + html_array[page]["score"] + '<img src="../images/order2.png" alt=""></span>' +
                '<span class="taga trans case_taga_chose" id="date">' + html_array[page]["date"] + '<img src="../images/order1.png" alt=""></span>';
        }
    }
    htmlCount= '<p class="case_js_number fl" style="display: inline-block;">共检索到<span style="padding: 0 5px;font-weight: 600">'+count+'</span>个结果</p>';

    htmlTop+= '<div class="case_tagas">'+
        '<div class="case_ar_chose fl">'+
        htmlSort+
        '</div>'+
        htmlCount+
        '</div>'
    ;
    var htmlmrt=$('.main_right').children('.result_top');
    htmlmrt.html(htmlTop);
    //return htmlTop;
    if(htmlmrt.find('#date').text()==""){
        htmlmrt.find('#date').remove();
    }
    //动态修改统计数
    $('#'+page).find('span').text(count);

    if(count==0){
    $('.result_top').hide();
        $('.none').show();
    }
};
/**
 * 结果命中
 * */
IntelLaw.prototype.resultChose = function (page,obj,a) {
    var text="";
    var bool="",ischose_content="",istext="";
    switch (page){
        case 'law':
            if(obj.fulltext!=undefined) {
                bool=obj.fulltext.lastIndexOf('<b>')!= -1?"true":"false";
                ischose_content=obj.fulltext.lastIndexOf('<b>')!= -1?"chose_content":"";
                istext=obj.fulltext.lastIndexOf('<b>')!= -1?"【结果命中】：":"";
                    text = '<p class="law_content '+ischose_content+'" type="fulltext" isChose="'+bool+'">' +istext+ obj.fulltext.replace(/<br>/g,"") + '</p>';
            }else{
                text="";
            }
            break;
        case 'cases':

                bool=obj.alyz_content.lastIndexOf('<b>')!= -1?"true":"false";
                ischose_content=obj.alyz_content.lastIndexOf('<b>')!= -1?"chose_content":"";

                if(obj.alyz_content!=undefined&&obj.alyz_content!=""&&obj.alyz_content.lastIndexOf('<b>')!= -1) {
                    text = '<p class="alyz_content '+ischose_content+'" type="alyz_content" isChose="'+bool+'">' + "【案例要旨】：" + obj.alyz_content + '</p>';
                }else if(obj.fulltext!=undefined&&obj.fulltext!=""&&obj.fulltext.lastIndexOf('<b>')!=-1){
                    text = '<p class="alyz_content chose_content" type="fulltext" isChose="true">' + "【结果命中】：" + obj.fulltext + '</p>';
                }else if(obj.fypl!=undefined&&obj.fypl!=""&&obj.fypl.lastIndexOf('<b>')!=-1){
                    text = '<p class="alyz_content chose_content" type="fulltext" isChose="true">' + "【结果命中】：" + obj.fypl + '</p>';
                }else if(obj.alyz_content!=undefined&&obj.alyz_content!=""&&obj.alyz_content.lastIndexOf('<b>')== -1){
                    text = '<p class="alyz_content '+ischose_content+'" type="alyz_content" isChose="'+bool+'">' + "【案例要旨】：" + obj.alyz_content + '</p>';
                }
                else if(obj.fulltext!=undefined&&obj.fulltext!=""&&obj.fulltext.lastIndexOf('<b>')== -1){
                    text = '<p class="alyz_content '+ischose_content+'" type="fulltext" isChose="false">'+ obj.fulltext + '</p>';
                }else if(obj.fypl!=undefined&&obj.fypl!=""&&obj.fypl.lastIndexOf('<b>')== -1){
                    text = '<p class="alyz_content '+ischose_content+'" type="fulltext" isChose="false">'+ obj.fypl + '</p>';
                }else {
                    text="";
                }
            break;
        case 'judge':
            var arr=["court_consider","trialprocess","court_ascertained","defender_opinion","appellant_opinion"]; //命中序列
            if (obj.court_consider!=undefined&&obj.court_consider.lastIndexOf('<b>')!= -1) {
                ischose_content=obj.court_consider.lastIndexOf('<b>')!= -1?"chose_content":"";
                text ='<p class="judge_content chose_content" type="court_consider" isChose="true">' + "【本院认为】：" + obj.court_consider + '</p>';
            }else if(obj.trialprocess!=undefined&&obj.trialprocess.lastIndexOf('<b>')!= -1){
                text ='<p class="judge_content chose_content" type="trialprocess" isChose="true">' + "【结果命中】：" + obj.trialprocess + '</p>';
            }else if(obj.court_ascertained!=undefined&&obj.court_ascertained.lastIndexOf('<b>')!= -1){
                text ='<p class="judge_content chose_content" type="court_ascertained" isChose="true">' + "【结果命中】：" + obj.court_ascertained + '</p>';
            }else if(obj.defender_opinion!=undefined&&obj.defender_opinion.lastIndexOf('<b>')!= -1){
                text ='<p class="judge_content chose_content" type="defender_opinion" isChose="true">' + "【结果命中】：" + obj.defender_opinion + '</p>';
            }else if(obj.appellant_opinion!=undefined&&obj.appellant_opinion.lastIndexOf('<b>')!= -1){
                text ='<p class="judge_content chose_content" type="appellant_opinion" isChose="true">' + "【结果命中】：" + obj.appellant_opinion + '</p>';
            }
            else if(obj.court_consider!=undefined&&obj.court_consider.lastIndexOf('<b>')== -1){
                text ='<p class="judge_content" type="court_consider" isChose="false">' + "【本院认为】：" + obj.court_consider + '</p>';
            }else if(obj.trialprocess!=undefined&&obj.trialprocess.lastIndexOf('<b>')== -1){
                text ='<p class="judge_content" type="trialprocess" isChose="false">' +  obj.trialprocess + '</p>';
            }else if(obj.court_ascertained!=undefined&&obj.court_ascertained.lastIndexOf('<b>')== -1){
                 text ='<p class="judge_conten" type="court_ascertained" isChose="false">' +  obj.court_ascertained + '</p>';
            }else if(obj.defender_opinion!=undefined&&obj.defender_opinion.lastIndexOf('<b>')== -1){
                text ='<p class="judge_content" type="defender_opinion" isChose="false">' +  obj.defender_opinion + '</p>';
            }else if(obj.appellant_opinion!=undefined&&obj.appellant_opinion.lastIndexOf('<b>')== -1){
                text ='<p class="judge_content" type="appellant_opinion" isChose="false">' +  obj.appellant_opinion + '</p>';
            }
            else{
                text="";
            }
                break;
        case 'point':
            if(obj.fulltext!=undefined) {
                ischose_content=obj.fulltext.lastIndexOf('<b>')!= -1?"chose_content":"";
                bool=obj.fulltext.lastIndexOf('<b>')!= -1?"true":"false";
                istext=obj.fulltext.lastIndexOf('<b>')!= -1?"【结果命中】：":"";
                    text = '<p class="point_content '+ischose_content+'" type="fulltext" isChose="'+bool+'">' +istext+ obj.fulltext + '</p>';
            }else{
                text="";
            }
            break;
    }
    return text;
};
/**
 * 生成主体main部分
 * */
IntelLaw.prototype.produceContent = function (page,data) {
    var content=data;
    $('.page').show();
    console.log("content",content);

    var htmlSort = '', htmlCount = '',htmlContent="",htmlMessage="",html_2Or1="",html_fx="";
    for(var a= 0,lenA=content.length;a<lenA;a++)
    {
        switch (page) {
            case 'knows':
                html_2Or1 =content[a].typ_answer!=(undefined||"")?'<p>'+content[a].typ_answer.replace('\n','<br>')+ '</p>':"";
                htmlContent+='<li class="result_item knows_result_item trans">'+
                    '<div class="h2"><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+content[a].typ_question.replace(/<b>|<\/b>/g, "")+'">'+content[a].typ_question+'</h2></div>'+        //案例要旨标题
                    '<div class="item_keywords">'+
                    '<span >'+this.checkType(content[a].category)+'</span>'+
                    '</div>'+
                    html_2Or1+
                    //html_fx+
                    '</li>'
                ;
                break;
            case 'law':
                var html_fdate="";
                var html_sdate="";
                var html_hdep="";
                var html_isIntime="";
                var newtext=content[a].fulltext==undefined?"":content[a].fulltext.replace(/<br>/g,"");

                html_2Or1=this.resultChose('law',content[a]);
                //html_2Or1 =newtext!=undefined? '<div class="law_content chose_content">' +newtext + '</div>':"";

                //实施
                html_sdate=content[a].ssrq!=undefined&&content[a].ssrq!=""?'<span class="ss_date">'+this.dateCheck(this.checkType(content[a].ssrq),"-")+' 实施</span>':"";
                //发布
                html_fdate=content[a].fdate!=undefined&&content[a].fdate!=""?'<span class="ss_date">'+this.dateCheck(this.checkType(content[a].fdate),"-")+' 发布</span>':"";
                //立法机构
                html_hdep=content[a].fdep_id_content.lastIndexOf("|")!=-1?content[a].fdep_id_content.substring(0,content[a].fdep_id_content.lastIndexOf("|")).substring(content[a].fdep_id_content.substring(0,content[a].fdep_id_content.lastIndexOf("|")).lastIndexOf("|")+1):content[a].fdep_id_content;
                //效力级别
                //console.log(a,content[a].shixiao_id_content);
                html_isIntime= '<span class="tips '+this.TypeTrans(this.transTab,this.checkType(content[a].shixiao_id_content),'cTOe')+'">'+this.checkType(content[a].shixiao_id_content)+'</span>';
                htmlContent+='<li class="result_item law_result_item trans">'+
                    '<div class="h2"><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+content[a].title.replace(/<b>|<\/b>/g, "")+'">'+content[a].title+'</h2></div>'+        //案例要旨标题
                    '<div class="item_keywords">'+
                    '<span>'+this.checkType(content[a].xiaoli_id_content)+'</span>'+
                    '<span>'+this.checkType(html_hdep)+'</span>'+
                    html_fdate+
                    html_sdate+
                    '</div>'+
                    html_isIntime+
                    html_2Or1+
                    '</li>'
                ;
                break;
            case 'cases':
                html_2Or1=this.resultChose('cases',content[a]);
                //html_2Or1 =content[a].alyz_content!=undefined&&content[a].alyz_content!=""? '<p class="alyz_content chose_content">' + "【案例要旨】:" + content[a].alyz_content + '</p>':"";

                htmlContent+='<li class="result_item case_result_item trans">'+
                    '<div class="h2"><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+content[a].alyz_tite.replace(/<b>|<\/b>/g, "")+'">'+content[a].alyz_tite+'</h2></div>'+        //案例要旨标题
                    '<h3 class="title" uid="'+content[a].uniqid+'" title="'+this.checkType(content[a].title).replace(/<b>|<\/b>/g, "")+'">'+this.checkType(content[a].title)+'</h3>'+              //案例标题
                    '<div class="case_item_keywords">'+
                    '<span>'+this.checkType(content[a].cpsxz_id_content)+'</span>'+    //文书性质
                    '<span>'+this.checkType(content[a].zsfy_id_content)+'</span>'+      //终审法院
                    '<span>'+this.checkType(this.dateCheck(content[a].zs_date,"-"))+'</span>'+      //终审日期
                    '<span>'+this.checkType(content[a].slcx_id_content)+'</span>'+      //审理程序
                    '</div>'+
                    html_2Or1+
                    '</li>'
                ;
                break;
            case 'judge':
                var html_casecause="";
                var html_key="";
                //关键词
                html_key=this.checkType(content[a].case_feature)==""?"":'<p>'+"【关键词】："+this.keyHandle(content[a].case_feature)+'</p>';
                //内容
                html_2Or1=this.resultChose('judge',content[a],a);
                //html_2Or1 =content[a].court_consider!=undefined&&content[a].court_consider!=""? '<p class="judge_content chose_content">' + "【本院认为】：" + content[a].court_consider + '</p>':"";
                //案由
                html_casecause=typeof this.checkType(content[a].casecause)=="string"?content[a].casecause:this.checkType(content[a].casecause[0]);
                //主体
                htmlContent+='<li class="result_item judge_result_item trans">'+
                    '<div class="h2"><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+this.checkType(content[a].title).replace(/<b>|<\/b>/g, "")+'">'+this.checkType(content[a].title)+'</h2></div>'+        //案例要旨标题
                    '<div class="case_item_keywords">'+
                    '<span>'+html_casecause+'</span>'+
                    '<span>'+this.checkType(content[a].court)+'</span>'+
                    '<span>'+this.checkType(this.dateCheck(content[a].judgedate,'-'))+'</span>'+
                    '<span>'+this.checkType(content[a].caseid)+'</span>'+
                    '<span>'+this.checkType(content[a].casetype)+'</span>'+
                    '<span>'+this.checkType(content[a].proceeding)+'</span>'+
                    '<span>'+this.checkType(content[a].proceduretype)+'</span>'+
                    '</div>'+
                        html_key+
                    html_2Or1+
                    '</li>'
                ;
                break;
            case 'point':
                // title / article /point  name  explanation
                html_2Or1=this.resultChose('point',content[a]);
                var htmlcome="";
                var come=this.checkType(content[a].comefrom_name);
                var newCome;
                if(come.lastIndexOf('$')!=-1)
                {
                     newCome=come.substring(come.lastIndexOf('|')+1,come.lastIndexOf('$'));
                }else{
                     newCome=come;
                }
                htmlcome=newCome.length>30?'<span title="《'+newCome+'"》>'+"《"+newCome.substring(0,30)+"》"+'</span>':'<span>'+"《"+newCome+"》"+'</span>';
                htmlContent+='<li class="result_item point_result_item trans">'+
                    '<div class="h2"><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+this.checkType(content[a].title).replace(/<b>|<\/b>/g,"")+'">'+this.checkType(content[a].title)+'</h2></div>'+        //案例要旨标题
                    '<div class="case_item_keywords">'+
                    '<span>'+this.checkType(content[a].flsy_recommend_content)+'</span>'+    //文书性质
                    '<span>'+this.checkType(content[a].zuozhe_name)+'</span>'+      //终审法院
                    htmlcome+
                    //'<span>'+"《"+this.checkType(content[a].comefrom_name)+"》"+'</span>'+      //终审法院
                    '<span>'+this.checkType(this.dateCheck(content[a].chuban_time,'-'))+'</span>'+
                    '</div>'+
                    html_2Or1+
                    '</li>'
                ;
                break;
            case 'periodical':
                // title / article /point  name  explanation
                var html_qihao="",html_qikan="";
                var html_key="";
                //关键词
                html_key=this.checkType(content[a].keyword_cn)==""?"":'<p>'+"【关键词】："+this.keyHandle(content[a].keyword_cn)+'</p>';

                html_2Or1=content[a].zhaiyao_cn==undefined?"":'<p class="periodical_content">' + content[a].zhaiyao_cn + '</p>';
                html_qihao=content[a].nianfen==undefined?"":content[a].nianfen+"年"+content[a].qihao+"期";
                var kanming=content[a].kanming_id.substring(content[a].kanming_id.indexOf('|')+1,content[a].kanming_id.lastIndexOf('|'));
                kanming=this.checkType(content[a].kanming_id)==""?"":content[a].kanming_id.substring(content[a].kanming_id.indexOf('|')+1,content[a].kanming_id.lastIndexOf('|'));
               //是否高亮
                if(html_qihao.lastIndexOf('</b>')!=-1){
                    html_qihao="<span><b>"+html_qihao.replace(/<b>|<\/b>/g,"")+"</b></span>";
                }else{
                    html_qihao="<span>"+html_qihao+"</span>";
                }
                if(content[a].kanming_id.lastIndexOf('</b>')!=-1){
                    //源数据是否含有'《'
                    if (kanming != "" && kanming.lastIndexOf("《") == -1) {
                        html_qikan = '<span><b>《' + kanming + '》</b></span>';
                    } else if (kanming != "") {
                        html_qikan = '<span><b>' + kanming + '</b></span>';
                    } else {
                        html_qikan = "";
                    }
                }else {
                    //源数据是否含有'《'
                    if (kanming != "" && kanming.lastIndexOf("《") == -1) {
                        html_qikan = '<span>《' + kanming + '》</span>';
                    } else if (kanming != "") {
                        html_qikan = '<span>' + kanming + '</span>';
                    } else {
                        html_qikan = "";
                    }
                }
                /*缺少期刊名称*/
                htmlContent+='<li class="result_item trans clearfix">'+
                    '<div><i></i><h2 class="" uid="'+content[a].uniqid+'" title="'+this.checkType(content[a].title)+'">'+this.checkType(content[a].title)+'</h2></div>'+        //标题
                    '<div class="item_keywords">'+
                    '<span>'+this.checkType(content[a].author)+'</span>'+
                    html_qikan+
                    html_qihao+
                    '</div>'+
                    html_key+
                    html_2Or1+
                    '</li>'
                ;
                break;
            case 'book':
                // title / article / imgData /point  name  explanation
                var html_author;
                /*差图片 专题类型 标题*/
                    var html_isBasic="";
                var html_img="";
                    html_2Or1 =content[a].tushu_miaoshu!="undefined"||""? '<p>' +"【内容简介】"+ content[a].tushu_miaoshu + '</p>':"";
                    html_isBasic=content[a].type=="zx"?'<input type="button" value="行政诉讼法专题" class="ztBtn">':"";
                    html_img=content[a].fengmian_pic_path!=undefined&&this.trim(content[a].fengmian_pic_path)!=""?
                    '<img src="'+"http://img.faxin.cn"+content[a].fengmian_pic_path.substring(content[a].fengmian_pic_path.lastIndexOf("upload")+6)+'" alt="">'
                        :'<img src="../images/book_pic.png" alt="">';

                        //作者
                    html_author='<span class="auchor">'+this.checkType(content[a].book_author)+'</span>';
                    htmlContent+='<li class="result_item books_result_item trans clearfix">'+
                    '<div class="books_imgs fl">'+
                 //   '<img src="../images/book_pic.png" alt="">'+
                        html_img+
                    '</div>'+
                    '<div class="fl" style="width:650px;">'+
                    '<h2 class="" uid="'+content[a].uniqid+'" title="'+this.checkType(content[a].book_title)+'">'+this.checkType(content[a].book_title)+'</h2>'+        //标题
                    html_2Or1+
                    '<div class="item_keywords">'+
                        html_author+
                    '<span>'+this.checkType(content[a].publish_dh)+'</span>'+
                    '<span>'+this.checkType(content[a].publish_year)+'</span>'+//publish_date
                    '</div>'+
                    '<div class="other_btn">'+
/*
                    '<input type="button" value="原版阅读" class="olderBtn">'+
*/
                    '<input type="button" value="文本阅读" class="txtBtn">'+
                     html_isBasic+
                    '</div>'+
                    '</div>'+
                    '</li>'
                ;
                break;
            case 'lawCode':
                break;
        }
    }

    $('.main_right .result_bottom').find('ul').html(htmlContent);
    //特殊处理
    var reli=$('.result_item');
    for(var r= 0,lenR=reli.length;r<lenR;r++){
        //条件栏
        var spans=reli.eq(r).find('span');
        for(var j= spans.length-1,lenJ=0;j>=lenJ;j--){
            if(spans.eq(j).text()=="undefined"||
                spans.eq(j).text()==""
            ){
                spans.eq(j).remove();
            }
        }
    }
};
/**
 * 生成面包屑
 * */
IntelLaw.prototype.produceTips = function (Init,stack) {
    var html = "";
    if(Init!="once")
    {
        if(Init=='tab'){
            var first="";
            for (var w = 0, lenW = stack.length; w < lenW; w++) {
                //标题
                var Btitle=this.TypeTrans(this.pagetrans[this.typeE[this.tabIndex]],stack[w].elementType,"eTOc");
                var newBtitle=Btitle.lastIndexOf('_')!=-1?Btitle.substring(0,Btitle.lastIndexOf('_')):Btitle;
                if(stack[w].name.lastIndexOf("|")!=-1){
                    if(stack[w].elementType=="kanming_id"){
                        //刊名特殊处理
                        first = stack[w].name.substring(0, stack[w].name.lastIndexOf("|"));
                        var second=first.substring(first.lastIndexOf("|") + 1);
                        if(second.lastIndexOf("《")==-1){
                            html += '<span class="trans index' + wisdom.tipIndex + '"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="《' + second + '》" num="' + wisdom.tipIndex + '">' +
                                newBtitle + "：" +
                                "《"+wisdom.StringSplit(second, 10)+"》" +
                                '<i e=q></i>' +
                                '</span>'
                            ;
                        }else {
                            html += '<span class="trans index' + wisdom.tipIndex + '"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="' + second + '" num="' + wisdom.tipIndex + '">' +
                                newBtitle + "：" +
                                wisdom.StringSplit(second, 10) +
                                '<i e=q></i>' +
                                '</span>'
                            ;
                        }
                    }
                    else {
                        first = stack[w].name.substring(0, stack[w].name.lastIndexOf("|"));
                        html += '<span class="trans index' + wisdom.tipIndex + '"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="' + stack[w].name + '" num="' + wisdom.tipIndex + '">' +
                            newBtitle + "：" +
                            wisdom.StringSplit(first.substring(first.lastIndexOf("|") + 1), 10) +
                            '<i e=q></i>' +
                            '</span>'
                        ;
                    }
                }
               else if(stack[w].name.lastIndexOf("/")!=-1){
                    first= stack[w].name.substring(stack[w].name.lastIndexOf("/")+1);
                    html += '<span class="trans index'+wisdom.tipIndex+'"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="' + stack[w].name + '" num="' + wisdom.tipIndex + '">' +
                        newBtitle+"："+
                        wisdom.StringSplit(first, 10) +
                        '<i e=q></i>' +
                        '</span>'
                    ;
                }
                else {
/*                    if(stack[w].elementType=="nianfen"){
                        html += '<span class="trans index' + wisdom.tipIndex + '"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="' + stack[w].name.substring(0,stack[w].name.indexOf('-')) + '" num="' + wisdom.tipIndex + '">' +
                            newBtitle + "：" +
                            wisdom.StringSplit(stack[w].name.substring(0,stack[w].name.indexOf('-')), 10) +
                            '<i e="q"></i>' +
                            '</span>'
                        ;
                    }else {*/

                        html += '<span class="trans index' + wisdom.tipIndex + '"  cType="' + stack[w].cType + '" tName="' + stack[w].name + '" title="' + stack[w].name + '" num="' + wisdom.tipIndex + '">' +
                            newBtitle + "：" +
                            wisdom.StringSplit(stack[w].name, 10) +
                            '<i e="q"></i>' +
                            '</span>'
                        ;
                 //   }
                }
            }
            $('.entry div .tabExtra').html(html);
        }
        else {
            for (var g = 0, lenG = stack.length; g < lenG; g++) {
                var Gtitle=this.TypeTrans(this.pagetrans[this.typeE[this.tabIndex]],stack[g].elementType,"eTOc");
                Gtitle=stack[g].elementType=="file"?"文书名":Gtitle;
                Gtitle=stack[g].elementType=="commonfields"?"关键词":Gtitle;
                var newGtitle=Gtitle.lastIndexOf('_')!=-1?Gtitle.substring(0,Gtitle.lastIndexOf('_')):Gtitle;
                html += '<span class="trans"  cType="' + stack[g].cType + '" tName="' + stack[g].name + '" title="' + stack[g].name + '">' +
                    newGtitle+"："+
                    wisdom.StringSplit(stack[g].name, 10) +
                    '<i e="q"></i>' +
                    '</span>'
                ;
            }
            $('.entry div .tabExtra').before(html);
        }
    }else{
        if(wisdom.tipIndex==-1) {
            var Vtitle;
             Vtitle=wisdom.sinput.type=="commonfields"?"关键词":"文书名";
            switch (wisdom.sinput.type){
                case "commonfields":
                    Vtitle="关键词";
                    break;
                case "file":
                    Vtitle="文书名";
                    break;
                case "title":
                Vtitle="法规标题";
                break;
                case "typ_question":
                    Vtitle="问答标题";
                    break;
            }
            html = '<span class="trans"  cType="' + wisdom.sinput.source + '" tName="' + wisdom.sinput.value + '" title="' + wisdom.sinput.value + '">' +
                Vtitle+"："+
                wisdom.StringSplit(wisdom.sinput.value, 10) +
                '<i e="q"></i>' +
                '</span>'
            ;
            $('.entry div .tabExtra').before(html);
        }else{
            html = '<span class="trans"  cType="' + wisdom.sinput.source + '" tName="' + wisdom.sinput.value + '" title="' + wisdom.sinput.value + '" num="'+wisdom.tipIndex+'">' +
                wisdom.StringSplit(wisdom.sinput.value, 10) +
                '<i e="q"></i>' +
                '</span>'
            ;
            $('.entry div ul').append(html);
        }
    }
    //重置
    this.tipIndex=-1;
};
/**
 * 生成分页栏
 * */
IntelLaw.prototype.produceTabs= function () {
    var html="";
    var tabs=wisdom.fakeTab["tag"];
    //var num=['xzwd','alllaw','alyz','documents','viewpoint','tushu','qikan'];
    var num=['knows','law','cases','judge','point','book','periodical'];
    for(var f= 0,lenF=num.length;f<lenF;f++) {
    for(var e= 0,lenE=tabs.length;e<lenE;e++) {
        if (tabs[e]["index"] == num[f]) {
            html += '<li class="tabs trans" id="' + tabs[e]["index"] + '">' +
                    //'<a href="#'+tabs[e].key+'">'+
                '<a href="javascript:void(0);">' +
                '<i class="tab_'+num[f]+'"></i> ' +
                this.TypeTrans(this.transTab, tabs[e]["index"], "eTOc") +
                ' <span>' + tabs[e].total + '</span>' +
                '</a>' +
                '</li>'
        }
    }
    }
    $('.tab_box ul').html(html);
};

/** 分页
 *  内容数据
 *  总数据量
 *  单页数据量
 * */
IntelLaw.prototype.page=function (data, pageName, showdata,sort) {

    var totalCount=data.count;
    var that=this;
    /*初始化*/
    wisdom.pageFactory(pageName, sort);
    /*翻页函数(插件)*/
    $('.page').pagination({
        pageCount: totalCount / showdata, //初始化时总页数
        totalData: totalCount,  //数据总量
        showData: showdata,     //每页数据量
        isHide: true,   ///当前页数为0页或者1页时隐藏分页
        callback: function (api) {
            /*翻页部分*/
            //取数据
            var pageX=api.getCurrent();
            var pageName=that.TypeTrans(that.transTab,that.typeS[that.tabIndex],"cTOe");
            $.when(that.Ajax(pageName,ip + "/witnet/search/document",that.sCache,sort,(pageX-1)*20)).then(function(data){
                $('.shadow').fadeOut();
                that.produceContent(pageName,JSON.parse(data.result));
            });
        }
    });
};
var wisdom = new IntelLaw();

/**
 * 事件响应部分
 * */

wisdom.OnEvent('click', '.trans i', function (e) {
    wisdom.tipDelete($(this).parent());
    e.stopPropagation();
});
/*滑块部分*/
wisdom.OnEvent('click','.tabs',function(e){
    wisdom.tabClick(this,'','tab');
    e.stopPropagation();
});
wisdom.OnEvent('mouseenter','.tab_box',function(){
    wisdom.tabTrans($(this),"enter");
});
wisdom.OnEvent('mouseleave','.tab_box',function(){
    wisdom.tabTrans($(this),"leave");
});

wisdom.OnEvent('mouseenter','.stair',function(){
    $(this).children('span').addClass('c0086dd');
});
wisdom.OnEvent('mouseleave','.stair',function(){
    $(this).children('span').removeClass('c0086dd');

});
wisdom.OnEvent('click','.taga',function(e){
    wisdom.rSort($(this));
    e.stopPropagation();
});

wisdom.OnEvent('click','.nav_left a',function(e){
    /*校验token*/
    click_loginVerify(); // 校验token 是否失效
    //if(!click_tokenYX) return ;

    wisdom.navClick($(this));

    e.stopPropagation();
});
wisdom.OnEvent('click','.nav_left i',function(e){

    //console.log("点击");
    wisdom.navClickI($(this));
    e.stopPropagation();
});
//更多按钮点击
wisdom.OnEvent('click','.btnMore',function(e){
    wisdom.MoreClick($(this));
    e.stopPropagation();
});
//跳转
wisdom.OnEvent('click','.result_item h2',function(e){

    /*校验token*/
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ;

    var  title="&title="+encodeURI(encodeURI($(this).attr('title').replace(/<b>|<\/b>/g,"")))||"";
    if(wisdom.tabIndex==0){
        wisdom.Jump(wisdom.pages[wisdom.tabIndex] + ".html?title=" + encodeURI(encodeURI($(this).attr('title'))) + "&type=" + wisdom.tabIndex, "window");
    }else {
        wisdom.Jump(wisdom.pages[wisdom.tabIndex] + ".html?uniqid=" + $(this).attr('uid') + "&type=" + wisdom.tabIndex+title, "window");
    }
    e.stopPropagation();
});
//跳转2
wisdom.OnEvent('click','.result_item h3',function(e){
    /*校验token*/
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ;

    var  title="&title="+encodeURI(encodeURI($(this).attr('title').replace(/<b>|<\/b>/g,"")))||"";
    wisdom.Jump(wisdom.pages[wisdom.tabIndex]+".html?uniqid="+$(this).attr('uid')+"&type="+wisdom.tabIndex+title,"window");
    e.stopPropagation();
});
//文本跳转
wisdom.OnEvent('click','.txtBtn',function(e){
    /*校验token*/
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ;

    var  title="&title="+encodeURI(encodeURI($(this).parent('.other_btn').siblings('h2').attr('title').replace(/<b>|<\/b>/g,"")))||"";
    wisdom.Jump("textDetails.html?uniqid="+$(this).parents('.books_result_item').find('h2').attr('uid')+"&type="+wisdom.tabIndex+title,"window");
    e.stopPropagation();
});
//文本跳转2
wisdom.OnEvent('click','.chose_content',function(e){
    /*校验token*/
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ;

    var isChose,title;
    isChose=$(this).attr('isChose')=="true"?"&choseStatus=true":"";
    title="&title="+encodeURI(encodeURI($(this).siblings('.h2').find('h2').attr('title').replace(/<b>|<\/b>/g,"")))||"";
    if(isChose==""){}else{
        wisdom.Jump(wisdom.pages[wisdom.tabIndex]+".html?uniqid="+$(this).siblings('.h2').find('h2').attr('uid')+"&type="+wisdom.tabIndex+"&choseType="+$(this).attr('type')+isChose+title,"window");
    }
    e.stopPropagation();
});
$(document).ready(function () {
    //兼容
    wisdom.isCompatible();
   // 初始化
    wisdom.Init();
});

//获取要定位元素距离浏览器顶部的距离
var tabHeight = $(".tab_box").offset().top;
// 页面滚动到一定距离，固定tab栏
$(window).scroll(function() {
    //获取滚动条的滑动距离
    var scroH = $(this).scrollTop();
    // console.log(tabHeight)
    //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
    if (scroH >= tabHeight) {
        $('.main_top').css("margin-bottom", 56);
        $(".tab_box").addClass('tab_fixed');
    } else if (scroH < tabHeight) {
        $('.main_top').css("margin-bottom", 0);
        $(".tab_box").removeClass('tab_fixed');
    }
})