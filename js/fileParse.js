var fileBtn = document.getElementById("file");
var fileString;
fileBtn.addEventListener('change',handleFileSelect,false);

function handleFileSelect(evt){
	var files = evt.target.files;
	if(files[0]){
		var reader = new FileReader();
		reader.readAsText(files[0]);
		reader.onload = function(evt){
			fileString = evt.target.result;
			STC90C51.loadCommandToPFM(fileString);
			//准备完成标志位
			isReady = true;
			main();
			console.log(STC90C51.PFM);
		};
	}
}