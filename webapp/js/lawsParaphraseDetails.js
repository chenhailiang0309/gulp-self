var gid=Request2("gid");
var tiao=Request2("tiao")
//判断userId是否存在
var render=function () {

};

render.prototype.getDocumentData=function () {
    var _this=this;
    var url=ip+'/witnet/search/queryparaphrase';
    var param={
        // "uniqid":"AWM-XOHh2OZYe8ihUlU8",
        "gid":gid,
        "tiao":tiao
    };
    jQuery.support.cors = true;
    $.ajax({
        type:'POST',
        url:url,
        data:JSON.stringify(param),
        dataType:'json',
        contentType: "application/json",
        // async:false,
        beforeSend: function () {
            $('.shadow').fadeIn();
        },
        success:function (res) {
            $('.shadow').fadeOut();
            if(!isEmpty(res.result)){
                var data=JSON.parse(res.result);
                // console.log(data)

                _this.spellPointsDetail(data);
            }else{
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
var arr=[];
render.prototype.spellPointsDetail=function (obj) {
    // if()
    var html='';
    //-------------------------基本信息

    for(var i=0,len=obj.length;i<len;i++){
        if(obj[i].tiaoNum==tiao){
            arr.push(obj[i])
        }
    }

    spellPage(0)

    var li='',html='';

    for(var k=0,lenk=arr.length;k<lenk;k++){
        li+='<li liid="'+k+'"><i></i><a href="javascript:void(0)">'+arr[k].comefromText+'</a></li>'
    }

    html+='<h3>全国人大法工委</h3>'+
        '<ul>'+li+'</ul>';
    $(".twsy_box").html(html);

    $(".twsy_box ul li").eq(0).addClass("on");

    $(".twsy_box").on("click","ul li",function () {
        if(!$(this).hasClass("on")){
            $(this).addClass("on").siblings("li").removeClass("on");
            var liid=$(this).attr("liid")
            spellPage(liid)
        }else{
            $(this).removeClass("on").addClass("on");
        }
    })

    // return arr;

};
function spellPage(index) {
    var tNum=arr[index].tiaoContent.substring(arr[index].tiaoContent.indexOf("第"),arr[index].tiaoContent.indexOf("第")+3)
    html='<h2>'+arr[index].fileTitle+tNum+'释义</h2>' +
        '<p class="source">来源：'+arr[index].comefromText+'</p>';
    $(".detail-title").html(html);
    var infoBox=[{"key":"tiaoContent","value":"条文内容"},{"key":"fulltext","value":"释义"}];
    html='';
    for(var n=0,len=infoBox.length;n<len;n++){
        var item=infoBox[n];
        if(arr[index][item.key]&&!isEmpty(arr[index][item.key])){
            html+='<div class="part"><h3><i></i>'+item.value+'</h3>'+
                '<p>'+arr[index][item.key]+'</p></div>';
        }
    }
    $(".left_details").html(html);
}
var Render=new render();
Render.getDocumentData();

