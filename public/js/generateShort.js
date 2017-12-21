$('#button').on('click', function(){
  $.ajax({
    url: '/generate',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#original').val()},
    success: function(data){
      $('#shortened').val(data.newURL);
    }
  });
});
