import express from 'express'
import quotesRouter from './routes/driversQuotes'
import { driverName } from './types'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
    res.status(200).json(driverName)
})

app.use('/quotes', quotesRouter)

app.use('/quotes/:driverId', quotesRouter)

app.use('/quotes/:driverId/:quoteId', quotesRouter)

app.use('/quotes/:driverId/p/:page', quotesRouter)

app.listen(PORT, () => console.log(`API running on PORT:${PORT}`))