module.exports = function(){
  var express = require('express');
  var router = express.Router();


  router.get('/', function(req,res){
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
        res.render('product', context);

  });

return router;
}(); 
