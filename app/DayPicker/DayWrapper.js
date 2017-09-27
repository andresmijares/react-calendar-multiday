import React from 'react'
import PropTypes from 'prop-types'
import DefaultDay from './DefaultDay'

const DayWrapper = (props) => {
  return (
      <div id={props.date.moment.format('MM-DD')} onClick={() => props.onClick(props.date)}>
        {props.children && React.cloneElement(props.children, {...props}) || <DefaultDay {...props}/>}
      </div>)
}

DayWrapper.propTypes = {
  date: PropTypes.object,
  children: PropTypes.node,
  selected: PropTypes.array,
  onClick: PropTypes.func,
}

export default DayWrapper
