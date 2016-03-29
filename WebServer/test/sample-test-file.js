//All of these dependecies should be in each test file
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../main');

//you may only need one of these, depending on the style you want to use
var expect = chai.expect; 
var should = chai.should();

chai.use(chaiHttp);

//"Class to be Tested" is the name of the class or name of group of tests
describe('Class to be Tested', function() {
	it('NAME OF YOUR UNIT TEST', function(done) {
        //WRITE YOUR ACTUAL TESTS HERE
        //http://chaijs.com/guide/styles/ for more examples

	   // USE THIS SYNTAX TO TEST ENDPOINTS
	   // chai.request(server)
	   //   .get('/')
       //   .end(function(err, res){
	   //     res.should.have.status(200);
	   //     done();
	   //   });

	  expect(true).to.equal(true); 

	  done(); //call this after you are done with tests
	});

    it('ANOTHER UNIT TEST', function(done) {
        //WRITE YOUR ACTUAL TESTS HERE
        //http://chaijs.com/guide/styles/ for more examples

       // USE THIS SYNTAX TO TEST ENDPOINTS
       // chai.request(server)
       //   .get('/')
       //   .end(function(err, res){
       //     res.should.have.status(200);
       //     done();
       //   });

      expect(true).to.equal(true); 

      done(); //call this after you are done with tests
    });
});
