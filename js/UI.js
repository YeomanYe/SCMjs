//canvas绘制环境
var ctx;
//canvas宽高
var canWidth, canHeight;

//canvas初始化
function canvasInit(){
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
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

function draw(){
    drawBack();
    drawSCM();
    drawDigit(0xff,0x00);
}


//绘制单片机
function drawSCM() {
    var scmWidth = 211,
        scmHeight = 403;
    //加载SCM图片
    var img = new Image();
    img.src = "img/SCM.png";
    img.onload = function() {
        ctx.drawImage(img, canWidth / 2 - scmWidth / 2, 180, scmWidth, scmHeight);
    };
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

        ctx.strokeStyle = (bit & 0x01) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, 0);
        ctx.lineTo(dLength, 0);

        ctx.strokeStyle = (bit & 0x02) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, 0);
        ctx.lineTo(dLength, dLength);

        ctx.strokeStyle = (bit & 0x04) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, dLength);
        ctx.lineTo(dLength, 2 * dLength);

        ctx.strokeStyle = (bit & 0x08) ? "#00FFFF" : "#00007D";
        ctx.moveTo(dLength, 2 * dLength);
        ctx.lineTo(0, 2 * dLength);

        ctx.strokeStyle = (bit & 0x10) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, 2 * dLength);
        ctx.lineTo(0, dLength);

        ctx.strokeStyle = (bit & 0x20) ? "#00FFFF" : "#00007D";
        ctx.moveTo(0, dLength);
        ctx.lineTo(0, 0);

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