exports.shorterURL = new function(){
  // initialize alphabets and numbers
  // base would be 60
  var abcNum = '23456789-_bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
	var base = abcNum.length;

  // pick char from string based off of number, mod it concatenate str
  // keep looping until number is < 0
	this.wrapIt = function(num){
		var str = '';
		while (num > 0) {
			str = abcNum.charAt(num % base) + str;
			num = Math.floor(num / base);
		}
		return str;
	};

  // get the string and do the reverse calcuations of above function wrapIt
  this.unwrapIt = function(str){
    var num = 0;
    for(var i = 0; i < str.length; i++){
      num = num * base + abcNum.indexOf(str.charAt(i));
    }
    return num;
  }
};
