
//      这是一些控制设置页面的隐藏与显示           //

function windows_close(id) {
    document.getElementById(id).style.display="none";
}
function show_help() {
    alert("扫雷是一款大众类的益智小游戏,于1992年发行。游戏目标是在最短的时间内根据点击格子出现的数字找出所有非雷格子,同时避免踩雷,踩到一个雷即全盘皆输。");
}
function show_zdy() {
    document.getElementById("zdy").style.display="block";
}
function show_lang() {
    document.getElementById("lang").style.display="block";
}
function show_xsjc() {
    swc_xsjc=1;
    document.getElementById("xsjc").style.display="block";
}
