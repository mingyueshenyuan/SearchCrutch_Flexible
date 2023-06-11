addElement();
BtnListener();


function getCopyInfo() {
    var count = parseInt(search_custom_num);
    var arr = [];
    for (let index = 0; index < count; index++) {
        var obj = {};
        obj.content1 = document.getElementById("cb_" + (index + getStaticLength())).checked;
        obj.content2 = document.getElementById("custom_name_" + index).value;
        obj.content3 = document.getElementById("custom_search_" + index).value;
        arr.push(obj)
    }

    var text = JSON.stringify(arr);
    // 写入到剪贴板
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied!');
        })
        .catch(error => {
            console.error(error);
        });


    // 创建一个 Blob 对象
    var blob = new Blob([text], { type: "application/json" });

    // 创建一个 URL
    var url = URL.createObjectURL(blob);

    // 下载文件到本地
    chrome.downloads.download({
        url: url,
        filename: "json.txt",
        saveAs: true
    }, function (id) {
        console.log("Download started");
    });
}

async function recoverFromClipboard() {
    // 从剪贴板读取json字符串
    var text = await navigator.clipboard.readText();
    //alert(text);
    //return;
    // 将json字符串转换成数组
    var data = JSON.parse(text);
    resetValue(data);
}

function resetValue(data) {
    var count = parseInt(search_custom_num);
    var cureentCount = data.length;
    if (count > cureentCount) {
        onDeleteTableElement(count - cureentCount);
    } else {
        onAddTableElement(cureentCount - count);
    }
    ShowNotification("当前数量：" + cureentCount, 3000);
    //alert("当前数量：" + cureentCount);

    // 遍历数组中的每个对象
    for (var index = 0; index < cureentCount; index++) {

        var element1 = document.getElementById("cb_" + (index + getStaticLength()));
        var element2 = document.getElementById("custom_name_" + index);
        var element3 = document.getElementById("custom_search_" + index);
        // 获取对象的属性
        element1.checked = data[index].content1;
        element2.value = data[index].content2;
        element3.value = data[index].content3;
    }
    save_options();

}

function chooseJsonText() {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    // 支持多选
    //input.setAttribute("multiple", "multiple");
    input.accept="text/plain, application/json, .txt";
    
    input.addEventListener("change", (e) => {
        //let file = e.path[0].files[0];
        let file = e.composedPath()[0].files[0];

        // 创建一个 FileReader 对象
        let reader = new FileReader();
        // 设置读取文件的回调函数
        reader.onload = function (e) {
            // 将json字符串转换成数组
            var data = JSON.parse(e.target.result);
            resetValue(data);
        };
        // 以文本格式读取文件
        reader.readAsText(file);

    });
    input.click();
}

function deleteUnsetSearch() {
    var count = parseInt(search_custom_num);
    var arr = [];
    for (let index = 0; index < count; index++) {
        var obj = {};

        // 假设我们有一个字符串变量
        var str = document.getElementById("custom_search_" + index).value;
        // 使用正则表达式 /^\\s*$/ 来检查字符串是否只包含空白字符
        if (str.length == 0) {
            // 字符串为空或者只包含空白字符
            continue;
        }
        obj.content1 = document.getElementById("cb_" + (index + getStaticLength())).checked;
        obj.content2 = document.getElementById("custom_name_" + index).value;
        obj.content3 = str;
        arr.push(obj)
    }
    resetValue(arr);
}

function BtnListener() {
    var button = document.getElementById("cb_copy");
    button.addEventListener("click", function () {
        getCopyInfo();
    });

    var buttonpaste = document.getElementById("cb_paste");
    buttonpaste.addEventListener("click", function () {
        recoverFromClipboard();
    });
    var buttonloadFormText = document.getElementById("cb_loadFormText");
    buttonloadFormText.addEventListener("click", function () {
        chooseJsonText();
    });


    var deleteUnsetBtn = document.getElementById("deleteUnset");
    deleteUnsetBtn.addEventListener("click", function () {
        deleteUnsetSearch();
    });

    //获取按钮元素
    var button = document.getElementById("add");
    button.addEventListener("click", function () {
        onAddTableElement(1);
    });
}
function onAddTableElement(addCount) {
    var count = parseInt(search_custom_num);
    setCustomNum(count + addCount);
    for (let index = count; index < count + addCount; index++) {
        table.appendChild(GetRow(index));
    }
    AddSaveEventListener();
}
function onDeleteTableElement(deleteCount) {
    var count = parseInt(search_custom_num);
    setCustomNum(count - deleteCount);

    for (let index = count - deleteCount; index < count; index++) {
        var row = document.getElementById("row_" + index)
        table.removeChild(row);
    }
}

function GetRow(index) {
    //创建一行
    var row = document.createElement("tr");
    row.id = "row_" + index;
    //创建三个单元格
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    //创建复选框
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "cb_" + (index + getStaticLength()); //从cb_4开始编号
    //创建自定义名称的输入框
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.class = "copyInfo";
    nameInput.className = "custom_name";
    //nameInput.value="测试名称";
    nameInput.id = "custom_name_" + index; //从custom_name_0开始编号
    nameInput.placeholder = "名称,如:Google";
    //创建自定义网址的输入框
    var searchInput = document.createElement("input");
    searchInput.type = "text";
    //searchInput.value='searchInput';
    searchInput.className = "custom_search";
    searchInput.id = "custom_search_" + index; //从custom_search_0开始编号
    searchInput.placeholder = index + "网址,如:https://www.google.com/search?q=%s";
    //把元素添加到单元格中
    cell1.appendChild(checkbox);
    cell2.appendChild(nameInput);
    cell3.appendChild(searchInput);
    //把单元格添加到行中
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    return row;
}


function addElement() {
    //获取表格元素
    var table = document.getElementById("table");
    var count = search_custom_num;
    for (var i = 0; i < count; i++) {
        //把行添加到表格中
        table.appendChild(GetRow(i));
    }
}
