import { driverName } from './types'
import axios from 'axios'
import { load } from 'cheerio'
import { authors } from './services/authors'
import { Response } from 'express-serve-static-core'

/**
 * Checks if the input is a correct driver name from the list of drivers in types.ts.
 * Returns a boolean.
 * @param param 
 * @returns 
 */
export const isDriver = (param: any): boolean => {
    return Object.values(driverName).includes(param)
}

/**
 * Paginates all the quotes of the driver in 10 quotes per page. 
 * Currently, since the maximum number of quotations per person is 60, the maximum number of pages is 6.
 * Returns the quotes sliced in pages.
 * @param pageN 
 * @param specificQuotes 
 * @returns 
 */
export const pagination = (pageN: number, specificQuotes: string | { id: number; quote: string; author: string }[]) => {
    const pageSize = 10
    const length = Math.ceil(specificQuotes.length / pageSize)

    if (isNaN(pageN)) {
        return `Not valid data. Try a number.`
    }

    if (pageN > 1 && pageN <= 6) {
        if (pageN === 2) {
            if (specificQuotes.slice(pageSize, pageN * pageSize) == '') {
                return `This driver doesn\'t have that number of quotes in the database. Try ${length} page.`
            } else {
                return specificQuotes.slice(pageSize, pageN * pageSize)
            }
        } else if (pageN >= 3) {
            let size = (pageN - 1) * 10
            if (specificQuotes.slice(size, pageN * pageSize) == '') {
                return `This driver doesn\'t have that number of quotes in the database. Try between 1-${length} pages.`
            } else {
                return specificQuotes.slice(size, pageN * pageSize)
            }
        }
    } else if (pageN < 1 || pageN > 6) {

        return length == 1 ? `Number of pages not valid. Try 1 page.` :
            `Number of pages not valid. Try between 1-${length}.`

    } else {
        return specificQuotes.slice(0, pageN * pageSize)
    }
}

/**
 * Looks for any symbol in the quote and slice it.
 * @param rawText 
 * @param rawQuote 
 * @param specialQuote 
 * @param author 
 * @param top
 * @returns quote and author object
 */
export const includesSymbol = (rawQuote: string, specialQuote: string, author: string, top: boolean) => {
    const symbols = ['!', "'", '?']
    for (let i = 0; i < symbols.length; i++) {
        if (rawQuote.includes(symbols[i]) && top) {
            specialQuote = rawQuote.slice(0, rawQuote.lastIndexOf(symbols[i]) + 1)
            author = rawQuote.slice(rawQuote.lastIndexOf(symbols[i]) + 1, rawQuote.length)
        }
    }
    return { specialQuote, author }
}

/**
 * Cleans the raw scraped text
 * @param raw 
 * @returns 
 */
export const cleanText = (raw: string) =>
    raw
        .replace(/\t|\n|\s:/g, '')
        .trim()

/**
 * Gets the author info
 * @param req 
 * @param res 
 */
export const getAuthor = (req: { params: { driverId: any } }, res: Response<any, Record<string, any>, number>) => {
    const driverId = req.params.driverId
    if (isDriver(driverId)) {
        const author = authors.filter(author => author.id === driverId)
        res.status(200).json(author)
    } else {
        res.json('No author with this ID.')
    }
}
