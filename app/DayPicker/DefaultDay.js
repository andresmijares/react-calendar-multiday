import React from 'react'
import PropTypes from 'prop-types'

const DefaultDayComponent = props => {
  const { label, selected, date } = props
  return (
    <div className={getStyle(date, selected)}>
      {label}
    </div>)
}

DefaultDayComponent.propTypes = {
  label: PropTypes.number,
  date: PropTypes.object,
  selected: PropTypes.array,
}

export const isSelected = (momentDate, selected) => selected.some(each => each.isSame(momentDate, 'day'))

export const getStyle = function (day, selected) {
  return `${isSelected(day.moment, selected) ? 'selected-day' : ''} ${day.type}-day`
}

export default DefaultDayComponent
