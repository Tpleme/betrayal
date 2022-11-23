import React, { useEffect, useState, useRef, useContext } from 'react'
import { Avatar } from '@mui/material'
import { Send } from '@mui/icons-material'
import { msToMinutesAndSeconds } from '../../utils'

import { useUserInfo } from '../../Hooks/useUser'
import { SocketContext } from '../../Context/socket/socket'
import UserProfile from '../Dialogs/Users/UserProfile/UserProfile'

import portraitPlaceholder from '../../Assets/placeholders/portrait.jpg'

import './LobbyChat.css'

function LobbyChat(props) {
    const [currentType, setCurrentType] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [openUserProfile, setOpenUserProfile] = useState(false)
    const [blocked, setBlocked] = useState({ blocked: false, timer: null })

    const socket = useContext(SocketContext)
    const { userInfo } = useUserInfo()
    const inputRef = useRef(null)
    let blockedTimer = null;


    useEffect(() => {
        socket.on('chat_message', msg => addMessageToChat(msg))
        socket.on('blocked', data => handleBlocked(data))

        return () => {
            socket.off('chat_message', addMessageToChat)
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

    const addMessageToChat = (data) => {
        setChatMessages(prev => [...prev, data])
    }

    const addSelfMessage = (message) => {
        if (message.length > 0) {
            socket.emit('message', { chat: props.roomId, user_id: userInfo.id, user_name: userInfo.name, user_picture: userInfo.picture, message: message })
            setCurrentType('')
            inputRef.current.focus()
        }
    }

    const handleInput = (e) => {
        //TODO: we have this method in case we need to restrict some characters from the chat
        setCurrentType(e.target.value)
    }

    return (
        <div className='lobby-chat-main-div'>
            <div className='lobby-chat-inner-div'>
                <div className='lobby-chat-history-wrapper'>
                    <div className='lobby-chat-history'>
                        {chatMessages.map((message, index) => {
                            return (
                                <Messages key={index} data={message} />
                            )
                        })}
                    </div>
                </div>
                <div className='lobby-chat-input-div'>
                    {blocked.blocked ?
                        <p style={{ color: 'white', textAlign: 'center' }}>
                            {`You have been restricted from sending more message for ${msToMinutesAndSeconds(blocked.timer)} seconds`}
                        </p>
                        :
                        <>
                            <input
                                placeholder='Type your message'
                                className='lobby-chat-input'
                                type='text'
                                onChange={handleInput}
                                value={currentType}
                                ref={inputRef}
                                onKeyPress={e => { if (e.key === 'Enter') addSelfMessage(currentType) }}
                            />
                            <Send htmlColor='var(--dark-green)' className='lobby-chat-input-submit-btn' onClick={() => addSelfMessage(currentType)} />
                        </>
                    }
                </div>
            </div>
            {/* {selectedUser &&
                <UserProfile open={openUserProfile} close={() => setOpenUserProfile(false)} user={selectedUser} />
            } */}
        </div>
    )
}

export default LobbyChat


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