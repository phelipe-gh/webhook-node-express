import axios from 'axios'
import logger from '@webhook/utils/logger'
import config from '@webhook/config'

const timestamp = new Date().getTime().toString()
const URLDelivery = config.leadsDeliveryURL

export default class NeonFacebookService {
	async sendLead(payload: any) {
		let response = null

		let lead = {
			crmId: 2,
			sourceId: 27,
			sourceType: 'SITE',
			sourceName: 'Facebook Whatsapp',
			acquisition: 'PAGA',
			attribution: 'Neon',
			client: 'Neon',
			campaign: '',
			adset_name: '',
			term: '',
			realEstateId: payload['Código do imóvel'] ? payload['Código do imóvel'] : 0,
			event: 'LEAD',
			name: payload['Nome lead'] ? payload['Nome lead'].normalize('NFKC') : '',
			email: payload['E-mail lead'] ? payload['E-mail lead'].normalize('NFKC') : '',
			phone: payload['Telefone lead'] ? payload['Telefone lead'].normalize('NFKC').replace(/[^\w]/g, '') : '',
			codigoAgencia: payload['Código agência'] ? payload['Código agência'] : 0,
			codigoCorretor: payload['Código do corretor'] ? payload['Código do corretor'] : 0,
			message: payload.message ? payload.message.normalize('NFKC') : '',
			pageId: null,
			business: this.normatizeBusiness(payload.message),
			URLWebhook: `${payload['Form URL']}`,
			timestamp: timestamp,
			payload: payload,
			sendEmail: false,
			saveVista: true,
			sendWhatsApp: false,
		}

		logger.info(`${timestamp} - lead: ${JSON.stringify(lead)}`)

		try {
			const response = await axios.post(`${URLDelivery}`, lead)

			logger.info(
				`sendLead(): status: ${response.status} - statusText: ${
					response.statusText
				} - data: ${JSON.stringify(response.data)}`
			)
		} catch (err) {
			console.log(`error: sendLead(): ${err}`)
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
