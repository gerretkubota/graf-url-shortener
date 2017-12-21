exports.checkRefresh = function(cookie){
  console.log(cookie);
  if(cookie.indexOf('mycookie')==-1){
    // cookie doesn't exist, create it now
    cookie = 'mycookie=1';
    return false;
  }
  else{
    // not first visit, so alert
    // alert('You refreshed!');
    return true;
  }
}
