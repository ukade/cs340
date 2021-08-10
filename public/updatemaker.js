function updateMaker(maker_id){
  $.ajax({
    url: '/makers/' + maker_id,
    type: 'PUT',
    data: $('#update-maker').serialize(),
    success: function(result){
       window.location.replace("./");
      }
    })
  };
    
