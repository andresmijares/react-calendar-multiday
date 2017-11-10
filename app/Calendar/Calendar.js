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
				// console.log('1', this.state.currentChannel)
				//if (this.props.channels !== nextProps.channels) {
				//	this.setState({currentChannel: nextProps.currentChannel})
				//}
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
    })
  }

  onClick (day) {
    const formatedDay = day.moment.format()
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

				if (isNil(channels[max]) || channels[max].length === 0) {
      return false
				}

				const nextIndexChannel = parseInt(max) + 1
				channels[nextIndexChannel] = []

				this.setState({
						channels,
						currentChannel: nextIndexChannel,
						}/* , () => this.props.handleChannel(channels, currentChannel) */
				)
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
				const addChannel = !isNil(this.props.channels) ? this.addChannel : null
				console.log('channels: ', channels)
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
  month: PropTypes.number,
  year: PropTypes.number,
  selected: PropTypes.array,
  channels: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  reset: PropTypes.bool,
  DayComponent: PropTypes.node,
  isMultiple: PropTypes.bool,
		currentChannel: PropTypes.number,
		handleChannel: PropTypes.func,
}

export default Calendar
