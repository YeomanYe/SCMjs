//用于存放指令的指令堆栈
var instrStack = [];
//显示PFM数据到id为pfm的段落
function showPFM() {
    var pfmArr = STC90C51.PFM;
    var p = document.getElementById("pfm");
    //清空标签P中的内容
    p.innerHTML = "";
    //统计空白单元数
    var count = 0;
    for (var i = 0; i < pfmArr.length; i++) {
        var span = document.createElement("span");
        if (pfmArr[i]) {
            span.innerHTML = pfmArr[i];
            p.appendChild(span);
        } else {
            count++;
        }
    }
    //根据PC指针来高亮代码段
    var pc = STC90C51.PC;
    if (pc > count) {
        pc -= count;
    }
    p.children[pc].setAttribute("class", "curpfm");
}

//CPU打断时间
var INTERRUPT_PERIOD = 12,
    interruptPeriod = INTERRUPT_PERIOD;

//运行下一条指令
function step() {
    if (STC90C51.PC >= 64 * 1024) STC90C51.PC = 0;
    //执行对应指令的函数
    var ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
    var retObj = STC90C51.cmdFunc[ins]();
    instrStack.push(retObj);
    //定时器计数
    timerCount(retObj.period);
    // 当中断查询计数器小于等于0，则开始查询中断。
    interruptPeriod -= retObj.period;
    if (interruptPeriod <= 0) {
        interruptPeriod = INTERRUPT_PERIOD;
        //判断中断是否开启，即EA是否为1
        if (!STC90C51.getSFRsBit(0XAF)) return;
        //判断定时器0是否开启,并且产生中断
        if (STC90C51.getSFRsBit(0XA9) && STC90C51.getSFRsBit(0X8D)) {
            interruptResponse(0X0B);
        }
    }
}
var time0=0,time1=0,time2=0;
function timerCount(period) {
    var count = 0;
    //模式
    var mode;
    //定时器处理函数
    function timerHandler(tl, th, cont, mode, timeNum) {
        var l = tl(),
            h = th();
        if (!mode) {
            if (l + cont > 32) {
                tl(l + cont - 32);
                if (h + 1 > 255) {
                    th(0x00);
                    if (timeNum === 0) {
                        //将TR0置0
                        STC90C51.setSFRsBit(0x8C, 0);
                        //将TF0置1
                        STC90C51.setSFRsBit(0X8D, 1);
                    }
                } else {
                    th(h + 1);
                }
            } else {
                tl(l + cont);
            }
        }

    }
    //TR值为1，并且C/T为0才能定时
    if (STC90C51.getSFRsBit(0X8C) && !(STC90C51.SFRs[0X89 - 0X80] & 0x40)) {
        time0 += period;
        if (time0 > 12) {
            count = time0 % 12;
            time0 = time0 - count * 12;
            mode = STC90C51.SFRs[0X89 - 0X80] & 0x03;
            timerHandler(STC90C51.TL0, STC90C51.TH0, count, mode, 0);
        }
    }

    if (period > 12) {

    }
    //0或1增加函数
}

function interruptResponse(num) {
    //判断中断号是否已经加入到数组中，即程序是否已经响应了中断。
    if (STC90C51.IVT.indexOf(num) == -1) {
        //如果还未响应中断则响应中断，如果已经响应了中断，判断优先级是否比最后一个大，如果大才响应中断
        if (STC90C51.IVT.length > 0 && ((interruptPriority(num) > interruptPriority(STC90C51.IVT[STC90C51.IVT.length - 1]))) || STC90C51.IVT.length === 0) {
            //将中断号加入中断数组中
            STC90C51.IVT.push(num);
            STC90C51.RAM[STC90C51.SP(STC90C51.SP()+1)] = STC90C51.PC & 0XFF;
            STC90C51.RAM[STC90C51.SP(STC90C51.SP()+1)] = (STC90C51.PC >> 8) & 0XFF;
            STC90C51.PC = num;
        }
    }
}

/**
 * 查询对应中断的优先级
 */
function interruptPriority(interruptNum) {
    var h, l;
    switch (interruptNum) {
        case 0X03:
            //IPH中
            h = STC90C51.SFRs[0XB7 - 0X80] & 0X01;
            //IP中
            l = STC90C51.getSFRsBit(0XB8);
            break;
        case 0X0B:
            h = (STC90C51.SFRs[0XB7 - 0X80] & 0X02) >> 1;
            l = STC90C51.getSFRsBit(0XB9);
            break;
        case 0X13:
            h = (STC90C51.SFRs[0XB7 - 0X80] & 0X04) >> 2;
            l = STC90C51.getSFRsBit(0XBA);
            break;
        case 0X1B:
            h = (STC90C51.SFRs[0XB7 - 0X80] & 0X08) >> 3;
            l = STC90C51.getSFRsBit(0XBB);
            break;
        case 0X23:
            h = (STC90C51.SFRs[0XB7 - 0X80] & 0X10) >> 4;
            l = STC90C51.getSFRsBit(0XBC);
            break;
        case 0X2B:
            h = (STC90C51.SFRs[0XB7 - 0X80] & 0X20) >> 5;
            l = STC90C51.getSFRsBit(0XBD);
            break;
        case 0X33:
            //XICON
            h = STC90C51.getSFRsBit(0XC3);
            l = STC90C51.getSFRsBit(0XBE);
            break;
        case 0X3B:
            h = STC90C51.getSFRsBit(0XC7);
            l = STC90C51.getSFRsBit(0XBF);
            break;
    }
    return h * 2 + l;
}

//给按钮绑定事件
window.onload = function() {
    var stepBtn = document.getElementById("step"),
        runBtn = document.getElementById("run"),
        pauseBtn = document.getElementById("pause"),
        clearAll = document.getElementById("clearAll"),
        disableAll = document.getElementById("disableAll"),
        enableAll = document.getElementById("enableAll");
    stepBtn.onclick = function() {
        execute("step");
    };
    runBtn.onclick = run;
    pauseBtn.onclick = function() {
        STC90C51.isPause = true;
    };
    clearAll.onclick = function() {
        breakPointArr = [];
        disabledBreakpointArr = [];
        highLightBreakpoint();
    };
    disableAll.onclick = function() {
        disabledBreakpointArr = breakPointArr.concat(disabledBreakpointArr);
        breakPointArr = [];
        highLightBreakpoint();
    };
    enableAll.onclick = function() {
        breakPointArr = disabledBreakpointArr.concat(breakPointArr);
        disabledBreakpointArr = [];
        highLightBreakpoint();
    };
    //如果本地存储中已经存储了数据则直接使用该数据进行初始化
    var PFM = localStorage.getItem("hex");
    if (PFM) {
        STC90C51.PFM = PFM.split(",");
        //准备完成标志位
        isReady = true;
        main();
        console.log(STC90C51.PFM);
        generateAssembly();
        highLightCurAss();
    }
};

//断点列表数组
var breakPointArr = [],
    //禁用的断点列表数组
    disabledBreakpointArr = [];

function execute(arg) {
    switch (arg) {
        case "step":
            step();
            break;
    }
    //设置汇编指令高亮
    highLightCurAss();
    //更新寄存器的展示
    updateShowSFRs();
    //更行程序存储器的显示
    showPFM();
}

//高亮断点汇编语句
function highLightBreakpoint() {
    //去除所有汇编指令元素的断点样式
    var index, assElem;
    var liElems = document.getElementById("code").children;
    for (var i = 0, len = liElems.length; i < len; i++) {
        if (hasClass(liElems[i], "breakpoint")) {
            removeClass(liElems[i], "breakpoint");
        }
        if (hasClass(liElems[i], "disabledBreakpoint")) {
            removeClass(liElems[i], "disabledBreakpoint");
        }
    }
    for (i = 0, len = breakPointArr.length; i < len; i++) {
        index = breakPointArr[i] - 1;
        assElem = document.getElementById("code").children[index];
        if (!hasClass(assElem, "breakpoint"))
            addClass(assElem, "breakpoint");
    }
    for (i = 0, len = disabledBreakpointArr.length; i < len; i++) {
        index = disabledBreakpointArr[i] - 1;
        assElem = document.getElementById("code").children[index];
        if (!hasClass(assElem, "disabledBreakpoint"))
            addClass(assElem, "disabledBreakpoint");
    }
}

/**
 * 使用定时器的方式运行，使用循环会造成页面崩溃。
 * @return {[type]} [description]
 */
function run() {
    STC90C51.isPause = false;
    var intervalFlag = setInterval(function() {
        if (!STC90C51.isPause)
            execute("step");
        if (isInBreak()) {
            STC90C51.isPause = true;
            clearInterval(intervalFlag);
        }
    }, 0);
}

//判断是否到断点
function isInBreak() {
    for (var i = 0, len = breakPointArr.length; i < len; i++) {
        if (macInsSeqTab[parseInt(breakPointArr[i] - 1)] == STC90C51.PC) {
            return true;
        }
    }
    return false;
}

//需要更新显示的寄存器值
function updateShowSFRs() {
    //清空显示列表
    var nameList = document.getElementById("SFRsName"),
        valueList = document.getElementById("SFRsValue"),
        decValueList = document.getElementById("SFRsValueDec"),
        hexValueList = document.getElementById("SFRsValueHex");
    nameList.innerHTML = "<li>名称</li>";
    valueList.innerHTML = "<li>二进制</li>";
    decValueList.innerHTML = "<li>十进制</li>";
    hexValueList.innerHTML = "<li>十六进制</li>";
    //显示各个寄存器的值
    showSFRs("P0", STC90C51.P0());
    showSFRs("P1", STC90C51.P1());
    showSFRs("P2", STC90C51.P2());
    showSFRs("P3", STC90C51.P3());
    showSFRs("PSW", STC90C51.PSW());
    showSFRs("ACC", STC90C51.ACC());
    showSFRs("B", STC90C51.B());
}
//显示的寄存器值
function showSFRs(sfrName, sfrValue) {
    var nameList = document.getElementById("SFRsName"),
        valueList = document.getElementById("SFRsValue"),
        decValueList = document.getElementById("SFRsValueDec"),
        hexValueList = document.getElementById("SFRsValueHex");
    var value = "";
    var temp = sfrValue;
    for (var i = 0; i < 8; i++) {
        var bit = temp & (0x01 << (7 - i));
        value += bit ? " 1" : " 0";
    }
    var nameLi = document.createElement("li"),
        valueLi = document.createElement("li"),
        decValueLi = document.createElement("li"),
        hexValueLi = document.createElement("li");
    nameLi.innerText = sfrName;
    valueLi.innerText = value;
    decValueLi.innerText = sfrValue;
    hexValueLi.innerText = sfrValue ? sfrValue.toString(16).toLocaleUpperCase() + "H" : "00H";
    nameList.appendChild(nameLi);
    valueList.appendChild(valueLi);
    decValueList.appendChild(decValueLi);
    hexValueList.appendChild(hexValueLi);
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
