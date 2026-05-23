import { parseBody } from './lib.ts'

export type InitiatePaymentOptionsType = {
	muid: string
	access_app_key: string
	merchant_order_id: string
	merchant_ref_id: string
	customer_name: string
	customer_email: string
	customer_add?: string
	customer_phone: string
	customer_city?: string
	customer_postcode?: string
	customer_country?: string
	shipping_name?: string
	shipping_email?: string
	shipping_add?: string
	shipping_city?: string
	shipping_postcode?: string
	shipping_country?: string
	product_desc: string
	amount: string
	currency: string
	approve_url: string
	cancel_url: string
	decline_url: string
}

export type InitiatePaymentResponseType =
	| { success: false; data: any }
	| {
			success: true
			data: {
				statusCode: string
				statusMsg: string
				token: string
				merchant_callback_url_update: boolean
			}
	  }

export async function initiatePayment(
	url: string,
	options: InitiatePaymentOptionsType
): Promise<InitiatePaymentResponseType> {
	try {
		const requestUrl = new URL(url)
		for (const key in options) {
			const value = options[key as keyof InitiatePaymentOptionsType]
			if (value === undefined) continue
			requestUrl.searchParams.append(key, value)
		}

		const response = await fetch(requestUrl, { method: 'POST' })
		if (!response.ok) return { success: false, data: await parseBody(response) }

		const data = await response.json().catch(() => null)
		if (data === null) {
			return { success: false, data: 'Failed to parse response' }
		}

		return { success: true, data }
	} catch {
		return {
			success: false,
			data: 'An error occurred while initiating payment'
		}
	}
}
