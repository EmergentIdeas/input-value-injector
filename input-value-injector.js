
const moment = require('moment')

let nameAttrPattern = /\sname=["'](.*?)["']/i
let valAttrPattern = /\svalue=["'](.*?)["']/i
let typeAttrPattern = /\stype=["'](.*?)["']/i
let inputPattern = /(<input.*?>)/i
let checkedAttrPattern = /\schecked(=["'](.*?)["'])?/i


function fetchValue(obj, path) {
	try {
		with(obj) {
			try {
				return eval(path)
			}
			catch(e) {}
		}
		return obj[path]
	}
	catch(e) {}
	return null
}

function isOrContains(target, possible) {
	if(typeof possible == 'array') {
		possible.includes(target)
	}
	else {
		return target == possible
	}
}


let injectValues = function(text, values) {
	
	let result = ''
	
	text.split(inputPattern).forEach((item) => {
		if(item.toLowerCase().indexOf('<input') == 0) {
			let r = item.match(nameAttrPattern)
			let name = r ? r[1] : null
			
			r = item.match(typeAttrPattern)
			let type = (r ? r[1] : 'text').toLowerCase()
			
			
			if(type === 'text' || type === 'hidden' || type === 'date' || type === 'time' || type === 'datetime-local') {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				
				let newVal = fetchValue(values, name)
				if(type === 'date') {
					if(newVal) {
						try {
							newVal = moment(newVal).format('YYYY-MM-DD')
						} catch(e) {}
					}
				}
				else if(type === 'time') {
					if(newVal) {
						try {
							newVal = moment(newVal).format('HH:mm')
						} catch(e) {}
					}
				}
				else if(type === 'datetime-local') {
					if(newVal) {
						try {
							newVal = moment(newVal).format('YYYY-MM-DDTHH:mm')
						} catch(e) {}
					}
				}
				
				let replacementText
				if(newVal == null) {
					replacementText = ''
				}
				else {
					if(newVal && newVal.indexOf('"') > -1) {
						newVal = newVal.replace('"', '&quot;')
					}
					
					newVal = newVal || ''
					replacementText = ' value="' + newVal + '"'
				}


				if(value != null) {
					if(newVal != null) {
						item = item.replace(valAttrPattern, replacementText)
					}
				}
				else {
					if(item.endsWith('/>')) {
						item = item.slice(0, -2)
					}
					else {
						item = item.slice(0, -1)
					}
					item = item + replacementText + ' />'
				}
				
				result += item
			}
			else if(type === 'radio') {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				let newVal = fetchValue(values, name)
				
				if(!value) {
					// We don't have a specific value, so we'll say it's checked
					// if the new value is truthy.
					
					if(!newVal || newVal == 'false' || newVal == 'off') {
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				else {
					if(!newVal || newVal != value) {
						// if the new value is blank or does not equal the value in
						// in the value attribute, we'll make it unchecked
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				
				result += item
			}
			else if(type === 'checkbox') {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				let newVal = fetchValue(values, name)
				
				if(!value) {
					// We don't have a specific value, so we'll say it's checked
					// if the new value is truthy.
					
					if(!newVal || isOrContains('false', newVal) || isOrContains('off', newVal)) {
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				else {
					if(!newVal || !isOrContains(value, newVal)) {
						// if the new value is blank or does not equal the value in
						// in the value attribute, we'll make it unchecked
						item = item.replace(checkedAttrPattern, '')
					}
					else {
						// so we should have it checked
						if(!item.match(checkedAttrPattern)) {
							if(item.endsWith('/>')) {
								item = item.slice(0, -2)
							}
							else {
								item = item.slice(0, -1)
							}
							item = item + ' checked="checked" />'  
						}
						// if the above were not true, it's because it's already checked
					}
				}
				
				result += item
			}
			else {
				result += item
			}
			
		}
		else {
			result += item
		}
	})
	
	return result
}


module.exports = injectValues