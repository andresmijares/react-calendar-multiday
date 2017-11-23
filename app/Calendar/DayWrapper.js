import React from 'react'
import PropTypes from 'prop-types'
import DefaultDay from './DefaultDay'
import {isNil, flatten} from 'ramda'

const DayWrapper = (props) => {
  const nextProps = {
    ...props,
    isSelected: isSelected(props),
    isCurrentChannelSelected: isCurrentChannelSelected(props),
  }

  return (
      <div
        data-date={props.date.moment.format('MM-DD')}
        onClick={() => props.onClick(props.date)}>
        {props.children && React.cloneElement(props.children, {...nextProps}) || <DefaultDay {...nextProps}/>}
      </div>)
}

export const isSelected = ({date, selected, channels}) =>
  !isNil(channels) ?
    flatten(Object.keys(channels).map(key => channels[key])).some(each => each.isSame(date.moment, 'day')) :
    selected.some(each => each.isSame(date.moment, 'day'))

export const isCurrentChannelSelected = ({date, selected, channels, currentChannel}) =>
  !isNil(channels) ?
    !isNil(channels[currentChannel]) &&
    channels[currentChannel].some(each => each.isSame(date.moment, 'day')) :
    selected.some(each => each.isSame(date.moment, 'day'))


DayWrapper.propTypes = {
  date: PropTypes.object,
  children: PropTypes.node,
  selected: PropTypes.array,
  onClick: PropTypes.func,
  channels: PropTypes.object,
  currentChannel: PropTypes.number,
}

export default DayWrapper
