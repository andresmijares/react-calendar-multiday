import React from 'react'
import {mount} from 'enzyme'
import DayPicker, {FORMAT} from '../DayPicker'
import {equals, dec} from 'ramda'
import moment from 'moment'
import toJson from 'enzyme-to-json'

describe('DayPicker, check multiple day selection', () => {
  it.skip('DayPicker select dates test', function () {
    const tests = [
      {
        initial: {month: 10, year: 2017},
        selectDates: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 5]),
          moment([2017, dec(10), 6])],
        expectedSelected: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 5]),
          moment([2017, dec(10), 6])],
      },
      {
        initial: {month: 10, year: 2017},
        selectDates: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 4])],
        expectedSelected: [],
      },
      {
        initial: {month: 10, year: 2017},
        selectDates: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 4])],
        expectedSelected: [moment([2017, dec(10), 4])],
      },
      {
        initial: {month: 10, year: 2017},
        selectDates: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 5]),
          moment([2017, dec(10), 5]),
          moment([2017, dec(10), 6]),
          moment([2017, dec(10), 7]),
          moment([2017, dec(10), 7]),
          moment([2017, dec(10), 8])],
        expectedSelected: [
          moment([2017, dec(10), 4]),
          moment([2017, dec(10), 6]),
          moment([2017, dec(10), 8])],
      },
    ]

    const onChange = (state) => {
      this.selected = state.selected
    }

    tests.forEach((t) => {
      this.selected = []
      const dayPicker = mount(<DayPicker onChange={onChange.bind(this)} {...t.initial} />)
      t.selectDates.forEach(d => {
        dayPicker.find(`#${d.format('MM-DD')}`).at(0).simulate('click', {})
      })
      expect(dayPicker.find('.selected-day').length).toBe(t.expectedSelected.length)
      expect(equals(this.selected, t.expectedSelected.map(d => d.format(FORMAT)))).toBeTruthy()
      expect(toJson(dayPicker)).toMatchSnapshot()
    })
  })

  it.skip('DayPicker select dates and month transition', function () {
    const tests = [
      {
        initial: {month: 10, year: 2017},
        final: {month: 11, year: 2017},
        selectInitialDates: [
          moment([2017, dec(10), 8]),
          moment([2017, dec(10), 9]),
          moment([2017, dec(10), 10])],
        transitionDate: moment([2017, dec(11), 3]),
        selectFinalDates: [
          moment([2017, dec(11), 4]),
          moment([2017, dec(11), 5]),
          moment([2017, dec(11), 6])],
        expectedSelected: [
          moment([2017, dec(10), 8]),
          moment([2017, dec(10), 9]),
          moment([2017, dec(10), 10]),
          moment([2017, dec(11), 4]),
          moment([2017, dec(11), 5]),
          moment([2017, dec(11), 6]),
          moment([2017, dec(11), 3])],
      },
      {
        initial: {month: 12, year: 2017},
        final: {month: 1, year: 2018},
        selectInitialDates: [
          moment([2017, dec(12), 8]),
          moment([2017, dec(12), 9]),
          moment([2017, dec(12), 10])],
        transitionDate: moment([2018, dec(1), 3]),
        selectFinalDates: [
          moment([2018, dec(1), 4]),
          moment([2018, dec(1), 5]),
          moment([2018, dec(1), 6])],
        expectedSelected: [
          moment([2017, dec(12), 8]),
          moment([2017, dec(12), 9]),
          moment([2017, dec(12), 10]),
          moment([2018, dec(1), 3]),
          moment([2018, dec(1), 4]),
          moment([2018, dec(1), 5]),
          moment([2018, dec(1), 6])],
      },
    ]

    const onChange = (state) => {
      this.selected = state.selected
    }

    tests.forEach((t) => {
      this.selected = []
      const dayPicker = mount(<DayPicker onChange={onChange.bind(this)} {...t.initial} />)
      t.selectInitialDates.forEach(d => {
        dayPicker.find(`#${d.format('MM-DD')}`).at(0).simulate('click', {})
      })
      dayPicker.find(`#${t.transitionDate.format('MM-DD')}`).at(0).simulate('click', {})
      expect(equals(dayPicker.state('defaultDate').format('MM-YYYY'), t.transitionDate.format('MM-YYYY'))).toBeTruthy()
      t.selectFinalDates.forEach(d => {
        dayPicker.find(`#${d.format('MM-DD')}`).at(0).simulate('click', {})
      })
      expect(equals(this.selected.sort(), t.expectedSelected.map(d => d.format(FORMAT)).sort())).toBeTruthy()
      expect(toJson(dayPicker)).toMatchSnapshot()
    })
  })
})
