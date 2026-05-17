export function formatDescription(
	description: { name: string; count: number; perItemPrice: number }[]
): string {
	let descArr: string[] = []

	for (const item of description) {
		const desc = `{${item.count} X ${item.name} [${item.perItemPrice}]=[${item.count * item.perItemPrice}]}`
		descArr.push(desc)
	}

	return descArr.join(' ')
}
