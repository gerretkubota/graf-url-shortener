// grab original url from textfield and pass it through as a POST
// using ajax/json and get the result back and place it in new textfield

$('#button').on('click', function(){
  $.ajax({
    url: '/generate',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#original').val()},
    success: function(data){
      $('input[type=text]#shortened').val(data.newURL)
                                     .prop('disabled', false)
                                     .prop('readonly', true)
                                     .select();

    }
  });
});
