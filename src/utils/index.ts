export const asyncTimeout = (ms: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

export function getLocalTimeISOString(date: any) {
	const offset = date.getTimezoneOffset()
	const offsetAbs = Math.abs(offset)
	const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString()
	// The code below will add the timezone numbers. Use the code inside the return string
	// ${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`
	return `${isoString.slice(0, -1)}Z`
}
