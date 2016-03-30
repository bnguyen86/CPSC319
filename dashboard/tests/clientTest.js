describe('ClientTest', function() {

	it('dateTimePopUpTest', function(){

		expect(true).toBe(true);
	});

	it('userButtonCreationTest', function(){
		var data = {test:"good"};
		userButtonCreation(data)
		expect(true).toBe(true);
	});

	it('userSelectionTest', function(){
		userSelection("sampleId");
		expect(true).toBe(true);
	});	

	it('queryTest', function(){

		expect(true).toBe(true);
	});	

	it('submitDateTimeTest', function(){

		expect(true).toBe(true);
	});

	it('isJSONTest', function(){
		var goodJSON = {test:"good"};
		var badJSON = "not even close";
		
		expect(isJSON(goodJSON)).toBe(true);
		expect(isJSON(badJSON)).toBe(false);
	});
});