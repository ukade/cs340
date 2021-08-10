function updateLocation(location_id){
  $.ajax({
    url: '/locations/' + location_id,
    type: 'PUT',
    data: $('#update-location').serialize(),
    success: function(result){
       window.location.replace("./");
      }
    })
  };
    
