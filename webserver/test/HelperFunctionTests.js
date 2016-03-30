//All of these dependecies should be in each test file
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../main');

//you may only need one of these, depending on the style you want to use
var expect = chai.expect; 
var should = chai.should();

chai.use(chaiHttp);

//"Class to be Tested" is the name of the class or name of group of tests
describe('Main Class Helper Functions', function() {
	it('generateUUIDTest', function(done) {
    //var uid = server.generateUUID();

    //expect(uid).to.not.be(null); 
	  //expect(uid).to.be.a('string'); 

	  done(); //call this after you are done with tests
	});

  it('fallDetected Test', function(done) {
    expect(true).to.equal(true); 

    done(); //call this after you are done with tests
  });

  it('isJSON Test', function(done) {
    expect(true).to.equal(true); 

    done(); //call this after you are done with tests
  });

  it('sendSOSMessage Test', function(done) {
    expect(true).to.equal(true); 

    done(); //call this after you are done with tests
  });
});
