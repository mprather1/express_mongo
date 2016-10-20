var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api');
var User = require("./app/models/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  })

app.use('/api', router);

var server = app.listen(port, function(){
  console.log(`Listening on port ${port}...`);
});