import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import PositionDay from './Calendar/PositionsDay'
import Calendar from './Calendar/Calendar'
import './Calendar/styles.css'

const container = {
	width: '320px',
	float: 'left',
	marginRight: '50px',
	marginBottom: '50px',
}

const selectedDays = [
	moment().add(3, 'days'),
	moment().add(7, 'days'),
	moment().add(8, 'days'),
	moment().add(10, 'days'),
	moment().add(60, 'days'),
]
const reactToChange = (ob) => {
	console.warn(ob)
}

class App extends React.PureComponent {
		render () {
				return (
					<div style={{width: '800px', margin: 'auto'}}>
						<div className='container' style={container}>
								<Calendar
									onChange={reactToChange} />
									<h3>{`Single Day Calendar`}</h3>
						</div>
						<div className='container' style={container}>
								<Calendar
									onChange={reactToChange}
									selected={[selectedDays[2]]} />
									<h3>{`Single Day Calendar Pre-selected`}</h3>
						</div>
						<div style={{clear: 'both'}}></div>
						<div className='container' style={container}>
								<Calendar
									onChange={reactToChange}
									month={moment().get('month') + 2}
									selected={[selectedDays[selectedDays.length - 1]]} />
									<h3>{`Two Months from Now`}</h3>
						</div>
						<div className='container' style={container}>
								<Calendar
									isMultiple={true}
									DayComponent={<PositionDay />}
									onChange={reactToChange} />
									<h3>{`Multiple Day Calendar`}</h3>
						</div>
						<div style={{clear: 'both'}}></div>
						<div className='container' style={container}>
								<Calendar
									isMultiple={true}
									selected={selectedDays}
									onChange={reactToChange} />
									<h3>{`Multiple With Pre-selected days`}</h3>
						</div>
					</div>
			)
		}
}

const render = () => {
		ReactDOM.render(
				<App />,
				document.getElementById('app')
		)
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)