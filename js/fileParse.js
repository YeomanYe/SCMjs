//选择文件的按钮
var fileBtn = document.getElementById("file");
var fileString;
fileBtn.addEventListener('change', handleFileChange, false);
//机器指令顺序表，用于确定当前执行到哪条机器指令。
//下标代表顺序，值是PC用于确定哪条程序
var macInsSeqTab = [];
//文件改变时执行的函数
function handleFileChange(evt) {
    var files = evt.target.files;
    if (files[0]) {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        //重置界面显示的内容
        resetShow();
        //重置机器指令顺序表
        macInsSeqTab = [];
        reader.onload = function(evt) {
            fileString = evt.target.result;
            STC90C51.loadCommandToPFM(fileString);
            //准备完成标志位
            isReady = true;
            main();
            console.log(STC90C51.PFM);
            generateAssembly();
            highLightCurAss();
        };
    }
}
//重设界面，将界面下显示的东西清空
function resetShow() {
    var pfm = document.getElementById("pfm"),
        ulLists = document.querySelectorAll("ul");
    pfm.innerHTML = "";
    for (var i = 0, len = ulLists.length; i < len; i++) {
        ulLists[i].innerHTML = "";
    }
}
/**
 * 根据机器码生成对应汇编语言
 * 思路:每执行一条,将指令中的代码存入PFM2中,如果PFM2没有相应的指令则说明指令没有执行过,则反汇编输出到屏幕。直到PFM2与PFM中的一致时，说明返回编完成，停止反汇编并复位。
 * @return 
 */
function generateAssembly() {
    STC90C51.PC = 0;
    generateSequence();
    generateInterrupt();
    //反编译完成后进行单片机的复位工作
    STC90C51.reset();
}

function generateSequence() {
    var PFM2 = [];
    //统计执行了的机器码的数量。
    var lenCount = 0;
    var ins;
    var strPFM2 = "";
    var strPFM = STC90C51.PFM.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " ");
    //保存前一个PC指针
    var prevPC;
    //连续相同的次数
    var loop;
    //返回的数据、指令的数据所占字节数
    var retData, instructNum;
    //添加指令到汇编指令列表
    var codeElem = document.getElementById("code");
    //添加的li元素
    var liElem;
    while (1) {
        if (PFM2[STC90C51.PC] == STC90C51.PFM[STC90C51.PC]) {
            loop++;
            ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
            STC90C51.cmdFunc[ins]();
        } else {
            loop = 0;
            //放入PC到指令顺序表
            macInsSeqTab[macInsSeqTab.length] = STC90C51.PC;
            PFM2[STC90C51.PC] = STC90C51.PFM[STC90C51.PC];
            var tmpPC = STC90C51.PC;
            prevPC = STC90C51.PC;
            ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
            retData = STC90C51.cmdFunc[ins]();
            instructNum = retData.num - 1;
            while (instructNum) {
                ++tmpPC;
                PFM2[tmpPC] = STC90C51.PFM[tmpPC];
                instructNum--;
            }
            lenCount += retData.num;
            liElem = document.createElement("li");
            liElem.ondblclick = setBreakpoint;
            liElem.innerHTML = macInsSeqTab.length + ". " + retData.asStr;
            codeElem.appendChild(liElem);

            strPFM2 = PFM2.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " ");
            if (strPFM == strPFM2) {
                console.log("PFM2: " + PFM2.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " "));
                break;
            }
        }

        //连续循环5000次找不到不同的指令则退出
        if (loop >= 5000) break;
    }
}

function generateInterrupt() {
    var codeElem = document.getElementById("code");
    var liElem, retData, ins;
    var i = 0,
        len;
    //中断程序反汇编生成
    var interruptAddr = [0x03, 0x0B, 0x13, 0x1B, 0x23, 0x2B, 0x33, 0x3B];
    //中断指令生成
    for (i = 0, len = interruptAddr.length; i < len; i++) {
        //外部中断0
        if (STC90C51.PFM[interruptAddr[i]]) {
            STC90C51.PC = interruptAddr[i];
            var count = 0;
            while (1) {
                if (!count) {
                    //添加一个标志位
                    macInsSeqTab[macInsSeqTab.length] = -1;
                    liElem = document.createElement("li");
                    liElem.innerHTML = "中断" + i;
                    liElem.style.color = "purple";
                    codeElem.appendChild(liElem);
                }
                count++;
                macInsSeqTab[macInsSeqTab.length] = STC90C51.PC;
                ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
                retData = STC90C51.cmdFunc[ins]();
                liElem = document.createElement("li");
                liElem.ondblclick = setBreakpoint;
                liElem.innerHTML = count + ". " + retData.asStr;
                codeElem.appendChild(liElem);
                if (retData.asStr.indexOf("RETI") != -1) break;
            }
        }
    }
}

function setBreakpoint(event) {
    var elem = event.currentTarget,
        parent = elem.parentNode,
        liElems = parent.children,
        index = 0,
        num = 0;
    for (var len = liElems.length; index < len; index++) {
        if (liElems[index] === elem)
            break;
    }
    //查询断点表中是否有断点，如果有则删除该断点
    if (-1 != (num = breakPointArr.indexOf(index + 1))) {
        //从数组中去除
        breakPointArr.splice(num, 1);
    } else {
        //添加到数组中
        breakPointArr.push(index + 1);
    }
    //查询禁用断点列表中是否有该断点如果有则删除
    if (-1 != (num = disabledBreakpointArr.indexOf(index + 1))) {
        disabledBreakpointArr.splice(num, 1);
    }
    //高亮对应的代码块
    highLightBreakpoint();
}

//高亮下一条汇编语句
function highLightCurAss() {
    var i = macInsSeqTab.indexOf(STC90C51.PC),
        allAssElems = document.querySelectorAll("#code .cur"),
        curAssElem = document.getElementById("code").children[i];
    for (var j = 0, len = allAssElems.length; j < len; j++) {
        if (allAssElems[j])
            removeClass(allAssElems[j], "cur");
    }
    addClass(curAssElem, "cur");
}
