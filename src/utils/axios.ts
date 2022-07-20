import axios from 'axios'
import config from '@webhook/config'

const deliveryAPI = axios.create({
	baseURL: config.leadsDeliveryURL || 'http://localhost:1337',
})

export default deliveryAPI
