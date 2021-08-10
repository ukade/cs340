module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getMakers (res, mysql, context, complete){
    mysql.pool.query("SELECT maker_id, first_name, last_name, phone_num, maker_town FROM Makers", function(error, results, fields){ 
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.makers = results;
      complete();
    });
  }

  function getNonprofits (res, mysql, context, complete){
    mysql.pool.query("SELECT nonprofit_id, nonprofit_name FROM Nonprofits", function(error, results, fields){
       if(error){
         res.write(JSON.stringify(error));
         res.end();
      }
      context.nonprofits = results;
      complete();
    });
   }

  function getNonprofit_makers(res, mysql, context, complete){
    mysql.pool.query("SELECT m_id, n_id FROM nonprofit_maker", function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.nonprofit_maker = results;
      complete();
    });
  }

  function getNonprofit_maker(res, mysql, context, maker_id, complete){
  var sql = "SELECT m_id, n_id FROM nonprofit_maker WHERE m_id= ? AND n_id= ?";
  var inserts = [m_id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      }
      context.nonprofit_maker = results[0];
      complete();
    });
  }

  router.get('/', function(req,res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletenonprofit_maker.js"];
    var mysql = req.app.get('mysql');
    getNonprofit_makers(res, mysql, context, complete);
    getMakers(res, mysql, context, complete);
    getNonprofits(res, mysql, context, complete);
    function complete(){
      callbackCount ++;
      if(callbackCount >= 3) {
        res.render('nonprofit_maker', context);
      }
    }
  });


  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO nonprofit_maker (m_id, n_id) VALUES (?, ?)";
    var inserts = [req.body.m_id, req.body.n_id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      } else{
        res.redirect('/nonprofit_maker');
      }
    });
  });

  router.delete('/:m_id' +'/:n_id', function(req,res){
     var mysql = req.app.get('mysql');
     var sql = "DELETE FROM nonprofit_maker WHERE m_id= ? AND n_id= ?";
     var inserts = [req.params.m_id, req.params.n_id];
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
