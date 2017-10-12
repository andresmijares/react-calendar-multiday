import {head, last, subtract, take, takeLast, or} from 'ramda'

export const TYPE = {
  MONTH: 'month',
  NEXT: 'next-month',
  PREV: 'prev-month',
}

export const KEY_FORMAT = 'YYYY-MM-DD'

export const setMonthDays = (month, moment) => {
  const nextMonthD = Array.from(getMonthRange(incMonth(moment(month)), moment).by('day'))
  const previousMonthD = Array.from(getMonthRange(decMonth(moment(month)), moment).by('day'))
  const monthDays = Array.from(getMonthRange(month, moment).by('day')).map(m => ({moment: m, type: TYPE.MONTH}))
  const weekIndexes = monthDays.map(d => d.moment.day())
  const nextMonthDays = take(subtract(6, last(weekIndexes)), nextMonthD).map(m => ({moment: m, type: TYPE.NEXT}))
  const prevMonthDays = takeLast(head(weekIndexes), previousMonthD).map(m => ({moment: m, type: TYPE.PREV}))
  return prevMonthDays.concat(monthDays, nextMonthDays)
}

export const normalize = (selected, momentBuilder) => {
  const normalizedDays = or(selected, []).reduce((prev, d) => {
    const moment = momentBuilder(d)
    prev[getKey(moment)] = moment
    return prev
  }, {})
  return normalizedDays
}

export const getMonthRange = (month, moment) => {
  const start = moment(month.startOf('month'))
  const end = month.endOf('month')
  return moment.range(start, end)
}

export const getKey = (moment) => moment.format(KEY_FORMAT)

export const incMonth = (date) => date.add(1, 'months')

export const decMonth = (date) => date.subtract(1, 'months')
