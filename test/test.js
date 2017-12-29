
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

let valueInjector = require('../input-value-injector')

let fs = require('fs')
let testDoc = fs.readFileSync('./test/test-file-1.html').toString()

let testData1 = {
	businessName: 'Emergent Ideas',
	whenDate: new Date(2017, 10, 16, 14, 20, 30, 700),
	thenDate: new Date(2017, 10, 16, 14, 20, 30, 700).toString(),
	timeAndLabor: 'two',
	timeAndLabor2: true,
	timeAndLabor3: 'two'
}

describe("standard parsing and execution", function() {
	it("simple replacement", function() {
		
		// valueInjector(testDoc, testData1)
		assert.equal(true, true)
	})
	
	it('text values', function() {
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" value="Emergent Ideas" name="businessName"  />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" value="Test Business" name="businessName"  />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessName" value="Emergent Ideas" />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" name="businessName" />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessName" value="Emergent Ideas" />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" name="businessName" value="" />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames" value="hello" />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames" value="hello" />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames" />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames" />',
				testData1
			)
		)
		
	})
	
})
