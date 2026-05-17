import { parseBody } from './lib.ts'

export type CheckStatusResponseType =
	| { success: false; data: any }
	| {
			success: true
			data: {
				selectedServer: boolean
				initiate_payment_url: string
				gateway_url: string
			}
	  }

export async function checkServer(
	origin: string
): Promise<CheckStatusResponseType> {
	try {
		const response = await fetch(`${origin}/api/v1/gateway/check-server`)
		if (!response.ok) return { success: false, data: await parseBody(response) }

		const data = await response.json().catch(() => null)
		if (data === null) {
			return { success: false, data: 'Failed to parse response' }
		}

		return { success: true, data }
	} catch {
		return {
			success: false,
			data: 'An error occurred while checking server status'
		}
	}
}
