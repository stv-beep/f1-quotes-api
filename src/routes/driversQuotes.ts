import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import { drivers, top10 } from '../services/drivers'
import { isDriver, pagination } from '../utils'
import { Request, Response } from 'express-serve-static-core'

const router = express.Router()


let quotes: Array<{ id: number, quote: string, author: string }> = Array()
let specificQuotes: Array<{ id: number, quote: string, author: string }> = Array()
const quotesErrorMessage: string = 'Something went wrong or your input is not correct. Try "/quotes".'
const driverQuotesErrorMsg: string = '` is not in the database or the input is incorrect.'
const idNotFound: string = 'This driver doesn\'t have that number of quotes in the database. Try smaller numbers.'
const idTooSmall: string = 'This driver doesn\'t have that number of quotes in the database. Try positive numbers.'
export const notEnoughQuotes: string = 'This driver doesn\'t have that number of quotes in the database. Try between 1-6 pages.'

const quoteContent: string = '.quoteContent'
const specificQuoteContent: string = '.qb'

const alphaRegex = new RegExp(/^[a-zA-Z]*$/)


/* top quotes */
axios.get(top10)
    .then(response => {
        const html = response.data
        const $ = load(html)
        quotes = [] //cleaning array
        let index = 0
        /* getting the quote div including the author, then slicing the quote and the author */
        $(quoteContent).each(function () {
            index++
            const lastDotIndex = $(this).text().lastIndexOf('.')
            const lastExclIndex = $(this).text().lastIndexOf('!')
            const lastInterrIndex = $(this).text().lastIndexOf('?')
            const lastApostropheIndex = $(this).text().lastIndexOf("'")
            let rawQuote = $(this).text().replace(/\n/g, '')
            let author = ''
            let specialQuote = ''

            if ($(this).text().slice(lastDotIndex-2, lastDotIndex) === 'Jr') {//if there's a '.' in author's name
                rawQuote = $(this).text().replace('Jr.', 'Jr')
                const lastDotIndex = rawQuote.lastIndexOf('.')
                const quote = rawQuote.replace(/\n/g, '').slice(0, lastDotIndex-1)
                const author = rawQuote.slice(lastDotIndex+1).replace(/\n/g, '')
                specialQuote = quote.slice(0, quote.lastIndexOf('.')+1) //quote with an image
                quotes.push({
                    id: index,
                    quote: specialQuote,
                    author: author
                })
            } else if (lastDotIndex === -1 || lastDotIndex < lastApostropheIndex || lastDotIndex < lastExclIndex || lastDotIndex < lastInterrIndex 
                ) {

                if (rawQuote.includes('!')) {
                    specialQuote = rawQuote.slice(0, lastExclIndex+1)
                    author = rawQuote.slice(lastExclIndex+1, rawQuote.length)

                } else if (rawQuote.includes('?')) {
                    specialQuote = rawQuote.slice(0, lastInterrIndex)
                    author = rawQuote.slice(lastInterrIndex, rawQuote.length)
                } else if (rawQuote.includes("'")) {
                    specialQuote = rawQuote.slice(0, lastApostropheIndex)
                    author = rawQuote.slice(lastInterrIndex, rawQuote.length)
                }
                alphaRegex.test(author.slice(0,1)) ? true : author = author.slice(2,author.length) 
                quotes.push({
                    id: index,
                    quote: specialQuote,
                    author: author
                })

            } else {
                const quote = $(this).text().replace(/\n/g, '').slice(0, lastDotIndex-1)
                const author = $(this).text().slice(lastDotIndex+1).replace(/\n/g, '')
                const specialQuote = quote.slice(1, quote.lastIndexOf('.')+1) //quote with an image
                quote.slice(-1) === '.' ||  quote.slice(-1) === '!' ||  quote.slice(-1) === '?' ? 
                quotes.push({
                    id: index,
                    quote,
                    author: author
                }) : 
                quotes.push({
                    id: index,
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



/* specific driver */
router.get('/:driverId', (req, res) => { //quotes/:driverId
    specificDriver(req,res)
})


/* specific driver specific quote */
router.get('/:driverId/:quoteId', (req, res) => { //quotes/verstappen/9
    specificDriver(req,res)
})


/* specific driver pagination */
router.get('/:driverId/p/:page', (req, res) => { //quotes/verstappen/p/1
    const driverId = req.params.driverId

    const pageN = Number(req.params.page)

    if (isDriver(driverId)) {
        
        const driverURL = drivers.filter(driver => driver.driverId === driverId)[0].address

        axios.get(driverURL)
            .then(response => {
                const html = response.data
                const $ = load(html)
                specificQuotes = [] //cleaning array
                let index = 0
                /* getting the quote div including the author, then slicing the quote and the author */
                $(specificQuoteContent).each(function () {
                    index++
                    let rawQuote = $(this).text().replace(/\n/g, '')
                    let author = ''
                    let quote = ''

                    const lastDotIndex = rawQuote.lastIndexOf('.')
                    const lastExclIndex = rawQuote.lastIndexOf('!')
                    const lastInterrIndex = rawQuote.lastIndexOf('?')
                    //if there's no '.' so probably last character is '!' or '?'
                    if (lastDotIndex === -1 || lastDotIndex < lastExclIndex || lastDotIndex < lastInterrIndex) {

                        if (rawQuote.includes('!')) {
                            quote = rawQuote.slice(0, lastExclIndex+1)
                            author = rawQuote.slice(lastExclIndex+1, rawQuote.length)

                        } else if (rawQuote.includes('?')) {
                            quote = rawQuote.slice(0, lastInterrIndex+1)
                            author = rawQuote.slice(lastInterrIndex+1, rawQuote.length)
                        }
                        alphaRegex.test(author.slice(0,1)) ? true : author = author.slice(2,author.length)

                    } else {
                        
                        if (rawQuote.slice(rawQuote.length-3, rawQuote.length) === 'Jr.') {//if there's a '.' in author's name
                            rawQuote = rawQuote.replace('Jr.', 'Jr')
                            author = rawQuote.slice(rawQuote.lastIndexOf('.')+1, rawQuote.length)
                            rawQuote.slice(0,1) === ' ' ? quote = rawQuote.slice(1, rawQuote.length-author.length) : 
                            quote = rawQuote.slice(0, rawQuote.lastIndexOf('.')+1)
           
                        } else {
                            author = rawQuote.slice(rawQuote.lastIndexOf('.')+1, rawQuote.length)
                            rawQuote.slice(0,1) === ' ' ? quote = rawQuote.slice(1, rawQuote.length-author.length) : 
                            quote = rawQuote.slice(0, rawQuote.lastIndexOf('.')+1)
                        }
                        alphaRegex.test(author.slice(0,1)) ? true : author = author.slice(1,author.length)
                        
                    }
                    specificQuotes.push({
                        id: index,
                        quote: quote,
                        author: author
                    })
                })

                res.json(pagination(pageN, specificQuotes))

            }).catch(err => console.log(err))
    } else {
        res.json('`'+driverId + driverQuotesErrorMsg)
    }
})

const specificDriver = (req:Request,res: Response<any, Record<string, any>, number>) => {
    const driverId = req.params.driverId
    let specQuoteID:number = 0
    if (req.params.quoteId != null || req.params.quoteId != undefined) {
        specQuoteID = Number(req.params.quoteId) -1
    }
    specificQuotes = [] //cleaning array
    if (isDriver(driverId)) {
        const driverURL = drivers.filter(driver => driver.driverId === driverId)[0].address
        let author = ''
        let quote = ''
        
        let index = 0

        //addresses loop
        for (let i = 0; i < drivers.filter(driver => driver.driverId === driverId).length; i++){
                axios.get(driverURL)
                .then(response => {
                    const html = response.data
                    const $ = load(html)
                    
                    /* getting the quote div including the author, then slicing the quote and the author */
                    $(specificQuoteContent).each(function () {
                        index++
                        let rawQuote = $(this).text().replace(/\n/g, '')     

                        const lastDotIndex = rawQuote.lastIndexOf('.')
                        const lastExclIndex = rawQuote.lastIndexOf('!')
                        const lastInterrIndex = rawQuote.lastIndexOf('?')
                        //if there's no '.' so probably last character is '!' or '?'
                        if (lastDotIndex === -1 || lastDotIndex < lastExclIndex || lastDotIndex < lastInterrIndex) {

                            if (rawQuote.includes('!')) {
                                quote = rawQuote.slice(0, lastExclIndex+1)
                                author = rawQuote.slice(lastExclIndex+1, rawQuote.length)

                            } else if (rawQuote.includes('?')) {
                                quote = rawQuote.slice(0, lastInterrIndex+1)
                                author = rawQuote.slice(lastInterrIndex+1, rawQuote.length)
                            }
                            alphaRegex.test(author.slice(0,1)) ? true : author = author.slice(2,author.length)

                        } else {
                            
                            if (rawQuote.slice(rawQuote.length-3, rawQuote.length) === 'Jr.') {//if there's a '.' in author's name
                                rawQuote = rawQuote.replace('Jr.', 'Jr')
                                author = rawQuote.slice(rawQuote.lastIndexOf('.')+1, rawQuote.length)
                                rawQuote.slice(0,1) === ' ' ? quote = rawQuote.slice(1, rawQuote.length-author.length) : 
                                quote = rawQuote.slice(0, rawQuote.lastIndexOf('.')+1)
            
                            } else {
                                author = rawQuote.slice(rawQuote.lastIndexOf('.')+1, rawQuote.length)
                                rawQuote.slice(0,1) === ' ' ? quote = rawQuote.slice(1, rawQuote.length-author.length) : 
                                quote = rawQuote.slice(0, rawQuote.lastIndexOf('.')+1)
                            }
                            alphaRegex.test(author.slice(0,1)) ? true : author = author.slice(1,author.length)
                            
                        }
                        specificQuotes.push({
                            id: index,
                            quote: quote,
                            author: author
                        })
                    })

                        if (Number(req.params.quoteId) <= 0) {
                            res.json(idTooSmall)
                        } else {
                            if (req.params.quoteId != null || req.params.quoteId != undefined) {
                                specificQuotes[specQuoteID] !== undefined ? res.json(specificQuotes[specQuoteID]) :
                                res.json(`This driver doesn\'t have that number of quotes in the database. Try between 1-${specificQuotes.length}.`)
                            } else {
                                res.json(specificQuotes)
                            }
                        } 
                
                }).catch(err => console.log(err))
        }
        
    } else {
        res.json('`'+driverId + driverQuotesErrorMsg)
    }
}

export default router;
