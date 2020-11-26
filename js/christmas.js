// var d = "";  //作為判斷enter或方向鍵用
var count_all = ""; //計數用
var bgC = "";//背景切換數1-3
var msg_wds = "";//當前獲獎人字串
var bg_treeLight = "", tree_light_D = "", bg_treeLight_color = "";//svg
var _flag_Enter = true, _flag_NtNw = false;//svg控制用

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
    count_all = 0;
    if (count_all != 0) $("#christmasMan").attr("data-target", "#myModal");
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
                $('#btn_clo').off('click').on('click', function () {                    
                }); // close後返還當前按鍵值
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
                    enter_fu("Previous");
                });
                $('#btn_clo').off('click').on('click', function () {                    
                }); // close後返還當前按鍵值
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
        if ((event.isComposing || event.keyCode === 13) && _flag_Enter) $('#open_present_frame').click();
        // Next，重抽
        if ((event.isComposing || event.keyCode === 39 || event.keyCode === 68) && _flag_NtNw) $('#WR_NEXT').click();
        // New，下一位
        if ((event.isComposing || event.keyCode === 37 || event.keyCode === 65) && _flag_NtNw) $('#WR_NEW').click();
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
    });

    $('#open_present_frame').off('click').on('click', function () {
        enter_fu();
    });

    // enter / 點選禮物盒觸發 
    function enter_fu(click_data) {
        _flag_Enter = false;
        if (click_data != "Previous") {
            count_all += 1;
            msg_wds = `部門：MIS </br> 工號：0000${getRandom(1, 9)} </br> 姓名：ＸＸＸＸ`;//**資料更換
        }
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
        count_all -= 1;
        gift();
        msg();
        console.log(count_all);
        _flag_Enter = true;
    }

    // 清空獎項欄位 
    function btnSuc_fun() {
        alert("clear");
        //資料更換，清除資料庫紀錄抽取編號之資料欄位，並重新整理 
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
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

});
