import axios from 'axios'
import logger from '@webhook/utils/logger'
import config from '@webhook/config'
import { getLocalTimeISOString } from '@webhook/utils'

const timestamp = getLocalTimeISOString(new Date())
const leadsDeliveryURL = config.leadsDeliveryURL
const LoftBaseURL = config.loftAPIBaseURL
const cmsBaseURL = config.cmsBaseURL

export default class LoftService {
	async sendLead(payload: any, realEstateId: string, visitId: string) {
		let lead = {
			crmId: 1,
			sourceId: 48,
			sourceType: 'LOFT',
			sourceName: 'LOFT',
			acquisition: 'PAGA',
			attribution: 'LOFT',
			client: 'Auxiliadora Predial',
			campaign: '',
			adset_name: '',
			term: '',
			realEstateId: realEstateId ? realEstateId : 0,
			event: 'LEAD',
			name: payload.name ? payload.name.normalize('NFKC') : '',
			email: payload.email ? payload.email.normalize('NFKC') : '',
			phone: payload.phone ? payload.phone.normalize('NFKC').replace(/[^\d]/g, '') : '',
			message: payload.message ? payload.message.normalize('NFKC') : '',
			pageId: null,
			business: payload.message ? this.normatizeBusiness(payload.message) : '',
			URLWebhook: LoftBaseURL,
			timestamp: timestamp,
			payload: { ...payload, visitId: visitId },
		}

		logger.info(`lead: ${JSON.stringify(lead)}\n`)

		const response = await axios.post(`${leadsDeliveryURL}`, lead).catch(function (error) {
			return Promise.reject(error)
		})

		logger.info(
			`LoftService.sendLead(): status: ${response?.status} - statusText: ${response?.statusText} - data: ${JSON.stringify(response?.data)}\n`
		)

		return lead
	}

	async getAuthToken() {
		const response = await axios
			.post(`${LoftBaseURL}/authentication`, {
				clientId: 'iTvqA6uoCxaCtbbq61OIDWi5bBis5ape',
				clientSecret: config.loftClientSecret,
				brand: 'LOFT',
			})
			.catch(function (error) {
				if (/Failed to login using client id and secret/gi.test(error.response.data.message)) return Promise.resolve(error.response)
				return Promise.reject(error)
			})

		logger.info(`LoftService.getAuthToken(): status: ${response?.status} - statusText: ${response?.statusText}\n`)

		return response
	}

	async getVisitData(visitId: string, authToken?: string) {
		const response = await axios
			.get(`${LoftBaseURL}/visits/${visitId}`, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
				},
			})
			.catch(function (error) {
				if (/Not authenticated/gi.test(error.response.data.message)) return Promise.resolve(error.response)
				if (/Visit not found/gi.test(error.response.data.message.message)) return Promise.resolve(error.response)
				return Promise.reject(error)
			})

		logger.info(
			`LoftService.getVisitData(): status: ${response?.status} - statusText: ${response?.statusText} - payload: ${JSON.stringify(
				response?.data
			)}\n`
		)

		return response
	}

	async findRealEstateIdByClientEmail(email: string) {
		const response = await axios
			.get(`${cmsBaseURL}/leads?email=${encodeURIComponent(email)}&_sort=created_at:DESC&_limit=1`)
			.catch(function (error) {
				return Promise.reject(error)
			})

		const realEstateId = response?.data[0]?.realEstateId

		logger.info(`LoftService.findRealEstateIdByClientEmail(): status: ${response?.status} - statusText: ${response?.statusText}\n`)

		return realEstateId
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
