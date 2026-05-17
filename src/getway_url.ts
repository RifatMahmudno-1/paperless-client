export function gatewayUrl(token: string, gatewayUrlTemp: string): string {
	return gatewayUrlTemp.replace('{token}', token)
}
