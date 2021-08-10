function updateNonprofit(nonprofit_id){
  $.ajax({
    url: '/nonprofits/' + nonprofit_id,
    type: 'PUT',
    data: $('#update-nonprofit').serialize(),
    success: function(result){
       window.location.replace("./");
      }
    })
  };
    
