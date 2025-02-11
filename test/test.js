
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
	
	it('sgml style inputs', function() {
		
		assert.equal(
			'<input type="text" name="businessName" value="Emergent Ideas" />',
			valueInjector(
				'<input type="text" name="businessName">',
				testData1
			)
		)
		assert.equal(
			'<input type="text" name="businessName" />',
			valueInjector(
				'<input type="text" name="businessName">',
				{
					businessName: null
				}
			)
		)
		assert.equal(
			'<input type="text" name="businessName" />\n' +
			'<input type="text" name="businessName" />'
			,
			valueInjector(
`<input type="text" name="businessName">
<input type="text" name="businessName">`,
				{
				}
			)
		)
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
	it('dates', function() {
		assert.equal(
			valueInjector(
				'<input type="date" name="when"/>',
				{
					when: '2025-02-01'
				}
			)
			, '<input type="date" name="when" value="2025-02-01" />'
		)
		assert.equal(
			valueInjector(
				'<input type="date" name="when"/>',
				{
					when: new Date('2025-02-01T00:00:00-06:00')
				}
			)
			, '<input type="date" name="when" value="2025-02-01" />'
		)
		assert.equal(
			valueInjector(
				'<input type="time" name="when"/>',
				{
					when: '23:00:00'
				}
			)
			, '<input type="time" name="when" value="23:00:00" />'
		)
		assert.equal(
			valueInjector(
				'<input type="time" name="when"/>',
				{
					when: new Date("2025-01-31T23:00:00-06:00")
				}
			)
			, '<input type="time" name="when" value="23:00" />'
		)
		assert.equal(
			valueInjector(
				'<input type="datetime-local" name="when"/>',
				{
					when: '2025-01-31T23:00:00-06:00'
				}
			)
			, '<input type="datetime-local" name="when" value="2025-01-31T23:00:00-06:00" />'
		)
	})
	it('text values, special characters', function() {
		
		assert.equal(
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" value="Test Business" name="businessName"  />',
				{ 
					businessName: '"quotesMc"Quoteson\'s'
				}
			)
			, '<input class="form-control" type="text" id="businessName" placeholder="" value="&quot;quotesMc&quot;Quoteson\'s" name="businessName"  />'
		)

		assert.equal(
			valueInjector(
				'<input class="form-control" type="text" id="businessName" placeholder="" value="Test Business" name="businessName"  />',
				{ 
					businessName: '"quotesMc"Quoteson\'s<&'
				}
			)
			, '<input class="form-control" type="text" id="businessName" placeholder="" value="&quot;quotesMc&quot;Quoteson\'s&lt;&amp;" name="businessName"  />'
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
	it('checkbox array values', function() {
		let checkData = {
			group: 'two'
		}
		
		assert.equal(
			`
				<input type="checkbox" name="group" value="one" />
				<input type="checkbox" name="group" value="two"  checked="checked" />
			`,
			valueInjector(
			`
				<input type="checkbox" name="group" value="one" checked="checked" />
				<input type="checkbox" name="group" value="two" />
			`,
				checkData	
			)
		)
		
		checkData = {
			group: ['two']
		}
		assert.equal(
			`
				<input type="checkbox" name="group" value="one" />
				<input type="checkbox" name="group" value="two"  checked="checked" />
			`,
			valueInjector(
			`
				<input type="checkbox" name="group" value="one" checked="checked" />
				<input type="checkbox" name="group" value="two" />
			`,
				checkData	
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
