import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MonthComponent from './MonthComponent'
import moment from 'moment'
import {extendMoment} from 'moment-range'
import {reject, or, isEmpty, values, equals, cond, T} from 'ramda'
import {normalize, incMonth, decMonth, setMonthDays, TYPE, getKey} from './helpers'
import './Calendar/styles.css'

class Calendar extends Component {
  static defaultProps = {
    year: moment().get('year'),
    month: moment().get('month'),
    isMultiple: false,
    selected: [],
    channels: {},
  }

  constructor (props) {
    super(props)
    this.moment = extendMoment(moment)
    const {selected, channels} = this.props
    const defaultDate = this.moment([props.year, props.month])

    this.state = {
      defaultDate: defaultDate,
      selected: normalize(selected, this.moment),
      monthDays: setMonthDays(defaultDate, this.moment),
      channels,
      currentChannel: 1,
    }

    this.nextMonth = this.nextMonth.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this.onClick = this.onClick.bind(this)
    this.retrieveSelected = this.retrieveSelected.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selected.length !== nextProps.selected.length) {
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
    const formatedDay = day.moment.format()
    const calendar = getKey(day.moment)
    // const {channels, currentChannel, selected, defaultDate, monthDays} = this.state
    const {selected, defaultDate, monthDays} = this.state
    const updatedDefaultDate = cond([
      [equals(TYPE.NEXT), () => incMonth(defaultDate)],
      [equals(TYPE.PREV), () => decMonth(defaultDate)],
      [T, () => defaultDate],
    ])(day.type)

    /* Runs this if only if the channels are activated */
    // if (!channels[currentChannel]) {
    //   channels[currentChannel] = []
    // }
    // if (channels[currentChannel].indexOf(formatedDay) === -1) {
    //   channels[currentChannel] = channels[currentChannel].concat([formatedDay])
    // } else {
    //   channels[currentChannel] = channels[currentChannel].filter(d => d !== formatedDay)
    // }

    this.setState(
      {
        // channels,
        selected: this.props.isMultiple ? {
          ...selected,
          [calendar]: isEmpty(or(selected[calendar], {})) ? day.moment : {},
        }
        : [day.moment], // is Single day ,
        defaultDate: updatedDefaultDate,
        monthDays: cond([
          [equals(TYPE.NEXT), () => setMonthDays(updatedDefaultDate, this.moment)],
          [equals(TYPE.PREV), () => setMonthDays(updatedDefaultDate, this.moment)],
          [T, () => monthDays],
        ])(day.type),
      }, () => {
      /*
        Returns information for the listener function
      */
      this.props.onChange({
        // channels,
        current: formatedDay,
        selected: reject(isEmpty, values(this.state.selected))
                  .map(d => d.format()),
      })
    }
   )
  }

  retrieveSelected () {
    const nextMonth = this.moment(this.state.defaultDate).add(1, 'months')
    const prevMonth = this.moment(this.state.defaultDate).subtract(1, 'months').subtract(7, 'days')
    return reject(isEmpty, values(this.state.selected))
    .filter(d => d.isBetween(prevMonth, nextMonth))
  }

  addChannel () {
    const {channels} = this.state
    const max = Object.keys(channels).reduce((a, b) => {
        return Math.max(a, b)
    })
    /* check if the last channels is already filled */
    if (channels[max].length === 0) {
      return false
    }
    channels[max + 1] = []
    this.setState(channels)
  }

  deleteChannel (index) {
    const {channels} = this.state
    delete channels[index]
    this.setState(channels)
  }

  changeChannel (index) {
    if (this.state.currentChannel !== index) {
      this.setState({currentChannel: index})
    }
    return
  }

  render () {
    const {defaultDate, monthDays, currentChannel, channels} = this.state
    const reset = this.props.reset ? this.reset : null
    return (
        <MonthComponent
            currentChannel={currentChannel}
            channels={channels}
            dayNames={moment.weekdaysMin()}
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

Calendar.propTypes = {
  month: PropTypes.number,
  year: PropTypes.number,
  selected: PropTypes.array,
  channels: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  reset: PropTypes.bool,
  DayComponent: PropTypes.node,
  isMultiple: PropTypes.bool,
}

export default Calendar
