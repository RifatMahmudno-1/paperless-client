# paperless-client

A Node.js client for seamlessly interacting with the Paperless payment API. Built with TypeScript.

## Installation

You can install `paperless-client` using npm, pnpm, or yarn:

```bash
npm install paperless-client
# or
pnpm add paperless-client
# or
yarn add paperless-client
```

## Usage

Here is a quick example of how to initiate a payment and check its status.

```typescript
import PaperlessClient, { formatDescription } from 'paperless-client'

// 1. Initialize the client
const client = new PaperlessClient(
	'YOUR_MUID',
	'YOUR_APP_ACCESS_KEY',
	'YOUR_MERCHANT_REF_ID',
	'https://payment-sandbox.paperlessltd.com' // or production URL
)

// 2. Generate a Payment URL
async function initiate() {
	const url = await client.getPaymentUrl({
		merchant_order_id: '105',
		customer_name: 'John Doe',
		customer_email: 'john@example.com',
		customer_phone: '01700000000',
		product_desc: formatDescription([
			{ name: 'Product 1', count: 2, perItemPrice: 100 }
		]),
		amount: '200',
		currency: 'BDT',
		approve_url: 'https://example.com/approve',
		cancel_url: 'https://example.com/cancel',
		decline_url: 'https://example.com/decline'
	})

	console.log('Redirect user to ->', url)
}

// 3. Check Payment Status
async function checkStatus(token: string) {
	const status = await client.checkPaymentStatus(token)
	console.log('Transaction Status:', status.txn_status)
}
```

## License

MIT
