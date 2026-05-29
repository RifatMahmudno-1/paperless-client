import { parseBody } from './lib.ts'

export type CheckPaymentResponseType =
	| { success: false; data: any }
	| {
			success: true
			data: {
				muid: string
				ref_id: string
				token: string
				merchant_req_amount: string
				merchant_ref_id: string
				merchant_currency: string
				merchant_amount_bdt: string
				conversion_rate: string
				service_ratio: string
				card_charge_bdt: string
				emi_ratio: string
				emi_charge: string
				bank_amount_bdt: string
				discount_bdt: string
				merchant_order_id: string
				request_ip: string
				txn_status: '1000' | '1001' | '1009' | null
				extra_json: null
				card_details: null
				is_foreign: 0 | 1
				payment_card: string
				card_code: number
				payment_method: string
				init_time: string
				txn_time: string
				statusCode: number
				customer_details: string
			}
	  }

export async function checkPayment(
	origin: string,
	muid: string,
	token: string
): Promise<CheckPaymentResponseType> {
	try {
		const url = new URL(`${origin}/api/v1/gateway/check-payment`)
		url.searchParams.append('muid', muid)
		url.searchParams.append('token', token)

		const response = await fetch(url, { method: 'POST' })
		if (!response.ok) return { success: false, data: await parseBody(response) }

		const data = await parseBody(response, true)
		if (data === null) {
			return { success: false, data: 'Failed to parse response' }
		}

		return { success: true, data }
	} catch {
		return {
			success: false,
			data: 'An error occurred while checking payment status'
		}
	}
}
