import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const headers = { key: ''}

export const loginUser = async (email, password) => {
    return await axios.post(`${SERVER_URL}/user/auth`, { email, password })
}