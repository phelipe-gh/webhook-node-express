import express from 'express'
import logger from '@webhook/utils/logger'
import bodyParser from 'body-parser'
import * as OpenApiValidator from 'express-openapi-validator'
import { Express } from 'express-serve-static-core'
import morgan from 'morgan'
import morganBody from 'morgan-body'
import config from '@webhook/config'
import { connector, summarise } from 'swagger-routes-express'
import YAML from 'yamljs'
import * as api from '@webhook/api/controllers'
import { expressDevLogger } from '@webhook/utils/express_dev_logger'
import swaggerUi from 'swagger-ui-express'
import { getLocalTimeISOString } from '@webhook/utils'

export async function createServer(): Promise<Express> {
	const yamlSpecFile = './config/openapi.yml'
	const apiDefinition = YAML.load(yamlSpecFile)
	const apiSummary = summarise(apiDefinition)
	logger.info(apiSummary)
	const server = express()
	// here we can intialize body/cookies parsers, connect logger, for example morgan
	server.use(bodyParser.json())

	if (config.morganLogger) {
		server.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
	}

	if (config.morganBodyLogger) {
		morganBody(server)
	}

	server.use('/api/webhooks/v1/api-docs', swaggerUi.serve, swaggerUi.setup(apiDefinition))

	if (config.exmplDevLogger) {
		server.use(expressDevLogger)
	}

	// setup API validator
	const validatorOptions = {
		apiSpec: yamlSpecFile,
		validateRequests: false,
		validateResponses: true,
	}

	server.use(OpenApiValidator.middleware(validatorOptions))

	// error customization, if request is invalid
	server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
		res.status(err.status).json({
			statusCode: err.status,
			timestamp: getLocalTimeISOString(new Date()),
			message: {
				name: err.name,
				errors: err.errors
			},
		})
	})

	const connect = connector(api, apiDefinition, {
		onCreateRoute: (method: string, descriptor: any[]) => {
			descriptor.shift()
			logger.verbose(`${method}: ${descriptor.map((d: any) => d.name).join(', ')}`)
		},
		security: {
			bearerAuth: api.auth,
		},
	})
	connect(server)

	return server
}
