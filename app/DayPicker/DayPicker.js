import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PureDayPicker from './PureDayPicker'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
import {reject, or, isEmpty, values, equals, cond, T, not} from 'ramda'
import {normalize, incMonth, decMonth, setMonthDays, TYPE, getKey} from './helpers'

class DayPicker extends Component {
  constructor (props) {
    super(props)
    this.moment = extendMoment(Moment)
    const {selected} = this.props
    const defaultDate = this.moment([props.year, props.month - 1])

    this.state = {
      defaultDate: defaultDate,
      selected: normalize(selected, this.moment),
      monthDays: setMonthDays(defaultDate, this.moment),
    }

    this.nextMonth = this.nextMonth.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this.onClick = this.onClick.bind(this)
    this.retrieveSelected = this.retrieveSelected.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (not(equals(or(this.props.selected), []).length, or(nextProps.selected, []).length)) {
      this.setState({selected: normalize(nextProps.selected, this.moment)})
    }
  }

  nextMonth () {
    const defaultDate = incMonth(this.state.defaultDate)
    this.setState({
      defaultDate,
      monthDays: setMonthDays(defaultDate, this.moment),
    })
  }

  prevMonth () {
    const defaultDate = decMonth(this.state.defaultDate)
    this.setState({
      defaultDate,
      monthDays: setMonthDays(defaultDate, this.moment),
    })
  }

  reset () {
    const selected = this.props.selected
    this.setState({
      selected: isEmpty(selected) ? {} : normalize(selected),
    })
  }

  onClick (day) {
    const calendar = getKey(day.moment)
    const {selected, defaultDate, monthDays} = this.state

    const updatedDefaultDate = cond([
      [equals(TYPE.NEXT), () => incMonth(defaultDate)],
      [equals(TYPE.PREV), () => decMonth(defaultDate)],
      [T, () => defaultDate],
    ])(day.type)
    this.setState(
      {
        selected: {
          ...selected,
          [calendar]: isEmpty(or(selected[calendar], {})) ? day.moment : {},
        },
        defaultDate: updatedDefaultDate,
        monthDays: cond([
          [equals(TYPE.NEXT), () => setMonthDays(updatedDefaultDate, this.moment)],
          [equals(TYPE.PREV), () => setMonthDays(updatedDefaultDate, this.moment)],
          [T, () => monthDays],
        ])(day.type),
      }, () => {
      this.props.onChange({current: day.moment.format(), selected: reject(isEmpty, values(this.state.selected)).map(d => d.format())})
    }
   )
  }

  retrieveSelected () {
    const nextMonth = this.moment(this.state.defaultDate).add(1, 'months')
    const prevMonth = this.moment(this.state.defaultDate).subtract(1, 'months').subtract(7, 'days')
    return reject(isEmpty, values(this.state.selected)).filter(d => d.isBetween(prevMonth, nextMonth))
  }

  render () {
    const {defaultDate, monthDays} = this.state
    const reset = this.props.reset ? this.reset : null
    return (
        <PureDayPicker
            dayNames={Moment.weekdaysMin()}
            days={monthDays}
            selected={this.retrieveSelected()}
            defaultDate={defaultDate}
            onClick={this.onClick}
            reset={reset}
            nextMonth={this.nextMonth}
            DayComponent={this.props.DayComponent}
            prevMonth={this.prevMonth}/>
    )
  }
}

DayPicker.propTypes = {
  month: PropTypes.number,
  year: PropTypes.number,
  selected: PropTypes.array,
  onChange: PropTypes.func,
  reset: PropTypes.bool,
  DayComponent: PropTypes.node,
}

export default DayPicker
