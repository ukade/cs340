function deleteNonprofit_maker(m_id, n_id){
  $.ajax({
    url: '/nonprofit_maker/' + m_id + '/' + n_id,
    type: 'DELETE',
    success: function(result){
       window.location.reload(true);
    }
  })
};
