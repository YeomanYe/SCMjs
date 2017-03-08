var fileBtn = document.getElementById("file");
var fileString;
fileBtn.addEventListener('change', handleFileChange, false);
//文件改变时执行的函数
function handleFileChange(evt) {
	var files = evt.target.files;
	if (files[0]) {
		var reader = new FileReader();
		reader.readAsText(files[0]);
		reader.onload = function(evt) {
			fileString = evt.target.result;
			STC90C51.loadCommandToPFM(fileString);
			//准备完成标志位
			isReady = true;
			main();
			console.log(STC90C51.PFM);
			generateAssembly();
		};
	}
}

/**
 * 根据机器码生成对应汇编语言
 * 思路:每执行一条,将指令中的代码存入PFM2中,如果PFM2没有相应的指令则说明指令没有执行过,则反汇编输出到屏幕。直到PFM2与PFM中的一致时，说明返回编完成，停止反汇编并复位。
 * @return 
 */
function generateAssembly() {
	STC90C51.PC = 0;
	var PFM2 = [];
	//统计执行了的机器码的数量。
	var lenCount = 0;
	var ins;
	var strPFM2 = "";
	var strPFM = STC90C51.PFM.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " ");
	//保存前一个指针
	var prevPC;
	while (1) {
		if (PFM2[STC90C51.PC] != STC90C51.PFM[STC90C51.PC]) {
			PFM2[STC90C51.PC] = STC90C51.PFM[STC90C51.PC];
			var tmpPC = STC90C51.PC;
			prevPC = STC90C51.PC;
			ins = parseInt(STC90C51.PFM[STC90C51.PC], 16);
			var retData = STC90C51.cmdFunc[ins]();
			var instructNum = retData.num - 1;
			while (instructNum) {
				++tmpPC;
				PFM2[tmpPC] = STC90C51.PFM[tmpPC];
				instructNum--;
			}
			lenCount += retData.num;
			console.warn("%clenCount:" + lenCount + ", PFMLen:" + STC90C51.PFM.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " ").split(" ").length, "font-size:5em;color:green;");
			//添加指令到汇编指令列表
			var codeElem = document.getElementById("code");
			var liElem = document.createElement("li");
			liElem.innerHTML = retData.asStr;
			codeElem.appendChild(liElem);
		} else {
			tmpPC = prevPC;
			prevPC = STC90C51.PC;
			STC90C51.PC = tmpPC + 1;
		}
		strPFM2 = PFM2.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " ");
		if (strPFM == strPFM2) {
			console.log("PFM2: " + PFM2.join(" ").replace(/(^\s*)|(\s*$)/g, "").replace(/(\W\s{1,}\W)/g, " "));
			break;
		}
	}
	//反编译完成后进行单片机的复位工作
	STC90C51.reset();
}