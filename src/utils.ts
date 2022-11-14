import { driverName } from './types'
import { notEnoughQuotes } from './routes/driversQuotes'

/* check if input is correct driver from list */
export const isDriver = (param: any): boolean => {
    return Object.values(driverName).includes(param)
}

export const pagination = (pageN: number, specificQuotes: string | { id: number; quote: string; author: string }[]) => {
    const pageSize = 10
    if (pageN > 1 && pageN <= 6) {
        if (pageN === 2) {
            if (specificQuotes.slice(pageSize, pageN*pageSize) == '') {
                return notEnoughQuotes
            } else {
                return specificQuotes.slice(pageSize, pageN*pageSize)
            }
        } else if (pageN >= 3) {
            let size = (pageN -1)*10
            if (specificQuotes.slice(size, pageN*pageSize) == '') {
                return notEnoughQuotes
            } else {
                return specificQuotes.slice(size, pageN*pageSize)
            }
        }
    } else if (pageN < 1 || pageN > 6) {

        return notEnoughQuotes

    } else {
        return specificQuotes.slice(0, pageN*pageSize)
    }
}