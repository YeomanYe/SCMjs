//ADD A,@R1
var Ri_ADD = R_Factory("Ri_ADD");
//ADD A,R0
var Rn_ADD = R_Factory("Rn_ADD");
//ADDC A,@Ri
var Ri_ADDC = R_Factory("Ri_ADDC");
//ADDC A,Rn
var Rn_ADDC = R_Factory("Rn_ADDC");
//ORL A,@Ri
var Ri_ORL = R_Factory("Ri_ORL");
//ORL A,Rn
var Rn_ORL = R_Factory("Rn_ORL");
//ANL A,@Ri
var Ri_ANL = R_Factory("Ri_ORL");
//ANL A,Rn
var Rn_ANL = R_Factory("Rn_ANL");
//XRL A,@Ri
var Ri_XRL = R_Factory("Ri_XRL");
//XRL A,Rn
var Rn_XRL = R_Factory("Rn_XRL");
//MOV @Ri,#data
var Ri_MOV = R_Factory("Ri_MOV");
//MOV Rn,#data
var Rn_MOV = R_Factory("Rn_MOV");
//SUBB A,@Ri
var Ri_SUBB = R_Factory("Ri_SUBB");
//SUBB A,Rn
var Rn_SUBB = R_Factory("Rn_SUBB");
//INC @Ri
var Ri_INC = R_Factory("Ri_INC");
//INC Rn
var Rn_INC = R_Factory("Rn_INC");
//DEC @Ri
var Ri_DEC = R_Factory("Ri_DEC");
//DEC Rn
var Rn_DEC = R_Factory("Rn_DEC");
//MOV @Ri,direct
var DIR_MOV_Ri = R_Factory("DIR_MOV_Ri");
//MOV Rn,direct
var DIR_MOV_Rn = R_Factory("DIR_MOV_Rn");
//CJNE @Ri,#data,rel
var Ri_CJNE = R_Factory("Ri_CJNE");
//CJNE @Rn,#data,rel
var Rn_CJNE = R_Factory("Rn_CJNE");
//XHR A,@Ri
var Ri_XHR = R_Factory("Ri_XHR");
//XHR A,Rn
var Rn_XHR = R_Factory("Rn_XHR");
//XCHD A,@Ri
var Ri_XCHD = R_Factory("Ri_XCHD");
//DJNZ Rn,rel
var Rn_DJNZ = R_Factory("Rn_DJNZ");
//MOVX A,@Ri
var Ri_MOVX_A = R_Factory("Ri_MOVX_A");
//MOV A,@Ri
var Ri_MOV_A = R_Factory("Ri_MOV_A");
//MOV A,Rn
var Rn_MOV_A = R_Factory("Rn_MOV_A");
//MOVX @Ri,A
var Ri_MOVX = R_Factory("Ri_MOVX");
//MOV @Ri,A
var A_MOV_Ri = R_Factory("A_MOV_Ri");
//MOV @Rn,A
var A_MOV_Rn = R_Factory("A_MOV_Rn");
//MOV direct,@Ri
var Ri_MOV_DIR = R_Factory("Ri_MOV_DIR");
//MOV direct,Rn
var Rn_MOV_DIR = R_Factory("Rn_MOV_DIR");

var STC90C51 = {
	//标志CPU是否暂停
	isPause: false,
	//标志CPU是否停止
	isStop:false,
	//程序存储器
	PFM: new Array(64 * 1024),
	//数据存储器
	RAM: new Array(2 * 128),
	//SFRs特殊功能寄存器
	SFRs: new Array(128),
	//物理空间为内部，逻辑地址为外部的存储器
	ExRAM: new Array(1024),
	//程序计数器 0x0000
	PC: 0X0000,
	//中断向量表,保存中断入口位置，实际中不存在
	IVT: [],
	//port0 80H 0xff
	P0: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x80 - 0x80] = val : STC90C51.SFRs[0X80 - 0x80];
	},
	//81H 0x07
	SP: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x81 - 0x80] = val : STC90C51.SFRs[0X81 - 0x80];
	},
	//82H 0x00
	DPL: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x82 - 0x80] = val : STC90C51.SFRs[0X82 - 0x80];
	},
	//83H 0x00
	DPH: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x83 - 0x80] = val : STC90C51.SFRs[0X83 - 0x80];
	},
	//87H 0x10
	PCON: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x87 - 0x80] = val : STC90C51.SFRs[0X87 - 0x80];
	},
	//88H 0x00
	TCON: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x88 - 0x80] = val : STC90C51.SFRs[0X88 - 0x80];
	},
	//89H 0x00
	TMOD: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x89 - 0x80] = val : STC90C51.SFRs[0X89 - 0x80];
	},
	//8AH 0x00
	TL0: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x8A - 0x80] = val : STC90C51.SFRs[0X8A - 0x80];
	},
	//8BH 0X00
	TL1: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x8B - 0x80] = val : STC90C51.SFRs[0X8B - 0x80];
	},
	//8CH 0X00
	TH0: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x8C - 0x80] = val : STC90C51.SFRs[0X8C - 0x80];
	},
	//8DH 0X00
	TH1: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x8D - 0x80] = val : STC90C51.SFRs[0X8D - 0x80];
	},
	//8EH 0X00
	AUXR: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x8E - 0x80] = val : STC90C51.SFRs[0X8E - 0x80];
	},
	//90H 0XFF
	P1: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x90 - 0x80] = val : STC90C51.SFRs[0X90 - 0x80];
	},
	//98H 0X00
	SCON: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x98 - 0x80] = val : STC90C51.SFRs[0X98 - 0x80];
	},
	//99H 0X00
	SBUF: function(val) {
		return val !== undefined ? STC90C51.SFRs[0x99 - 0x80] = val : STC90C51.SFRs[0X99 - 0x80];
	},
	//A0H 0XFF
	P2: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xA0 - 0x80] = val : STC90C51.SFRs[0XA0 - 0x80];
	},
	//A2H 0X00
	AUXR1: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xA2 - 0x80] = val : STC90C51.SFRs[0XA2 - 0x80];
	},
	//A8H 0X00
	IE: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xA8 - 0x80] = val : STC90C51.SFRs[0XA8 - 0x80];
	},
	//A9H 0X00
	SADDR: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xA9 - 0x80] = val : STC90C51.SFRs[0XA9 - 0x80];
	},
	//B0 0XFF
	P3: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xB0 - 0x80] = val : STC90C51.SFRs[0XB0 - 0x80];
	},
	//B7 0X00
	IPH: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xB7 - 0x80] = val : STC90C51.SFRs[0XB7 - 0x80];
	},
	//B8 0X00
	IP: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xB8 - 0x80] = val : STC90C51.SFRs[0XB8 - 0x80];
	},
	//B9 0X00
	SADEN: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xB9 - 0x80] = val : STC90C51.SFRs[0XB9 - 0x80];
	},
	//C0 0X00
	XICON: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xC0 - 0x80] = val : STC90C51.SFRs[0XC0 - 0x80];
	},
	//C8 0X00
	T2CON: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xC8 - 0x80] = val : STC90C51.SFRs[0XC8 - 0x80];
	},
	//C9 0X00
	T2MOD: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xC9 - 0x80] = val : STC90C51.SFRs[0XC9 - 0x80];
	},
	//CA 0X00
	RCAP2L: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xCA - 0x80] = val : STC90C51.SFRs[0XCA - 0x80];
	},
	//CB 0X00
	RCAP2H: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xCB - 0x80] = val : STC90C51.SFRs[0XCB - 0x80];
	},
	//CC 0X00
	TL2: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xCC - 0x80] = val : STC90C51.SFRs[0XCC - 0x80];
	},
	//CD 0X00
	TH2: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xCD - 0x80] = val : STC90C51.SFRs[0XCD - 0x80];
	},
	//D0 0X00
	PSW: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xD0 - 0x80] = val : STC90C51.SFRs[0XD0 - 0x80];
	},
	//E0 0X00
	ACC: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE0 - 0x80] = val : STC90C51.SFRs[0XE0 - 0x80];
	},
	//E1 0X00
	WDT_CONTR: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE1 - 0x80] = val : STC90C51.SFRs[0XE1 - 0x80];
	},
	//E2 0XFF
	ISP_DATA: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE2 - 0x80] = val : STC90C51.SFRs[0XE2 - 0x80];
	},
	//E3 0X00
	ISP_ADDRH: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE3 - 0x80] = val : STC90C51.SFRs[0XE3 - 0x80];
	},
	//E4 0X00
	ISP_ADDRL: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE4 - 0x80] = val : STC90C51.SFRs[0XE4 - 0x80];
	},
	//E5 0X00
	ISP_CMD: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE5 - 0x80] = val : STC90C51.SFRs[0XE5 - 0x80];
	},
	//E6 0X00
	ISP_TRIG: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE6 - 0x80] = val : STC90C51.SFRs[0XE6 - 0x80];
	},
	//E7 0X00
	ISP_CONTR: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE7 - 0x80] = val : STC90C51.SFRs[0XE7 - 0x80];
	},
	//E8 0X0F
	P4: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xE8 - 0x80] = val : STC90C51.SFRs[0XE8 - 0x80];
	},
	//F0 0X00
	B: function(val) {
		return val !== undefined ? STC90C51.SFRs[0xF0 - 0x80] = val : STC90C51.SFRs[0XF0 - 0x80];
	},
	//获取RN的值
	RN: function(offset) {
		//根据RS判断Rn地址
		var RS = 0x18 & STC90C51.PSW(),
			addr;
		offset = offset ? offset : 0;
		switch (RS) {
			case 0X00:
				addr = 0X00 + offset;
				break;
			case 0X01:
				addr = 0X08 + offset;
				break;
			case 0X10:
				addr = 0X10 + offset;
				break;
			case 0x11:
				addr = 0X18 + offset;
				break;
		}
		return STC90C51.RAM[addr];
	},
	RI: function(offset) {
		//根据RS判断Rn地址
		var RS = 0x18 & STC90C51.PSW(),
			addr;
		offset = offset ? offset : 0;
		switch (RS) {
			case 0X00:
				addr = 0X00 + offset;
				break;
			case 0X01:
				addr = 0X08 + offset;
				break;
			case 0X10:
				addr = 0X10 + offset;
				break;
			case 0x11:
				addr = 0X18 + offset;
				break;
		}
		return STC90C51.RAM[STC90C51.RAM[addr]];
	},
	//下载指令到PFM中
	loadCommandToPFM: function(txt) {
		//重置下PFM
		this.PFM = [];
		txt = replaceAll(txt, "\r\n", "");
		var tempArr = txt.split(":");
		tempArr.shift();
		var i, len;
		for (i = 0, len = tempArr.length; i < len; i++) {
			// tempArr[i].shift();
			//整条记录长度
			var recordLen = tempArr[i].length;
			//获取数据长度
			var dataLen = parseInt(tempArr[i].substr(0, 2), 16);
			//获取地址域
			var addrField = parseInt(tempArr[i].substr(2, 4), 16);
			//记录类型
			var reacordType = parseInt(tempArr[i].substr(6, 2), 16);
			//校验位
			var validation = parseInt(tempArr[i].substr(recordLen - 2, 2), 16);
			//数据
			var data = tempArr[i].substr(8, dataLen * 2);

			if (validation === 0XFF && reacordType === 0X01) {
				break;
			} else if (reacordType === 0x01) {
				//console.log("file error");
				alert("File Error!");
				return;
			} else if (addrField > 0xffff) {
				//console.log("address error");
				alert("File Error!");
				return;
			} else if (dataLen !== (recordLen - 2 - 8) / 2) {
				//console.log("data format error");
				alert("File Error!");
				return;
			}
			if (this.isRecord(data, validation)) {
				//校验成功将数据位加入PFM中
				for (var j = 0; j < dataLen; j++) {
					this.PFM[addrField + j] = data.substr(j * 2, 2);
				}
			} else {
				//校验失败，输入数据有误
				//console.log("data error");
				alert("File Error!");
				break;
			}
		}
		//校验成功后将数据保存到localStorage中以便下次读取
		localStorage.setItem("hex", STC90C51.PFM);
	},
	//校验检测数据是否有误
	isRecord: function(data, validation) {
		var sum = 0;
		for (var i = 0, len = data.length; i < len; i++) {
			sum += parseInt(data.substr(i * 2, 2), 16);
		}
		sum &= 0xff;
		//校验位是数据位之和的取反的低16位
		return sum & validation ? false : true;
	},
	//得到片外存储器的数据
	getExData: function(addr) {
		var extram = (STC90C51.AUXR() >> 1) & 0X01;
		var data;
		if (!extram) {
			data = STC90C51.ExRAM[addr];
		}
		return data;
	},
	//向片外存储器设置数据
	setExData: function(addr, data) {
		var extram = (STC90C51.AUXR() >> 1) & 0X01;
		if (!extram) {
			STC90C51.ExRAM[addr] = data;
		}
		return data;
	},
	/*
	P0:80~87
	P1:90~97
	P2:A0~A7
	P3:B0~B7
	 */
	//设置特殊功能寄存器位
	setSFRsBit: function(addr, bit) {
		var abs = parseInt((addr - 0x80) / 8) * 8,
			rel = addr % 8;
		if (bit) {
			STC90C51.SFRs[abs] = STC90C51.SFRs[abs] | (0x01 << rel);
		} else {
			STC90C51.SFRs[abs] = STC90C51.SFRs[abs] & (~(0x01 << rel)) & 0xFF;
		}
	},
	//获取特殊功能寄存器位
	getSFRsBit: function(addr) {
		var abs = parseInt((addr - 0x80) / 8) * 8,
			rel = addr % 8;
		return STC90C51.SFRs[abs] >> rel & 0x01;
	},
	//获取RAM中的位
	getRAMBit: function(addr) {
		var abs = parseInt(addr / 8),
			rel = addr % 8;
		return STC90C51.RAM[abs] >> rel & 0x01;
	},
	//设置RAM中的位
	setRAMBit: function(addr, bit) {
		var abs = parseInt(addr / 8),
			rel = addr % 8;
		if (bit) {
			STC90C51.RAM[abs] = STC90C51.RAM[abs] | (0x01 << rel);
		} else {
			STC90C51.RAM[abs] = STC90C51.RAM[abs] & (~(0x01 << rel)) & 0xFF;
		}
	},
	//获取bit
	getBit:function(addr){
		return (addr>=0x80) ? STC90C51.getSFRsBit(addr) : STC90C51.getRAMBit(addr);
	},
	//设置bit
	setBit:function(addr,bit){
		if(addr>=0x80) STC90C51.setSFRsBit(addr,bit);
		else STC90C51.setRAMBit(addr,bit);
	},
	//获取直接地址的值
	getDir: function(addr) {
		return (addr >= 128) ? STC90C51.SFRs[addr - 128] : STC90C51.RAM[addr];
	},
	//设置直接地址的值
	setDir: function(addr, data) {
		return (addr >= 128) ? STC90C51.SFRs[addr - 128] = data : STC90C51.RAM[addr] = data;
	},
	//单片机复位函数
	reset: function() {
		//程序计数器归零
		STC90C51.PC = 0;
		//寄存器复位
		for (var i = 0, len = STC90C51.SFRs.length; i < len; i++) {
			STC90C51.SFRs[i] = 0;
		}
		//RAM复位
		for (i = 0, len = STC90C51.RAM.length; i < len; i++) {
			STC90C51.RAM[i] = 0;
		}
		STC90C51.P0(0XFF);
		STC90C51.SP(0X07);
		STC90C51.DPL(0X00);
		STC90C51.DPH(0X00);
		STC90C51.PCON(0X10);
		STC90C51.TCON(0X00);
		STC90C51.TMOD(0X00);
		STC90C51.TL0(0X00);
		STC90C51.TL1(0X00);
		STC90C51.TH0(0X00);
		STC90C51.TH1(0X00);
		STC90C51.AUXR(0X00);
		STC90C51.P1(0XFF);
		STC90C51.SCON(0X00);
		STC90C51.SBUF(0X00);
		STC90C51.P2(0XFF);
		STC90C51.AUXR1(0X00);
		STC90C51.IE(0X00);
		STC90C51.SADDR(0X00);
		STC90C51.P3(0XFF);
		STC90C51.IPH(0X00);
		STC90C51.IP(0X00);
		STC90C51.SADEN(0X00);
		STC90C51.XICON(0X00);
		STC90C51.T2CON(0X00);
		STC90C51.T2MOD(0X00);
		STC90C51.RCAP2L(0X00);
		STC90C51.RCAP2H(0X00);
		STC90C51.TL2(0X00);
		STC90C51.TH2(0X00);
		STC90C51.PSW(0X00);
		STC90C51.ACC(0X00);
		STC90C51.WDT_CONTR(0X00);
		STC90C51.ISP_DATA(0XFF);
		STC90C51.ISP_ADDRH(0X00);
		STC90C51.ISP_ADDRL(0X00);
		STC90C51.ISP_CMD(0X00);
		STC90C51.ISP_TRIG(0X00);
		STC90C51.ISP_CONTR(0X00);
		STC90C51.P4(0X0F);
		STC90C51.B(0X00);
	},
	//各自令对应的函数
	cmdFunc: [
		//NOP 00H 1
		function() {
			STC90C51.PC++;
			var asStr = "NOP";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				//机器周期
				period:6
			};
			return retData;
		},
		//AJMP addr11 01 2
		AJMP,
		//LJMP addr16 02 3
		function() {
			var addrh = getData16(++STC90C51.PC),
				addrl = getData16(++STC90C51.PC);
			STC90C51.PC = addrh << 8 | addrl;
			var asStr = "LJMP " + STC90C51.PC;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//RR 03 1
		function() {
			//循环右移一位
			STC90C51.ACC((STC90C51.ACC() >> 1 | STC90C51.ACC() << 7) & 0xFF);
			STC90C51.PC++;
			var asStr = "RR A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//INC A 04 1
		function() {
			STC90C51.ACC((STC90C51.ACC() + 1) & 0xFF);
			STC90C51.PC++;
			var asStr = "INC A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//INC direct 05 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.setDir(addr,++data & 0xFF);
			STC90C51.PC++;
			var asStr = "INC " + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//INC @R0 06 1
		Ri_INC(0),
		//INC @R1 07 1
		Ri_INC(1),
		//INC R0 08 1
		Rn_INC(0),
		//INC R1 09 1
		Rn_INC(1),
		//INC R2 0A 1
		Rn_INC(2),
		//INC R3 0B 1
		Rn_INC(3),
		//INC R4 0C 1
		Rn_INC(4),
		//INC R5 0D 1
		Rn_INC(5),
		//INC R6 0E 1
		Rn_INC(6),
		//INC R7 0F 1
		Rn_INC(7),
		//JBC bit,rel 10 3
		function() {
			//判断对应的位是否为1，为1进行相对跳转
			//获取可位寻址区对应位置
			var addr = getData16(++STC90C51.PC),
				rel = getRel(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			STC90C51.PC += bit ? rel + 1 : 1;
			STC90C51.setBit(addr, 0);
			var asStr = "JBC " + getStr16(addr) + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//ACALL addr11 11 2
		ACALL,
		//LCALL addr16 12 3
		function() {
			//分别放置低8位和高8位跳转地址
			var addrh8 = getData16(++STC90C51.PC);
			var addrl8 = getData16(++STC90C51.PC);
			++STC90C51.PC;
			//分别放置低8位和高8位
			STC90C51.SP(STC90C51.SP() + 1);
			STC90C51.RAM[STC90C51.SP()] = STC90C51.PC & 0X00FF;
			STC90C51.SP(STC90C51.SP() + 1);
			STC90C51.RAM[STC90C51.SP()] = STC90C51.PC >> 8;
			STC90C51.PC = addrh8 << 8 | addrl8;
			var asStr = "LCALL " + STC90C51.PC;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//RRC A 13 1
		function() {
			var temp = STC90C51.ACC(),
				newC = temp&0x01,
				oldC = STC90C51.PSW() & 0X80;
			STC90C51.ACC(((oldC << 7 ) | (temp >> 1)) & 0XFF);
			STC90C51.PSW(STC90C51.PSW() | (newC << 7));
			STC90C51.PC++;
			var asStr = "RRC A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//DEC A 14 1
		function() {
			STC90C51.ACC(STC90C51.ACC() - 1);
			STC90C51.PC++;
			var asStr = "DEC A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//DEC direct 15 2
		function() {
			var addr = STC90C51.PFM[++STC90C51.PC],
				data = STC90C51.getDir(addr);
			STC90C51.setDir(addr, data - 1);
			STC90C51.PC++;
			var asStr = "DEC " + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//DEC @R0 16 1
		Ri_DEC(0),
		//DEC @R1 17 1
		Ri_DEC(1),
		//DEC R0 18 1
		Rn_DEC(0),
		//DEC R1 19 1
		Rn_DEC(1),
		//DEC R2 1A 1
		Rn_DEC(2),
		//DEC R3 1B 1
		Rn_DEC(3),
		//DEC R4 1C 1
		Rn_DEC(4),
		//DEC R5 1D 1
		Rn_DEC(5),
		//DEC R6 1E 1
		Rn_DEC(6),
		//DEC R7 1F 1
		Rn_DEC(7),
		//JB bit,rel 20 3
		function() {
			//判断对应的位是否为1，为1进行相对跳转
			//获取可位寻址区对应位置
			var addr = getData16(++STC90C51.PC),
				rel = getRel(++STC90C51.PC),
				bit = STC90C51.getDir(addr);
			STC90C51.PC += bit ? rel + 1 : 1;
			var asStr = "JB " + bit + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//AJMP 21 2
		AJMP,
		//RET 22 1
		function() {
			var addrh8 = STC90C51.RAM[STC90C51.SP()];
			STC90C51.SP(STC90C51.SP() - 1);
			var addrl8 = STC90C51.RAM[STC90C51.SP()];
			STC90C51.SP(STC90C51.SP() - 1);
			STC90C51.PC = addrh8 << 8 | addrl8;
			var asStr = "RET";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//RL A 23 1
		function() {
			var temp = STC90C51.ACC();
			STC90C51.ACC(((temp << 1) | (temp >> 7)) & 0x00FF);
			STC90C51.PC++;
			var asStr = "RL A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//ADD A,#data 24 2
		function() {
			var data = getData16(++STC90C51.PC);
			Add(data);
			STC90C51.PC++;
			var asStr = "ADD A," + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ADD A,direct 25 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			Add(data);
			STC90C51.PC++;
			var asStr = "ADD A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ADD A,@R0 26 1
		Ri_ADD(0),
		//ADD A,@R1 27 1
		Ri_ADD(1),
		//ADD A,R0 28 1
		Rn_ADD(0),
		//ADD A,R1 29 1
		Rn_ADD(1),
		//ADD A,R2 2A 1
		Rn_ADD(2),
		//ADD A,R3 2B 1
		Rn_ADD(3),
		//ADD A,R4 2C 1
		Rn_ADD(4),
		//ADD A,R5 2D 1
		Rn_ADD(5),
		//ADD A,R6 2E 1
		Rn_ADD(6),
		//ADD A,R7 2F 1
		Rn_ADD(7),
		//JNB bit,rel 30 3
		function() {
			//判断对应的位是否为1，为1进行相对跳转
			//获取可位寻址区对应位置
			var addr = getData16(++STC90C51.PC),
				rel = getRel(++STC90C51.PC),
				bit = STC90C51.getDir(addr);
			STC90C51.PC += bit === 0 ? rel + 1 : 1;
			var asStr = "JNB " + bit + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//ACALL addr11 31 2
		ACALL,
		//RETI 32 1
		function() {
			var IV = STC90C51.IVT.pop(),
				iph = STC90C51.IPH(),
				ip = STC90C51.IP(),
				xicon = STC90C51.XICON();
			//中断优先级清0
			switch (IV) {
				//X0
				case 0X03:
					STC90C51.IPH(iph & 0XFE);
					STC90C51.IP(ip & 0XFE);
					break;
					//T0
				case 0X0B:
					STC90C51.IPH(iph & 0XFD);
					STC90C51.IP(ip & 0XFD);
					//将TR0置1
                    STC90C51.setSFRsBit(0x8C, 1);
                    //将TF0置0
                    STC90C51.setSFRsBit(0X8D, 0);
					break;
					//X1
				case 0X13:
					STC90C51.IPH(iph & 0XFB);
					STC90C51.IP(ip & 0XFB);
					break;
					//T1
				case 0X1B:
					STC90C51.IPH(iph & 0XF7);
					STC90C51.IP(ip & 0XF7);
					break;
					//S
				case 0X23:
					STC90C51.IPH(iph & 0XEF);
					STC90C51.IP(ip & 0XEF);
					break;
					//T2
				case 0X2B:
					STC90C51.IPH(iph & 0XDF);
					STC90C51.IP(ip & 0XDF);
					break;
					//X2
				case 0X33:
					STC90C51.XICON(xicon & 0XBF);
					STC90C51.IP(ip & 0XBF);
					break;
					//X3
				case 0X3B:
					STC90C51.XICON(xicon & 0X7F);
					STC90C51.IP(ip & 0X7F);
					break;
			}
			var sp = STC90C51.SP(),
				addrh = STC90C51.RAM[sp--],
				addrl = STC90C51.RAM[sp--];
			STC90C51.PC = addrh << 8 | addrl;
			var asStr = "RETI";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//RLC A 33 1
		function() {
			var temp = STC90C51.ACC(),
				oldC = STC90C51.PSW() & 0X80,
				newC = (temp & 0x80) >> 7;
			STC90C51.ACC(((oldC >> 7) | (temp << 1)) & 0XFF);
			STC90C51.PSW(STC90C51.PSW() | (newC << 7));
			STC90C51.PC++;
			var asStr = "RLC A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//ADDC A,#data 34 2
		function() {
			var data = getData16(++STC90C51.PC);
			Addc(data);
			STC90C51.PC++;
			var asStr = "ADDC A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ADDC A,direct 35 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			var a_data = STC90C51.ACC(),
				CY = (STC90C51.PSW() & 0X80) >> 7,
				result = a_data + data + CY;
			//如果结果溢出将进位标志位和溢出标志位置1，并使结果为溢出大小
			if (result > 255) {
				result -= 255;
				STC90C51.PSW(STC90C51.PSW() | 0x84);
			} else {
				STC90C51.PSW(STC90C51.PSW() & 0x7B);
			}
			//判断进位辅助位是否要置1
			if ((a_data & 0x08) && (data & 0x08)) {
				STC90C51.PSW(STC90C51.PSW() | 0x40);
			} else if (((a_data & 0x08) | (data & 0x08)) && ((a_data & 0x04) | (data & 0x04))) {
				STC90C51.PSW(STC90C51.PSW() | 0x40);
			}
			STC90C51.PC++;
			var asStr = "ADDC A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ADDC A,@R0 36 2
		Ri_ADDC(0),
		//ADDC A,@R1 37 2
		Ri_ADDC(1),
		//ADDC A,R0 38 2
		Rn_ADDC(0),
		//ADDC A,R1 39 2
		Rn_ADDC(1),
		//ADDC A,R2 3A 2
		Rn_ADDC(2),
		//ADDC A,R3 3B 2
		Rn_ADDC(3),
		//ADDC A,R4 3C 2
		Rn_ADDC(4),
		//ADDC A,R5 3D 2
		Rn_ADDC(5),
		//ADDC A,R6 3E 2
		Rn_ADDC(6),
		//ADDC A,R7 3F 2
		Rn_ADDC(7),
		//JC rel 40 2
		function() {
			var CY = STC90C51.PSW() & 0X80;
			var rel = getRel(++STC90C51.PC);
			STC90C51.PC += CY ? rel + 1 : 1;
			var asStr = "JC " + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//AJMP addr11 41 2
		AJMP,
		//ORL direct,A 42 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.setDir(addr, a | data);
			STC90C51.PC++;
			var asStr = "ORL " + getStr16(addr) + ",A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ORL direct,#data 43 3
		function() {
			var addr = getData16(++STC90C51.PC),
				data = getData16(++STC90C51.PC),
				dataDir = STC90C51.getDir(addr);
			STC90C51.setDir(addr, data | dataDir);
			STC90C51.PC++;
			var asStr = "ORL " + getStr16(addr) + ",#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//ORL A,#data 44 2
		function() {
			var a = STC90C51.ACC(),
				data = getData16(++STC90C51.PC);
			STC90C51.ACC(a | data);
			STC90C51.PC++;
			var asStr = "ORL A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ORL A,direct 45 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.ACC(a | data);
			STC90C51.PC++;
			var asStr = "ORL A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ORL A,@R0 46 1
		Ri_ORL(0),
		//ORL A,@R1 47 1
		Ri_ORL(1),
		//ORL A,R0 48 1
		Rn_ORL(0),
		//ORL A,R1 49 1
		Rn_ORL(1),
		//ORL A,R2 4A 1
		Rn_ORL(2),
		//ORL A,R3 4B 1
		Rn_ORL(3),
		//ORL A,R4 4C 1
		Rn_ORL(4),
		//ORL A,R5 4D 1
		Rn_ORL(5),
		//ORL A,R6 4E 1
		Rn_ORL(6),
		//ORL A,R7 4F 1
		Rn_ORL(7),
		//JNC rel 50 2
		function() {
			var CY = STC90C51.PSW() & 0X80;
			var rel = getRel(++STC90C51.PC);
			STC90C51.PC += CY === 0 ? rel + 1 : 1;
			var asStr = "JNC " + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//ACALL addr11 51 2
		ACALL,
		//ANL direct,A 52 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				dirData = STC90C51.getDir(addr);
			STC90C51.setDir(addr, a & dirData);
			STC90C51.PC++;
			var asStr = "ANL " + getStr16(addr) + ",A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ANL direct,#data 53 3
		function() {
			var addr = getData16(++STC90C51.PC),
				data = getData16(++STC90C51.PC),
				dirData = STC90C51.getDir(addr);
			STC90C51.setDir(addr, data & dirData);
			STC90C51.PC++;
			var asStr = "ANL " + getStr16(addr) + ",#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//ANL A,#data 54 2
		function() {
			var a = STC90C51.ACC(),
				data = getData16(++STC90C51.PC);
			STC90C51.ACC(a & data);
			STC90C51.PC++;
			var asStr = "ANL A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ANL A,direct 55 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.ACC(a & data);
			STC90C51.PC++;
			var asStr = "ANL A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//ANL A,@R0 56 1
		Ri_ANL(0),
		//ANL A,@R1 57 1
		Ri_ANL(1),
		//ANL A,R0 58 1
		Rn_ANL(0),
		//ANL A,R1 59 1
		Rn_ANL(1),
		//ANL A,R2 5A 1
		Rn_ANL(2),
		//ANL A,R3 5B 1
		Rn_ANL(3),
		//ANL A,R4 5C 1
		Rn_ANL(4),
		//ANL A,R5 5D 1
		Rn_ANL(5),
		//ANL A,R6 5E 1
		Rn_ANL(6),
		//ANL A,R7 5F 1
		Rn_ANL(7),
		//JZ rel 60 2
		function() {
			var a = STC90C51.ACC(),
				rel = getRel(++STC90C51.PC);
			STC90C51.PC += a === 0 ? rel + 1 : 1;
			var asStr = "JZ " + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//AJMP addr11 61 2
		AJMP,
		//XRL direct,A 62 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				dirData = STC90C51.getDir(addr);
			STC90C51.setDir(addr, dirData ^ a);
			STC90C51.PC++;
			var asStr = "XRL " + getStr16(addr) + ",A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//XRL direct,#data 63 3
		function() {
			var addr = getData16(++STC90C51.PC),
				data = getData16(++STC90C51.PC),
				dirData = STC90C51.getDir(addr);
			STC90C51.setDir(addr, data ^ dirData);
			STC90C51.PC++;
			var asStr = "XRL " + getStr16(addr) + ",#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//XRL A,#data 64 2
		function() {
			var a = STC90C51.ACC(),
				data = getData16(++STC90C51.PC);
			STC90C51.ACC(a ^ data);
			STC90C51.PC++;
			var asStr = "XRL A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//XRL A,direct 65 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.ACC(a ^ data);
			STC90C51.PC++;
			var asStr = "XRL A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//XRL A,@R0 66 1
		Ri_XRL(0),
		//XRL A,@R1 67 1
		Ri_XRL(1),
		//XRL A,R0 68 1
		Rn_XRL(0),
		//XRL A,R1 69 1
		Rn_XRL(1),
		//XRL A,R2 6A 1
		Rn_XRL(2),
		//XRL A,R3 6B 1
		Rn_XRL(3),
		//XRL A,R4 6C 1
		Rn_XRL(4),
		//XRL A,R5 6D 1
		Rn_XRL(5),
		//XRL A,R6 6E 1
		Rn_XRL(6),
		//XRL A,R7 6F 1
		Rn_XRL(7),
		//JNZ rel 70 2
		function() {
			var a = STC90C51.ACC(),
				rel = getRel(++STC90C51.PC);
			STC90C51.PC += a ? rel + 1 : 1;
			var asStr = "JNZ " + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//ACALL addr11 71 2
		ACALL,
		//ORL C,bit 72 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			var CY = STC90C51.PSW() & 0X80;
			STC90C51.PSW(STC90C51.PSW() | (CY | bit << 7));
			STC90C51.PC++;
			var asStr = "ORL C," + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//JMP @A+DPTR 73 1
		function() {
			var a = STC90C51.RAM[STC90C51.ACC()],
				dpl = STC90C51.DPL(),
				dph = STC90C51.DPH();
			STC90C51.PC = ((dph << 8) | dpl) + a;
			var asStr = "JMP @A+DPTR";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//MOV A,#data 74 2
		function() {
			var data = getData16(++STC90C51.PC);
			STC90C51.ACC(data);
			STC90C51.PC++;
			var asStr = "MOV A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//MOV direct,#data 75 3
		function() {
			var addr = getData16(++STC90C51.PC),
				data = getData16(++STC90C51.PC);
			STC90C51.setDir(addr, data);
			STC90C51.PC++;
			var asStr = "MOV " + getStr16(addr) + ",#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//MOV @R0,#data 76 2
		Ri_MOV(0),
		//MOV @R1,#data 77 2
		Ri_MOV(1),
		//MOV A,R0 78 2
		Rn_MOV(0),
		//MOV A,R1 79 2
		Rn_MOV(1),
		//MOV A,R2 7A 2
		Rn_MOV(2),
		//MOV A,R3 7B 2
		Rn_MOV(3),
		//MOV A,R4 7C 2
		Rn_MOV(4),
		//MOV A,R5 7D 2
		Rn_MOV(5),
		//MOV A,R6 7E 2
		Rn_MOV(6),
		//MOV A,R7 7F 2
		Rn_MOV(7),
		//SJMP rel 80 2
		function() {
			var rel = getRel(++STC90C51.PC);
			STC90C51.PC += rel + 1;
			var asStr = "SJMP " + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//AJMP addr11 81 2
		AJMP,
		//ANL C,bit 82 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr),
				CY = STC90C51.PSW() & 0X80;
			STC90C51.PSW(STC90C51.PSW() | (CY & bit << 7));
			STC90C51.PC++;
			var asStr = "ANL C," + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//MOVC A,@A+PC 83 1
		function() {
			var a = STC90C51.ACC();
			STC90C51.ACC(STC90C51.RAM[STC90C51.PC + a]);
			STC90C51.PC++;
			var asStr = "MOVC A,@A+PC";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//DIV AB 84 1
		function() {
			var a = STC90C51.ACC(),
				b = STC90C51.B();
			STC90C51.ACC(parseInt(a / b));
			STC90C51.B(a % b);
			STC90C51.PC++;
			var asStr = "DIV AB";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:24
			};
			return retData;
		},
		//MOV direct,direct 85 3
		function() {
			var addr1 = getData16(++STC90C51.PC),
				addr2 = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr2);
			STC90C51.setDir(addr1, data);
			STC90C51.PC++;
			var asStr = "MOV " + getStr16(addr1) + "," + getStr16(addr2);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//MOV direct,@R0 86 2
		Ri_MOV_DIR(0),
		//MOV direct,@R1 87 2
		Ri_MOV_DIR(1),
		//MOV direct,R0 88 2
		Rn_MOV_DIR(0),
		//MOV direct,R1 89 2
		Rn_MOV_DIR(1),
		//MOV direct,R2 8A 2
		Rn_MOV_DIR(2),
		//MOV direct,R3 8B 2
		Rn_MOV_DIR(3),
		//MOV direct,R4 8C 2
		Rn_MOV_DIR(4),
		//MOV direct,R5 8D 2
		Rn_MOV_DIR(5),
		//MOV direct,R6 8E 2
		Rn_MOV_DIR(6),
		//MOV direct,R7 8F 2
		Rn_MOV_DIR(7),
		//MOV DPTR,#data16 90 3
		function() {
			var datah = getData16(++STC90C51.PC),
				datal = getData16(++STC90C51.PC);
			STC90C51.DPL(datal);
			STC90C51.DPH(datah);
			STC90C51.PC++;
			var asStr = "MOV DPTR,#" + ((datah << 8) | datal);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 3,
				period:12
			};
			return retData;
		},
		//ACALL addr11 91 2
		ACALL,
		//MOV bit,C 92 2
		function() {
			var CY = (STC90C51.PSW() & 0X80) >> 7,
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getBit(addr);
			if (CY) {
				STC90C51.setBit(addr, 1);
			} else {
				STC90C51.setBit(addr, 0);
			}
			STC90C51.PC++;
			var asStr = "MOV " + addr + ",C";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//MOVC A,@A+DPTR 93 1
		function() {
			var dpl = STC90C51.DPL(),
				dph = STC90C51.DPH(),
				a = STC90C51.ACC();
			var addr = a + (dph << 8 | dpl),
				data = getData16(addr);
			STC90C51.ACC(data);
			STC90C51.PC++;
			var asStr = "MOVC A,@A+DPTR";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//SUBB A,#data 94 2
		function() {
			var data = getData16(++STC90C51.PC);
			Subb(data);
			STC90C51.PC++;
			var asStr = "SUBB A,#" + data;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//SUBB A,direct 95 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			SUBB(data);
			STC90C51.PC++;
			var asStr = "SUBB A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//SUBB A,@R0 96 1
		Ri_SUBB(0),
		//SUBB A,@R1 97 1
		Ri_SUBB(1),
		//SUBB A,Rn 98 1
		Rn_SUBB(0),
		//SUBB A,Rn 99 1
		Rn_SUBB(1),
		//SUBB A,Rn 9A 1
		Rn_SUBB(2),
		//SUBB A,Rn 9B 1
		Rn_SUBB(3),
		//SUBB A,Rn 9C 1
		Rn_SUBB(4),
		//SUBB A,Rn 9D 1
		Rn_SUBB(5),
		//SUBB A,Rn 9E 1
		Rn_SUBB(6),
		//SUBB A,Rn 9F 1
		Rn_SUBB(7),
		//ORL C,/bit A0 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			//单个位取反
			bit = bit ? 0 : bit;
			var CY = STC90C51.PSW() & 0X80;
			STC90C51.PSW(STC90C51.PSW() | (CY | bit << 7));
			STC90C51.PC++;
			var asStr = "ORL C,/" + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//AJMP addr11 A1 2
		AJMP,
		//MOV C,bit A2 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			if (bit) {
				STC90C51.PSW(STC90C51.PSW() | 0X80);
			} else {
				STC90C51.PSW(STC90C51.PSW() & 0X7F);
			}
			STC90C51.PC++;
			var asStr = "MOV C," + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//INC DPTR A3 1
		function() {
			var ret = STC90C51.DPL((STC90C51.DPL() + 1));
			if (ret > 255) {
				STC90C51.DPH((STC90C51.DPH() + 1) & 0XFF);
			}
			STC90C51.PC++;
			var asStr = "INC DPTR";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//MUL AB A4 1
		function() {
			var a = STC90C51.ACC(),
				b = STC90C51.B();
			var result = a * b;
			STC90C51.ACC(result & 0xFF);
			STC90C51.B(result >> 8);
			STC90C51.PC++;
			var asStr = "MUL AB";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:24
			};
			return retData;
		},
		//A5
		function() {},
		//MOV @R0,#data A6 2
		DIR_MOV_Ri(0),
		//MOV @R1,#data A7 2
		DIR_MOV_Ri(1),
		//MOV R0,direct A8 2
		DIR_MOV_Rn(0),
		//MOV R1,direct A9 2
		DIR_MOV_Rn(1),
		//MOV R2,direct AA 2
		DIR_MOV_Rn(2),
		//MOV R3,direct AB 2
		DIR_MOV_Rn(3),
		//MOV R4,direct AC 2
		DIR_MOV_Rn(4),
		//MOV R5,direct AD 2
		DIR_MOV_Rn(5),
		//MOV R6,direct AE 2
		DIR_MOV_Rn(6),
		//MOV R7,direct AF 2
		DIR_MOV_Rn(7),
		//ANL C,/bit B0 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			if (!bit) {
				STC90C51.PSW(STC90C51.PSW() & 0XFF);
			} else {
				STC90C51.PSW(STC90C51.PSW() & 0X7F);
			}
			STC90C51.PC++;
			var asStr = "ANL C,/" + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//ACALL addr11 B1 2
		ACALL,
		//CPL bit B2 2
		function() {
			var addr = getData16(++STC90C51.PC),
				bit = STC90C51.getBit(addr);
			STC90C51.setBit(addr, ~bit);
			STC90C51.PC++;
			var asStr = "CPL " + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//CPL C B3 1
		function() {
			var CY = STC90C51.PSW() & 0X80 >> 7;
			if (CY) {
				STC90C51.PSW(STC90C51.PSW() & 0X7F);
			} else {
				STC90C51.PSW(STC90C51.PSW() | 0X80);
			}
			STC90C51.PC++;
			var asStr = "CPL C";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//CJNE A,#data,rel B4 3
		function() {
			var data = getData16(++STC90C51.PC),
				a = STC90C51.ACC(),
				rel = getRel(++STC90C51.PC);
			if (a != data) {
				STC90C51.PC += rel + 1;
				if (data > a) {
					//进位标志位置1
					STC90C51.PSW(STC90C51.PSW() | 0X80);
				} else {
					//进位标志位置0
					STC90C51.PSW(STC90C51.PSW() & 0X7F);
				}
			} else {
				STC90C51.PC += 1;
			}
			var asStr = "CJNE A,#" + data + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//CJNE A,direct,rel B5 3
		function() {
			var addr = getData16(++STC90C51.PC),
				a = STC90C51.ACC(),
				data = STC90C51.getDir(addr),
				rel = getRel(++STC90C51.PC);
			if (data2 != data) {
				STC90C51.PC += rel + 1;
				if (data > a) {
					//进位标志位置1
					STC90C51.PSW(STC90C51.PSW() | 0X80);
				} else {
					//进位标志位置0
					STC90C51.PSW(STC90C51.PSW() & 0X7F);
				}
			} else {
				STC90C51.PC += 1;
			}
			var asStr = "CJNE A," + getStr16(addr) + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//CJNE @R0,#data,rel B6 3
		Ri_CJNE(0),
		//CJNE @R1,#data,rel B7 3
		Ri_CJNE(1),
		//CJNE R0,#data,rel B8 3
		Rn_CJNE(0),
		//CJNE R1,#data,rel B9 3
		Rn_CJNE(1),
		//CJNE R2,#data,rel BA 3
		Rn_CJNE(2),
		//CJNE R3,#data,rel BB 3
		Rn_CJNE(3),
		//CJNE R4,#data,rel BC 3
		Rn_CJNE(4),
		//CJNE R5,#data,rel BD 3
		Rn_CJNE(5),
		//CJNE R6,#data,rel BE 3
		Rn_CJNE(6),
		//CJNE R7,#data,rel BF 3
		Rn_CJNE(7),
		//PUSH direct C0 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.RAM[STC90C51.SP(STC90C51.SP() + 1)] = data;
			STC90C51.PC++;
			var asStr = "PUSH " + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//AJMP addr11 C1 2
		AJMP,
		//CLR bit C2 2
		function() {
			var addr = getData16(++STC90C51.PC);
			var bit = STC90C51.setBit(addr, 0);
			STC90C51.PC++;
			var asStr = "CLR " + bit;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//CLR C C3 1
		function() {
			STC90C51.PSW(STC90C51.PSW() & 0X7F);
			STC90C51.PC++;
			var asStr = "CLR C";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//SWAP A C4 1
		function() {
			var a = STC90C51.ACC();
			STC90C51.ACC((a >> 4) | (a << 4) & 0x00ff);
			STC90C51.PC++;
			var asStr = "SWAP A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//XHR A,direct C5 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.ACC(data);
			STC90C51.setDir(addr, a);
			STC90C51.PC++;
			var asStr = "XHR A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//XHR A,@R0 C6 1
		Ri_XHR(0),
		//XHR A,@R1 C7 1
		Ri_XHR(1),
		//XHR A,R0 C8 1
		Rn_XHR(0),
		//XHR A,R1 C9 1
		Rn_XHR(1),
		//XHR A,R2 CA 1
		Rn_XHR(2),
		//XHR A,R3 CB 1
		Rn_XHR(3),
		//XHR A,R4 CC 1
		Rn_XHR(4),
		//XHR A,R5 CD 1
		Rn_XHR(5),
		//XHR A,R6 CE 1
		Rn_XHR(6),
		//XHR A,R7 CF 1
		Rn_XHR(7),
		//POP direct D0 2
		function() {
			var addr = getData16(++STC90C51.PC);
			var sp = STC90C51.SP();
			STC90C51.setDir(addr, STC90C51.RAM[sp]);
			STC90C51.SP(sp - 1);
			STC90C51.PC++;
			var asStr = "POP " + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//ACALL addr11 D1 2
		ACALL,
		//SETB bit D2 2
		function() {
			var addr = getData16(++STC90C51.PC);
			STC90C51.setBit(addr, 1);
			STC90C51.PC++;
			var asStr = "SETB " + addr;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//SETB C D3 1
		function() {
			STC90C51.PSW(STC90C51.PSW() | 0X80);
			STC90C51.PC++;
			var asStr = "SETB C";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//DA A D4 1
		function() {
			var a = STC90C51.ACC(),
				consult = parseInt(a / 16),
				remainder = a % 16;
			if (consult > 9 && remainder <= 9) {
				STC90C51.ACC((a + 0X60) & 0XFF);
				STC90C51.PSW(STC90C51.PSW() | 0X80);
			} else if (consult > 9 && remainder > 9) {
				STC90C51.ACC((a + 0x66) & 0XFF);
				STC90C51.PSW(STC90C51.PSW() | 0X80);
			} else if (remainder > 9 && consult <= 9) {
				STC90C51.ACC((A + 0X06) & 0XFF);
			}
			STC90C51.PC++;
			var asStr = "DA A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//DJNZ direct,rel D5 3
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr),
				rel = getRel(++STC90C51.PC);
			STC90C51.setDir(addr, --data);
			STC90C51.PC += data ? (rel + 1) : 1;
			var asStr = "DJNZ " + getStr16(addr) + "," + rel;
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:12
			};
			return retData;
		},
		//XCHD A,@R0 D6 1
		Ri_XCHD(0),
		//XCHD A,@R1 D7 1
		Ri_XCHD(1),
		//DJNZ R0,rel D8 2
		Rn_DJNZ(0),
		//DJNZ R1,rel D9 2
		Rn_DJNZ(1),
		//DJNZ R2,rel DA 2
		Rn_DJNZ(2),
		//DJNZ R3,rel DB 2
		Rn_DJNZ(3),
		//DJNZ R4,rel DC 2
		Rn_DJNZ(4),
		//DJNZ R5,rel DD 2
		Rn_DJNZ(5),
		//DJNZ R6,rel DE 2
		Rn_DJNZ(6),
		//DJNZ R7,rel DF 2
		Rn_DJNZ(7),
		//MOVX A,@DPTR E0 1
		function() {
			var extram = (STC90C51.AUXR() >> 1) & 0X01,
				dpl = STC90C51.DPL(),
				dph = STC90C51.DPH();
			var data;
			if (!extram) {
				data = STC90C51.ExRAM[(dph << 8) | dpl];
			}
			STC90C51.ACC(data);
			STC90C51.PC++;
			var asStr = "MOVX A,@DPTR";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//AJMP addr11 E1 2
		AJMP,
		//MOVX A,@R0 E2 1
		Ri_MOVX_A(0),
		//MOVX A,@R1 E3 1
		Ri_MOVX_A(1),
		//CLR A E4 1
		function() {
			STC90C51.ACC(0);
			STC90C51.PC++;
			var asStr = "CLR A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//MOV A,direct E5 2
		function() {
			var addr = getData16(++STC90C51.PC),
				data = STC90C51.getDir(addr);
			STC90C51.ACC(data);
			STC90C51.PC++;
			var asStr = "MOV A," + getStr16(addr);
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//MOV A,@R0 E6 1
		Ri_MOV_A(0),
		//MOV A,@R1 E7 1
		Ri_MOV_A(1),
		//MOV A,R0 E8 1
		Rn_MOV_A(0),
		//MOV A,R1 E9 1
		Rn_MOV_A(1),
		//MOV A,R2 EA 1
		Rn_MOV_A(2),
		//MOV A,R3 EB 1
		Rn_MOV_A(3),
		//MOV A,R4 EC 1
		Rn_MOV_A(4),
		//MOV A,R5 ED 1
		Rn_MOV_A(5),
		//MOV A,R6 EE 1
		Rn_MOV_A(6),
		//MOV A,R7 EF 1
		Rn_MOV_A(7),
		//MOVX @DPTR,A F0 1
		function() {
			var a = STC90C51.ACC(),
				dpl = STC90C51.DPL(),
				dph = STC90C51.DPH(),
				addr = (dph << 8) | dpl;
			STC90C51.setExData(addr, a);
			STC90C51.PC++;
			var asStr = "MOVX @DPTR";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:12
			};
			return retData;
		},
		//ACALL addr11 F1 2
		ACALL,
		//MOVX @R0,A F2 1
		Ri_MOVX(0),
		//MOVX @R1,A F3 1
		Ri_MOVX(1),
		//CPL A F4 1
		function() {
			STC90C51.ACC((~STC90C51.ACC()) & 0x00ff);
			STC90C51.PC++;
			var asStr = "CPL A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 1,
				period:6
			};
			return retData;
		},
		//MOV direct,A F5 2
		function() {
			var a = STC90C51.ACC(),
				addr = getData16(++STC90C51.PC);
			STC90C51.setDir(addr, a);
			STC90C51.PC++;
			var asStr = "MOV " + getStr16(addr) + ",A";
			console.log(asStr);
			var retData = {
				asStr: asStr,
				num: 2,
				period:6
			};
			return retData;
		},
		//MOV @R0,A F6 1
		A_MOV_Ri(0),
		//MOV @R1,A F7 1
		A_MOV_Ri(1),
		//MOV R0,A F8 1
		A_MOV_Rn(0),
		//MOV R1,A F9 1
		A_MOV_Rn(1),
		//MOV R2,A FA 1
		A_MOV_Rn(2),
		//MOV R3,A FB 1
		A_MOV_Rn(3),
		//MOV R4,A FC 1
		A_MOV_Rn(4),
		//MOV R5,A FD 1
		A_MOV_Rn(5),
		//MOV R6,A FE 1
		A_MOV_Rn(6),
		//MOV R7,A FF 1
		A_MOV_Rn(7),
	]
};
//AJMP addr11
function AJMP() {
	var addrh = STC90C51.PFM[STC90C51.PC] & 0XE0,
		addrl = STC90C51.PFM[++STC90C51.PC];
	//设置跳转地址
	var addr11 = (addrh << 3) | addrl;
	STC90C51.PC = STC90C51.PC & 0XFC00 | addr11;
	var asStr = "AJMP " + addr11;
	console.log(asStr);
	var retData = {
		asStr: asStr,
		num: 2,
		period:12
	};
	return retData;
}
//ACALL addr11 2
function ACALL() {
	var addrh = STC90C51.PFM[STC90C51.PC] & 0XE0,
		addrl = STC90C51.PFM[++STC90C51.PC];
	//分别放置低8位和高8位
	STC90C51.SP(STC90C51.SP() + 1);
	STC90C51.RAM[STC90C51.SP()] = STC90C51.PC & 0X00FF;
	STC90C51.SP(STC90C51.SP() + 1);
	STC90C51.RAM[STC90C51.SP()] = STC90C51.PC >> 8;
	//设置跳转地址
	var addr11 = (addrh << 3) | addrl;
	STC90C51.PC = STC90C51.PC & 0XF800 | addr11;
	var asStr = "ACALL " + addr11;
	console.log(asStr);
	var retData = {
		asStr: asStr,
		num: 2,
		period:12
	};
	return retData;
}

//加法不含进位
function Add(data) {
	// var ret = STC90C51.ACC(STC90C51.ACC() + data);
	var a_data = STC90C51.ACC(),
		result = a_data + data;
	STC90C51.ACC(result & 0xff);
	//如果结果溢出将进位标志位和溢出标志位置1，并使结果为溢出大小
	if ((result & 0xFFFF) > 255) {
		STC90C51.PSW(STC90C51.PSW() | 0x04);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0xFB);
	}
	//判断进位辅助位是否要置1
	if ((a_data & 0x0f) > (result & 0x0f) && (data & 0x0f) > (result & 0x0f)) {
		STC90C51.PSW(STC90C51.PSW() | 0x40);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0XBF);
	}
	//判断是否有进位
	if (a_data  > result && data > result ) {
		STC90C51.PSW(STC90C51.PSW() | 0X80);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0X7F);
	}
}
//加法含进位
function Addc(data) {
	var a_data = STC90C51.ACC(),
		CY = (STC90C51.PSW() & 0X80) >> 7,
		result = a_data + data + CY;
	//如果结果溢出将进位标志位和溢出标志位置1，并使结果为溢出大小
	if ((result & 0xFFFF) > 255 ) {
		STC90C51.PSW(STC90C51.PSW() | 0x04);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0xFB);
	}
	STC90C51.ACC(result & 0xff);
	//判断进位辅助位是否要置1
	if ((a_data & 0x0f) > (result & 0x0f) && (data & 0x0f) > (result & 0x0f)) {
		STC90C51.PSW(STC90C51.PSW() | 0x40);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0XBF);
	}
	//判断是否有进位
	if (a_data > result && data > result) {
		STC90C51.PSW(STC90C51.PSW() | 0X80);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0X7F);
	}
}
//借位减法
function Subb(data) {
	var CY = (STC90C51.PSW() & 0X80) >> 7,
		a_data = STC90C51.ACC(),
		result = a_data - CY - data;
	STC90C51.ACC(result & 0XFF);
	//判断是否溢出
	if ((result&0xFFFF) > 255) {
		//溢出标志位置1
		STC90C51.PSW(STC90C51.PSW() | 0X04);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0XFB);
	}
	//判断B3是否有借位
	if ((a_data & 0x0f) < (data & 0x0f)) {
		STC90C51.PSW(STC90C51.PSW() | 0x40);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0XBF);
	}
	//判断最高位是否有借位
	if (a_data < data + CY ) {
		STC90C51.PSW(STC90C51.PSW() | 0X80);
	} else {
		STC90C51.PSW(STC90C51.PSW() & 0X7F);
	}
}

function R_Factory(key) {
	//获得地址
	function getAddr(offset) {
		//根据RS判断R0地址
		var RS = 0x18 & STC90C51.PSW(),
			addr;
		offset = offset ? offset : 0;
		switch (RS) {
			case 0X00:
				addr = 0X00 + offset;
				break;
			case 0X01:
				addr = 0X08 + offset;
				break;
			case 0X10:
				addr = 0X10 + offset;
				break;
			case 0x11:
				addr = 0X18 + offset;
				break;
		}
		return addr;
	}
	//根据地址得到数据
	function getData(addr) {
		return STC90C51.RAM[addr];
	}
	switch (key) {
		case "Rn_ADDC":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					Add(data);
					STC90C51.PC++;
					var asStr = "ADDC A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:6
					};
					return retData;
				};
			};
		case "Rn_ADD":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					Add(data);
					STC90C51.PC++;
					var asStr = "ADD A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_ADD":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					Add(data);
					STC90C51.PC++;
					var asStr = "ADD A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_ADDC":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					Addc(data);
					STC90C51.PC++;
					var asStr = "ADDC A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:6
					};
					return retData;
				};
			};
		case "Rn_ORL":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					Addc(data);
					STC90C51.PC++;
					var asStr = "ORL A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_ANL":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					STC90C51.ACC(STC90C51.ACC() & data);
					STC90C51.PC++;
					var asStr = "ANL A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_XRL":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					STC90C51.ACC(STC90C51.ACC() ^ data);
					STC90C51.PC++;
					var asStr = "XRL A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_ORL":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					STC90C51.ACC(STC90C51.ACC() | data);
					STC90C51.PC++;
					var asStr = "ORL A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_ANL":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					STC90C51.ACC(STC90C51.ACC() & data);
					STC90C51.PC++;
					var asStr = "ANL A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_XRL":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					STC90C51.ACC(STC90C51.ACC() ^ data);
					STC90C51.PC++;
					var asStr = "XRL A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_MOV":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						data = getData16(++STC90C51.PC);
					STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV @R" + offset + ",#" + data;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:6
					};
					return retData;
				};
			};
		case "Rn_MOV":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						data = getData16(++STC90C51.PC);
					STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV R" + offset + ",#" + data;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:6
					};
					return retData;
				};
			};
		case "Ri_MOV_DIR":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset))),
						addr = getData16(++STC90C51.PC);
					STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV " + addr + ",@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "Rn_MOV_DIR":
			return function(offset) {
				return function() {
					var data = getAddr(offset),
						addr = getData16(++STC90C51.PC);
					STC90C51.setDir(addr,data);
					// STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV " + addr + ",R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "Ri_SUBB":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					Subb(data);
					STC90C51.PC++;
					var asStr = "SUBB A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_SUBB":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					Subb(data);
					STC90C51.PC++;
					var asStr = "SUBB A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_INC":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						data = STC90C51.RAM[addr]++;
					STC90C51.RAM[addr] = data & 0xff;
					STC90C51.PC++;
					var asStr = "INC @R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_INC":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						data = STC90C51.RAM[addr];
					if (++data > 255) {
						STC90C51.RAM[addr] = 0;
					} else {
						STC90C51.RAM[addr] = data;
					}
					STC90C51.PC++;
					var asStr = "INC R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_DEC":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset));
					STC90C51.RAM[addr]--;
					STC90C51.PC++;
					var asStr = "DEC @R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_DEC":
			return function(offset) {
				return function() {
					var addr = getAddr(offset);
					STC90C51.RAM[addr]--;
					STC90C51.PC++;
					var asStr = "DEC R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "DIR_MOV_Ri":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						data = STC90C51.getDir(getData16(++STC90C51.PC));
					STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV @R" + offset + "," + addr;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "DIR_MOV_Rn":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						dir = getData16(++STC90C51.PC),
						data = STC90C51.getDir(dir);
					STC90C51.RAM[addr] = data;
					STC90C51.PC++;
					var asStr = "MOV R" + offset + "," + getStr16(dir);
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "Ri_CJNE":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset))),
						data2 = getData16(++STC90C51.PC),
						rel = getRel(++STC90C51.PC);
					if (data2 != data) {
						STC90C51.PC += rel + 1;
						if (data < data2) {
							//进位标志位置1
							STC90C51.PSW(STC90C51.PSW() | 0X80);
						} else {
							//进位标志位置0
							STC90C51.PSW(STC90C51.PSW() & 0X7F);
						}
					} else {
						STC90C51.PC += 1;
					}
					var asStr = "CJNE @R" + offset + ",#" + data2 + "," + rel;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "Rn_CJNE":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset)),
						data2 = getData16(++STC90C51.PC),
						rel = getRel(++STC90C51.PC);
					if (data2 != data) {
						STC90C51.PC += rel + 1;
						if (data < data2) {
							//进位标志位置1
							STC90C51.PSW(STC90C51.PSW() | 0X80);
						} else {
							//进位标志位置0
							STC90C51.PSW(STC90C51.PSW() & 0X7F);
						}
					} else {
						STC90C51.PC += 1;
					}
					var asStr = "CJNE R" + offset + ",#" + data2 + "," + rel;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 3,
						period:12
					};
					return retData;
				};
			};
		case "Ri_XHR":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						data = getData(addr),
						a = STC90C51.ACC();
					STC90C51.ACC(data);
					STC90C51.RAM[addr] = a;
					STC90C51.PC++;
					var asStr = "XHR A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_XHR":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						data = getData(addr),
						a = STC90C51.ACC();
					STC90C51.ACC(data);
					STC90C51.RAM[addr] = a;
					STC90C51.PC++;
					var asStr = "XHR A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_XCHD":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						datal = getData(addr) & 0X0F,
						al = STC90C51.ACC() & 0X0F;
					STC90C51.ACC(STC90C51.ACC() & 0XF0 | datal);
					STC90C51.RAM[addr] = getData(addr) & 0xF0 | al;
					STC90C51.PC++;
					var asStr = "XCHR A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_DJNZ":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						data = getData(addr),
						rel = getRel(++STC90C51.PC);
					STC90C51.RAM[addr] = --data;
					STC90C51.PC += data ? rel + 1 : 1;
					var asStr = "DJNZ R" + offset + "," + rel;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 2,
						period:12
					};
					return retData;
				};
			};
		case "Ri_MOV_A":
			return function(offset) {
				return function() {
					var data = getData(getData(getAddr(offset)));
					STC90C51.ACC(data);
					STC90C51.PC++;
					var asStr = "MOV A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Rn_MOV_A":
			return function(offset) {
				return function() {
					var data = getData(getAddr(offset));
					STC90C51.ACC(data);
					STC90C51.PC++;
					var asStr = "MOV A,R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "Ri_MOVX_A":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						data = STC90C51.getExData(addr);
					STC90C51.ACC(data);
					STC90C51.PC++;
					var asStr = "MOVX A,@R" + offset;
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:12
					};
					return retData;
				};
			};
		case "Ri_MOVX":
			return function(offset) {
				return function() {
					var data = STC90C51.ACC(),
						addr = getData(getAddr(offset));
					STC90C51.setExData(addr, data);
					STC90C51.PC++;
					var asStr = "MOVX @R" + offset + ",A";
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:12
					};
					return retData;
				};
			};
		case "A_MOV_Ri":
			return function(offset) {
				return function() {
					var addr = getData(getAddr(offset)),
						a = STC90C51.ACC();
					STC90C51.RAM[addr] = a;
					STC90C51.PC++;
					var asStr = "MOV @R" + offset + ",A";
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
		case "A_MOV_Rn":
			return function(offset) {
				return function() {
					var addr = getAddr(offset),
						a = STC90C51.ACC();
					STC90C51.RAM[addr] = a;
					STC90C51.PC++;
					var asStr = "MOV R" + offset + ",A";
					console.log(asStr);
					var retData = {
						asStr: asStr,
						num: 1,
						period:6
					};
					return retData;
				};
			};
	}
}
//得到16进制字符
function getStr16(data){
	return data.toString(16).toUpperCase() + "H";
}
//得到16进制数据，PFM中
function getData16(addr) {
	return parseInt(STC90C51.PFM[addr], 16);
}
//获取相对跳转地址
function getRel(addr) {
	var rel = getData16(addr);
	if (rel > 127) {
		rel = -(~(rel - 1) & 0xff);
	}
	return rel;
}