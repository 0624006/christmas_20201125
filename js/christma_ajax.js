// var d = "";  //作為判斷enter或方向鍵用
var count_all = ""; //計數用
var bgC = "";//背景切換數1-3
var msg_wds = "";//當前獲獎人字串
var bg_treeLight = "", tree_light_D = "", bg_treeLight_color = "";//svg
var _flag_Enter = true, _flag_NtNw = false;//svg控制用
var emp_no, emp_name, emp_dep;
var xhr = new XMLHttpRequest();

// Loading載入後執行
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        $('#loading').fadeOut();
        $('.container').fadeIn();
        console.log(document.readyState);
        $('#open_present_frame').focus();
    };
}

$(function () {
    count_all("ajax/emp_lottery.php", "action=emp_lottery_num_row");//設定初始值與modal_get

    bgC = 1;
    $("#iframe_bg" + bgC).toggleClass("bg");
    // 初始狀態設定

    // modal通知視窗
    $('#myModal').on('show.bs.modal', function (e) {
        _flag_Enter = false;
        _flag_NtNw = false;
        //獲取點擊打開的按鈕
        var button = $(e.relatedTarget);
        //根據標籤傳入參數
        var recipient = button.data('whatever');
        console.log(recipient);
        switch (recipient) {
            case 'star':
                md_content.innerHTML = "\
                <h4><font class='bg-danger text-white'>請注意！</font></br></h4>\
                此動作將清空已抽取獎項之紀錄，</br>\
                請再次確認是否要清空資料？";
                $('#bt_suc').off('click').on('click', function () {
                    btnSuc_fun();
                });
                $('#btn_clo').off('click').on('click', function () { }); // close後返還當前按鍵值
                break;
            case 'WR_NEW':
                md_content.innerHTML = "<h4><font class='bg-danger text-white'>請確認是否重新抽取人選！</font></h4>";
                $('#bt_suc').off('click').on('click', function () {
                    new_fu();
                });
                $('#btn_clo').off('click').on('click', function () {
                    _flag_NtNw = true;
                }); // close後返還當前按鍵值
                break;
            case 'christmasMan':
                md_content.innerHTML = "<h4><font class='bg-danger text-white'>請確認是否取回前一位得獎者！</font></h4>";
                $('#bt_suc').off('click').on('click', function () {
                    lottery_previous();//呼叫抽取前一位之ajax
                });
                $('#btn_clo').off('click').on('click', function () { }); // close後返還當前按鍵值
                break;
            default:
                break;
        }

    });

    // keyup
    document.addEventListener("keyup", event => {
        if (event.isComposing || event.keyCode === 40 || event.keyCode === 83) {  //按方向鍵"下"
            $("#iframe_bg" + bgC).toggleClass("bg");
            if (bgC === 3) {
                bgC = 1;
            } else {
                bgC += 1;
            };
            $("#iframe_bg" + bgC).toggleClass("bg");
        }
        // Enter
        if ((event.isComposing || event.keyCode === 13) && _flag_Enter) { $('#open_present_frame').click(); };
        // Next，重抽
        if ((event.isComposing || event.keyCode === 39 || event.keyCode === 68) && _flag_NtNw) { $('#WR_NEXT').click(); };
        // New，下一位
        if ((event.isComposing || event.keyCode === 37 || event.keyCode === 65) && _flag_NtNw) { $('#WR_NEW').click(); };
    });


    // click
    $('#WR_NEXT').off('click').on('click', function () {
        if (count_all > "0") {
            $("#christmasMan").attr("data-target", "#myModal");
        }
        gift();
        msg();
        _flag_NtNw = false;
        _flag_Enter = true;
        lottery_nextupdate();//呼叫更新資料lottery之ajax
    });

    $('#open_present_frame').off('click').on('click', function () {
        lottery(); //呼叫抽取之ajax
    });

    // enter / 點選禮物盒觸發動畫 
    function enter_fu() {
        _flag_Enter = false;
        console.log(msg_wds);
        $('#msg').html(msg_wds);
        setTimeout(function () {
            _flag_NtNw = true;
        }, 2500);
        gift();
        msg();
    }

    // new / 重新抽取當前獎項人選 
    function new_fu() {
        lottery_newupdate();//呼叫重抽脂ajax元資料列lottery值變為0
        count_all -= 1;
        gift();
        msg();
        console.log(count_all);
        _flag_Enter = true;
    }

    // 清空獎項欄位 
    function btnSuc_fun() {
        alert("clear");
        deleteAll();//呼叫將lottery重製為0
        setTimeout(function () {
            location.reload();
        }, 500);
    }

    //動畫
    function gift() {
        $('#open_present_top').attr("class", function (index, attr) { return attr == "open_present_top" ? null : "open_present_top"; });
        $('#present_bgLight').attr("class", function (index, attr) { return attr == "present_bgLight" ? null : "present_bgLight"; });
        $('#present_bear').attr("class", function (index, attr) { return attr == "present_bear" ? null : "present_bear"; });
        $('#present_card').attr("class", function (index, attr) { return attr == "present_card" ? null : "present_card"; });
        $('#present_balloon').attr("class", function (index, attr) { return attr == "present_balloon" ? null : "present_balloon"; });
    }
    function msg() {
        $("#msg_bg").fadeToggle(1000);
        setTimeout(function () {
            $("#msg_bgD").stop(true, true).animate({
                opacity: "toggle"
            }, 0);
            $("#msg_content").attr("class", function (index, attr) { return attr == "msg_contentS" ? null : "msg_contentS"; });
            $(".msg").toggleClass("msg_contentS");
        }, 200);
    }

    //svg tree_light
    bg_treeLight = document.querySelectorAll(".tree_light");
    tree_light_D = 0.0;
    bg_treeLight.forEach(function (Tlight) {
        bg_treeLight_color = Tlight.getAttribute('fill');
        switch (bg_treeLight_color) {
            case '#F44336':
                Tlight.setAttribute("style", "animation:" + `Tlight_R 1s ${tree_light_D}s linear infinite`);
                break;
            case '#FFEE58':
                Tlight.setAttribute("style", "animation:" + `Tlight_Y 1s ${tree_light_D}s linear infinite`);
                break;
            default:
                break;
        };
        tree_light_D += 0.2;
    });

    /* 測試用，亂數替代，產出min(含) ~ max(含)之間的值 */
    // function getRandom(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // };

    //_ajax_初始設定_data若沒有就設NULL
    function count_all(url, data) {
        xhr.open(
            "post",
            url,
            true
        );
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//post要加
        xhr.send(data);
        xhr.onload = function () {
            console.log(xhr.responseText); //有撈到資料
            var get_value = JSON.parse(xhr.responseText); //字串轉成資料
            console.log(get_value);
            count_all = get_value;
            if (count_all === "目前無報到人員") {
                d = "-1"; //禁止modal彈出後按任何按鍵
                alert("目前還未有任何人報到，無法進行抽獎！");
            } else {
                if (count_all > "0") {
                    $("#christmasMan").attr("data-target", "#myModal");
                }
            }
        };
    }

    //_ajax_清空資料庫
    function deleteAll() {
        $.ajax({
            url: 'ajax/emp_lottery.php',
            type: 'post',
            cache: false,
            dataType: 'text',
            data: {
                'action': 'emp_delete',
            },
            success: function (data) {
                console.log(data);
            },
            error: function (xhr) { alert("發生錯誤: " + xhr.status + " " + xhr.statusText); }
        });
    }

    //_ajax_抽獎
    function lottery() {
        $.ajax({
            url: 'ajax/emp_lottery.php',
            type: 'post',
            cache: false,
            dataType: 'json',
            data: {
                'action': 'emp_lottery',
            },
            success: function (data) {
                var Obj_len = Object.keys(data).length;
                console.log(Obj_len);
                if (Obj_len != 1) {
                    d = "-1"; //禁止modal彈出後按任何按鍵					
                    alert("人員數量小於獎項數量！");
                } else {
                    $.each(data, function (index, n) {
                        emp_dep = data[index].emp_dep;
                        emp_no = data[index].emp_no;
                        emp_name = data[index].emp_name;
                        msg_wds = `部門：${data[index].emp_dep} <br> 工號：${data[index].emp_no} <br> 姓名：${data[index].emp_name}`;//**資料更換
                        // document.getElementById('msg').innerHTML = msg_wds;
                        console.log(data, emp_dep, emp_no, emp_name);
                    });
                    count_all += 1;
                    enter_fu();
                }
            },
            error: function (xhr) { alert("發生錯誤: " + xhr.status + " " + xhr.statusText); }
        });
    }

    //_ajax_next抽取下一位更新資料庫lottery=count_all
    function lottery_nextupdate() {
        $.ajax({
            url: 'ajax/emp_lottery.php',
            type: 'post',
            cache: false,
            dataType: 'text',
            data: {
                'action': 'emp_lottery_nextupdate',
                'emp_no': emp_no,
                'emp_lottery_num': count_all,
            },
            success: function (data) {
                console.log(data);
            },
            error: function (xhr) { alert("發生錯誤: " + xhr.status + " " + xhr.statusText); }
        });
    }

    //_ajax_previous抽取上一位獲獎者
    function lottery_previous() {
        $.ajax({
            url: 'ajax/emp_lottery.php',
            type: 'post',
            cache: false,
            dataType: 'json',
            data: {
                'action': 'emp_lottery_previous',
                'emp_lottery_num': count_all,
            },
            success: function (data) {
                $.each(data, function (index, n) {
                    emp_dep = data[index].emp_dep;
                    emp_no = data[index].emp_no;
                    emp_name = data[index].emp_name;
                    msg_wds = `部門：${data[index].emp_dep} <br> 工號：${data[index].emp_no} <br> 姓名：${data[index].emp_name}`;//**資料更換
                    // document.getElementById('msg').innerHTML = msg_wds;
                    console.log(data, emp_dep, emp_no, emp_name);
                });
                enter_fu();
            },
            error: function (xhr) { alert("發生錯誤: " + xhr.status + " " + xhr.statusText); }
        });
    }

    //_ajax_New重抽新抽取
    function lottery_newupdate() {
        $.ajax({
            url: 'ajax/emp_lottery.php',
            type: 'post',
            cache: false,
            dataType: 'text',
            data: {
                'action': 'emp_lottery_newupdate',
                'emp_lottery_num': count_all,
            },
            success: function (data) { },
            error: function (xhr) { alert("發生錯誤: " + xhr.status + " " + xhr.statusText); }
        });
    }

});
