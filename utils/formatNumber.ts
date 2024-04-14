export const fortmatNumber = (digit: number) => {
    return new Intl.NumberFormat('en-Us').format(digit)
}