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

  function getCommissions(res, mysql, context, complete){
    mysql.pool.query("SELECT Commissions.commission_id, Makers.maker_id AS m_id, Commissions.finished, Commissions.date_start, Commissions.date_due, Commissions.comments FROM Commissions INNER JOIN Makers ON m_id = Makers.maker_id", function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.commissions = results;
      complete();
    });
  }

  function getCommission(res, mysql, context, commission_id, complete){
  var sql = "SELECT commission_id, m_id, finished, date_start, date_due, comments";
  var inserts = [commission_id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      }
      context.commission = results[0];
      complete();
    });
  }

  router.get('/', function(req,res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletecommission.js"];
    var mysql = req.app.get('mysql');
    getCommissions(res, mysql, context, complete);
    getMakers(res, mysql, context, complete);
    function complete(){
      callbackCount ++;
      if(callbackCount >= 2) {
        res.render('commissions', context);
      }
    }
  });

  router.get('/:commission_id', function(req,res){
    callbackCount = 0; 
    var context = {};
    context.jsscripts = ["selectedmaker.js", "updatecommission.js"];
    var mysql = req.app.get('mysql');
    getCommission(res, mysql, context, req.params.commission_id, complete);
    getMakers(res, mysql, context, complete);
    function complete(){
      callbackCount ++;
      if(callbackCount >= 2){
        res.render('update-commission', context);
      }
    };
  });

  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Commissions (m_id, finished, date_start, date_due, comments) VALUES (?, ?, ?, ?, ?)";
    var inserts = [req.body.m_id, req.body.finished, req.body.date_start, req.body.date_due, req.body.comments];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      } else{
        res.redirect('/commissions');
      }
    });
  });

  router.put('/:commission_id', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Commissions SET m_id= ?, finished= ?, date_start = ?, date_due=?, comments=?, WHERE commission_id=?";
    var inserts = [req.body.m_id, req.body.finished, req.body.date_start, req.body.date_due, req.body.comments, req.params.commission_id];
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

  router.delete('/:commission_id', function(req,res){
     var mysql = req.app.get('mysql');
     var sql = "DELETE FROM Commissions WHERE commission_id= ?";
     var inserts = [req.params.commission_id];
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

  router.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS Commissions", function(err){
    var createString = "CREATE TABLE Commissions("+
    "commission_id INT NOT NULL,"+
    "m_id INT NOT NULL,"+
    "finished BOOLEAN NOT NULL,"+
    "date_start DATE NOT NULL,"+
    "date_due DATE NOT NULL,"+
    "comments VARCHAR,"+
    "PRIMARY KEY (commission_id),"+
    "FOREIGN KEY (m_id) REFERENCES Makers(maker_id)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('commissions',context);
    })
  });
});
return router;
}(); 
