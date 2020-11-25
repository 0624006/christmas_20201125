var d = "";  //作為判斷enter或方向鍵用

/***********/
/* Loading */
/***********/
document.onreadystatechange = function () {
	if (document.readyState === "complete") {
		$('#loading').fadeOut();
		$('.container').fadeIn();
		console.log(document.readyState);
		$('#open_present_frame').focus();/* 20201110 */
	};
}


$(function () {
	/* 20201116  */
	var count_all = 1; //查詢資料庫是否有獎序，無則設定1，有就回傳目前最大值，此為判斷抽取上一人的btn用
	d = "0";//初始enter
	if (count_all > "1") {
		$("#christmasMan").attr("data-target", "#myModal");
	}

	// var count_allDet = count_all; //php回傳目前抽取之最大值
	// if (count_all != '0') {
	// 	//當資料庫有數值，重整或誤按關閉就不跳出輸入視窗
	// 	$('#Fkindex').attr('style', 'opacity:0; z-index:-9999;');
	// 	d = "0";
	// 	/*
	// 	php迴圈跑五個，替換msg_wds，呼叫list_emAdd()產生框
	// 	msg_wds = `獎序：0 <br>部門：${list_all[count_str][0]}<br>工號：${list_all[count_str][1]}<br>姓名：${list_all[count_str][2]} `;
	// 	list_emAdd();
	// 	*/
	// };
	/* 20201116  */

	// list_all:預設陣列 ; count_str:起始陣列數 ; 加入資料庫後可刪
	let list_all = [["MIS", "09136", "林鈺真"], ["MIS", "07076", "陳達韋"], ["MIS", "02001", "楊宗原"]];
	var count_str = 0;

	var bgC = 1; //背景圖數
	$("#iframe_bg" + bgC).toggleClass("bg"); //初始背景1
	var msg_wds = ''; //當前獲獎人字串


	/*****************************/
	/** function gift & msg動畫 **/
	/****************************/
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

	/*************************/
	/* enter / 點選禮物盒觸發 */
	/************************/
	function enter_fu(click_data) {
		//2020116_edit
		count_all += 1;
		d = "-1";//防止連續點enter
		//2020116_edit

		/* 20201110 */
		if (click_data != "Previous") {
			msg_wds = `部門：${list_all[count_str][0]}<br>工號：${list_all[count_str][1]}<br>姓名：${list_all[count_str][2]} `;
		}
		/* 20201110 */
		console.log(msg_wds);
		document.getElementById('msg').innerHTML = msg_wds;

		//判斷陣列數，換成資料庫可刪
		if (count_str != list_all.length - 1) {
			count_str += 1;
		} else {
			count_str = 0;
		}

		console.log("enter");
		/* 20201112 */
		setTimeout(function () {
			d = "1"; //限制左右方向鍵
		}, 2500);
		/* 20201112 */
		gift();
		msg();
	}

	/***********************/
	/* 重新抽取當前獎項人選 */
	/**********************/
	function new_fu() {
		gift();
		msg();
		//2020116_edit
		d = "0";//判斷按鍵enter	
		$('#open_present_frame').focus();
		// //延遲1s自動抽取，此時案enter不會重複觸發
		// setTimeout(function () {
		// 	enter_fu();
		// }, 800);
		//2020116_edit
	}

	/******************/
	/*** 清空獎項欄位 **/
	/******************/
	function btnSuc_fun() {
		alert("clear");

		/* 清除資料庫紀錄抽取編號之資料欄位，並重新整理 */

		setTimeout(function () {
			location.reload();
		}, 500);
	}


	/******************/
	/**   keycode    **/
	/******************/
	document.addEventListener("keyup", event => {
		if (event.isComposing || event.keyCode === 40 || event.keyCode === 83) {  //按方向鍵"下"
			console.log(bgC);
			$("#iframe_bg" + bgC).toggleClass("bg");
			if (bgC === 3) {
				bgC = 1;
			} else {
				bgC += 1;
			};
			$("#iframe_bg" + bgC).toggleClass("bg");
		} else {
			switch (d) {
				case "0":
					// Enter
					if (event.isComposing || event.keyCode === 13) {
						enter_fu();
						return;
					}
					break;
				case "1":
					/* 20201110 */
					// Next
					if (event.isComposing || event.keyCode === 39 || event.keyCode === 68) {
						$('#WR_NEXT').click();
						return;
					}
					// New
					if (event.isComposing || event.keyCode === 37 || event.keyCode === 65) {
						$('#WR_NEW').click();
						return;
					}
					break;
				/* 20201110 */
				default:
					break;
			};
		};

	});


	/******************/
	/**    click     **/
	/******************/
	/* 20201110 */
	$('#WR_NEXT').off('click').on('click', function () {
		d = "0";//判斷按鍵enter	
		// count_allDet += 1;//20201116
		if (count_all > "1") {
			$("#christmasMan").attr("data-target", "#myModal");
		}
		gift();
		msg();
	});
	/* 20201110 */

	$('#open_present_frame').off('click').on('click', function () {
		enter_fu();
	});
	/******************/
	/** modal通知視窗 **/
	/******************/
	$('#myModal').on('show.bs.modal', function (e) {
		var t = d;//暫存當前按鍵
		d = "-1"; //禁止modal彈出後按任何按鍵
		//獲取點擊打開的按鈕
		var button = $(e.relatedTarget);
		//根據標籤傳入參數
		var recipient = button.data('whatever');
		console.log(recipient);
		if (recipient === 'star') {
			md_content.innerHTML = "\
			<h4><font class='bg-danger text-white'>請注意！</font></br></h4>\
			此動作將清空已抽取獎項之紀錄，</br>\
			請再次確認是否要清空資料？";
			$('#bt_suc').off('click').on('click', btnSuc_fun);
		};
		if (recipient === 'WR_NEW') {
			md_content.innerHTML = "<h4><font class='bg-danger text-white'>請確認是否重新抽取人選！</font></h4>";
			$('#bt_suc').off('click').on('click', new_fu);
		};
		/* 20201112 */
		if (recipient === 'christmasMan') {
			md_content.innerHTML = "<h4><font class='bg-danger text-white'>請確認是否取回前一位得獎者！</font></h4>";
			$('#bt_suc').off('click').on('click', function () {
				enter_fu("Previous");
			});
		};
		/* 20201112 */
		$('#btn_clo').off('click').on('click', function () { d = t; }); // close後返還當前按鍵值

	});


	/******************/
	/**svg tree_light**/
	/******************/
	var bg_treeLight = document.querySelectorAll(".tree_light");
	var tree_light_D = 0.0;
	bg_treeLight.forEach(function (Tlight) {
		var bg_treeLight_color = Tlight.getAttribute('fill');
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



});
