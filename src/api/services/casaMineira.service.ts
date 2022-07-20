import axios from 'axios'
import logger from '@webhook/utils/logger'
import config from '@webhook/config'

const timestamp = new Date().getTime().toString()
const URLDelivery = config.leadsDeliveryURL
const URLWebhook: string = `https://us-central1-auxiliadora-dashboard.cloudfunctions.net/neon-casamineira-lead`

export default class CasaMineiraService {
	async sendLead(payload: any) {
		let response = null

		let lead = {
			crmId: 'PEGAR COM PO',
			sourceId: 'CADASTRAR NO CMS',
			sourceType: 'CADASTRAR NO CMS',
			sourceName: 'CASAMINEIRA',
			acquisition: 'PAGA',
			attribution: 'CASAMINEIRA',
			campaign: '',
			adset_name: '',
			term: '',
			realEstateId: payload.clientListingId ? payload.clientListingId : 0,
			event: 'LEAD',
			name: payload.name ? payload.name.normalize('NFKC') : '',
			email: payload.email ? payload.email.normalize('NFKC') : '',
			phone: payload.phoneNumber ? payload.phoneNumber.normalize('NFKC').replace(/[^\w]/g, '') : '',
			message: payload.message ? payload.message.normalize('NFKC') : '',
			pageId: null,
			business: this.normatizeBusiness(payload.message),
			URLWebhook: URLWebhook,
			timestamp: timestamp,
			payload: payload,
		}

		logger.info(`${timestamp} - lead: ${JSON.stringify(lead)}`)

		try {
			axios.create({ baseURL: URLDelivery })
			response = await axios.post('', lead)

			logger.info(
				`${timestamp} - fetch(URLDelivery): ${JSON.stringify(response.toString())} - status: ${response.status} - statusText: ${
					response.statusText
				}`
			)
		} catch (err) {
			console.log(`${timestamp} - error: fetch(URLDelivery): ${err}`)
		}

		return response
	}

	// Criar uma pasta com formatters e migrar a funcao abaixo
	normatizeBusiness(value: string) {
		let business = null
		if (value) {
			if (value.match(/vend/gi)) {
				business = 'VENDA'
			}
			if (value.match(/alug|locaç/gi)) {
				business = 'ALUGUEL'
			}
			if (value.match(/condom/gi)) {
				business = 'CONDOMINIO'
			}
		}
		return business
	}
}
