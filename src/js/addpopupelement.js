addPopupElement();
function addPopupElement() {
    var count = parseInt(search_custom_num) + getStaticLength();
    //alert(count+"!!!");
    var table = document.getElementById("table");
    for (var i = 0; i < count; i++) {
        //把行添加到表格中
        if (i < getStaticLength()) {
            continue;
        }
        table.appendChild(GetPopupRow(i));
    }
    function GetPopupRow(i) {

        //创建一行
        var row = document.createElement("a");
        row.id = "a_" + i;
        row.href = "javascript:redirect(" + i + ");";
        row.value = "自定" + i;
        return row;
    }
}