module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getLocations (res, mysql, context, complete){
    mysql.pool.query("SELECT location_id, location_town, location_zip FROM Locations", function(error, results, fields){ 
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.locations = results;
      complete();
    });
  }

  function getMakers(res, mysql, context, complete){
    mysql.pool.query("SELECT Makers.maker_id, first_name, last_name, phone_num, Locations.location_town AS maker_town FROM Makers INNER JOIN Locations ON maker_town = Locations.location_id", function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.makers = results;
      complete();
    });
  }

  function getMaker(res, mysql, context, maker_id, complete){
  var sql = "SELECT maker_id, first_name, last_name, phone_num, maker_town FROM Makers WHERE maker_id= ?";
  var inserts = [maker_id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      }
      context.maker = results[0];
      complete();
    });
  }

  router.get('/', function(req,res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletemaker.js"];
    var mysql = req.app.get('mysql');
    getMakers(res, mysql, context, complete);
    getLocations(res, mysql, context, complete);
    function complete(){
      callbackCount ++;
      if(callbackCount >= 2) {
        res.render('makers', context);
      }
    }
  });

  router.get('/:maker_id', function(req,res){
    callbackCount = 0; 
    var context = {};
    context.jsscripts = ["selectedlocation.js", "updatemaker.js"];
    var mysql = req.app.get('mysql');
    getMaker(res, mysql, context, req.params.maker_id, complete);
    getLocations(res, mysql, context, complete);
    function complete(){
      callbackCount ++;
      if(callbackCount >= 2){
        res.render('update-maker', context);
      }
    };
  });

  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Makers (first_name, last_name, phone_num, maker_town) VALUES (?, ?, ?, ?)";
    var inserts = [req.body.first_name, req.body.last_name, req.body.phone_num, req.body.maker_town];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      } else{
        res.redirect('/makers');
      }
    });
  });

  router.put('/:maker_id', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Makers SET first_name= ?, last_name= ?, phone_num = ?, maker_town=? WHERE maker_id=?";
    var inserts = [req.body.first_name, req.body.last_name, req.body.phone_num, req.body.maker_town, req.params.maker_id];
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

  router.delete('/:maker_id', function(req,res){
     var mysql = req.app.get('mysql');
     var sql = "DELETE FROM Makers WHERE maker_id= ?";
     var inserts = [req.params.maker_id];
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
  mysql.pool.query("DROP TABLE IF EXISTS Makers", function(err){
    var createString = "CREATE TABLE Makers("+
    "maker_id INT NOT NULL,"+
    "first_name VARCHAR NOT NULL,"+
    "last_name VARCHAR NOT NULL,"+
    "phone_num VARCHAR NOT NULL,"+
    "maker_town INT NOT NULL,"+
    "PRIMARY KEY (maker_id),"+
    "FOREIGN KEY (maker_town) REFERENCES Locations(location_id)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('makers',context);
    })
  });
});
return router;
}(); 
