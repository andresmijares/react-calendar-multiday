import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import PositionDay from '../Calendar/PositionsDay'
import Calendar from '../Calendar/Calendar'
import {omit} from 'ramda'
import '../Calendar/styles.css'


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

class App extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			currentChannel: 0,
			channels: {},
		}
		this.addChannels = this.addChannels.bind(this)
		this.deleteChannel = this.deleteChannel.bind(this)
		this.setChannel = this.setChannel.bind(this)
	}

	addChannels ({channels, currentChannel}) {
		this.setState({
			channels: channels,
			currentChannel: currentChannel,
		})
	}

	setChannel () {
		this.setState({currentChannel: 0})
	}

	deleteChannel () {
		this.setState({
			channels: omit(['0'], this.state.channels)
		})
	}

	render () {
			return (
				<div style={{width: '800px', margin: 'auto'}}>
					<div className='container' style={container}>
						<Calendar
							reset={true}
							isMultiple={true}
							onChange={reactToChange}
							channels={{}}/>
						<h3>{`Calendar with channels`}</h3>
					</div>
					<div className='container' style={container}>
						<Calendar
							reset={true}
							isMultiple={true}
							onChange={reactToChange}
							channels={this.state.channels}
							currentChannel={this.state.currentChannel}
							onAddChannel={this.addChannels}/>
						<button onClick={this.setChannel}>{'Select channel 0'}</button>
						<button onClick={this.deleteChannel}>{'Delete Channel 0'}</button>
						<h3>{`Calendar with choisable channels`}</h3>
					</div>
					<div className='container' style={container}>
							<Calendar
								reset={true}
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
								reset={true}
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
