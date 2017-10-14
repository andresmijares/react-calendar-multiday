# React Multiday Calendar <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads]][downloads-image]

[![npm badge][npm-badge-png]][package-url]

A minimalist React Calendar used for our scheduling tools.

If you want to play with it:

[![Edit React Calendar Multiday](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/m4j347534p)

## Install
Using npm or yarn.
```
  npm install react-calendar-multiday
```

## Dependencies
It uses **moment** behind the scenes, for more information check the following API.

## API
|name|type|required|default|description|
|---|---|---|---|---|
|**onChange**|function|Yes |-|Exposed the current selections|
|**selected**|Array of Moment Instances|No| [] |Pass a selection of dates| 
|**year**|Moment Object - Year|No| Current |Select the default year|
|**month**|Moment Object - Month|No| Current |Select the default month|
|**isMultiple**|Boolean|No|false|Define if you need one sigle date selection or multiple|
|**DayComponent**|React Node|No|Default Day Component|Renders each day into the calendar|
|**reset**|Boolean|No|false|Display a clear selection button|

### OnChange
Returns an object with the **current** selection and the **selected** date(s).

```javascript
  {
    current: "2017-10-16T00:00:00-03:00",
    selected: ["2017-10-16T00:00:00-03:00"]

  }
```

### isMultiple
The calendar will allow to select one single day or multiples, the only different with be return object on the **onChange** function, it can contains one or more dates.

```javascript
  {
    current: "2017-10-16T00:00:00-03:00",
    selected: ["2017-10-16T00:00:00-03:00", "2017-10-27T00:00:00-03:00", "2017-11-05T00:00:00-03:00"]

  }
```

### DayComponent
A component that will render on each day, it receives several props where the most importants **label** and **isSelected**.
  * **Label**: String; Represents the day character.
  * **isSelected**: Booleam; True if the day is included in the selected array.
  * **isToday**: Booleam; True if the value match today;s date.
  * **isInThePast**: Boolem; True if the value is before than today.

Some other properties are expose like **selected** which is the selection array, we expose it cause we need that rule to manage inside business cases.

If you require that past days not be selected, you need to stop the propagation of the click event yourself.

Common use example:

```javascript
const PositionDay = props => {
  const { label, selected, date, isToday, isInThePast } = props
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

const getStyle = function ({date, isSelected}) {
  return `${isSelected ? 'o_selected-day' : ''} ${date.type}-day`
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
```

As you can see, we leave the default implementation as open as possible, this way we can support all the use cases we have into our apps.

## Styles
We expose a few css clases that you can edit, otherwise, you can use our ugly css default.

```javascript
  import 'react-calendar-multiday/lib/styles.css'
```

* o_day_picker: the calendar container
* i_day-picker-header: weeks headers
* i_day-picker-body: calendar body
* e_day-picker-buttons: prev and next month
* i_day-picker-row: weeks row
* i_day-picker-reset: reset button

## License
MIT

[package-url]: https://npmjs.org/package/react-calendar-multiday
[npm-version-svg]: http://versionbadg.es/sgrepo/react-calendar-multiday.svg
[npm-badge-png]: https://nodei.co/npm/react-calendar-multiday.png?downloads=true&stars=true
[deps-svg]: https://david-dm.org/sgrepo/react-calendar-multiday.svg
[deps-url]: https://david-dm.org/sgrepo/react-calendar-multiday
[dev-deps-svg]: https://david-dm.org/sgrepo/react-calendar-multiday.svg
[dev-deps-url]: https://david-dm.org/sgrepo/react-calendar-multiday.svg#info=devDependencies
[license-image]: http://img.shields.io/npm/l/react-calendar-multiday.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/react-calendar-multiday.svg