import axios from 'axios'


export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3433' : 'http://localhost:3433',
})