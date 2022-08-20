import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const getHeaders = async () => {
    return { key: JSON.parse(sessionStorage.getItem('token'))?.token, requestingUser: sessionStorage.getItem('id') }
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

export const verifyUser = async (id, key) => {
    if (!key) key = await getHeaders();

    return await axios.get(`${SERVER_URL}/api/user/verifyuser/${id}`, { headers: { key: key } })
}

export const getUser = async (id, key) => {
    if (!key) key = await getHeaders();

    return await axios.get(`${SERVER_URL}/api/users/${id}`, { headers: await getHeaders() })
}

export const getAllUsers = async () => {
    return await axios.get(`${SERVER_URL}/api/users`, { headers: await getHeaders() })
}

export const getUserForPassReset = async (id, secret) => {
    return await axios.get(`${SERVER_URL}/api/user/getuserforpassreset/${id}/${secret}`)
}

export const getEntity = async (entity, id) => {
    return await axios.get(`${SERVER_URL}/api/${entity}${id ? `/${id}` : ''}`, { headers: await getHeaders() })
}