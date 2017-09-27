import React from 'react'
import {mount} from 'enzyme'
import DayPicker from '../DayPicker'
import DayWrapper from '../DayWrapper'
import toJson from 'enzyme-to-json'
import {equals, range, inc} from 'ramda'

describe('Test dayPicker months, days and transitions', () => {
  beforeAll(() => {
    expect.extend({
      toHaveSameDates (dayPicker, t) {
        const monthDates = retrieveMonthDates(dayPicker)
        const {month, year} = t
        const dateRange = range(1, inc(getDaysInMonth(month, year)))
        const pass = equals(monthDates, dateRange)
        if (pass) {
          return {
            message: () => (`Year: ${year} Month: ${month}, passed`),
            pass: true,
          }
        } else {
          return {
            message: () => (`Year: ${year} Month: ${month}, failed.
                Calendar Month Days:  ${monthDates}
                Javascript Month Days: ${dateRange}
                `),
            pass: false,
          }
        }
      },
    })
    expect.extend({
      daysPerWeek (dayPicker, nr) {
        let pass = true
        dayPicker.find('.day-picker-row').forEach(week => {
          pass = equals(week.find(DayWrapper).length, nr)
        })
        return {
          message: () => (pass ? `Week has ${nr} days` : `Week has not ${nr} days`),
          pass,
        }
      },
    })
    expect.extend({
      daysPosition (dayPicker) {
        let pass = true
        let errorMessage = ''
        dayPicker.find('.day-picker-row').forEach(week => {
          week.find(DayWrapper).forEach((d, index) => {
            let pass = equals(d.props().date.moment.day(), index)
            if (!pass) {
              errorMessage = `Day found in a wrong position, ${d.props().date.moment} in ${index} position`
            }
          })
        })
        return pass ? {pass} : {message: () => (errorMessage), pass}
      },
    })
  })
  it.skip('Number of days in month, week and day position + Snapshots', function () {
    const tests = [
      {month: 1, year: 2017},
      {month: 2, year: 2017},
      {month: 3, year: 2017},
      {month: 4, year: 2017},
      {month: 5, year: 2017},
      {month: 6, year: 2017},
      {month: 7, year: 2017},
      {month: 8, year: 2017},
      {month: 9, year: 2017},
      {month: 10, year: 2017},
      {month: 11, year: 2017},
      {month: 12, year: 2017},
      {month: 1, year: 2018},
      {month: 2, year: 2018},
      {month: 3, year: 2018},
      {month: 4, year: 2018},
      {month: 5, year: 2018},
      {month: 6, year: 2018},
      {month: 7, year: 2018},
      {month: 8, year: 2018},
      {month: 9, year: 2018},
      {month: 10, year: 2018},
      {month: 11, year: 2018},
      {month: 12, year: 2018},
      {month: 1, year: 2019},
      {month: 2, year: 2019},
      {month: 3, year: 2019},
      {month: 4, year: 2019},
      {month: 5, year: 2019},
      {month: 6, year: 2019},
      {month: 7, year: 2019},
      {month: 8, year: 2019},
      {month: 9, year: 2019},
      {month: 10, year: 2019},
      {month: 11, year: 2019},
      {month: 12, year: 2019},
    ]
    tests.forEach((t) => {
      const dayPicker = mount(<DayPicker {...t} />)
      expect(dayPicker).daysPerWeek(7)
      expect(dayPicker).daysPosition()
      expect(dayPicker).toHaveSameDates(t)
      expect(toJson(dayPicker)).toMatchSnapshot()
    })
  })

  it.skip('Check Next Month transition', function () {
    const tests = [
      {
        initial: {month: 10, year: 2017},
        next: {month: 11, year: 2017},
      },
      {
        initial: {month: 12, year: 2017},
        next: {month: 1, year: 2017},
      },
      {
        initial: {month: 1, year: 2017},
        next: {month: 2, year: 2017},
      },
    ]
    tests.forEach((t) => {
      const dayPicker = mount(<DayPicker {...t.initial} />)
      expect(dayPicker).toHaveSameDates(t.initial)
      dayPicker.find('.arrow-right').at(0).simulate('click', {})
      expect(dayPicker).toHaveSameDates(t.next)
    })
  })

  it.skip('Check Previous Month transition', function () {
    const tests = [
      {
        previous: {month: 10, year: 2017},
        initial: {month: 11, year: 2017},
      },
      {
        previous: {month: 11, year: 2017},
        initial: {month: 12, year: 2017},
      },
      {
        previous: {month: 12, year: 2017},
        initial: {month: 1, year: 2018},
      },
    ]
    tests.forEach((t) => {
      const dayPicker = mount(<DayPicker {...t.initial} />)
      expect(dayPicker).toHaveSameDates(t.initial)
      dayPicker.find('.arrow-left').at(0).simulate('click', {})
      expect(dayPicker).toHaveSameDates(t.previous)
      expect(toJson(dayPicker)).toMatchSnapshot()
    })
  })
})

const retrieveMonthDates = (wrapper) => {
  return wrapper.state('monthDays').filter(d => equals(d.type, 'month')).map(d => d.moment.date())
}

const getDaysInMonth = function (month, year) {
  return new Date(year, month, 0).getDate()
}

