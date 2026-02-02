import axios from 'axios'


export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3334' : process.env.NEXT_PUBLIC_API_URL,
})