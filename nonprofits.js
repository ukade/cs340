module.exports = function(){
  var express = require('express');
  var router = express.Router();

    function getNonprofits(res, mysql, context, complete){
    mysql.pool.query("SELECT Nonprofits.nonprofit_id, nonprofit_name FROM Nonprofits", function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.nonprofits = results;
      complete();
    });
  }

  function getNonprofit(res, mysql, context, nonprofit_id, complete){
  var sql = "SELECT nonprofit_id, nonprofit_name FROM Nonprofits WHERE nonprofit_id= ?";
  var inserts = [nonprofit_id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      }
      context.nonprofit = results[0];
      complete();
    });
  }

  router.get('/', function(req,res){
    var context = {};
    context.jsscripts = ["deletenonprofit.js"];
    var mysql = req.app.get('mysql');
    getNonprofits(res, mysql, context, complete);
    function complete(){
        res.render('nonprofits', context);
     
    }
  });

  router.get('/:nonprofit_id', function(req,res){
    var context = {};
    context.jsscripts = ["updatenonprofit.js"];
    var mysql = req.app.get('mysql');
    getNonprofit(res, mysql, context, req.params.nonprofit_id, complete);
    function complete(){
      res.render('update-nonprofit', context);
      
    };
  });

  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Nonprofits (nonprofit_name) VALUES (?)";
    var inserts = [req.body.nonprofit_name];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      } else{
        res.redirect('/nonprofits');
      }
    });
  });

  router.put('/:nonprofit_id', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Nonprofits SET nonprofit_name= ? WHERE nonprofit_id=?";
    var inserts = [req.body.nonprofit_name, req.params.nonprofit_id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    });
  });

  router.delete('/:nonprofit_id', function(req,res){
     var mysql = req.app.get('mysql');
     var sql = "DELETE FROM Nonprofits WHERE nonprofit_id= ?";
     var inserts = [req.params.nonprofit_id];
     sql = mysql.pool.query(sql, inserts, function(error, results, fields){
     if(error){
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
     }else{
       res.status(202).end();
     }
   })
  })
return router;
}(); 
