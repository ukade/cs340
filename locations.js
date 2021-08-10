module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getLocations (res, mysql, context, complete){
    mysql.pool.query("SELECT Locations.location_id, location_town, location_zip FROM Locations", function(error, results, fields){ 
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.locations = results;
      complete();
    });
  }

  function getLocation(res, mysql, context, location_id, complete){
  var sql = "SELECT location_id, location_town, location_zip FROM Locations WHERE location_id= ?";
  var inserts = [location_id];
  mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
      }
      context.location = results[0];
      complete();
    });
  }

  router.get('/', function(req,res){
    var context = {};
    context.jsscripts = ["deletelocation.js"];
    var mysql = req.app.get('mysql');
    getLocations(res, mysql, context, complete);
    function complete(){
      
        res.render('locations', context);
      
    }
  });

  router.get('/:location_id', function(req,res){
    var context = {};
    context.jsscripts = ["updatelocation.js"];
    var mysql = req.app.get('mysql');
    getLocation(res, mysql, context, req.params.location_id, complete);
    function complete(){
        res.render('update-location', context);
      
    };
  });

  router.post('/', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Locations (location_town, location_zip) VALUES (?, ?)";
    var inserts = [req.body.location_town, req.body.location_zip];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      } else{
        res.redirect('/locations');
      }
    });
  });

  router.put('/:location_id', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Locations SET location_town= ?, location_zip= ? WHERE location_id=?";
    var inserts = [req.body.location_town, req.body.location_zip, req.params.location_id];
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

  router.delete('/:location_id', function(req,res){
     var mysql = req.app.get('mysql');
     var sql = "DELETE FROM Locations WHERE location_id= ?";
     var inserts = [req.params.location_id];
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
