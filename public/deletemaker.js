function deleteMaker(maker_id){
  $.ajax({
    url: '/makers/' + maker_id,
    type: 'DELETE',
    success: function(result){
       window.location.reload(true);
    }
  })
};
