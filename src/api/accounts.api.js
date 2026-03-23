import client from './client'

export const getAccounts = (params) => client.get('/accounts', { params })
export const getAccountById = (id) => client.get(`/accounts/${id}`)
export const createAccount = (data) => client.post('/accounts', data)
export const updateAccount = (id, data) => client.patch(`/accounts/${id}`, data)
export const deleteAccount = (id) => client.delete(`/accounts/${id}`)

export const toggleAccount = (id, isActive) => client.patch(`/accounts/${id}`, { isActive })