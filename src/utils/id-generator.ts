// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec: number): string {
    return dec.toString(16).padStart(2, "0")
}

export function generateId (length: number = 20):string {
    const arr = new Uint8Array(length / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}