import React from 'react'
import PropTypes from 'prop-types'
import {splitEvery} from 'ramda'
import DayWrapper from './DayWrapper'
import './styles.css'

const PureDayPicker = props => {
  const {days, dayNames, selected, nextMonth, prevMonth, defaultDate, onClick, reset, DayComponent} = props
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
          )}
        </div>
        <div className={'i_day-picker-body'}>
          {weeks.map((w, index) =>
              <div key={index} className={'i_day-picker-row'}>
                {w.map(d =>
                    <DayWrapper
                        key={d.moment.date()}
                        label={d.moment.date()}
                        date={d}
                        selected={selected}
                        onClick={onClick}>
                      {DayComponent}
                    </DayWrapper>
                )}
              </div>
          )}
        </div>
        { reset &&
            <div className={'i_day-picker-reset'} onClick={reset}>
             {'Reset'}
           </div>
        }
      </div>
  )
}

PureDayPicker.propTypes = {
  days: PropTypes.array,
  dayNames: PropTypes.array,
  selected: PropTypes.array,
  onClick: PropTypes.func,
  nextMonth: PropTypes.func,
  prevMonth: PropTypes.func,
  reset: PropTypes.func,
  defaultDate: PropTypes.object,
  DayComponent: PropTypes.node,
}

export default PureDayPicker

