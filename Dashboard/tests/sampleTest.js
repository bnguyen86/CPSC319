describe('SampleTest', function() {

	//These will be used to hold the mock services that we will inject into the cntl
	var service1, service2, service3;

    //Before each test, load our module
    beforeEach(function(){

    /*	
	  module(function($provide){

	  	//Mock your services ehre
	  	$provide.service('$service1', function(){
	      this.someFunction1 = function(){
	      	return true
	      };
	    });

	    $provide.service('$service2', function(){
	      this.someFunction2 = function(){
	      	return true
	      };
	    });

	    $provide.service('$service3', function(){
	    	this.someFunction3 = function(){
	      	return false
	      };
	    });

	  });
	  module('yourServiceName');
	*/
	});
	

    ///Create/Inject our mocks into the controller
    /*
	beforeEach(inject(function($service1, $service2, $service3) {
		//Bind your mocked up services to these variables
		service1 = $service1;
		service2 = $service2;
		service3 = $service3;
		
	}));
	*/

	//These are our actual unit tests
	it('YourTestName', function(){

		expect(true).toBe(true);
		/* call your service functions here
		expect(service1.someFunction1()).toBe(true);
		expect(service2.someFunction2()).toBe(true);
		expect(service3.someFunction3()).toBe(false);
		*/

	});	
});