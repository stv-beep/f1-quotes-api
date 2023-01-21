import { app, server } from '../src/index'
import { describe, expect, test } from '@jest/globals';
import supertest from 'supertest';
import { quotes, specificQuotes } from '../src/routes/driversQuotes'

const api = supertest(app)

describe('topic quotes', () => {
    test('quotes are returned as json', async () => {
        await api
            .get('/quotes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
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
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/quotes/verstappen')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Gasly quotes are returned (quotes.net)', async () => {
        await api
            .get('/quotes/gasly')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/quotes/gasly')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Ecclestone quotes are returned (azquotes)', async () => {
        await api
            .get('/quotes/ecclestone')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/quotes/ecclestone')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Williams quotes are returned (quotetab)', async () => {
        jest.setTimeout(30000);
        await api
            .get('/quotes/williams')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/quotes/williams')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Zhou quotes are returned (thesportsrush)', async () => {
        await api
            .get('/quotes/zhou')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/quotes/zhou')
        expect(response.body).toHaveLength(specificQuotes.length)
    })
})

describe('specific driver quotes with pagination (pages exceeded)', () => {
    const exceededPages = 99

    test('Pagination: Verstappen quotes are returned (brainyquote)', async () => {
        await api
            .get(`/quotes/verstappen/p/${exceededPages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/verstappen/p/${exceededPages}`)
        expect(response.body).toBe('Number of pages not valid. Try between 1-6.')
    })
    test('Pagination: Kvyat quotes are returned (quotes.net)', async () => {
        await api
            .get(`/quotes/kvyat/p/${exceededPages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/kvyat/p/${exceededPages}`)
        expect(response.body).toBe('Number of pages not valid. Try 1 page.')
    })
    test('Pagination: Ecclestone quotes are returned (azquotes)', async () => {
        await api
            .get(`/quotes/ecclestone/p/${exceededPages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/ecclestone/p/${exceededPages}`)
        expect(response.body).toBe('Number of pages not valid. Try between 1-3.')
    })
    test('Pagination: Williams quotes are returned (quotetab)', async () => {
        jest.setTimeout(30000);
        await api
            .get(`/quotes/williams/p/${exceededPages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/williams/p/${exceededPages}`)
        expect(response.body).toBe('Number of pages not valid. Try between 1-4.')
    })
    test('Pagination: Zhou quotes are returned (thesportsrush)', async () => {
        await api
            .get(`/quotes/zhou/p/${exceededPages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/zhou/p/${exceededPages}`)
        expect(response.body).toBe('Number of pages not valid. Try 1 page.')
    })
})

describe('specific driver quotes with pagination', () => {
    const pages = 1
    const quotesPerPage = 10

    test('Pagination: Verstappen quotes are returned (brainyquote)', async () => {
        await api
            .get(`/quotes/verstappen/p/${pages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/verstappen/p/${pages}`)
        expect(response.body).toHaveLength(quotesPerPage)
    })
    test('Pagination: Kvyat quotes are returned (quotes.net)', async () => {
        await api
            .get(`/quotes/kvyat/p/${pages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/kvyat/p/${pages}`)
        expect(response.body).toHaveLength(specificQuotes.length)
    })
    test('Pagination: Ecclestone quotes are returned (azquotes)', async () => {
        await api
            .get(`/quotes/ecclestone/p/${pages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/ecclestone/p/${pages}`)
        expect(response.body).toHaveLength(quotesPerPage)
    })
    test('Pagination: Williams quotes are returned (quotetab)', async () => {
        jest.setTimeout(30000);
        await api
            .get(`/quotes/williams/p/${pages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/williams/p/${pages}`)
        expect(response.body).toHaveLength(quotesPerPage)
    })
    test('Pagination: Zhou quotes are returned (thesportsrush)', async () => {
        await api
            .get(`/quotes/zhou/p/${pages}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const response = await api.get(`/quotes/zhou/p/${pages}`)
        expect(response.body).toHaveLength(specificQuotes.length)
    })
})

/* to exit Jest properly */
afterAll(() => {
    server.close()
})
