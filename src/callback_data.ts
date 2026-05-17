export type CallbackDataType = {
	merchant_txn_data: {
		amount: string
		currency: string
		merchant_order_id: string
		token: string
		txn_status: 1000 | 1001 | 1009 | null
	}
}
