import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import { drivers, top10 } from '../services/drivers'
import { driverName } from '../types'

const router = express.Router()


let quotes = [] as any
let specificQuotes = [] as any
const quotesErrorMessage: string = 'Something went wrong or your input is not correct. Try "/quotes".'
const driverQuotesErrorMsg: string = '` is not in the database or the input is incorrect.'

const quoteContent: string = '.quoteContent'
const specificQuoteContent: string = '.qb'


/* all quotes */
axios.get(top10)
    .then(response => {
        const html = response.data
        const $ = load(html)
        quotes = [] //cleaning array
        /* getting the quote div including the author, then slicing the quote and the author */
        $(quoteContent).each(function () {
            const lastDotIndex = $(this).text().lastIndexOf('.')

            if ($(this).text().slice(lastDotIndex-2, lastDotIndex) === 'Jr') {//if there's a '.' in author's name
                const rawQuote = $(this).text().replace('Jr.', 'Jr')
                const lastDotIndex = rawQuote.lastIndexOf('.')
                const quote = rawQuote.replace(/\n/g, '').slice(0, lastDotIndex-1)
                const author = rawQuote.slice(lastDotIndex+1).replace(/\n/g, '')
                const specialQuote = quote.slice(1, quote.lastIndexOf('.')+1) //quote with an image
                quotes.push({
                    quote: specialQuote,
                    author: author
                })
            } else {
                const quote = $(this).text().replace(/\n/g, '').slice(0, lastDotIndex-1)
                const author = $(this).text().slice(lastDotIndex+1).replace(/\n/g, '')
                const specialQuote = quote.slice(1, quote.lastIndexOf('.')+1) //quote with an image
                quote.slice(-1) === '.' ||  quote.slice(-1) === '!' ||  quote.slice(-1) === '?' ? 
                quotes.push({
                    quote,
                    author: author
                }) : 
                quotes.push({
                    quote: specialQuote,
                    author: author
                })
            } 
        })
    }).catch(err => console.log(err))
router.get('/', (req, res) => { //quotes
    return (quotes != null || res.status(200))
    ? res.send(quotes)
    : res.json(quotesErrorMessage) 
})


/* check if input is correct driver from list */
const isDriver = (param: any): boolean => {
    return Object.values(driverName).includes(param)
}


/* specific driver */
router.get('/:driverId', (req, res) => { //quotes/:driverId
    const driverId = req.params.driverId
    if (isDriver(driverId)) {
        
        const driverURL = drivers.filter(driver => driver.driverId === driverId)[0].address

        axios.get(driverURL)
            .then(response => {
                const html = response.data
                const $ = load(html)
                specificQuotes = [] //cleaning array
                /* getting the quote div including the author, then slicing the quote and the author */
                $(specificQuoteContent, html).each(function () {
                    let rawQuote = $(this).text().replace(/\n/g, '')
                    let lastDotIndex = 0
                    if (rawQuote.includes('?')) {
                        lastDotIndex = $(this).text().lastIndexOf('?')
                    } else if (rawQuote.includes('!')) {
                        lastDotIndex = $(this).text().lastIndexOf('!')
                    } else {
                        lastDotIndex = $(this).text().lastIndexOf('.')
                    }
                    let quote = rawQuote.slice(0, lastDotIndex-2)
                    const author = $(this).text().slice(lastDotIndex+1).replace(/\n/g, '')
                    if (!author.includes('.')) {
                        const specialQuote = quote.slice(0, quote.lastIndexOf('.')+1) //quote with an image
                        quote.slice(-1) === '.' ||  quote.slice(-1) === '!' ||  quote.slice(-1) === '?' ? 
                        specificQuotes.push({
                            quote,
                            author: author
                        }) : 
                        specificQuotes.push({
                            quote: specialQuote,
                            author: author
                        })
                    }                    
                })
                res.json(specificQuotes)
            }).catch(err => console.log(err))
    } else {
        res.json('`'+driverId + driverQuotesErrorMsg)
    }
})

export default router;
