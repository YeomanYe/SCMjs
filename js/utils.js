/**
 * 替换字符串中所有指定字符
 * @param  {String} txt 待替换文本
 * @param  {String} org 要替换
 * @param  {String} rep 替换成
 * @return {[type]}     [description]
 */
function replaceAll(txt,org,rep){
	var temp = txt.replace(org,rep);
	while(temp!==txt){
		txt = temp;
		temp = txt.replace(org,rep);
	}
	console.log(txt);
	return txt;
}