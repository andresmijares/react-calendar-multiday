# React Multiday Calendar <sup>[![Version Badge][npm-version-svg]][package-url]</sup> 

[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Github file size][file-size-image]]()
[![Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/andresmijares/react-calendar-multiday.svg?branch=master)](https://travis-ci.org/andresmijares/react-calendar-multiday)


[![npm badge][npm-badge-png]][package-url]

A minimalist React Calendar used for scheduling tools.

If you want to play with it:

[![Edit React Calendar Multiday](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/m4j347534p)

## Install
Using npm or yarn.
```bash
    npm install react-calendar-multiday
```

## Run Example
```bash
    cd app/Example
    npm install
    npm run start
```

## Import
As a default component:

```javascript
  import Calendar from 'react-calendar-multiday'
```

## Dependencies
It uses **moment** and **ramda** behind the scenes, we are working to remove the ramda on the next release in order to keep the bundle size as low as we can.

## API
|name|type|required|default|description|
|---|---|---|---|---|
|**onChange**|Function|Yes |-|Callback fired once click on a date. Expose the current selections|
|**onAddChannel**|Function|No|-|Callback fired once confirm channel selection. Expose channels and currentChannel|
|**onReset**|Function|No|-|Callback fired once click Reset (Reset needs to be true)|
|**channels**|Dict object|No|-|Store selected dates by channels|
|**selected**|Array of Moment Instances|No| [] |Pass a selection of dates| 
|**year**|Moment Object - Year|No| Current |Select the default year|
|**month**|Moment Object - Month|No| Current |Select the default month|
|**currentChannel**|Number|No|-|Key of current channel|
|**reset**|Boolean|No|false|Display a clear selection button|
|**isMultiple**|Boolean|No|false|Define if you need one sigle date selection or multiple|
|**DayComponent**|React Node|No|Default Day Component|Renders each day into the calendar|



### OnChange
Returns an object with the **current** selection and the **selected** date(s).

```javascript
{
    current: "2017-10-16T00:00:00-03:00",
    selected: ["2017-10-16T00:00:00-03:00"],
    channels: {0: ["2017-10-16T00:00:00-03:00"]} // if channels are available
}
```

### isMultiple
The calendar will allow to select one single day or multiples, the only different with be return object on the **onChange** function, it can contains one or more dates.

```javascript
{
    current: "2017-10-16T00:00:00-03:00",
    selected: ["2017-10-16T00:00:00-03:00", "2017-10-27T00:00:00-03:00", "2017-11-05T00:00:00-03:00"],
    channels: {0: ["2017-10-16T00:00:00-03:00", "2017-10-27T00:00:00-03:00", "2017-11-05T00:00:00-03:00"]} // if channels are available
}
```

### DayComponent
A component that will render on each day, it receives several props where the most importants **label** and **isSelected**.
* **Label**: String; Represents the day character.
* **isSelected**: Booleam; True if the day is included in the selected array.
* **isCurrentChannelSelected**: Booleam; True if the day is included in the selected array for the current channel.
* **isToday**: Booleam; True if the value match today;s date.
* **isInThePast**: Boolem; True if the value is before than today.

Some other properties are expose like **selected** which is the selection array, we expose it cause we need that rule to manage inside business cases.

If you require that past days not be selected, you need to stop the propagation of the click event yourself.

Common use example:

```javascript
const PositionDay = props => {
  const onClick = (e) => {
    if (props.isInthePast) {
      e.stopPropagation()
    }
  }
  return (
    <div onClick={onClick}
      className={getStyle(props)}
      style={getInline(props)}>
      {props.label}
    </div>)
}

const getStyle = function ({date, isSelected}) {
  return `${isSelected ? 'o_selected-day' : ''} ${date.type}-day`
}

const getInline = ({isToday, isInThePast}) => ({
  cursor: isInThePast ? 'not-allowed' : 'inherit',
  background: isToday
  ? 'rgba(141, 224, 229, 0.5)'
  : isInThePast ? '#e4e4e4' : 'inherit',
  color: isInThePast ? '#555555' : 'inherit',
})

```

As you can see, we leave the default implementation as open as possible, this way we can support all the use cases we have into our apps.

## Styles
We expose a few css clases that you can edit, otherwise, you can use our ugly css default.

* o_day_picker: the calendar container
* i_day-picker-header: weeks headers
* i_day-picker-body: calendar body
* e_day-picker-buttons: prev and next month
* i_day-picker-row: weeks row
* i_day-picker-reset: reset button
* i_day-picker-add-channel: add channel button
* o_selected-current-channel-day: date selected for current channel

## License
MIT

[package-url]: https://npmjs.org/package/react-calendar-multiday
[npm-version-svg]: http://versionbadg.es/andresmijares/react-calendar-multiday.svg
[npm-badge-png]: https://nodei.co/npm/react-calendar-multiday.png?downloads=true&stars=true
[deps-svg]: https://david-dm.org/andresmijares/react-calendar-multiday.svg
[deps-url]: https://david-dm.org/andresmijares/react-calendar-multiday
[dev-deps-svg]: https://david-dm.org/andresmijares/react-calendar-multiday.svg
[dev-deps-url]: https://david-dm.org/andresmijares/react-calendar-multiday.svg#info=devDependencies
[license-image]: http://img.shields.io/npm/l/react-calendar-multiday.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-calendar-multiday.svg
[downloads-url]: http://npm-stat.com/charts.html?package=react-calendar-multiday
[file-size-image]: https://img.shields.io/github/size/andresmijares/react-calendar-multiday/lib/app.min.js.svg
