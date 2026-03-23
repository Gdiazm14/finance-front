import client from './client'

export const getTransactions = (params) => client.get('/transactions', { params })
export const getTransactionById = (id) => client.get(`/transactions/${id}`)
export const createTransaction = (data) => client.post('/transactions', data)