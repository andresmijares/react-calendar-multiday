import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import ReactDOM from 'react-dom'
// import PropTypes from 'prop-types'

class App extends React.PureComponent {
		render () {
				return (
						<div className='container'>
								{`Calendar`}
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
