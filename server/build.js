/* eslint-disable no-console */
import chalk from 'chalk'
import webpack from 'webpack'
import config from '../webpack.config.prod'

const chalkError = chalk.red
const chalkSuccess = chalk.green
const chalkWarning = chalk.yellow
const chalkProcessing = chalk.blue

process.env.NODE_ENV = 'production'

console.log(chalkProcessing('Generating minified bundle. This will take a moment...'))

webpack(config).run((errorMessage, stats) => {
		if (errorMessage) { // so a fatal error occurred. Stop here.
				console.log(chalkError(errorMessage))
				return 1
		}

		const jsonStats = stats.toJson()

		if (jsonStats.hasErrors) {
				return jsonStats.errors.map(error => console.log(chalkError(error)))
		}

		if (jsonStats.hasWarnings) {
				console.log(chalkWarning('Webpack generated the following warnings: '))
				jsonStats.warnings.map(warning => console.log(chalkWarning(warning)))
		}

		console.log(`Webpack stats: ${stats}`)

		// if we got this far, the build succeeded.
		console.log(chalkSuccess('Your app is compiled in production mode in /build. It\'s ready to roll!'))

		return false
})
