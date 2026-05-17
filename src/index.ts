import { checkServer } from './check_server.ts'
import {
	initiatePayment,
	type InitiatePaymentOptionsType
} from './initiate_payment.ts'
import { gatewayUrl } from './getway_url.ts'
import { checkPayment } from './check_payment.ts'
import { formatDescription } from './format_description.ts'

export { formatDescription }
export { type CallbackDataType } from './callback_data.ts'

export type GetPaymentUrlOptionsType = Omit<
	InitiatePaymentOptionsType,
	'muid' | 'access_app_key'
>

export default class PaperlessClient {
	#muid: string
	#app_access_key: string
	#host: string

	constructor(muid: string, app_access_key: string, host: string) {
		this.#muid = muid
		this.#app_access_key = app_access_key
		this.#host = host
	}

	async getPaymentUrl(options: GetPaymentUrlOptionsType): Promise<string> {
		const checkServerResponse = await checkServer(this.#host)
		if (!checkServerResponse.success) {
			throw new Error('Server check failed', {
				cause: checkServerResponse.data
			})
		}

		const initiatePaymentResponse = await initiatePayment(
			checkServerResponse.data.initiate_payment_url,
			{
				...options,
				muid: this.#muid,
				access_app_key: this.#app_access_key
			}
		)
		if (!initiatePaymentResponse.success) {
			throw new Error('Payment initiation failed', {
				cause: initiatePaymentResponse.data
			})
		}

		return gatewayUrl(
			initiatePaymentResponse.data.token,
			checkServerResponse.data.gateway_url
		)
	}

	async checkPaymentStatus(token: string) {
		const checkPaymentResponse = await checkPayment(
			this.#host,
			this.#muid,
			token
		)
		if (!checkPaymentResponse.success) {
			throw new Error('Payment check failed', {
				cause: checkPaymentResponse.data
			})
		}

		return checkPaymentResponse.data
	}
}
