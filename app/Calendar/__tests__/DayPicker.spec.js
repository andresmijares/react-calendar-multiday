// import React from 'react'
// import Enzyme, {mount} from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'
// import Calendar from '../Calendar'
// import DayWrapper from '../DayWrapper'
// import toJson from 'enzyme-to-json'
// import {equals, range, inc} from 'ramda'
// import jsdom from 'jsdom'

// Enzyme.configure({ adapter: new Adapter() })
// var exposedProperties = ['window', 'navigator', 'document']

// global.document = jsdom.jsdom('')
// global.window = document.defaultView
// Object.keys(document.defaultView).forEach((property) => {
//   if (typeof global[property] === 'undefined') {
//     exposedProperties.push(property)
//     global[property] = document.defaultView[property]
//   }
// })

// global.navigator = {
//   userAgent: 'node.js',
// }

// // const dayPicker = mount(<Calendar />)

