// import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import ReactDOM from 'react-dom'
import Calendar from 'react-calendar-multiday'
import moment from 'moment'
import {omit} from 'ramda'

const container = {
  width: '375px',
  float: 'left',
  marginRight: '50px',
  marginBottom: '50px',
  fontFamily: 'system-ui',
}

const buttonStyle = {
  border: 'none',
  fontSize: '.75em',
  outline: 'none',
  marginLeft: '10px',
  cursor: 'pointer',
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
    this.onReset = this.onReset.bind(this)
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

  setChannel (index) {
    this.setState({currentChannel: index})
  }

  deleteChannel (index) {
    this.setState({
      channels: omit([String(index)], this.state.channels)
    })
  }

  onReset () {
    this.setState({
      channels: {},
      currentChannel: 0
    })
  }

  render () {
      return (
        <div style={{width: '900px', margin: 'auto'}}>
          <div className='container' style={container}>
            <h3>{`Calendar with channels`}</h3>
            <Calendar
              reset={true}
              isMultiple={true}
              onChange={reactToChange}
              channels={{}}/>
          </div>
          <div className='container' style={container}>
            <h3>{`Calendar with choisable channels`}</h3>
            <div>
              {Object.keys(this.state.channels).map((key, index) => {
                const channel = this.state.channels[key]
                return <div style={{fontSize: '.85em', margin: '20px 0'}} key={key}>
                  <p style={{marginBottom: '5px', 'color' : this.state.currentChannel === parseInt(key) ? '#b8e986' : 'initial'}}>
                    {`🗓 ${channel.map(day => day.format('MM/DD/YY')).join(' - ')}`}
                  </p>
                  <button style={Object.assign({}, buttonStyle, {color: '#38b0ed'})}
                    onClick={() => this.setChannel(parseInt(key))} >{'EDIT'}</button>
                  <button style={Object.assign({}, buttonStyle, {color: '#ee3838'})}
                    onClick={() => this.deleteChannel(parseInt(key))} >{'DELETE'}</button>
                </div>
              })}
            </div>
            <Calendar
              reset={true}
              isMultiple={true}
              onChange={reactToChange}
              onReset={this.onReset}
              channels={this.state.channels}
              currentChannel={this.state.currentChannel}
              onAddChannel={this.addChannels}/>
          </div>
          <div className='container' style={container}>
            <h3>{`Single Day Calendar`}</h3>
            <Calendar
                reset={true}
                onChange={reactToChange} />
          </div>
          <div className='container' style={container}>
            <h3>{`Single Day Calendar Pre-selected`}</h3>
            <Calendar
                onChange={reactToChange}
                selected={[selectedDays[2]]} />
          </div>
          <div style={{clear: 'both'}}></div>
          <div className='container' style={container}>
            <h3>{`Two Months from Now`}</h3>
            <Calendar
                onChange={reactToChange}
                month={moment().get('month') + 2}
                selected={[selectedDays[selectedDays.length - 1]]} />
          </div>
          <div className='container' style={container}>
            <h3>{`Multiple Day Calendar`}</h3>
            <Calendar
              isMultiple={true}
              onChange={reactToChange} />
          </div>
          <div style={{clear: 'both'}}></div>
          <div className='container' style={container}>
            <h3>{`Multiple With Pre-selected days`}</h3>
            <Calendar
                isMultiple={true}
                reset={true}
                selected={selectedDays}
                onChange={reactToChange} />
          </div>
        </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
      <App />,
      document.getElementById('root')
  )
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)
