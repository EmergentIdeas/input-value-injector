
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

let valueInjector = require('../input-value-injector')

let fs = require('fs')
let testDoc = fs.readFileSync('./test/test-file-1.html').toString()

let testData1 = {
	businessName: 'Emergent Ideas',
	alternateName: '',
	whenDate: new Date(2017, 10, 16, 14, 20, 30, 700),
	thenDate: new Date(2017, 10, 16, 14, 20, 30, 700).toString(),
	timeAndLabor: 'two',
	timeAndLabor2: true,
	timeAndLabor4: false,
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
			'<input class="form-control" type="text" id="alternateName" placeholder="" value="" name="alternateName"  />',
			valueInjector(
				'<input class="form-control" type="text" id="alternateName" placeholder="" value="Test Business" name="alternateName"  />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" value="Emergent Ideas" name="businessName"  />' +
			'<input class="form-control" type="text" id="alternateName" placeholder="" value="" name="alternateName"  />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" value="Test Business" name="businessName"  />' +
				'<input class="form-control" type="text" id="alternateName" placeholder="" value="Test Business" name="alternateName"  />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessName"  value="Emergent Ideas" />',
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
			'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames"  />',
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" name="businessNames" />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="hidden" id="businessName" placeholder="" name="businessName"  value="Emergent Ideas" />',
			valueInjector(
				'<input class="form-control" type="hidden" id="businessName" placeholder="" name="businessName" />',
				testData1
			)
		)
		
		assert.equal(
			'<input class="form-control" type="hidden" id="businessName" placeholder="" name="businessName" value="Emergent Ideas" />',
			valueInjector(
				'<input class="form-control" type="hidden" id="businessName" placeholder="" name="businessName"/>',
				testData1
			)
		)
	})

	it('checkbox values', function() {
		
		assert.equal(
			'<input class="form-control" type="checkbox" id="timeAndLabor2" placeholder="" name="timeAndLabor2"  checked="checked" />',
			valueInjector(
				'<input class="form-control" type="checkbox" id="timeAndLabor2" placeholder="" name="timeAndLabor2" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="checkbox" id="timeAndLabor4" placeholder="" name="timeAndLabor4" />',
			valueInjector(
				'<input class="form-control" type="checkbox" id="timeAndLabor4" placeholder="" name="timeAndLabor4" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="checkbox" id="timeAndLabor" placeholder="" value="two" name="timeAndLabor"  checked="checked" />',
			valueInjector(
				'<input class="form-control" type="checkbox" id="timeAndLabor" placeholder="" value="two" name="timeAndLabor" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="checkbox" id="timeAndLabor" placeholder="" value="three" name="timeAndLabor"/>',
			valueInjector(
				'<input class="form-control" type="checkbox" id="timeAndLabor" placeholder="" value="three" name="timeAndLabor"/>',
				testData1
			)
		)
		
	})	
	it('radio values', function() {
		
		assert.equal(
			'<input class="form-control" type="radio" id="timeAndLabor2" placeholder="" name="timeAndLabor2"  checked="checked" />',
			valueInjector(
				'<input class="form-control" type="radio" id="timeAndLabor2" placeholder="" name="timeAndLabor2" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="radio" id="timeAndLabor4" placeholder="" name="timeAndLabor4" />',
			valueInjector(
				'<input class="form-control" type="radio" id="timeAndLabor4" placeholder="" name="timeAndLabor4" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="radio" id="timeAndLabor" placeholder="" value="two" name="timeAndLabor"  checked="checked" />',
			valueInjector(
				'<input class="form-control" type="radio" id="timeAndLabor" placeholder="" value="two" name="timeAndLabor" />',
				testData1
			)
		)
		assert.equal(
			'<input class="form-control" type="radio" id="timeAndLabor" placeholder="" value="three" name="timeAndLabor"/>',
			valueInjector(
				'<input class="form-control" type="radio" id="timeAndLabor" placeholder="" value="three" name="timeAndLabor"/>',
				testData1
			)
		)
		
	})	
})
