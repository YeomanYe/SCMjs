window.onload = function () {
    var i,j,itemName,itemValue;
    var pins = document.querySelectorAll(".pin");
    var pinChangeHandler =function(evt){
            var elem = evt.currentTarget;
            pinBound(elem);
    };
    for(i=0,len=pins.length;i<len;i++){
        pins[i].addEventListener('change',pinChangeHandler,false);
    }
    //绑定事件
    var stepBtn = document.getElementById("step"),
        runBtn = document.getElementById("run"),
        pauseBtn = document.getElementById("pause"),
        stopBtn = document.getElementById("stop"),
        fileBtn = document.getElementById("file");
    fileBtn.addEventListener('change',fileHander,false);
    
    stepBtn.onclick = step;
    runBtn.onclick = run;
    stopBtn.onclick=stop;
    pauseBtn.onclick = function() {
        STC90C51.isPause = true;
    };
    //从localStorage读取数据，端口的设置
    for(i=0;i<4;i++){
        itemName = "P"+ i + "_";
        for(j=0;j<8;j++){
            itemName += j;
            itemValue = localStorage.getItem(itemName);
            if(itemValue){
                var item = document.getElementById(itemName);
                item.value = itemValue;
                pinBound(item);
            }
            itemName = "P" + i + "_";
        }
    }
    //如果本地存储中已经存储了数据则直接使用该数据进行初始化
    var PFM = localStorage.getItem("hex");
    if(PFM){
        STC90C51.PFM = PFM.split(",");
    }
    //单片机初始化
    STC90C51.reset();
    canvasInit();
    draw();
};
//数码管位选端口
var digA,digB,digC,digD,digE,digF,digG,digDP;
//数码管段选端口
var dig1,dig2,dig3,dig4,dig5,dig6,dig7,dig8;
//LED灯端口
var LED1,LED2,LED3,LED4,LED5,LED6,LED7,LED0;

//文件变化处理函数
function fileHander(evt){
    debugger;
    var files = evt.target.files;
    if (files[0]) {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        //文件加载成功后再将指令载入到PFM中
        reader.onload = function(evt) {
            STC90C51.reset();
            fileString = evt.target.result;
            STC90C51.loadCommandToPFM(fileString);
            console.log(STC90C51.PFM);
        };
    }
}
//端口改变处理函数
function pinBound(portElem){
    var portId = portElem.id,
        portValue = portElem.value,
        expression = /P([0-9])_([0-9])/,
        portNum = expression.exec(portId)[1],
        pinNum = expression.exec(portId)[2];
    localStorage.setItem(portId,portValue);
    var temp = function(){return STC90C51.getSFRsBit(0x80+parseInt(portNum)*16+parseInt(pinNum));};
    switch(portValue.toUpperCase()){
        case "A":digA=temp;break;
        case "B":digB=temp;break;
        case "C":digC=temp;break;
        case "D":digD=temp;break;
        case "E":digE=temp;break;
        case "F":digF=temp;break;
        case "G":digG=temp;break;
        case "DP":digDP=temp;break;
        case "1":dig1=temp;break;
        case "2":dig2=temp;break;
        case "3":dig3=temp;break;
        case "4":dig4=temp;break;
        case "5":dig5=temp;break;
        case "6":dig6=temp;break;
        case "7":dig7=temp;break;
        case "8":dig8=temp;break;
        case "LED1":LED1=temp;break;
        case "LED2":LED2=temp;break;
        case "LED3":LED3=temp;break;
        case "LED4":LED4=temp;break;
        case "LED5":LED5=temp;break;
        case "LED6":LED6=temp;break;
        case "LED7":LED7=temp;break;
        case "LED0":LED0=temp;break;
    }
}

//运行下一条指令
function step() {
    if (STC90C51.PC >= 64 * 1024) STC90C51.PC = 0;
    //执行对应指令的函数
    var ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
    var retObj = STC90C51.cmdFunc[ins]();
    //instrStack.push(retObj);
}


/**
 * 使用定时器的方式运行，使用循环会造成页面崩溃。
 * @return {[type]} [description]
 */
function run() {
    STC90C51.isPause = false;
    var intervalFlag = setInterval(function() {
        step();
        if (STC90C51.isPause)
            clearInterval(intervalFlag);
    }, 1);
}

function stop(){
    STC90C51.isPause = true;
    STC90C51.reset();
}


//添加类
function addClass(elem, clsName) {
    var oldClass = elem.className;
    elem.className = oldClass + " " + clsName;
}

//移除类
function removeClass(elem, clsName) {
    var newClass = elem.className.replace(clsName, "");
    elem.className = newClass;
}
//判断元素是否存在类
function hasClass(elem, clsName) {
    return (-1 == elem.className.indexOf(clsName)) ? false : true;
}