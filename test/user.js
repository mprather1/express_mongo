var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
chai.use(chaiHttp)
var mongoose = require("mongoose");
var User = require('../db/models/user')

describe('Users', function(){
  it('should list All users', function(done){
    chai.request(server)
    .get('/api/users')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      done();
    });
  });
  it("should add a single user", function(done) {
    chai.request(server)
    .post('/api/users')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
})