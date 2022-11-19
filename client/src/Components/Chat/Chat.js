import React, { useEffect, useState, useRef, useContext } from 'react'
import { Avatar } from '@mui/material'
import { Send } from '@mui/icons-material'
import { getChatMessages, getEntity } from '../../API/requests'
import { msToMinutesAndSeconds } from '../../utils'

import { useUserInfo } from '../../Hooks/useUser'
import { SocketContext } from '../../Context/socket/socket'
import UserProfile from '../Dialogs/Users/UserProfile/UserProfile'

import portraitPlaceholder from '../../Assets/placeholders/portrait.jpg'

import './Chat.css'

function Chat(props) {
    const [currentType, setCurrentType] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [offlineUsers, setOfflineUsers] = useState([])
    const [openUserProfile, setOpenUserProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [blocked, setBlocked] = useState({ blocked: false, timer: null })

    const socket = useContext(SocketContext)
    const { userInfo } = useUserInfo()
    const inputRef = useRef(null)
    let blockedTimer = null;


    useEffect(() => {
        getEntity('users').then(res => {
            organizeUsers(res.data)
        })

        getChatMessages('global').then(res => {
            console.log(res)
            setChatMessages(res.data)
        })

        socket.on('chat_message', msg => addMessageToChat(msg))
        socket.on('users', data => updateUsers(data))
        socket.on('blocked', data => handleBlocked(data))

        return () => {
            socket.off('chat_message', addMessageToChat)
            socket.off('users', updateUsers)
            socket.off('blocked', handleBlocked)
        }
    }, [])

    const handleBlocked = (data) => {
        if (blockedTimer) return;
        setBlocked({ blocked: true, timer: data["retry-ms"] })
        blockedTimer = setTimeout(() => {
            setChatBlocked()
        }, data["retry-ms"])
    }

    const setChatBlocked = () => {
        setBlocked({ blocked: false, timer: null })
        clearTimeout(blockedTimer, setChatBlocked)
        blockedTimer = null
    }

    const organizeUsers = (data) => {
        const onlineUsers = data.filter(user => user.loggedIn)
        const offlineUsers = data.filter(user => !user.loggedIn)
        setOnlineUsers(onlineUsers)
        setOfflineUsers(offlineUsers)
    }

    const updateUsers = (data) => {
        if (data) organizeUsers(data)
    }

    const addMessageToChat = (data) => {
        setChatMessages(prev => [...prev, data])
    }

    const addSelfMessage = (message) => {
        if (message.length > 0) {
            socket.emit('message', { chat: 'global', user_id: userInfo.id, user_name: userInfo.name, user_picture: userInfo.picture, message: message })
            setCurrentType('')
            inputRef.current.focus()
        }
    }

    const handleInput = (e) => {
        //TODO: we have this method in case we need to restrict some characters from the chat
        setCurrentType(e.target.value)
    }

    const handleOpenUser = (user) => {
        setSelectedUser(user)
        setOpenUserProfile(true)
    }

    return (
        <div className='chat-main-div'>
            <div className='chat-users'>
                {onlineUsers.length > 0 && <p className='online-offline-divider'>Online</p>}
                {onlineUsers.map(user => {
                    return (
                        <div key={user.id} className='chat-user-display' onClick={() => handleOpenUser(user)}>
                            <div className='chat-user-online-indicator online' />
                            <p className='chat-list-user'>{user.name}</p>
                        </div>
                    )
                })}
                {offlineUsers.length > 0 && <p className='online-offline-divider'>Offline</p>}
                {offlineUsers.map(user => {
                    return (
                        <div key={user.id} className='chat-user-display' onClick={() => handleOpenUser(user)}>
                            <div className='chat-user-online-indicator offline' />
                            <p className='chat-list-user'>{user.name}</p>
                        </div>
                    )
                })}
            </div>
            <div className='chat-inner-div'>
                <div className='chat-history-wrapper'>
                    <div className='chat-history'>
                        {chatMessages.map((message, index) => {
                            return (
                                <Messages key={index} data={message} />
                            )
                        })}
                    </div>
                </div>
                <div className='chat-input-div'>
                    {blocked.blocked ?
                        <p style={{ color: 'white', textAlign: 'center' }}>
                            {`You have been restricted from sending more message for ${msToMinutesAndSeconds(blocked.timer)} seconds`}
                        </p>
                        :
                        <>
                            <input
                                placeholder='Type your message'
                                className='chat-input'
                                type='text'
                                onChange={handleInput}
                                value={currentType}
                                ref={inputRef}
                                onKeyPress={e => { if (e.key === 'Enter') addSelfMessage(currentType) }}
                            />
                            <Send htmlColor='var(--dark-green)' className='chat-input-submit-btn' onClick={() => addSelfMessage(currentType)} />
                        </>
                    }
                </div>
            </div>
            {selectedUser &&
                <UserProfile open={openUserProfile} close={() => setOpenUserProfile(false)} user={selectedUser} />
            }
        </div>
    )
}

export default Chat


const Messages = (props) => {
    return (
        <div className='chat-messages-div'>
            <Avatar alt={props.data.user_name} src={props.data.user_picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${props.data.user_picture}` : portraitPlaceholder} sx={{ width: '35px', height: '35px', marginRight: '10px' }} />
            <div>
                <p className='chat-message-name'>{props.data.user_name}</p>
                <p className='chat-message-message'>{props.data.message}</p>
            </div>
        </div>
    )
}