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
	for(var i=0;i<pfmArr.length;i++){
		var span = document.createElement("span");
		if(pfmArr[i]){
			span.innerHTML=pfmArr[i];
			p.appendChild(span);
		}else{
			count++;
		}
	}
	//根据PC指针来高亮代码段
	var pc = STC90C51.PC;
	if(pc>count){
		pc -= count;
	}
	p.children[pc].setAttribute("class","curpfm");
}

//运行下一条指令
function step() {
	if (STC90C51.PC >= 64 * 1024) STC90C51.PC = 0;
	//执行对应指令的函数
	var ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
	var retObj = STC90C51.cmdFunc[ins]();
	instrStack.push(retObj);
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
	clearAll.onclick = function(){
		breakPointArr = [];
		disabledBreakpointArr = [];
		highLightBreakpoint();
	};
	disableAll.onclick = function(){
		disabledBreakpointArr = breakPointArr.concat(disabledBreakpointArr);
		breakPointArr = [];
		highLightBreakpoint();
	};
	enableAll.onclick = function(){
		breakPointArr = disabledBreakpointArr.concat(breakPointArr);
		disabledBreakpointArr = [];
		highLightBreakpoint();
	};
	//如果本地存储中已经存储了数据则直接使用该数据进行初始化
	var PFM = localStorage.getItem("hex");
	if(PFM){
		STC90C51.PFM = PFM.split(",");
		//准备完成标志位
        isReady = true;
        main();
        console.log(STC90C51.PFM);
        generateAssembly();
        highLightCurAss();
	}
	/*addBreak.onclick = function() {
		breakPointArr.push(breakpoint.value);
		//高亮对应的代码块
		highLightBreakpoint();
		breakpoint.value = "";
	};*/
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
	var index,assElem;
	var liElems = document.getElementById("code").children;
	for (var i=0,len=liElems.length;i<len;i++){
		if(hasClass(liElems[i],"breakpoint")){
			removeClass(liElems[i],"breakpoint");
		}
		if(hasClass(liElems[i],"disabledBreakpoint")){
			removeClass(liElems[i],"disabledBreakpoint");
		}
	}
	for (i = 0, len = breakPointArr.length; i < len; i++) {
		 index = breakPointArr[i]-1;
		 assElem = document.getElementById("code").children[index];
		if (!hasClass(assElem, "breakpoint"))
			addClass(assElem, "breakpoint");
	}
	for (i = 0, len = disabledBreakpointArr.length; i < len; i++) {
		 index = disabledBreakpointArr[i]-1;
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
	}, 1);
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
		value += bit ? " 1" : " 0" ;
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