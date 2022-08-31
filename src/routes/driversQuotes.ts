import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import { drivers, top10 } from '../services/drivers'
import { driverName } from '../types'

const router = express.Router()


const quotes = [] as any
const quotesErrorMessage: string = 'Something went wrong or your input is not correct. Try "/quotes".'
const driverQuotesErrorMsg: string = ' is not in the database or the input is incorrect.'

const quoteClass: string = '.b-qt'
const quoteContent: string = '.quoteContent'
const specificQuoteContent: string = '.qb'


/* all quotes */
axios.get(top10)
    .then(response => {
        const html = response.data
        const $ = load(html)
        /* getting the quote div including the author, then slicing the quote and the author */
        $(quoteContent).each(function () {
            const lastDotIndex = $(this).text().lastIndexOf('.')
            let quote = $(this).text().replace(/\n/g, '').slice(0, lastDotIndex-1)
            let author = $(this).text().slice(lastDotIndex+1).replace(/\n/g, '')
            if (quote.includes('Carlos Sainz Jr')) {
                quote = quote.replace('Carlos Sainz Jr.', '')
                author = 'Carlos Sainz Jr.'
            }
            quotes.push({
                quote,
                author: author
            })
        })
        
    }).catch(err => console.log(err))
router.get('/', (req, res) => { //quotes
    res.status(200) ? res.send(quotes) : res.json(quotesErrorMessage) 
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
                const specificQuotes = [] as any
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

                    quote.includes('.'+author.slice(0,3)) ? rawQuote.slice(0, lastDotIndex-3) :                     
                    specificQuotes.push({
                        quote,
                        author: author
                    })
                })
                res.json(specificQuotes)
            }).catch(err => console.log(err))
    } else {
        res.json(driverId + driverQuotesErrorMsg)
    }
})

export default router;
