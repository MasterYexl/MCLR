//棋盘大小、地雷数
glb_width=19;
glb_height=19;
rance = 40;
relrance=0;
//生成地雷开关，在用户第一次点击时关闭
create_rance=1;
//棋盘
cbd=[];
time = 0;
//计时器开关，在用户第一次点击时打开
time_conter_swc=0;
//推荐设置
best_max_width=Math.ceil((window.screen.width-100)/20);
best_max_height=Math.ceil((window.screen.height-200)/20);
//计时面板和记雷面板长度，默认3
time_len=3;
rance_len=3;
//新手教程开关
swc_xsjc=0;
//地雷列表
list_="";

font_color = ["", "#0000aa", "#00aa00", "#aa0000", "#000077", "#007700", "#770000", "#000044", "#004400"];



//           页面与游戏显示设置              //



window.onload=function (ev) {
    //取消右击菜单事件
    document.oncontextmenu=function (ev1) {
        ev1.preventDefault();
    };
    start_new_game(glb_width,glb_height,rance);
};
//开始一个新游戏
function start_new_game(width_,height_,rance_) {
    //条件检测
    if (width_<6||height_<6||width_==null||height_==null) {
        alert("为保证游戏体验，宽度和高度最小为6!");
        return;
    }
    if (rance_<3) {
        alert("请设置2个以上的雷");
        return;
    }
    //最大值检测，不适用于手机端
    if (width_>best_max_width||height_>best_max_height) {
        if (confirm("设置的尺寸大于了您的屏幕分辨率\n（推荐大小为："+best_max_width+"×"+best_max_height+")\n继续生成会影响到显示效果\n如果显示不完全，请按ctrl➕-缩小网页\n是否继续？"));
        else return;
    }
    if (width_*height_*0.65+1<rance_){
        alert("推荐设置不超过"+Math.ceil(width_*height_*0.65)+"个雷!");
        return;
    }
    //隐藏自定义面板
    document.getElementById('zdy').style.display="none";
    glb_width=width_;
    glb_height=height_;
    rance=rance_;
    game_reset();
}
//重置游戏
function game_reset() {
    if (swc_xsjc==1) document.getElementById("tips").innerHTML="点击一个棋格以探索该区域";
    time=0;
    //将地雷数赋给一个可变值
    relrance=rance;
    //移除多余的数据显示格
    for (var i=3;i<time_len;i++) document.getElementById("time").removeChild(document.getElementById("time_add"+i));
    for (i=3;i<rance_len;i++) document.getElementById("rance").removeChild(document.getElementById("rance_add"+i));
    time_len=3;
    rance_len=3;
    document.getElementById("face").style.background="#cacaca url(\"number/face.bmp\")";
    document.getElementById("bcd").innerHTML="";
    iniCBD(glb_width, glb_height, rance);
    time_conter_swc=0;
}
//初始化棋盘
function iniCBD() {
    //设置棋盘可用
    document.getElementById("bcd").style.pointerEvents="auto";
    //刷新数据格
    show_time();
    cont_rance(rance);
    //创建棋盘容器
    for (var i=0;i<glb_height;i++){
        cbd[i] = [];
        //初始化值
        for (var j=0;j<glb_width;j++) cbd[i][j]=0;
    }
    var bcd = document.getElementById("bcd");
    var bod = document.getElementById("boder_");
    //调整游戏区域
    bcd.style.width = glb_width*20+"px";
    bcd.style.height = glb_height*20+"px";
    bod.style.width = (glb_width*20+35)+"px";
    bod.style.height = (glb_height*20+119)+"px";
    //生成游戏棋格
    for (i=0;i<glb_height;i++){
        for (j=0;j<glb_width;j++){
            var qizi = document.createElement("div");
            qizi.id=i+" "+j;
            qizi.className="qizi";
            //绑定左击、右击事件
            qizi.onclick = function () {qizi_click(this.id)};
            qizi.oncontextmenu=function (ev) { mark(this.id) };
            bcd.appendChild(qizi);
        }
    }
}
//格子点击事件
function qizi_click(id) {
    //判断是否启动计时器
    if (time_conter_swc==0) {
        time_conter_swc=1;
        show_time();
        time_conter();
        setRance(rance, id);
    }
    qizi = document.getElementById(id);
    //判断该棋格是否未被标记
    if (qizi.className=="qizi") {
        //设置当前棋格为被点击状态
        set_class_clicked(id);
        //解析id获取棋格的x，y属性
        var xy = qizi.id.split(" ");
        if (cbd[xy[0]][xy[1]]==9) {
            //失败处理，设置棋格区域不可操作
            document.getElementById("bcd").style.pointerEvents="none";
            //关闭计时器开关
            time_conter_swc=0;
            document.getElementById("face").style.background="#cacaca url(\"number/face_false.bmp\")";
            //显示出地雷
            var show_lis = list_.substr(2).split("    ");
            for (var i=1;i<show_lis.length-1;i++){
                var liss = show_lis[i];
                document.getElementById(liss).className="qizi_clicked";
                document.getElementById(liss).style.background="url(\"number/gray_rance.bmp\")";
            }
            document.getElementById(id).style.background="url(\"number/red_rance.bmp\")";
            if (swc_xsjc==1) document.getElementById("tips").innerHTML="真不幸！<br>你踩着地雷了，在没有绝对把握的情况下请谨慎探索数字较大的棋格周围<br>点击小黄人以重开游戏";
        }
        else {
            deep_check(Number(xy[0]),Number(xy[1]));
            if (check_win()) {
                alert("你赢了！\n用时："+time);
                time_conter_swc=0;
                document.getElementById("bcd").style.pointerEvents="none";
                if (swc_xsjc==1) document.getElementById("tips").innerHTML="看来你已经掌握了扫雷的技巧了，你可以选择关闭这个窗口了";
            }
        }
    }
}
//长按事件--显示周围可点击的格子
function set_class_clicked(id) {
    qizi = document.getElementById(id);
    qizi.className="qizi_clicked";
    qizi.style.backgroundColor="#c3c3c3";
    qizi.onmousedown=function(){show(this.id)};
    qizi.onmouseup=function (){receve(this.id)};
}
//胜利检测
function check_win() {
    var tmp=0;
    for (var i=0;i<glb_height;i++){
        for (var j=0;j<glb_width;j++){
            if (document.getElementById(i+" "+j).className!="qizi_clicked"){
                tmp++;
                if (tmp>rance) return false;
            }
        }
    }
    if (tmp==rance) return true;
}
//计时器
function  time_conter() {
    setTimeout(function () {
        if (time_conter_swc==1){
            time++;
            show_time();
            time_conter();
        }

    }, 1000);
}

//对格子进行标记
function mark(id) {
    var tmp = document.getElementById(id);
    if (tmp.className=="qizi"){
        tmp.className="qizi qizi_mark";
        tmp.style.background="url(\"number/red_flag.bmp\")";
        relrance--;
        cont_rance(relrance);
    }
    else if (tmp.className=="qizi qizi_mark"){
        tmp.className="qizi qizi_conf";
        tmp.style.background="#c3c3c3";
        tmp.innerHTML="?";
        relrance++;
        cont_rance(relrance);
    }
    else if (tmp.className=="qizi qizi_conf"){
        tmp.className="qizi";
        tmp.innerHTML="";
    }
}

function show(id) {
    var xy=id.split(" ");
    var x=xy[0];
    var y=xy[1];
    for (var i=x-1;i<Number(x)+2;i++){
        for (var j=y-1;j<Number(y)+2;j++){
            if (i>=0&&i<glb_height&&j>=0&&j<glb_width){
                tmp = document.getElementById(i+" "+j);
                if (tmp.className=="qizi"){
                    tmp.className="qizi_alert";
                }
            }
        }
    }
}

function receve(id) {
    var xy=id.split(" ");
    var x=xy[0];
    var y=xy[1];
    for (var i=x-1;i<Number(x)+2;i++){
        for (var j=y-1;j<Number(y)+2;j++){
            if (i>=0&&i<glb_height&&j>=0&&j<glb_width){
                tmp = document.getElementById(i+" "+j);
                if (tmp.className=="qizi_alert"){
                    tmp.className="qizi";
                }
            }
        }
    }
}
//刷新记雷器
function cont_rance(tot) {
    tot = String(tot);
    if (rance_len<tot.length) {
        //document.getElementById("main_but").style.width=(glb_width*20-47*2-15*cha)+"px";
        for (var i=rance_len;i<tot.length;i++){
            var new_rance = document.createElement("div");
            new_rance.id="rance_add"+i;
            new_rance.className="numb";
            document.getElementById("rance").appendChild(new_rance);

        }
        rance_len=tot.length;
    }
    while (tot.length<rance_len){
        tot = "0"+tot;
    }
    for (var i=0;i<tot.length;i++){
        document.getElementById("rance_add"+i).style.background="url(\"number/"+tot[i]+".bmp\")"
    }
}
//刷新计时器
function show_time() {
    var tot = String(time);
    if (time_len<tot.length) {
        for (var i=time_len;i<tot.length;i++){
            var new_time = document.createElement("div");
            new_time.id="time_add"+i;
            new_time.className="numb";
            document.getElementById("time").appendChild(new_time);
        }
        time_len=tot.length;
    }
    while (tot.length<3) tot = "0"+tot;
    for (i=0;i<tot.length;i++) document.getElementById("time_add"+i).style.background="url(\"number/"+tot[i]+".bmp\")"
}






//         核心算法         //





//通过随机数生成地雷位置
function setRance(num, ini_id) {
    list_="  "+ini_id+"  ";
    for (var i=0;i<num;i++){
        var tmpx = Math.floor(Math.random()*glb_width);
        var tmpy = Math.floor(Math.random()*glb_height);
        if (list_.indexOf(tmpy+" "+tmpx)==-1) {
            //将地雷标记为9
            cbd[tmpy][tmpx]=9;
            list_+="  "+tmpy+" "+tmpx+"  ";
        }
        else i--;
    }
}
//监测附近的雷数
function check_rance(x,y) {
    var tot=0;
    for (var i=x-1;i<x+2;i++){
        for (var j=y-1;j<y+2;j++){
            if (i>=0&&i<glb_height&&j>=0&&j<glb_width){
                if (cbd[i][j]==9) tot++;
            }
        }
    }
    return tot;
}
//搜索符合条件的格子
//核心算法：深搜
function deep_check(x, y) {
    //获取周围的地雷数
    var rance = check_rance(x, y);
    var qizi = document.getElementById(x+" "+y);
    set_class_clicked(x+" "+y);
    if (rance!=0) {
        if (swc_xsjc==1) document.getElementById("tips").innerHTML="你探索了你所点击的棋格，并且探索到了这个格子周围1格内有"+rance+"个地雷<br>你可以长按有数字的棋格来查看疑似有地雷的棋格";
        qizi.innerHTML=rance;
        qizi.style.color=font_color[rance];
    }
    else{
        //如果rance==0即周围没有地雷，程序就会在周围的棋格进行一次deep_check检测，直到rance！=0即周围有地雷的时候停止
        for (var i=x-1;i<x+2;i++){
            for (var j=y-1;j<y+2;j++){
                if (i>=0&&i<glb_height&&j>=0&&j<glb_width){
                    //获取到周围可点击的棋格
                    if (document.getElementById(i+" "+j).className=="qizi") deep_check(i,j);
                }
            }
        }
        if (swc_xsjc==1) document.getElementById("tips").innerHTML="你探索了你所点击的棋格，该棋格附近没有一颗地雷，系统自动探索了这附近的棋格。<br>你可以右击一个棋格来标记有地雷的区域，也可以右击两下来标记疑似区域";
    }
}


