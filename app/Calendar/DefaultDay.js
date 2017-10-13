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
  const { label, date, isToday, isInThePast } = props
  const disableDate = date.moment.isBefore(moment(), 'day')
  const onClick = (e) => {
    if (disableDate) {
      e.stopPropagation()
    }
  }

  return (
    <div onClick={onClick}
      className={getStyle(props)}
      style={getInline(isToday, isInThePast)}>
      {label}
    </div>)
}

DefaultDayComponent.propTypes = {
  label: PropTypes.number,
  date: PropTypes.object,
  isToday: PropTypes.bool,
  isInThePast: PropTypes.bool,
}

export const getStyle = function ({date, isSelected}) {
  return `${isSelected ? 'o_selected-day' : ''} ${date.type}-day`
}

export default DefaultDayComponent
