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


/* all quotes */
axios.get(top10)
    .then(response => {
        const html = response.data
        const $ = load(html)

        $(quoteContent).each(function () {
            const quote = $(this).text().replace(/\n/g, '').replace(/\./g, '. Author: ').replace('Jr. Author: ', 'Jr.')
            quotes.push({
                quote
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

                $(quoteClass, html).each(function () {
                    const quote = $(this).text().replace(/\n/g, '')
                    specificQuotes.push({
                        quote,
                        author: driverId
                    })
                })
                res.json(specificQuotes)
            }).catch(err => console.log(err))
    } else {
        res.json(driverId + driverQuotesErrorMsg)
    }
})

export default router;
