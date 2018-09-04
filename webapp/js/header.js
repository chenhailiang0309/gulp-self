var clickTag = false; // 默认未点击搜索

// 联想词兼容性写法
if (Utils.myBrowser() == 'IE8' || Utils.myBrowser() == 'IE9') {
    // 联想词搜索
    $('#search_inp').on('input propertychange', function() {
        clickTag = false; //重置点击标识

        if (Utils.trim($(this).val())) {
            var key_dropdown = new KeyDropdown();
            key_dropdown.init($(this).val());
        } else {
            $('#dropdown-wrapper').hide();
            $('#dropdown-wrapper').html('');
            // $('#dropdown-wrapper').stop().slideUp(300, function() {
            //     $('#dropdown-wrapper').html('');
            // });
        }
    });
} else {
    // 联想词搜索
    var flag = true;
    $('#search_inp').on('compositionstart', function() {
        flag = false;
    });

    $('#search_inp').on('compositionend', function() {
        flag = true;
    });

    $('#search_inp').on('input', function() {
        clickTag = false; //重置点击标识

        var _this = this;
        setTimeout(function() {
            if (flag) {
                // console.log($(_this).val());

                if (Utils.trim($(_this).val())) {
                    var key_dropdown = new KeyDropdown();
                    key_dropdown.init($(_this).val());
                } else {
                    $('#dropdown-wrapper').hide();
                    $('#dropdown-wrapper').html('');

                    // $('#dropdown-wrapper').stop().slideUp(300, function() {
                    //     $('#dropdown-wrapper').html('');
                    // });
                }
            }
        }, 0)
    });
}

$('#upload').on('click', '#upFile', function() {
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ; 

    clickTag = true; //点击搜索
})

// 上传文件 （设置缓存 使谷歌与其他浏览器一样）
$('#upload').on('change', '#upFile', function() {
    var file = $(this).val(),
        fileTypeArr = ['.docx', '.doc', '.txt'];

    if (file) {
        // 文件格式
        var fileType = Utils.getFileExt(file);
        if (!Utils.isInArray(fileTypeArr, fileType)) {
            alert("只允许上传doc,docx,txt类型文件");
            return false;
        }

        Search.file_cache = Utils.getFileName(file); // 有文件时 缓存  即使取消了，缓存并不清空
        if (window.FormData) {
            Search.file_stream_cache = $("#upload #upFile")[0].files[0]; // 有文件时 缓存  即使取消了，缓存并不清空
        }
    }

    // console.log($(this).val())
    // console.log(Search.file_cache)

    //避免 清空文件内容时 IE下chang事件 再次执行下面的代码
    if (Search.file_cache) { //缓存中有文件
        Search.type = 'file';
        Search.showFilename(); // 显示文件名
        var uploadFile = new Uploading();
        uploadFile.init(Search.file_cache);
    } else {
        Search.type = 'key';
        Search.hideFilename();
    }
});

// 上传文件  （针对谷歌 和 其他浏览器不同情况）
/*$('#upFile').on('change', function() {
    // console.log($(this).val())

    if ($(this).val()) {
        Search.type = 'file';

        var filename = $(this).val();
        $('#filename').text(Utils.getFileName(filename));
        $('#filename-wrapper-js').show();

        // var uploadFile = new Uploading();
        // uploadFile.init();
    } else {
        Search.type = 'key';

        $('#filename').text('');
        $('#filename-wrapper-js').hide();
    }
});*/

// 全局搜索
$('#searchBtn').on('click', function() {
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ; 

    clickTag = true; //点击搜索
    // console.log(Search.type);
    // console.log($('#upload #upFile').val())
    // console.log(Search.file_cache)
    if (Search.type == 'key') {
        Search.key();
    } else if (Search.type == 'file') {
        Search.file();
    }

    // 重新显示placeholder
    $('.placeholder').show();
    $('#search_inp').blur();
});

// 回车键检索
$(document).on('keydown', function(e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
        $('#searchBtn').trigger('click');
    }
    Utils.stopPropagation(e);
});

// 结果中搜索
$('#resultSearch').on('click', function() {
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ; 

    clickTag = true; //点击搜索
    if (Search.type == 'key') {
        Search.result();
    } else if (Search.type == 'file') {
        Search.file_R();
    }

    // 重新显示placeholder
    $('.placeholder').show();
    $('#search_inp').blur();

});

// 下拉框搜素
$('#dropdown-wrapper').on('click', '.dropdown li', function(e) {
    click_loginVerify(); // 校验token 是否失效
    if(!click_tokenYX) return ; 

    var val = $(this).attr('title');
    if ($(this).hasClass('law-item')) { // 法规
        Search.drop('law', val);
    } else if ($(this).hasClass('qa-item')) { // 问答
        Search.drop('qa', val);
    }
});


$(document).on('click', function() {
    $('#dropdown-wrapper').hide();
    $('#dropdown-wrapper').html('');

    // $('#dropdown-wrapper').stop().slideUp(300, function() {
    //     $('#dropdown-wrapper').html('');
    // });
});

// 关闭文件名
$('#close-filename-js').on('click', function() {
    Search.type = 'key'; // 重置为 key

    Search.hideFilename(); //隐藏文件名
});

//placeholder控制
$(".placeholder,.search_inp").click(function() {
    $(".search_inp").trigger('focus');
    $(".searchIpt ").addClass('searchIpt_focus');
});

$(".search_inp").focus(function() {
    $(".placeholder").hide();
})

$(".search_inp").blur(function() {
    $('.searchIpt ').removeClass('searchIpt_focus');

    if (Utils.trim($(".search_inp").val()) == '') {
        $(".placeholder").show();
    }
});