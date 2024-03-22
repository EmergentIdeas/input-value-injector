
function makeDate(date) {
	if(date instanceof Date) {
		return date
	}
	return new Date(date)
}

function pad(value, len, pad) {
	value = '' + value
	while(value.length < len) {
		value = pad + value
	}
	return value
}

function formatDate(date) {
	date = makeDate(date)
	let year = date.getFullYear()
	let month = pad(date.getMonth() + 1, 2, '0')
	let day = pad(date.getDate(), 2, '0')

	return `${year}-${month}-${day}`
}
function formatTime(date) {
	date = makeDate(date)
	let hour = pad(date.getHours(), 2, '0')
	let minute = pad(date.getMinutes(), 2, '0')
	let sec = pad(date.getSeconds(), 2, '0')
	let milli = pad(date.getMilliseconds(), 4, '0')
	return `${hour}:${minute}`
}

function formatCombined(date) {
	return formatDate(date) + 'T' + formatTime(date)
}

let nameAttrPattern = /\sname=["'](.*?)["']/i
let valAttrPattern = /\svalue=["'](.*?)["']/i
let typeAttrPattern = /\stype=["'](.*?)["']/i
let inputPattern = /(<input.*?>)/i
let checkedAttrPattern = /\schecked(=["'](.*?)["'])?/i

let attributeEscapes = {
	'&': '&amp;'
	, '"': '&quot;'
	, '<': '&lt;'
}

function escapeAttributeValue(attr) {
	if(attr === null || attr === undefined) {
		attr = ''
	}
	if(typeof attr !== 'string') {
		attr = '' + attr
	}
	for(let [key, value] of Object.entries(attributeEscapes)) {
		attr = attr.split(key).join(value)
	}
	return attr
}

let evalFunction = new Function('data',
	`with (data.context) {
		try {
			return eval(data.expression);
		} catch (e) {
			return null;
		}
	}`
)

function fetchValue(obj, path) {
	return evalFunction.call(this, {
		context: obj
		, expression: path
	})
}

function isOrContains(target, possible) {
	if(Array.isArray(possible)) {
		return possible.includes(target)
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
			
			
			if(type === 'text' || type === 'hidden' || type === 'date' || type === 'time' || type === 'datetime-local'
			|| type === 'search' || type === 'email' || type === 'number' || type === 'tel' || type === 'url' 
			|| type === 'month' || type === 'week' || type === 'color' || type === 'week'
			) {
				r = item.match(valAttrPattern)
				let value = r ? r[1] : null
				
				let newVal = fetchValue(values, name)
				if(type === 'date') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatDate(newVal)
						} catch(e) {
							newVal = orgValue
						}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				else if(type === 'time') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatTime(newVal)
						} catch(e) {
							newVal = orgValue
						}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				else if(type === 'datetime-local') {
					if(newVal) {
						let orgValue = newVal
						try {
							newVal = formatCombined(newValue)
						} catch(e) {}
						if(newVal == 'Invalid date') {
							newVal = orgValue
						}
					}
				}
				
				let replacementText
				if(newVal === null || newVal === undefined) {
					replacementText = ''
				}
				else {
					newVal = escapeAttributeValue(newVal)
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
