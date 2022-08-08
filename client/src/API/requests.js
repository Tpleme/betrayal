import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const getApiKey = async () => {
    return JSON.parse(sessionStorage.getItem('token'))?.token
}

export const loginUser = async (email, password) => {
    return await axios.post(`${SERVER_URL}/api/user/auth`, { email, password })
}

export const sendForgotPass = async (email) => {
    return await axios.post(`${SERVER_URL}/api/user/forgotpass`, { email })
}

export const resetPass = async (data) => {
    return await axios.post(`${SERVER_URL}/api/user/resetpass`, data)
}

export const getUser = async (id, key) => {
    if (!key) key = await getApiKey();

    return await axios.get(`${SERVER_URL}/api/users/${id}`, { headers: { key: key } })
}

export const getAllUsers = async () => {
    return await axios.get(`${SERVER_URL}/api/users/`, { headers: { key: await getApiKey() } })
}

export const getUserForPassReset = async (id, secret) => {
    return await axios.get(`${SERVER_URL}/api/user/getuserforpassreset/${id}/${secret}`)
}

export const getEntity = async (entity, id) => {
    return await axios.get(`${SERVER_URL}/api/${entity}${id ? `/${id}` : ''}`, { headers: { key: await getApiKey() } })
}