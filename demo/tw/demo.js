// 初始化外掛程式

// 全域保存當前選中窗口
var g_iWndIndex = 0; //可以不用設置這個變數，有視窗參數的介面中，不用傳值，開發包會預設使用當前選擇視窗
$(function () {
	// 檢查外掛程式是否已經安裝過
	if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
		alert("您還未安裝過外掛程式，按兩下開發包目錄裡的WebComponents.exe安裝！");
		return;
	}

	// 初始化外掛程式參數及插入外掛程式
	WebVideoCtrl.I_InitPlugin(500, 300, {
		iWndowType: 2,
		cbSelWnd: function (xmlDoc) {
			g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
			var szInfo = "當前選擇的視窗編號：" + g_iWndIndex;
			showCBInfo(szInfo);
		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

	// 檢查外掛程式是否最新
	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
		alert("檢測到新的外掛程式版本，按兩下開發包目錄裡的WebComponents.exe升級！");
		return;
	}

	// 窗口事件綁定
	$(window).bind({
		resize: function () {
			var $Restart = $("#restartDiv");
			if ($Restart.length > 0) {
				var oSize = getWindowSize();
				$Restart.css({
					width: oSize.width + "px",
					height: oSize.height + "px"
				});
			}
		}
	});

	//初始化日期時間
	var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
	$("#starttime").val(szCurTime + " 00:00:00");
	$("#endtime").val(szCurTime + " 23:59:59");
});

// 顯示操作資訊
function showOPInfo(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#opinfo").html(szInfo + $("#opinfo").html());
}

// 顯示回檔資訊
function showCBInfo(szInfo) {
	szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
	$("#cbinfo").html(szInfo + $("#cbinfo").html());
}

// 格式化時間
function dateFormat(oDate, fmt) {
	var o = {
		"M+": oDate.getMonth() + 1, //月份
		"d+": oDate.getDate(), //日
		"h+": oDate.getHours(), //小時
		"m+": oDate.getMinutes(), //分
		"s+": oDate.getSeconds(), //秒
		"q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
		"S": oDate.getMilliseconds()//毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

// 獲取視窗尺寸
function getWindowSize() {
	var nWidth = $(this).width() + $(this).scrollLeft(),
		nHeight = $(this).height() + $(this).scrollTop();

	return { width: nWidth, height: nHeight };
}

// 打開選擇框 0：資料夾  1：文件
function clickOpenFileDlg(id, iType) {
	var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);

	if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
		$("#" + id).val(szDirPath);
	}
}

// 獲取本機參數
function clickGetLocalCfg() {
	var xmlDoc = WebVideoCtrl.I_GetLocalCfg();

	$("#netsPreach").val($(xmlDoc).find("BuffNumberType").eq(0).text());
	$("#wndSize").val($(xmlDoc).find("PlayWndType").eq(0).text());
	$("#rulesInfo").val($(xmlDoc).find("IVSMode").eq(0).text());
	$("#captureFileFormat").val($(xmlDoc).find("CaptureFileFormat").eq(0).text());
	$("#packSize").val($(xmlDoc).find("PackgeSize").eq(0).text());
	$("#recordPath").val($(xmlDoc).find("RecordPath").eq(0).text());
	$("#downloadPath").val($(xmlDoc).find("DownloadPath").eq(0).text());
	$("#previewPicPath").val($(xmlDoc).find("CapturePath").eq(0).text());
	$("#playbackPicPath").val($(xmlDoc).find("PlaybackPicPath").eq(0).text());
	$("#playbackFilePath").val($(xmlDoc).find("PlaybackFilePath").eq(0).text());
	$("#protocolType").val($(xmlDoc).find("ProtocolType").eq(0).text());

	showOPInfo("本機配置獲取成功！");
}

// 設置本機參數
function clickSetLocalCfg() {
	var arrXml = [],
		szInfo = "";

	arrXml.push("<LocalConfigInfo>");
	arrXml.push("<PackgeSize>" + $("#packSize").val() + "</PackgeSize>");
	arrXml.push("<PlayWndType>" + $("#wndSize").val() + "</PlayWndType>");
	arrXml.push("<BuffNumberType>" + $("#netsPreach").val() + "</BuffNumberType>");
	arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
	arrXml.push("<CapturePath>" + $("#previewPicPath").val() + "</CapturePath>");
	arrXml.push("<PlaybackFilePath>" + $("#playbackFilePath").val() + "</PlaybackFilePath>");
	arrXml.push("<PlaybackPicPath>" + $("#playbackPicPath").val() + "</PlaybackPicPath>");
	arrXml.push("<DownloadPath>" + $("#downloadPath").val() + "</DownloadPath>");
	arrXml.push("<IVSMode>" + $("#rulesInfo").val() + "</IVSMode>");
	arrXml.push("<CaptureFileFormat>" + $("#captureFileFormat").val() + "</CaptureFileFormat>");
	arrXml.push("<ProtocolType>" + $("#protocolType").val() + "</ProtocolType>");
	arrXml.push("</LocalConfigInfo>");

	var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

	if (0 == iRet) {
		szInfo = "本機配置設置成功！";
	} else {
		szInfo = "本機配置設置失敗！";
	}
	showOPInfo(szInfo);
}

// 窗口分割數
function changeWndNum(iType) {
	iType = parseInt(iType, 10);
	WebVideoCtrl.I_ChangeWndNum(iType);
}

// 登錄
function clickLogin() {
	var szIP = $("#loginip").val(),
		szPort = $("#port").val(),
		szUsername = $("#username").val(),
		szPassword = $("#password").val();

	if ("" == szIP || "" == szPort) {
		return;
	}

	var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
		success: function (xmlDoc) {
			showOPInfo(szIP + "登錄成功！");

			$("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");
			setTimeout(function () {
				$("#ip").val(szIP);
				getChannelInfo();
			}, 10);
		},
		error: function () {
			showOPInfo(szIP + "登錄失敗！");
		}
	});

	if (-1 == iRet) {
		showOPInfo(szIP + "已登錄過！");
	}
}

// 退出
function clickLogout() {
	var szIP = $("#ip").val(),
		szInfo = "";

	if (szIP == "") {
		return;
	}

	var iRet = WebVideoCtrl.I_Logout(szIP);
	if (0 == iRet) {
		szInfo = "退出成功！";

		$("#ip option[value='" + szIP + "']").remove();
		getChannelInfo();
	} else {
		szInfo = "退出失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 獲取設備資訊
function clickGetDeviceInfo() {
	var szIP = $("#ip").val();

	if ("" == szIP) {
		return;
	}

	WebVideoCtrl.I_GetDeviceInfo(szIP, {
		success: function (xmlDoc) {
			var arrStr = [];
			arrStr.push("設備名稱：" + $(xmlDoc).find("deviceName").eq(0).text() + "\r\n");
			arrStr.push("設備ID：" + $(xmlDoc).find("deviceID").eq(0).text() + "\r\n");
			arrStr.push("型號：" + $(xmlDoc).find("model").eq(0).text() + "\r\n");
			arrStr.push("設備序號：" + $(xmlDoc).find("serialNumber").eq(0).text() + "\r\n");
			arrStr.push("MAC地址：" + $(xmlDoc).find("macAddress").eq(0).text() + "\r\n");
			arrStr.push("主控版本：" + $(xmlDoc).find("firmwareVersion").eq(0).text() + " " + $(xmlDoc).find("firmwareReleasedDate").eq(0).text() + "\r\n");
			arrStr.push("編碼版本：" + $(xmlDoc).find("encoderVersion").eq(0).text() + " " + $(xmlDoc).find("encoderReleasedDate").eq(0).text() + "\r\n");

			showOPInfo(szIP + "獲取設備資訊成功！");
			alert(arrStr.join(""));
		},
		error: function () {
			showOPInfo(szIP + "獲取設備資訊失敗！");
		}
	});
}

// 獲取通道
function getChannelInfo() {
	var szIP = $("#ip").val(),
		oSel = $("#channels").empty(),
		nAnalogChannel = 0;

	if ("" == szIP) {
		return;
	}

	// 類比頻道
	WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("VideoInputChannel");
			nAnalogChannel = oChannels.length;

			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Camera " + (id < 9 ? "0" + id : id);
				}
				oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
			});
			showOPInfo(szIP + "獲取類比頻道成功！");
		},
		error: function () {
			showOPInfo(szIP + "獲取類比頻道失敗！");
		}
	});
	// 數位通道
	WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text(),
					online = $(this).find("online").eq(0).text();
				if ("false" == online) {// 過濾禁用的數位通道
					return true;
				}
				if ("" == name) {
					name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
				}
				oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
			});
			showOPInfo(szIP + "獲取數位通道成功！");
		},
		error: function () {
			showOPInfo(szIP + "獲取數位通道失敗！");
		}
	});
	// 零通道
	WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("ZeroVideoChannel");

			$.each(oChannels, function (i) {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					name = $(this).find("name").eq(0).text();
				if ("" == name) {
					name = "Zero Channel " + (id < 9 ? "0" + id : id);
				}
				if ("true" == $(this).find("enabled").eq(0).text()) {// 過濾禁用的零通道
					oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
				}
			});
			showOPInfo(szIP + "獲取零通道成功！");
		},
		error: function () {
			showOPInfo(szIP + "獲取零通道失敗！");
		}
	});
}

// 獲取數位通道
function clickGetDigitalChannelInfo() {
	var szIP = $("#ip").val(),
		iAnalogChannelNum = 0;

	$("#digitalchannellist").empty();

	if ("" == szIP) {
		return;
	}

	// 類比頻道
	WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			iAnalogChannelNum = $(xmlDoc).find("VideoInputChannel").length;
		},
		error: function () {

		}
	});

	// 數位通道
	WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
		async: false,
		success: function (xmlDoc) {
			var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

			$.each(oChannels, function () {
				var id = parseInt($(this).find("id").eq(0).text(), 10),
					ipAddress = $(this).find("ipAddress").eq(0).text(),
					srcInputPort = $(this).find("srcInputPort").eq(0).text(),
					managePortNo = $(this).find("managePortNo").eq(0).text(),
					online = $(this).find("online").eq(0).text(),
					proxyProtocol = $(this).find("proxyProtocol").eq(0).text();

				var objTr = $("#digitalchannellist").get(0).insertRow(-1);
				var objTd = objTr.insertCell(0);
				objTd.innerHTML = (id - iAnalogChannelNum) < 10 ? "D0" + (id - iAnalogChannelNum) : "D" + (id - iAnalogChannelNum);
				objTd = objTr.insertCell(1);
				objTd.width = "25%";
				objTd.innerHTML = ipAddress;
				objTd = objTr.insertCell(2);
				objTd.width = "15%";
				objTd.innerHTML = srcInputPort;
				objTd = objTr.insertCell(3);
				objTd.width = "20%";
				objTd.innerHTML = managePortNo;
				objTd = objTr.insertCell(4);
				objTd.width = "15%";
				objTd.innerHTML = "true" == online ? "線上" : "離線";
				objTd = objTr.insertCell(5);
				objTd.width = "25%";
				objTd.innerHTML = proxyProtocol;
			});
			showOPInfo(szIP + "獲取數位通道成功！");
		},
		error: function () {
			showOPInfo(szIP + " 沒有數位通道！");
		}
	});
}

// 開始預覽
function clickStartRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		iStreamType = parseInt($("#streamtype").val(), 10),
		iChannelID = parseInt($("#channels").val(), 10),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (oWndInfo != null) {// 已經在播放了，先停止
		WebVideoCtrl.I_Stop();
	}

	var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
		iStreamType: iStreamType,
		iChannelID: iChannelID,
		bZeroChannel: bZeroChannel
	});

	if (0 == iRet) {
		szInfo = "開始預覽成功！";
	} else {
		szInfo = "開始預覽失敗！";
	}

	showOPInfo(szIP + " " + szInfo);
}

// 停止預覽
function clickStopRealPlay() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止預覽成功！";
		} else {
			szInfo = "停止預覽失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 打開聲音
function clickOpenSound() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var allWndInfo = WebVideoCtrl.I_GetWindowStatus();
		// 迴圈遍歷所有視窗，如果有視窗打開了聲音，先關閉
		for (var i = 0, iLen = allWndInfo.length; i < iLen; i++) {
			oWndInfo = allWndInfo[i];
			if (oWndInfo.bSound) {
				WebVideoCtrl.I_CloseSound(oWndInfo.iIndex);
				break;
			}
		}

		var iRet = WebVideoCtrl.I_OpenSound();

		if (0 == iRet) {
			szInfo = "打開聲音成功！";
		} else {
			szInfo = "打開聲音失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 關閉聲音
function clickCloseSound() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_CloseSound();
		if (0 == iRet) {
			szInfo = "關閉聲音成功！";
		} else {
			szInfo = "關閉聲音失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 設置音量
function clickSetVolume() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iVolume = parseInt($("#volume").val(), 10),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_SetVolume(iVolume);
		if (0 == iRet) {
			szInfo = "音量設置成功！";
		} else {
			szInfo = "音量設置失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 抓圖
function clickCapturePic() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var szChannelID = $("#channels").val(),
			szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
			iRet = WebVideoCtrl.I_CapturePic(szPicName);
		if (0 == iRet) {
			szInfo = "抓圖成功！";
		} else {
			szInfo = "抓圖失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 開始錄影
function clickStartRecord() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var szChannelID = $("#channels").val(),
			szFileName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
			iRet = WebVideoCtrl.I_StartRecord(szFileName);
		if (0 == iRet) {
			szInfo = "開始錄影成功！";
		} else {
			szInfo = "開始錄影失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 停止錄影
function clickStopRecord() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_StopRecord();
		if (0 == iRet) {
			szInfo = "停止錄影成功！";
		} else {
			szInfo = "停止錄影失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 獲取對講通道
function clickGetAudioInfo() {
	var szIP = $("#ip").val();

	if ("" == szIP) {
		return;
	}

	WebVideoCtrl.I_GetAudioInfo(szIP, {
		success: function (xmlDoc) {
			var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel"),
				oSel = $("#audiochannels").empty();
			$.each(oAudioChannels, function () {
				var id = $(this).find("id").eq(0).text();

				oSel.append("<option value='" + id + "'>" + id + "</option>");
			});
			showOPInfo(szIP + "獲取對講通道成功！");
		},
		error: function () {
			showOPInfo(szIP + "獲取對講通道失敗！");
		}
	});
}

// 開始對講
function clickStartVoiceTalk() {
	var szIP = $("#ip").val(),
		iAudioChannel = parseInt($("#audiochannels").val(), 10),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (isNaN(iAudioChannel)) {
		alert("請選擇對講通道！");
		return;
	}

	var iRet = WebVideoCtrl.I_StartVoiceTalk(szIP, iAudioChannel);

	if (0 == iRet) {
		szInfo = "開始對講成功！";
	} else {
		szInfo = "開始對講失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 停止對講
function clickStopVoiceTalk() {
	var szIP = $("#ip").val(),
		iRet = WebVideoCtrl.I_StopVoiceTalk(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (0 == iRet) {
		szInfo = "停止對講成功！";
	} else {
		szInfo = "停止對講失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 啟用電子放大
function clickEnableEZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_EnableEZoom();
		if (0 == iRet) {
			szInfo = "啟用電子放大成功！";
		} else {
			szInfo = "啟用電子放大失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 禁用電子放大
function clickDisableEZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_DisableEZoom();
		if (0 == iRet) {
			szInfo = "禁用電子放大成功！";
		} else {
			szInfo = "禁用電子放大失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 啟用3D放大
function clickEnable3DZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Enable3DZoom();
		if (0 == iRet) {
			szInfo = "啟用3D放大成功！";
		} else {
			szInfo = "啟用3D放大失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 禁用3D放大
function clickDisable3DZoom() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Disable3DZoom();
		if (0 == iRet) {
			szInfo = "禁用3D放大成功！";
		} else {
			szInfo = "禁用3D放大失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 全屏
function clickFullScreen() {
	WebVideoCtrl.I_FullScreen(true);
}

// PTZ控制 9為自動，1,2,3,4,5,6,7,8為方向PTZ
var g_bPTZAuto = false;
function mouseDownPTZControl(iPTZIndex) {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iPTZSpeed = $("#ptzspeed").val(),
		bStop = false;

	if (bZeroChannel) {//零通道不支持雲台
		return;
	}

	if (oWndInfo != null) {
		if (9 == iPTZIndex && g_bPTZAuto) {
			iPTZSpeed = 0;// 自動開啟後，速度置為0可以關閉自動
			bStop = true;
		} else {
			g_bPTZAuto = false;// 點擊其他方向，自動肯定會被關閉
			bStop = false;
		}

		WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
			iPTZSpeed: iPTZSpeed,
			success: function (xmlDoc) {
				if (9 == iPTZIndex) {
					g_bPTZAuto = !g_bPTZAuto;
				}
				showOPInfo(oWndInfo.szIP + "開啟雲台成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "開啟雲台失敗！");
			}
		});
	}
}

// 方向PTZ停止
function mouseUpPTZControl() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(1, true, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "停止雲台成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "停止雲台失敗！");
			}
		});
	}
}

// 設置預置點
function clickSetPreset() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iPresetID = parseInt($("#preset").val(), 10);

	if (oWndInfo != null) {
		WebVideoCtrl.I_SetPreset(iPresetID, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "設置預置點成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "設置預置點失敗！");
			}
		});
	}
}

// 調用預置點
function clickGoPreset() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		iPresetID = parseInt($("#preset").val(), 10);

	if (oWndInfo != null) {
		WebVideoCtrl.I_GoPreset(iPresetID, {
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "調用預置點成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "調用預置點失敗！");
			}
		});
	}
}

//搜索錄影
var iSearchTimes = 0;
function clickRecordSearch(iType) {
	var szIP = $("#ip").val(),
		iChannelID = $("#channels").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val();

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {//零通道不支援錄影搜索
		return;
	}

	if (0 == iType) {//首次搜索
		$("#searchlist").empty();
		iSearchTimes = 0;
	}

	WebVideoCtrl.I_RecordSearch(szIP, iChannelID, szStartTime, szEndTime, {
		iSearchPos: iSearchTimes * 40,
		success: function (xmlDoc) {
			if ("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {

				for (var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if (szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>下載</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}

				iSearchTimes++;
				clickRecordSearch(1);//繼續搜索
			} else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				var iLength = $(xmlDoc).find("searchMatchItem").length;
				for (var i = 0; i < iLength; i++) {
					var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
					if (szPlaybackURI.indexOf("name=") < 0) {
						break;
					}
					var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
					var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
					var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

					var objTr = $("#searchlist").get(0).insertRow(-1);
					var objTd = objTr.insertCell(0);
					objTd.id = "downloadTd" + i;
					objTd.innerHTML = iSearchTimes * 40 + (i + 1);
					objTd = objTr.insertCell(1);
					objTd.width = "30%";
					objTd.innerHTML = szFileName;
					objTd = objTr.insertCell(2);
					objTd.width = "30%";
					objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(3);
					objTd.width = "30%";
					objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
					objTd = objTr.insertCell(4);
					objTd.width = "10%";
					objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + i + ");'>下載</a>";
					$("#downloadTd" + i).data("playbackURI", szPlaybackURI);
				}
				showOPInfo(szIP + "搜索錄影檔成功！");
			} else if ("NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
				setTimeout(function () {
					showOPInfo(szIP + "沒有錄影檔！");
				}, 50);
			}
		},
		error: function () {
			showOPInfo(szIP + "搜索錄影檔失敗！");
		}
	});
}

// 開始重播
function clickStartPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iChannelID = $("#channels").val(),
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val(),
		szInfo = "",
		bChecked = $("#transstream").prop("checked"),
		iRet = -1;

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {// 零通道不支持重播
		return;
	}

	if (oWndInfo != null) {// 已經在播放了，先停止
		WebVideoCtrl.I_Stop();
	}

	if (bChecked) {// 啟用轉碼重播
		var oTransCodeParam = {
			TransFrameRate: "16",// 0：全幀率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
			TransResolution: "2",// 255：Auto，3：4CIF，2：QCIF，1：CIF
			TransBitrate: "23"// 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
		};
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime,
			oTransCodeParam: oTransCodeParam
		});
	} else {
		iRet = WebVideoCtrl.I_StartPlayback(szIP, {
			iChannelID: iChannelID,
			szStartTime: szStartTime,
			szEndTime: szEndTime
		});
	}

	if (0 == iRet) {
		szInfo = "開始重播成功！";
	} else {
		szInfo = "開始重播失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 停止重播
function clickStopPlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Stop();
		if (0 == iRet) {
			szInfo = "停止重播成功！";
		} else {
			szInfo = "停止重播失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 開始倒放
function clickReversePlayback() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szIP = $("#ip").val(),
		bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		iChannelID = $("#channels").val(),
		szStartTime = $("#starttime").val(),
		szEndTime = $("#endtime").val(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	if (bZeroChannel) {// 零通道不支持重播
		return;
	}

	if (oWndInfo != null) {// 已經在播放了，先停止
		WebVideoCtrl.I_Stop();
	}

	var iRet = WebVideoCtrl.I_ReversePlayback(szIP, {
		iChannelID: iChannelID,
		szStartTime: szStartTime,
		szEndTime: szEndTime
	});

	if (0 == iRet) {
		szInfo = "開始倒放成功！";
	} else {
		szInfo = "開始倒放失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 單幀
function clickFrame() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Frame();
		if (0 == iRet) {
			szInfo = "單幀播放成功！";
		} else {
			szInfo = "單幀播放失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 暫停
function clickPause() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Pause();
		if (0 == iRet) {
			szInfo = "暫停成功！";
		} else {
			szInfo = "暫停失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 恢復
function clickResume() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_Resume();
		if (0 == iRet) {
			szInfo = "恢復成功！";
		} else {
			szInfo = "恢復失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 慢放
function clickPlaySlow() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlaySlow();
		if (0 == iRet) {
			szInfo = "慢放成功！";
		} else {
			szInfo = "慢放失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// 快放
function clickPlayFast() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
		szInfo = "";

	if (oWndInfo != null) {
		var iRet = WebVideoCtrl.I_PlayFast();
		if (0 == iRet) {
			szInfo = "快放成功！";
		} else {
			szInfo = "快放失敗！";
		}
		showOPInfo(oWndInfo.szIP + " " + szInfo);
	}
}

// OSD時間
function clickGetOSDTime() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		var szTime = WebVideoCtrl.I_GetOSDTime();
		if (szTime != -1) {
			$("#osdtime").val(szTime);
			showOPInfo(oWndInfo.szIP + "獲取OSD時間成功！");
		} else {
			showOPInfo(oWndInfo.szIP + "獲取OSD時間失敗！");
		}
	}
}

// 下載錄影
var iDownloadID = -1;
var tDownloadProcess = 0;
function clickStartDownloadRecord(i) {
	var szIP = $("#ip").val(),
		szChannelID = $("#channels").val(),
		szFileName = szIP + "_" + szChannelID + "_" + new Date().getTime(),
		szPlaybackURI = $("#downloadTd" + i).data("playbackURI");

	if ("" == szIP) {
		return;
	}

	iDownloadID = WebVideoCtrl.I_StartDownloadRecord(szIP, szPlaybackURI, szFileName);

	if (iDownloadID < 0) {
		var iErrorValue = WebVideoCtrl.I_GetLastError();
		if (34 == iErrorValue) {
			showOPInfo(szIP + "已下載！");
		} else if (33 == iErrorValue) {
			showOPInfo(szIP + "空間不足！");
		} else {
			showOPInfo(szIP + "下載失敗！");
		}
	} else {
		$("<div id='downProcess' class='freeze'></div>").appendTo("body");
		tDownloadProcess = setInterval("downProcess(" + i + ")", 1000);
	}
}
// 下載進度
function downProcess() {
	var iStatus = WebVideoCtrl.I_GetDownloadStatus(iDownloadID);
	if (0 == iStatus) {
		$("#downProcess").css({
			width: $("#searchlist").width() + "px",
			height: "100px",
			lineHeight: "100px",
			left: $("#searchlist").offset().left + "px",
			top: $("#searchlist").offset().top + "px"
		});
		var iProcess = WebVideoCtrl.I_GetDownloadProgress(iDownloadID);
		if (iProcess < 0) {
			clearInterval(tDownloadProcess);
			tDownloadProcess = 0;
			m_iDownloadID = -1;
		} else if (iProcess < 100) {
			$("#downProcess").text(iProcess + "%");
		} else {
			$("#downProcess").text("100%");
			setTimeout(function () {
				$("#downProcess").remove();
			}, 1000);

			WebVideoCtrl.I_StopDownloadRecord(iDownloadID);

			showOPInfo("錄影下載完成");
			clearInterval(tDownloadProcess);
			tDownloadProcess = 0;
			m_iDownloadID = -1;
		}
	} else {
		WebVideoCtrl.I_StopDownloadRecord(iDownloadID);

		clearInterval(tDownloadProcess);
		tDownloadProcess = 0;
		iDownloadID = -1;
	}
}

// 匯出設定檔
function clickExportDeviceConfig() {
	var szIP = $("#ip").val(),
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	var iRet = WebVideoCtrl.I_ExportDeviceConfig(szIP);

	if (0 == iRet) {
		szInfo = "匯出設定檔成功！";
	} else {
		szInfo = "匯出設定檔失敗！";
	}
	showOPInfo(szIP + " " + szInfo);
}

// 導入設定檔
function clickImportDeviceConfig() {
	var szIP = $("#ip").val(),
		szFileName = $("#configFile").val();

	if ("" == szIP) {
		return;
	}

	if ("" == szFileName) {
		alert("請選擇設定檔！");
		return;
	}

	var iRet = WebVideoCtrl.I_ImportDeviceConfig(szIP, szFileName);

	if (0 == iRet) {
		WebVideoCtrl.I_Restart(szIP, {
			success: function (xmlDoc) {
				$("<div id='restartDiv' class='freeze'>重啟中...</div>").appendTo("body");
				var oSize = getWindowSize();
				$("#restartDiv").css({
					width: oSize.width + "px",
					height: oSize.height + "px",
					lineHeight: oSize.height + "px",
					left: 0,
					top: 0
				});
				setTimeout("reconnect('" + szIP + "')", 20000);
			},
			error: function () {
				showOPInfo(szIP + "重啟失敗！");
			}
		});
	} else {
		showOPInfo(szIP + "導入失敗！");
	}
}

// 重連
function reconnect(szIP) {
	WebVideoCtrl.I_Reconnect(szIP, {
		success: function (xmlDoc) {
			$("#restartDiv").remove();
		},
		error: function () {
			setTimeout(function () { reconnect(szIP); }, 5000);
		}
	});
}

// 開始升級
m_tUpgrade = 0;
function clickStartUpgrade(szIP) {
	var szIP = $("#ip").val(),
		szFileName = $("#upgradeFile").val();

	if ("" == szIP) {
		return;
	}

	if ("" == szFileName) {
		alert("請選擇升級檔！");
		return;
	}

	var iRet = WebVideoCtrl.I_StartUpgrade(szIP, szFileName);
	if (0 == iRet) {
		m_tUpgrade = setInterval("getUpgradeStatus('" + szIP + "')", 1000);
	} else {
		showOPInfo(szIP + "升級失敗！");
	}
}

// 獲取升級狀態
function getUpgradeStatus(szIP) {
	var iStatus = WebVideoCtrl.I_UpgradeStatus();
	if (iStatus == 0) {
		var iProcess = WebVideoCtrl.I_UpgradeProgress();
		if (iProcess < 0) {
			clearInterval(m_tUpgrade);
			m_tUpgrade = 0;
			showOPInfo(szIP + "獲取進度失敗！");
			return;
		} else if (iProcess < 100) {
			if (0 == $("#restartDiv").length) {
				$("<div id='restartDiv' class='freeze'></div>").appendTo("body");
				var oSize = getWindowSize();
				$("#restartDiv").css({
					width: oSize.width + "px",
					height: oSize.height + "px",
					lineHeight: oSize.height + "px",
					left: 0,
					top: 0
				});
			}
			$("#restartDiv").text(iProcess + "%");
		} else {
			WebVideoCtrl.I_StopUpgrade();
			clearInterval(m_tUpgrade);
			m_tUpgrade = 0;

			$("#restartDiv").remove();

			WebVideoCtrl.I_Restart(szIP, {
				success: function (xmlDoc) {
					$("<div id='restartDiv' class='freeze'>重啟中...</div>").appendTo("body");
					var oSize = getWindowSize();
					$("#restartDiv").css({
						width: oSize.width + "px",
						height: oSize.height + "px",
						lineHeight: oSize.height + "px",
						left: 0,
						top: 0
					});
					setTimeout("reconnect('" + szIP + "')", 20000);
				},
				error: function () {
					showOPInfo(szIP + "重啟失敗！");
				}
			});
		}
	} else if (iStatus == 1) {
		WebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + "升級失敗！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	} else if (iStatus == 2) {
		mWebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + "語言不匹配！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	} else {
		mWebVideoCtrl.I_StopUpgrade();
		showOPInfo(szIP + "獲取狀態失敗！");
		clearInterval(m_tUpgrade);
		m_tUpgrade = 0;
	}
}

// 檢查外掛程式版本
function clickCheckPluginVersion() {
	var iRet = WebVideoCtrl.I_CheckPluginVersion();
	if (0 == iRet) {
		alert("您的外掛程式版本已經是最新的！");
	} else {
		alert("檢測到新的外掛程式版本！");
	}
}

// 遠端配置庫
function clickRemoteConfig() {
	var szIP = $("#ip").val(),
		iDevicePort = parseInt($("#deviceport").val(), 10) || "",
		szInfo = "";

	if ("" == szIP) {
		return;
	}

	var iRet = WebVideoCtrl.I_RemoteConfig(szIP, {
		iDevicePort: iDevicePort,
		iLan: 1
	});

	if (-1 == iRet) {
		szInfo = "調用遠端配置庫失敗！";
	} else {
		szInfo = "調用遠端配置庫成功！";
	}
	showOPInfo(szIP + " " + szInfo);
}

function clickRestoreDefault() {
	var szIP = $("#ip").val(),
		szMode = "basic";
	WebVideoCtrl.I_RestoreDefault(szIP, szMode, {
		success: function (xmlDoc) {
			$("#restartDiv").remove();
			showOPInfo(szIP + " 恢復預設參數成功！");
			//恢復完成後需要重啟
			WebVideoCtrl.I_Restart(szIP, {
				success: function (xmlDoc) {
					$("<div id='restartDiv' class='freeze'>重啟中...</div>").appendTo("body");
					var oSize = getWindowSize();
					$("#restartDiv").css({
						width: oSize.width + "px",
						height: oSize.height + "px",
						lineHeight: oSize.height + "px",
						left: 0,
						top: 0
					});
					setTimeout("reconnect('" + szIP + "')", 20000);
				},
				error: function () {
					showOPInfo(szIP + "重啟失敗！");
				}
			});
		},
		error: function () {
			showOPInfo(szIP + "恢復預設參數失敗！");
		}
	});
}

function PTZZoomIn() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(10, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "調焦+成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "調焦+失敗！");
			}
		});
	}
}

function PTZZoomout() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(11, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "調焦-成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "調焦-失敗！");
			}
		});
	}
}

function PTZZoomStop() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(11, true, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "調焦停止成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "焦停止失敗！");
			}
		});
	}
}

function PTZFocusIn() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(12, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + "聚焦+成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "聚焦+失敗！");
			}
		});
	}
}

function PTZFoucusOut() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(13, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "  聚焦-失敗！");
			}
		});
	}
}

function PTZFoucusStop() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(12, true, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "  聚焦停止失敗！");
			}
		});
	}
}

function PTZIrisIn() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(14, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 光圈+成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "  光圈+失敗！");
			}
		});
	}
}

function PTZIrisOut() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(15, false, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 光圈-成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "  光圈-失敗！");
			}
		});
	}
}

function PTZIrisStop() {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

	if (oWndInfo != null) {
		WebVideoCtrl.I_PTZControl(14, true, {
			iWndIndex: g_iWndIndex,
			success: function (xmlDoc) {
				showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
			},
			error: function () {
				showOPInfo(oWndInfo.szIP + "  光圈停止失敗！");
			}
		});
	}
}

dateFormat = function (oDate, fmt) {
	var o = {
		"M+": oDate.getMonth() + 1, //月份
		"d+": oDate.getDate(), //日
		"h+": oDate.getHours(), //小時
		"m+": oDate.getMinutes(), //分
		"s+": oDate.getSeconds(), //秒
		"q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
		"S": oDate.getMilliseconds()//毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

// 切換模式
function changeIPMode(iType) {
	var arrPort = [0, 7071, 80];

	$("#serverport").val(arrPort[iType]);
}

// 獲取設備IP
function clickGetDeviceIP() {
	var iDeviceMode = parseInt($("#devicemode").val(), 10),
		szAddress = $("#serveraddress").val(),
		iPort = parseInt($("#serverport").val(), 10) || 0,
		szDeviceID = $("#deviceid").val(),
		szDeviceInfo = "";

	szDeviceInfo = WebVideoCtrl.I_GetIPInfoByMode(iDeviceMode, szAddress, iPort, szDeviceID);

	if ("" == szDeviceInfo) {
		showOPInfo("設備IP和埠解析失敗！");
	} else {
		showOPInfo("設備IP和埠解析成功！");

		var arrTemp = szDeviceInfo.split("-");
		$("#loginip").val(arrTemp[0]);
		$("#deviceport").val(arrTemp[1]);
	}
}

