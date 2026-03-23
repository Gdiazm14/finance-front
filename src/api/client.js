import axios from "axios";

const client = axios.create({
    baseURL: 'https://finance-api-10b5.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
})

//Interceptor de request - Agrega el token automaticamente

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


//Interceptor de response - maneja errores globalmente

client.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
    return Promise.reject(error)
}
)

export default client