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
        }
    }
    canvasInit();
    draw();
};
//数码管位选端口
var digA,digB,digC,digD,digE,digF,digG,digDP;
//数码管段选端口
var dig1,dig2,dig3,dig4,dig5,dig6,dig7,dig8;
//LED灯端口
var LED1,LED2,LED3,LED4,LED5,LED6,LED7,LED0;

//端口改变处理函数
function pinBound(portElem){
    var portId = portElem.id,
        portValue = portElem.value,
        expression = /P([0-9])_([0-9])/,
        portNum = expression.exec(portId)[1],
        pinNum = expression.exec(portId)[2];
    localStorage.setItem(portId,portValue);
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