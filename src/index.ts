import express from 'express'
import quotesRouter from './routes/routes'
import { driverName } from './types'
import { authors } from './services/authors'

const PORT = process.env.PORT || 3000

export const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
    res.status(200).json(driverName)
})

app.get('/authors', (_req, res) => {
    res.status(200).json(authors)
})

app.use('/quotes', quotesRouter)

app.use('/quotes/:driverId', quotesRouter)

app.use('/quotes/:driverId/:quoteId', quotesRouter)

app.use('/quotes/:driverId/p/:page', quotesRouter)

export const server = app.listen(PORT, () => console.log(`API running on PORT:${PORT} \n-----------------------------`))
