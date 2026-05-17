export async function parseBody(response: Response, onlyJson: boolean = false) {
	const text = await response.text()

	try {
		return JSON.parse(text)
	} catch {
		if (onlyJson) return null
		return text
	}
}
