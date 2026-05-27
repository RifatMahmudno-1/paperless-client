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
	#origin: string

	/**
	 * @param muid It will be provided upon registration
	 * @param app_access_key It will be provided upon registration
	 * @param origin The origin of the server
	 */
	constructor(muid: string, app_access_key: string, origin: string) {
		this.#muid = muid
		this.#app_access_key = app_access_key
		this.#origin = origin
	}

	/**
	 * merchant_order_id and merchant_ref_id should be unique for each payment.
	 * marchant_order_id is the order id is used by Peperless to identify the order. Max 20 characters.
	 * merchant_ref_id is used by the merchant to identify the order in the dashboard.
	 */
	async newPayment(
		options: GetPaymentUrlOptionsType
	): Promise<{ url: string; token: string }> {
		const checkServerResponse = await checkServer(this.#origin)
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

		return {
			url: gatewayUrl(
				initiatePaymentResponse.data.token,
				checkServerResponse.data.gateway_url
			),
			token: initiatePaymentResponse.data.token
		}
	}

	/**
	 * @param token The token received from the newPayment method
	 */
	async checkPayment(token: string) {
		const checkPaymentResponse = await checkPayment(
			this.#origin,
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
