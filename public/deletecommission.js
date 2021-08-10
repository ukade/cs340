function deleteCommission(commission_id){
  $.ajax({
    url: '/commissions/' + commission_id,
    type: 'DELETE',
    success: function(result){
       window.location.reload(true);
    }
  })
};
