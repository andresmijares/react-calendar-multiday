import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MonthComponent from './MonthComponent'
import moment from 'moment'
import {extendMoment} from 'moment-range'
import {reject, or, isEmpty, values, equals, cond, T, isNil} from 'ramda'
import {normalize, incMonth, decMonth, setMonthDays, TYPE, getKey, getRealMonthAndYear} from './helpers'

class Calendar extends Component {
  static defaultProps = {
    year: moment().get('year'),
    month: moment().get('month'),
    isMultiple: false,
    selected: [],
    channels: null,
  }

  constructor (props) {
    super(props)
    this.moment = extendMoment(moment)
    const {selected, channels} = this.props
    const defaultDate = this.moment(getRealMonthAndYear(this.props.month, this.props.year))

    this.state = {
      defaultDate: defaultDate,
      selected: normalize(selected, this.moment),
      monthDays: setMonthDays(defaultDate, this.moment),
      channels,
      currentChannel: props.currentChannel || 0,
    }

    this.nextMonth = this.nextMonth.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this.onClick = this.onClick.bind(this)
    this.retrieveSelected = this.retrieveSelected.bind(this)
    this.reset = this.reset.bind(this)
    this.addChannel = this.addChannel.bind(this)
    this.addOrRemoveDateToChannel = this.addOrRemoveDateToChannel.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selected.length !== nextProps.selected.length) {
      this.setState({selected: normalize(nextProps.selected, this.moment)})
    }
    if (this.state.currentChannel !== nextProps.currentChannel) {
      this.setState({currentChannel: nextProps.currentChannel})
    }
    if (!equals(this.props.channels, nextProps.channels)) {
      this.setState({channels: nextProps.channels})
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
    const selected = this.state.selected
    const empty = Object.keys(selected).length
    this.setState({
      selected: empty ? {} : normalize(selected, this.moment),
        channels: !isNil(this.props.channels) ? {} : null,
        currentChannel: 0,
    }, () => this.props.onReset ? this.props.onReset() : true
    )
  }

  onClick (day) {
    const formattedDay = day.moment.format()
    const calendar = getKey(day.moment)
    const {selected, defaultDate, monthDays} = this.state
    //const {selected, defaultDate, monthDays} = this.state
    const updatedDefaultDate = cond([
      [equals(TYPE.NEXT), () => incMonth(defaultDate)],
      [equals(TYPE.PREV), () => decMonth(defaultDate)],
      [T, () => defaultDate],
    ])(day.type)

	  this.setState(
      {
        channels: !isNil(this.props.channels) ? this.addOrRemoveDateToChannel(day) : this.props.channels,
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
        channels: this.state.channels,
        current: formattedDay,
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

  addOrRemoveDateToChannel (day) {
    const {channels, currentChannel} = this.state
    if (!channels[currentChannel]) {
      channels[currentChannel] = []
    }

    if (!channels[currentChannel].some(d => d.isSame(day.moment, 'day'))) {
      channels[currentChannel] =  channels[currentChannel].concat([day.moment])
    } else {
      channels[currentChannel] = channels[currentChannel].filter(d => !d.isSame(day.moment, 'day'))
    }
    return channels
  }

  addChannel () {
    const {channels, currentChannel} = this.state
    const max = Object.keys(channels).reduce((a, b) =>  Math.max(a, b), 0)

    if (currentChannel === max && channels[max].length === 0) {
      return false
    }

    this.setState({
      channels,
      currentChannel: !isEmpty(channels[max]) ? Number(max) + 1 : max,
    }, () => this.props.onAddChannel ? this.props.onAddChannel({
      channels: this.state.channels,
      currentChannel: this.state.currentChannel,
      }) : true
    )
  }

  render () {
    const {defaultDate, monthDays, currentChannel, channels} = this.state
    const reset = this.props.reset ? this.reset : null
    const addChannel = !isNil(this.props.channels) ? this.addChannel : null
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
            addChannel={addChannel}
            nextMonth={this.nextMonth}
            DayComponent={this.props.DayComponent}
            prevMonth={this.prevMonth}/>
    )
  }
}

Calendar.propTypes = {
  channels: PropTypes.object,
  DayComponent: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  onAddChannel: PropTypes.func,
  selected: PropTypes.array,
  month: PropTypes.number,
  year: PropTypes.number,
  currentChannel: PropTypes.number,
  reset: PropTypes.bool,
  isMultiple: PropTypes.bool,
}

export default Calendar
