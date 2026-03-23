import client from './client'

export const getProfile = () => client.get('/users/me')
export const updateProfile = (data) => client.patch('/users/me', data)
export const updatePassword = (data) => client.patch('/users/me/password', data)