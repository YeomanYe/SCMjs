window.onload = function () {
    var pins = document.querySelectorAll(".pin");
    for(var i=0,len=pins.length;i<len;i++){
        pins[i].addEventListener('change',portChangeHandler,false);
    }
    canvasInit();
    draw();
};
//数码管位选端口
var digA,digB,digC,digD,digE,digF,digG,digDP;
//数码管段选端口
var dig1,dig2,dig3,dig4,dig5,dig6,dig7,dig8;
//端口改变处理函数

function portChangeHandler(evt){
    var portElem = evt.currentTarget,
        portId = portElem.id,
        portValue = portElem.value,
        expression = /P([0-9])_([0-9])/,
        portNum = expression.exec(portId)[1],
        pinNum = expression.exec(portId)[2];
    var temp = function(){return STC90C51.getSFRsBit(0x80+portNum*16+pinNum);};
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
    }
}