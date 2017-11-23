import React from 'react'
import PropTypes from 'prop-types'
import {splitEvery, isNil, isEmpty} from 'ramda'
import DayWrapper from './DayWrapper'
import moment from 'moment'

const MonthComponent = props => {
  const { days, dayNames, selected, nextMonth, prevMonth, defaultDate, onClick,
	         reset, DayComponent, addChannel, channels, currentChannel } = props
  const weeks = splitEvery(7, days)
  return (
      <div className={'o_day-picker'}>
        <div className={'e_day-picker-buttons'}>
          <div onClick={prevMonth} className={'e_day-picker-arrow-container'}>
            <div className={'i_day-picker-arrow-left'} />
          </div>
          <div className={'i_day-picker-title'}>
            {defaultDate.format('MMMM YYYY')}
          </div>
          <div onClick={nextMonth} className={'e_day-picker-arrow-container'}>
            <div className={'i_day-picker-arrow-right'} />
          </div>
        </div>
        <div className={'i_day-picker-header'}>
          {dayNames.map(n =>
              <div key={n}>{n}</div>
          )} {/* we can pass this as props as well */}
        </div>
        <div className={'i_day-picker-body'}>
          {weeks.map((w, index) =>
              <div key={index} className={'i_day-picker-row'}>
                {w.map((d, i) =>
                    <DayWrapper
                        key={i}
                        label={d.moment.date()}
                        date={d}
                        isToday={moment().format('YYYY-MM-DD') === d.moment.format('YYYY-MM-DD')}
                        isInThePast={d.moment.isBefore(moment(), 'day')}
                        selected={selected}
                        channels={channels}
                        currentChannel={currentChannel}
                        onClick={onClick}>
                      {DayComponent}
                    </DayWrapper>
                )}
              </div>
          )}
        </div>
	       <div className={'i_day-picker-actions'}>
          { reset &&
            <button className={'i_day-picker-reset'} onClick={reset}>
              {'reset'}
            </button>
          }
          { addChannel &&
            <button className={'i_day-picker-add-channel'} onClick={addChannel}
            disabled={isNil(channels[currentChannel]) || isEmpty(channels[currentChannel])}>
              {'save channel'}
            </button>
          }
	       </div>
      </div>
  )
}

MonthComponent.propTypes = {
  days: PropTypes.array,
  dayNames: PropTypes.array,
  selected: PropTypes.array,
  onClick: PropTypes.func,
  nextMonth: PropTypes.func,
  prevMonth: PropTypes.func,
  reset: PropTypes.func,
  defaultDate: PropTypes.object,
  DayComponent: PropTypes.node,
  type: PropTypes.string,
  channels: PropTypes.object,
  currentChannel: PropTypes.number,
}

export default MonthComponent

