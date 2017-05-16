(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

//canvas绘制环境
var ctx,ctx2;
//canvas宽高
var canWidth, canHeight;

//canvas初始化
function canvasInit() {
    var canvas = document.getElementById("canvas"),
        canvas2 = document.getElementById("canvas2");
    ctx = canvas.getContext("2d");
    ctx2 = canvas2.getContext("2d");
    canWidth = canvas.offsetWidth;
    canHeight = canvas.offsetHeight;
}

//绘制背景
function drawBack() {
    ctx.beginPath();
    ctx.fillStyle = "#E0E0D0";
    ctx.fillRect(0, 0, canWidth, canHeight);
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0,0,canWidth,canHeight);
    drawBack();
    drawSCM();
    var seg = 0xFF,
        bit = 0x00;
    if(typeof digA === "function"){
        bit = digA() << 0 | digB() << 1 | digC() << 2 | digD() << 3 | digE() << 4 | digF() << 5 | digG() << 6 | digDP() <<7 ;
    }
    if(typeof dig1 === "function"){
        seg = dig1() << 0 | dig2() <<1 | dig3() <<2 | dig4() <<3 | dig5() <<4 | dig6() <<5 | dig7() <<6 | dig8() <<7;
    }
    drawDigit(~seg, bit);
    var ledPin = 0XFF;
    if(typeof LED0 === "function"){
        ledPin = (LED0() << 0 | LED1() << 1 | LED2() << 2 | LED3() << 3 | LED4() << 4 | LED5() << 5 | LED6() << 6 | LED7() << 7);
    }
    console.log("%cLED:"+ledPin,"color:green");
    console.log("%cP0:"+STC90C51.P0(),"color:green");
    console.log("%cP1:"+STC90C51.P1(),"color:green");
    console.log("%cP2:"+STC90C51.P2(),"color:green");
    console.log("%cP3:"+STC90C51.P3(),"color:green");
    drawLED(ledPin);

    requestAnimationFrame(draw);
}


//绘制单片机
function drawSCM() {
    //图片加载方案
    var scmWidth = 211,
        scmHeight = 403;
    //加载SCM图片
    var img = new Image();
    img.src = "img/SCM.png";
    img.onload = function() {
        ctx2.drawImage(img, canWidth / 2 - scmWidth / 2 - 100, 180, scmWidth, scmHeight);
    };
    //绘制方案
    /*var scmWidth = 200,
        scmHeight = 100,
        scmX = ( canWidth - scmWidth ) /2,
        scmY = ( canHeight - scmHeight) /2;
    //绘制
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fillRect(scmX,scmY,scmWidth,scmHeight);
    ctx.closePath();

    var offset = 30;
    ctx.font = offset + "px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#606060";
    ctx.fillText("STC90C51", scmX + offset, scmY + scmHeight/2 );*/
}

//绘制LED灯
function drawLED(pins) {
    var ledPosX = canWidth - 100,
        ledPosY = 100,
        ledWidth = 60,
        ledHeight = 300;
    //绘制外框
    ctx.beginPath();
    ctx.fillStyle = "#008080";
    ctx.fillRect(ledPosX, ledPosY, ledWidth, ledHeight);
    ctx.closePath();
    //灯泡绘制
    var i = 0,
        gap = ledHeight / 9,
        radius = (ledWidth - 35) / 2;

    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    for (i = 0; i < 8; i++) {
        //绘制文字
        ctx.fillStyle = "#000000";
        ctx.fillText("LED" + i, ledPosX, ledPosY + (i + 1) * gap);
        //绘制灯泡
        ctx.fillStyle = ((pins>>i)&0x01)?"#FFB3B3":"#FF0000";
        ctx.beginPath();
        ctx.arc(ledPosX + ledWidth / 2, ledPosY + (i + 1) * gap, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

//绘制数码管
function drawDigit(seg, bit) {
    /*var digWidth = 403,digHeight = 90;
    //加载Digit图片
    var img = new Image();
    img.src = "img/Digit.png";
    img.onload = function(){
        ctx.drawImage(img,100,50,digWidth,digHeight);
    };*/
    var digWidth = 400,
        digHeight = 100,
        digPosX = 100,
        digPosY = 50,
        offset = 10;
    //绘制外框
    ctx.beginPath();
    ctx.fillStyle = "#008080";
    ctx.fillRect(digPosX, digPosY, digWidth, digHeight);
    ctx.closePath();
    //绘制内部显示区
    ctx.beginPath();
    ctx.fillStyle = "#05006C";
    ctx.fillRect(digPosX + offset, digPosY + offset, digWidth - 2 * offset, digHeight - 2 * offset);
    ctx.closePath();
    //分隔线
    var unitWidth = (digWidth - 2 * offset) / 8;
    ctx.beginPath();
    ctx.strokeStyle = "#00007D";
    ctx.lineWidth = 2.0;
    for (var i = 1; i <= 7; i++) {
        ctx.moveTo(digPosX + offset + i * unitWidth, digPosY + offset);
        ctx.lineTo(digPosX + offset + i * unitWidth, digPosY + digHeight - offset);
    }
    ctx.closePath();
    ctx.stroke();
    //绘制底部文字
    ctx.font = offset + "px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.fillText("ABCDEFG DP", digPosX + offset, digPosY + digHeight);
    ctx.textAlign = "right";
    ctx.fillText("12345678", digPosX + digWidth - offset, digPosY + digHeight);
    //数码管显示
    var digDisplay = function(seg, bit) {
        for (var i = 0; i < 8; i++) {
            if ((seg >> i) & 0x01) {
                displayOne(bit, i);
            }
        }
    };
    //显示一个数码管
    var displayOne = function(bit, num) {
        //绘制数码管
        var dLength = (digHeight - 4 * offset) / 2;
        ctx.save();
        ctx.translate(digPosX + 1.6 * offset + unitWidth * num, digPosY + 2 * offset);
        ctx.beginPath();
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 5.0;
        ctx.lineCap = "miter";
        ctx.lineJoin = "butt";

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x01) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, 0);
        ctx.lineTo(dLength, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x02) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, 0);
        ctx.lineTo(dLength, dLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x04) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, dLength);
        ctx.lineTo(dLength, 2 * dLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x08) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, 2 * dLength);
        ctx.lineTo(0, 2 * dLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x10) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, 2 * dLength);
        ctx.lineTo(0, dLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x20) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, dLength);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = (bit & 0x40) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, dLength);
        ctx.lineTo(dLength, dLength);

        ctx.stroke();
        //绘制数码管上的小数点
        ctx.beginPath();
        ctx.fillStyle = (bit & 0x80) ? "#00FFFF" : "#00007D";
        ctx.arc(dLength + offset / 2, dLength * 2, 2.5, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.restore();
    };

    digDisplay(seg, bit);
}
