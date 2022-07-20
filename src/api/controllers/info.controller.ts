import { Console } from 'console'
import { Response, Request } from 'express'
import logger from '@webhook/utils/logger'

export async function getInfo(request: Request, response: Response): Promise<Response> {
	try {
		logger.info('Iniciando processo...')

		return response.send('Essa é a API do webhook ' + new Date())
	} catch (error) {
		logger.error('Error: ', error)
		return response.status(400).json({ error: `${error}` })
	}
}
