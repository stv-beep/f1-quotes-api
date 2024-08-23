import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import { drivers, topic, sites } from '../services/quotes'
import { isDriver, pagination, includesSymbol, cleanText } from '../utils'
import { Request, Response } from 'express-serve-static-core'

const router = express.Router()


export let quotes: Array<{ id: number, quote: string, author: string }> = Array()
export let specificQuotes: Array<{ id: number, quote: string, author: string }> = Array()
const quotesErrorMessage: string = 'Something went wrong or your input is not correct. Try "/quotes".'
const driverQuotesErrorMsg: string = '` is not in the database or the input is incorrect.'
const idNotFound: string = 'This driver doesn\'t have that number of quotes in the database. Try smaller numbers.'
const idTooSmall: string = 'This driver doesn\'t have that number of quotes in the database. Try positive numbers.'

const quoteContent: string = '.quoteContent'
const markupElements = ['.b-qt', 'blockquote', 'li div p a', 'blockquote', 'blockquote.data-event > p > em', 'div.sc-fotOHu.zwJMw p']


const alphaRegex = new RegExp(/^[a-zA-Z]*$/)


/* top quotes */
router.get('/', (req, res) => { //quotes
    return (quotes != null || res.status(200))
        ? res.send(topic)
        : res.json(quotesErrorMessage)
})


/* specific driver */
router.get('/:driverId', (req, res) => { //quotes/:driverId
    specificDriver(req, res)
})


/* specific driver specific quote */
router.get('/:driverId/:quoteId', (req, res) => { //quotes/verstappen/9
    specificDriver(req, res)
})


/* specific driver pagination */
router.get('/:driverId/p/:page', (req, res) => { //quotes/verstappen/p/1
    const driverId = req.params.driverId

    const pageN = Number(req.params.page)
    specificQuotes = [] //cleaning array
    let index = 0
    if (isDriver(driverId)) {
        const driverURL = drivers.filter(driver => driver.driverId === driverId)[0].address
        const author = drivers.filter(driver => driver.driverId === driverId)[0].name

        for (let w = 0; w < sites.length; w++) {

            if (driverURL.includes(sites[w]) && w != 4) {
                axios.get(driverURL)
                    .then(response => {
                        const html = response.data
                        const $ = load(html)
                        if (w === 2) index = -1 //bcs i delete the first element

                        //getting the quote div
                        $(markupElements[w]).each(function () {
                            index++
                            let quote = cleanText($(this).text())
                            //some quotes of db3 finnish with a comma for some reason
                            if (quote.slice(-1) == ',' && quote.lastIndexOf(',') == quote.length - 1) {
                                quote = quote.replace(/,$/, '.')
                            }
                            specificQuotes.push({
                                id: index,
                                quote,
                                author: author
                            })
                        })
                        if (w === 2) specificQuotes.shift()
                        res.json(pagination(pageN, specificQuotes))

                    }).catch(err => console.log(err))

            } else if (w === 4 && driverURL.includes(sites[4])) {
                axios.get(driverURL)
                .then(response => {
                        const html = response.data
                        const $ = load(html)
                        let formattedQuotes: any | RegExpMatchArray | null = []

                        // VERSION 1
                        $(markupElements[4]).each(function () {
                            index++
                            let rawQuote = $(this).text().replace(/“|”/g, '')

                            specificQuotes.push({
                                id: index,
                                quote: rawQuote,
                                author: author
                            })

                        })

                        //VERSION 2
                        if (specificQuotes.length == 0) { //no blockquote

                            $('#article-content').each(function () {
                                //bcs it's necessary to scrap all the page, I save the quoted phrases
                                let rawQuote = $(this).text().replace(/“|”/g, '"')
                                formattedQuotes = rawQuote.match(/".*/ig)

                            })
                            for (let i in formattedQuotes) {
                                index++
                                let q: any = []
                                //the quotes have some symbols at the beginning and at the end
                                q[i] = formattedQuotes[i].slice(1, formattedQuotes[i].length - 1)
                                specificQuotes.push({
                                    id: index,
                                    quote: q[i],
                                    author: author
                                })
                            }

                        }
                    
                        res.json(pagination(pageN, specificQuotes))

                    }).catch(err => console.log(err))
            }
        }
    } else {
        res.json('`' + driverId + driverQuotesErrorMsg)
    }
})

/**
 * Gets the driver ID and returns a json response containing all the quotes of the driver.
 * @param req driver ID
 * @param res driver quotes
 */
const specificDriver = (req: Request, res: Response<any, Record<string, any>, number>) => {
    const driverId = req.params.driverId
    let specQuoteID: number = 0
    if (req.params.quoteId != null || req.params.quoteId != undefined) {
        specQuoteID = Number(req.params.quoteId) - 1
    }
    specificQuotes = [] //cleaning array
    if (isDriver(driverId)) {
        const driverURL = drivers.filter(driver => driver.driverId === driverId)[0].address
        const authorName = drivers.filter(driver => driver.driverId === driverId)[0].name

        scrapQuotes(driverURL, authorName, req, res, specQuoteID, sites)

    } else {
        res.json('`' + driverId + driverQuotesErrorMsg)
    }
}

/**
 * Gets the driver ID, author name and other data to response with the quotes of the person. 
 * Contains the logic to get the quotes data.
 * @param driverURL 
 * @param authorName 
 * @param req 
 * @param res 
 * @param specQuoteID 
 * @param sites 
 */
const scrapQuotes = (driverURL: string, authorName: string, req: Request,
    res: Response<any, Record<string, any>, number>, specQuoteID: number, sites: Array<string>) => {
    let index = 0

    for (let w = 0; w < sites.length; w++) {

        if (driverURL.includes(sites[w]) && w != 4 && w != 5) {
            axios.get(driverURL)
                .then(response => {
                    const html = response.data
                    const $ = load(html)
                    if (w === 2) index = -1 //bcs i delete the first element

                    //getting the quote div
                    $(markupElements[w]).each(function () {
                        index++
                        let quote = cleanText($(this).text())
                        //some quotes of db3 finnish with a comma for some reason
                        if (quote.slice(-1) == ',' && quote.lastIndexOf(',') == quote.length - 1) {
                            quote = quote.replace(/,$/, '.')
                        }
                        specificQuotes.push({
                            id: index,
                            quote,
                            author: authorName
                        })
                    })
                    if (w === 2) specificQuotes.shift()
                    displayQuotes(req, res, specQuoteID)

                }).catch(err => console.log(err))

        } else if (w === 4 && driverURL.includes(sites[4])) { //sportsrush
            axios.get(driverURL)
                .then(response => {
                    const html = response.data
                    const $ = load(html)
                    let formattedQuotes: any | RegExpMatchArray | null = []

                    // VERSION 1
                    $(markupElements[4]).each(function () {
                        index++
                        let rawQuote = $(this).text().replace(/“|”/g, '')

                        specificQuotes.push({
                            id: index,
                            quote: rawQuote,
                            author: authorName
                        })


                    })

                    //VERSION 2
                    if (specificQuotes.length == 0) { //no blockquote

                        $('#article-content').each(function () {
                            //bcs it's necessary to scrap all the page, I save the quoted phrases
                            let rawQuote = $(this).text().replace(/“|”/g, '"')
                            formattedQuotes = rawQuote.match(/".*/ig)

                        })
                        for (let i in formattedQuotes) {
                            index++
                            let q: any = []
                            //the quotes have some symbols at the beginning and at the end
                            q[i] = formattedQuotes[i].slice(1, formattedQuotes[i].length - 1)
                            specificQuotes.push({
                                id: index,
                                quote: q[i],
                                author: authorName
                            })
                        }

                    }
                    
                    displayQuotes(req, res, specQuoteID)

                }).catch(err => console.log(err))

        } else if (w === 5 && driverURL.includes(sites[5])) {//takequotes.org
            axios.get(driverURL)
                .then(response => {
                    const html = response.data
                    const $ = load(html)
                    //getting the quote div
                    $(markupElements[w]).each(function () {
                        index++
                        //filtering the quote
                        let quote = $(this).contents().filter((i, el) => el.nodeType === 3).text().trim();

                        specificQuotes.push({
                            id: index,
                            quote,
                            author: authorName
                        })
                    })
                    displayQuotes(req, res, specQuoteID)

                }).catch(err => console.log(err))
        }
    }
}

/**
 * Displays the quotes with a json response.
 * @param req 
 * @param res 
 * @param specQuoteID 
 */
const displayQuotes = (req: Request, res: Response<any, Record<string, any>, number>, specQuoteID: number) => {

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
}

export default router;
