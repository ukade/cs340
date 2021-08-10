function updateCommission(commission_id){
  $.ajax({
    url: '/commissions/' + commission_id,
    type: 'PUT',
    data: $('#update-commission').serialize(),
    success: function(result){
       window.location.replace("./");
      }
    })
  };
    
