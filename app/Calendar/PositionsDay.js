import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const PositionDay = props => {
  const { label, selected, date } = props
  const disableDate = date.moment.isBefore(moment(), 'day')
  const dayIsSelected = isSelected(date.moment, selected)
  const onClick = (e) => {
    if (disableDate) {
      e.stopPropagation()
    }
  }
  const disabledStyles = {
    cursor: 'not-allowed',
    background: '#e4e4e4',
    color: '#555555',
  }

  const disabledAndSelected = {
    cursor: 'not-allowed',
    background: '#4179a3',
  }
  return (
    <div onClick={onClick}
         style={disableDate
           ? (dayIsSelected
             ? disabledAndSelected
             : disabledStyles)
           : {}}
         className={getStyle(date, selected)}>
      {label}
    </div>)
}

PositionDay.propTypes = {
  label: PropTypes.number,
  date: PropTypes.object,
  selected: PropTypes.array,
}

export const isSelected = (momentDate, selected) => selected.some(each => each.isSame(momentDate, 'day'))

export const getStyle = function (day, selected) {
  return `${isSelected(day.moment, selected) ? 'o_selected-day' : ''} ${day.type}-day`
}

export default PositionDay
