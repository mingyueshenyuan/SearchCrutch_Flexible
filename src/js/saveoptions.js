/* global searchselect_array search_custom_num isEmpty  dataBackup dataRecover */

AddSaveEventListener();
// Saves options to localStorage.
function save_options() {
    localStorage.setItem("custom_num", search_custom_num);

    var i;
    for (i = 0; i < getStaticLength() + search_custom_num; i++) {
        var cb_id = "cb_" + i;
        localStorage.setItem(cb_id, $(cb_id).checked ? "checked" : "no");
        //localStorage[cb_id] = $(cb_id).checked ? "checked" : "no";
    }
    //var vav="";
    for (i = 0; i < search_custom_num; i++) {
        var custom_name_id = "custom_name_" + i;
        var custom_search_id = "custom_search_" + i;
        
        localStorage.setItem(custom_name_id, $(custom_name_id).value);
        localStorage.setItem(custom_search_id, $(custom_search_id).value);
        //vav+="\n"+localStorage.getItem(custom_name_id);
        //localStorage[custom_name_id] = $(custom_name_id).value;
        //localStorage[custom_search_id] = $(custom_search_id).value;
    }
    //alert("保存"+search_custom_num+vav);

    // localStorage["cb_switch"] = $("cb_switch").checked ? "checked" : "no";
    // localStorage["cb_switch_open_new_tab"] = $("cb_switch_open_new_tab").checked ? "checked" : "no";
    // localStorage["cb_autosync"] = $("cb_autosync").checked ? "checked" : "no";
    localStorage.setItem("cb_switch", $("cb_switch").checked ? "checked" : "no");
    localStorage.setItem("cb_switch_open_new_tab", $("cb_switch_open_new_tab").checked ? "checked" : "no");
    localStorage.setItem("cb_autosync", $("cb_autosync").checked ? "checked" : "no");

    chrome.extension.sendRequest({
        ask: 'reload'
    })

    ShowNotification(search_custom_num+"条选项已保存",1000);
    //createMenu();

}
function ShowNotification(info,time=1000,background= "#74b775"){
    var statusDiv = document.createElement("div");
    statusDiv.textContent = info;
    statusDiv.style.zIndex = 9999;
    statusDiv.style.width = "300px";
    statusDiv.style.height = "40px";
    statusDiv.style.background = background;
    statusDiv.style.position = "absolute";
    statusDiv.style.textAlign = "center";
    statusDiv.style.fontSize = "26px";
    statusDiv.style.top = (parseInt(document.body.scrollTop) + 0) + "px";
    statusDiv.style.left = (parseInt(document.body.scrollWidth) - 300) / 2 + "px";
    document.body.appendChild(statusDiv);
    setTimeout(function () {
        document.body.removeChild(statusDiv);
    }, time);

}
function explain() {
    if ($("div_exp").style.display == "none") {
        $("lb_imgg").className = "heighup";
        $("div_exp").style.display = "";
    } else {
        $("lb_imgg").className = "";
        $("div_exp").style.display = "none";
    }
}

function upload_options() {
    dataBackup();
    alert("数据备份成功！");
}

function download_options() {
    browser.storage.sync.get("backup_data", function (item) {
        if (isEmpty(item)) {
            alert("您尚未备份过数据，请先点击“备份数据”按钮进行备份！");
        } else {
            dataRecover();
            alert("数据恢复成功！");
            window.location.reload();
        }
    });
}

function AddSaveEventListener() {
    var count = search_custom_num + getStaticLength();
    for (i = 0; i < count; i++) {
        //获取id为cb_i的元素

        var checkbox = "cb_" + i;
        //给获取到的元素添加点击事件的监听器
        $(checkbox).addEventListener("click", save_options);
        if (i < count - getStaticLength()) {
            var custom_name = "custom_name_" + i;
            var custom_search = "custom_search_" + i;
            $(custom_name).addEventListener("input", save_options);
            $(custom_search).addEventListener("input", save_options);
        }
    }
    $("cb_switch").addEventListener("click", save_options);    //单击图标切换
    $("cb_switch_open_new_tab").addEventListener("click", save_options);    //单击图标切换
    //$("cb1_explain").addEventListener("click", explain);

    $("cb_autosync").addEventListener("click", save_options);      //自动同步云端数据
    $("cb_upload").addEventListener("click", upload_options);      //上传云端同步数据
    $("cb_download").addEventListener("click", download_options);  //下载云端同步数据
}
