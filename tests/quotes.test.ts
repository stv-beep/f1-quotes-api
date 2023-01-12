import {app, server} from '../src/index'
import {describe, expect, test} from '@jest/globals';
import supertest from 'supertest';
import {quotes, specificQuotes} from '../src/routes/driversQuotes'

const api = supertest(app)

describe('topic quotes', () => {
    test('quotes are returned as json', async () => {
        await api
        .get('/quotes')
        .expect(200)
        .expect('Content-Type',/application\/json/)
    })
    test('top 10', async () => {
       const response = await api.get('/quotes')
       expect(response.body).toHaveLength(quotes.length)
    })
})
describe('specific driver quotes', () => {
    test('Verstappen quotes are returned (brainyquote)', async () => {
        await api
        .get('/quotes/verstappen')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        const response = await api.get('/quotes/verstappen')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Gasly quotes are returned (quotes.net)', async () => {
        await api
        .get('/quotes/gasly')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        const response = await api.get('/quotes/gasly')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Ecclestone quotes are returned (azquotes)', async () => {
        await api
        .get('/quotes/ecclestone')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        const response = await api.get('/quotes/ecclestone')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Briatore quotes are returned (quotetab)', async () => {
        await api
        .get('/quotes/briatore')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        const response = await api.get('/quotes/briatore')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    
})

/* to exit Jest properly */
afterAll(() => {
    server.close()
})
