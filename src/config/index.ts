import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables from 'dotenv-parse-variables'

type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

const env = dotenvExtended.load({
	path: process.env.ENV_FILE,
	defaults: './config/.env.defaults',
	schema: './config/.env.schema',
	includeProcessEnv: true,
	silent: false,
	errorOnMissing: true,
	errorOnExtra: true,
})

const parsedEnv = dotenvParseVariables(env)

interface Config {
	morganLogger: boolean
	morganBodyLogger: boolean
	exmplDevLogger: boolean
	loggerLevel: LogLevel
	leadsDeliveryURL: string
	cmsBaseURL: string
	loftClientSecret: string
	loftAPIBaseURL: string
}

const config: Config = {
	morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
	morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
	exmplDevLogger: parsedEnv.EXMPL_DEV_LOGGER as boolean,
	loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
	leadsDeliveryURL: parsedEnv.LEADS_DELIVERY_URL as string,
	cmsBaseURL: parsedEnv.CMS_BASE_URL as string,
	loftClientSecret: parsedEnv.LOFT_CLIENT_SECRET as string,
	loftAPIBaseURL: parsedEnv.LOFT_API_BASEURL as string,
}

export default config
