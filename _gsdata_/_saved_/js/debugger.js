//根据机器码生成对应汇编语言
function generateAssembly(){
	STC90C51.PC = 0;
	var code = STC90C51.PFM[STC90C51.PC];
	while(1){
		if(!code)return;
		switch(code){

		}
	}
}

//显示PFM数据到#pfm的段落
function showPFM(){
	var pfmArr = STC90C51.PFM,
		content = "";
	for(var i=0,len=pfmArr.length;i<len;i++){
		var temp = pfmArr[i];
		if(!temp)break;
		content += temp+" ";
	}
	var p = document.getElementById("pfm");
	p.innerText = content;
}

//运行下一条指令
function step(){
	if (STC90C51.PC >= 64 * 1024) STC90C51.PC = 0;
    //执行对应指令的函数
    var ins = parseInt(STC90C51.PFM[STC90C51.PC],16);
    STC90C51
    .cmdFunc[ins]();
}

//给按钮绑定事件
window.onload = function(){
	var stepBtn = document.getElementById("step"),
		runBtn = document.getElementById("run"),
		pauseBtn = document.getElementById("pause"),
		breakpoint = document.getElementById("breakpoint"),
		addBreakBtn = document.getElementById("addBreak");
	stepBtn.onclick = function(){execute("step");};	
	runBtn.onclick = run;
	pauseBtn.onclick = function () {
		STC90C51.isPause = true;	
	};
	addBreak.onclick = function(){
		breakPointArr.push(breakpoint.value);
		breakpoint.value = "";
	};
};

var breakPointArr = [];

function execute(arg){
	switch(arg){
		case "step":step();break;
	}
	updateShowSFRs();
}

//运行
function run(){
	STC90C51.isPause = false;
	while(!STC90C51.isPause){
		if (STC90C51.PC >= 64 * 1024) STC90C51.PC = 0;
	    //执行对应指令的函数
	    var ins = parseInt(STC90C51.PFM[STC90C51.PC],16);
	    STC90C51.cmdFunc[ins]();
		updateShowSFRs();
		for(var i=0,len=breakPointArr.length;i<len;i++){
			if(parseInt(breakPointArr[i])==STC90C51.PC){
				STC90C51.isPause = true;
			}
		}
	}
}

//需要更新显示的寄存器值
function updateShowSFRs() {
	//清空显示列表
	var nameList = document.getElementById("SFRsName"),
		valueList = document.getElementById("SFRsValue");
	nameList.innerHTML = "";
	valueList.innerHTML = "";
	//显示各个寄存器的值
	showSFRs("P0",STC90C51.P0());
	showSFRs("P1",STC90C51.P1());
	showSFRs("P2",STC90C51.P2());
	showSFRs("P3",STC90C51.P3());
	showSFRs("PSW",STC90C51.PSW());
	showSFRs("ACC",STC90C51.ACC());
	showSFRs("B",STC90C51.B());
}
//显示的寄存器值
function showSFRs(sfrName,sfrValue){
	var nameList = document.getElementById("SFRsName"),
		valueList = document.getElementById("SFRsValue");
	var value = "";
	for(var i=0,len=8;i<len;i++){
		var bit = sfrValue&0x01;
		sfrValue>>=1;
		value += bit + " ";
	}
	var nameLi = document.createElement("li"),
		valueLi = document.createElement("li");
	nameLi.innerText = sfrName;
	valueLi.innerText = value;
	nameList.appendChild(nameLi);
	valueList.appendChild(valueLi);
}