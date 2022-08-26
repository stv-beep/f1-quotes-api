import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import drivers from '../services/drivers'
import { driverName } from '../types'

const router = express.Router()


const quotes = [] as any
const quotesErrorMessage: string = 'Something went wrong or your input is not correct. Try "/quotes".'
const driverQuotesErrorMsg: string = ' is not in the database or the input is incorrect.'


drivers.forEach(driver => {
    axios.get(driver.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('.b-qt', html).each(function () {
                const quote = $(this).text().replace(/\n/g, '')
                quotes.push({
                    quote,
                    author: driver.name
                })
            })
        })
})


/* all quotes */
router.get('/', (req, res) => { //quotes
    res.status(404) ? res.send(quotes) : res.json(quotesErrorMessage) 
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
                const $ = cheerio.load(html)
                const specificQuotes = [] as any

                $('.b-qt', html).each(function () {
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
