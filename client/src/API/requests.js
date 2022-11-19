import axios from 'axios'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const getHeaders = async () => {
    return {
        key: JSON.parse(sessionStorage.getItem('token'))?.token,
        'requesting-user': sessionStorage.getItem('id')
    }
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

export const getUserForPassReset = async (id, secret) => {
    return await axios.get(`${SERVER_URL}/api/user/getuserforpassreset/${id}/${secret}`)
}

export const getEntity = async (entity, id) => {
    return await axios.get(`${SERVER_URL}/api/${entity}${id ? `/${id}` : ''}`, { headers: await getHeaders() })
}

export const getChatMessages = async (chat) => {
    return await axios.get(`${SERVER_URL}/api/chat_messages/${chat}`, { headers: await getHeaders() })
}

export const joinRoom = async (roomId) => {
    return await axios.post(`${SERVER_URL}/api/game-room/join/`, { roomId }, { headers: await getHeaders() })
}