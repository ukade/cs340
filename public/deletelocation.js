function deleteLocation(location_id){
  $.ajax({
    url: '/locations/' + location_id,
    type: 'DELETE',
    success: function(result){
       window.location.reload(true);
    }
  })
};
