import express from 'express'
import quotesRouter from './routes/driversQuotes'
import { driverName } from './types'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
    res.json(driverName)
})



app.use('/quotes', quotesRouter)

app.use('/quotes/:driverId', quotesRouter)

app.listen(PORT, () => console.log(`running on http://localhost:${PORT}` + ' on ' + new Date().toLocaleDateString()))