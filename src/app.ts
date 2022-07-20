import { createServer } from './utils/server'
import logger from '@webhook/utils/logger'

createServer()
	.then(server => {
		server.listen(3000, () => {
			logger.info(`Listening on http://localhost:3000`)
			logger.info(`API Documentation on http://localhost:3000/api/webhooks/v1/api-docs`)
		})
	})
	.catch(err => {
		logger.error(`Error: ${err}`)
	})
