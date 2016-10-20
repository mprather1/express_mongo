var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api');
var User = require("./db/models/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/app"));

var port = process.env.PORT || 8000;

var router = express.Router();

router.use(function(req, res, next){
  console.log("Something is happening....");
  next();
});

router.get('/', function(req, res){
  res.json({ message: "Hello"});
});

router.route('/users')
  .post(function(req, res){
    var user = new User();
    user.name = req.body.name;
    user.save(function(err){
      if (err)
        res.send(err);
      res.json({ message: "User created..." });
    });
  })
  
  .get(function(req, res){
    User.find(function(err, users){
      if (err)
        res.send(err);
      res.json(users);
    });
  });
  
router.route('/users/:user_id')
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if (err)
        res.send(err);
      res.json(user);
    });
  })
  
  .put(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if (err)
        res.send(err);
      user.name = req.body.name;
      user.save(function(err){
        if (err)
          res.send(err);
        res.json({ message: "User updated..." });
      });
    });
  })
  
  .delete(function(req, res){
    User.remove({
      _id: req.params.user_id
    }, function(err, user){
      if (err)
       res.send(err)
      res.json({ message: 'Successfully deleted user...' });
    });
  });

app.use('/api', router);

var server = app.listen(port, function(){
  console.log(`Listening on port ${port}...`);
});