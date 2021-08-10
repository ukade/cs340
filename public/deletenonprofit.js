function deleteNonprofit(nonprofit_id){
  $.ajax({
    url: '/nonprofits/' + nonprofit_id,
    type: 'DELETE',
    success: function(result){
       window.location.reload(true);
    }
  })
};
