import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const getInline = (today, before) => ({
  cursor: before ? 'not-allowed' : 'inherit',
  background: today
  ? 'rgba(141, 224, 229, 0.5)'
  : before ? '#e4e4e4' : 'inherit',
  color: before ? '#555555' : 'inherit',

})

const DefaultDayComponent = props => {
  const { label, selected, date, isToday, isInThePast } = props
  const disableDate = date.moment.isBefore(moment(), 'day')
  const onClick = (e) => {
    if (disableDate) {
      e.stopPropagation()
    }
  }
  return (
    <div onClick={onClick}
      className={getStyle(date, selected)}
      style={getInline(isToday, isInThePast)}>
      {label}
    </div>)
}

DefaultDayComponent.propTypes = {
  label: PropTypes.number,
  date: PropTypes.object,
  selected: PropTypes.array,
  isToday: PropTypes.bool,
  isInThePast: PropTypes.bool,
}

// can we move this to an upper level???
export const isSelected = (momentDate, selected) => selected.some(each => each.isSame(momentDate, 'day'))

export const getStyle = function (day, selected) {
  return `${isSelected(day.moment, selected) ? 'o_selected-day' : ''} ${day.type}-day`
}

export default DefaultDayComponent
