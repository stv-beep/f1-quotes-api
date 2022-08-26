import express from 'express'
import quotesRouter from './routes/driversQuotes'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
    res.json("Welcome to the F1 quotes API. For all quotes: /quotes. For a specific driver's quotes: /quotes/:last name. For example: /quotes/verstappen")
})



app.use('/quotes', quotesRouter)

app.use('/quotes/:driverId', quotesRouter)

app.listen(PORT, () => console.log(`running on port ${PORT}` + ' on ' + new Date().toLocaleDateString()))