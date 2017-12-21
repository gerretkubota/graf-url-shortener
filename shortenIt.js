exports.shorterURL = new function(){
  var abcNum = '23456789-_bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
	var base = abcNum.length;

	this.wrapIt = function(num){
		var str = '';
		while (num > 0) {
			str = abcNum.charAt(num % base) + str;
			num = Math.floor(num / base);
		}
		return str;
	};

  this.unwrapIt = function(str){
    var num = 0;
    for(var i = 0; i < str.length; i++){
      num = num * base + abcNum.indexOf(str.charAt(i));
    }
    return num;
  }
};
