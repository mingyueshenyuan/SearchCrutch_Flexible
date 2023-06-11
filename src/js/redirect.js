/* global $ insertCustomArray GetHost inHostArray GetUrlParms searchhost_array searchselect_array SetNowLink */

AddCheckRedirect();
function AddCheckRedirect(){
    var count=parseInt(search_custom_num)+getStaticLength();
    for (i = 0; i < count; i++) {
        //获取id为cb_i的元素
        var _CheckRedirect = "a_"+ i;
        //给获取到的元素添加点击事件的监听器
        $(_CheckRedirect).addEventListener("click", CheckRedirect);
      }
}


function CheckRedirect() {
    var index = this.id.substr("a_".length);
    redirect(index);
}

function redirect(index) {
    var isOpenNewTab = localStorage["cb_switch_open_new_tab"] === 'checked'

    browser.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var tab = tabs[0];
        var q = "", newurl;
        insertCustomArray();
        var host = GetHost(tab.url);
        var i_host = inHostArray(host);
        var args = GetUrlParms(tab.url);
        //console.log(args)
        var search_key = searchselect_array[searchhost_array[i_host][1]][2];
        if (-1 < i_host) {
            if (search_key == "%s") {
                search_key = searchselect_array[searchhost_array[i_host][1]][1];
                search_key = search_key.toLowerCase();
                search_key = search_key.substring(0, search_key.indexOf("%s"));
                search_key = search_key.match(/[^?#&/]*$/);
                if (search_key != null) {
                    if (search_key[0].match("="))
                        search_key = search_key[0].replace("=", "");
                    else
                        search_key = "q";
                    q = args[search_key]; // search word
                } else {
                    q = args["q"]; // Protection, should not step into this
                }
            } else {
                q = args[search_key];
            }
        }
        search_key = searchselect_array[index][2];
        if (q) {
            if (search_key == "%s") {
                newurl = searchselect_array[index][1].replace(/%s/i, q);
            } else {
                newurl = searchselect_array[index][1] + q;
            }

        } else {
            newurl = searchselect_array[index][3];
        }


        if (isOpenNewTab) {
            chrome.tabs.create({url: newurl});
        } else {
            browser.tabs.update(tab.id, {url: newurl});
        }

    });
    SetNowLink(index);
}
