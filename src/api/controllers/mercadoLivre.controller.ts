import { Console } from 'console'
import { Response, Request } from 'express'
import logger from '@webhook/utils/logger'
import MercadoLivreService from '@webhook/api/services/mercadoLivre.service'

export async function sendLeadFromMercadoLivre(request: Request, response: Response): Promise<Response> {
	try {
		logger.info('Iniciando processo...')

		const mercadoLivreService = new MercadoLivreService()
		const payload = request.body
		// await mercadoLivreService.sendLead(payload)

		return response.send('200')
	} catch (error) {
		logger.error('Error: ', error)
		return response.status(400).json({ error: `${error}` })
	}
}
