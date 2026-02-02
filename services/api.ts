import axios from 'axios'


export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://http://192.168.1.38:3433:3433' : 'http://http://192.168.1.38:3433:3433',
})