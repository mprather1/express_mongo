var chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should(),
    mongoose = require("mongoose"),
    User = require('../db/models/User');

chai.use(chaiHttp);

describe('Users', function(){
  
  User.collection.drop();
  
  beforeEach(function(done){
    var newUser = new User({
      firstName: "mohammed",
      lastName: "ali",
      email: "mohammed-ali@gmail.com",
      phone: 1234567890
    });
    newUser.save(function(err){
      done();
    });
  });
  
  afterEach(function(done){
    User.collection.drop();
    done();
  });
  
  it('GET should list All users at /api/users', function(done){
    chai.request(server)
    .get('/api/users')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('firstName');
      res.body[0].should.have.property('lastName');
      res.body[0].should.have.property('phone');
      res.body[0].should.have.property('email');
      res.body[0].firstName.should.equal('mohammed');
      res.body[0].lastName.should.equal('ali');
      res.body[0].phone.should.equal('1234567890');
      res.body[0].email.should.equal('mohammed-ali@gmail.com');
      done();
    });
  });
  
  it('GET should list a SINGLE user at /api/user/:id ', function(done) {
    var newUser = new User({
      firstName: "mohammed",
      lastName: "ali",
      email: "mohammed-ali@gmail.com",
      phone: 1234567890
    });
    newUser.save(function(err, data){
      chai.request(server)
      .get('/api/users/' + data.id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.a.property('_id');
        res.body.should.have.a.property('firstName');
        res.body.should.have.a.property('lastName');
        res.body.should.have.a.property('phone');
        res.body.should.have.a.property('email');
        res.body.firstName.should.equal('mohammed');
        res.body.lastName.should.equal('ali');
        res.body.phone.should.equal('1234567890');
        res.body.email.should.equal('mohammed-ali@gmail.com');
        res.body._id.should.equal(data.id);
        done();
      });
    });
  });
  
  it("POST should add a single user", function(done) {
    chai.request(server)
    .post('/api/users')
    .send({"firstName": "mohammed", "lastName": "ali", "phone": 1234567890, "email": "mohammed-ali@hotmail.com"})
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property("success");
      res.body.success.should.be.a('object');
      res.body.success.should.have.property('firstName');
      res.body.success.should.have.property('lastName');
      res.body.success.should.have.property('phone');
      res.body.success.should.have.property('email');
      res.body.success.firstName.should.equal("mohammed");
      res.body.success.lastName.should.equal("ali");
      res.body.success.email.should.equal("mohammed-ali@hotmail.com");
      res.body.success.phone.should.equal("1234567890");
      done();
    });
  });
})