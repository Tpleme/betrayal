import React, { useEffect, useState, useRef, useContext } from 'react'
import { Avatar } from '@mui/material'
import { Send } from '@mui/icons-material'
import { msToMinutesAndSeconds } from '../../utils'
import { useUserInfo } from '../../Hooks/useUser'
import { SocketContext } from '../../Context/socket/socket'
import { getChatsData, pushMessagesToChat, removeChat } from '../../UserSettings/LobbyChat'
import moment from 'moment'

import portraitPlaceholder from '../../Assets/placeholders/portrait.jpg'

import './LobbyChat.css'

function LobbyChat(props) {
    const [currentType, setCurrentType] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [blocked, setBlocked] = useState({ blocked: false, timer: null })

    const socket = useContext(SocketContext)
    const { userInfo } = useUserInfo()
    const inputRef = useRef(null)
    let blockedTimer = null;


    useEffect(() => {
        setChatMessages(getChatsData(props.roomId))

        socket.on('looby_chat_message', msg => addMessageToChat(msg))
        socket.on('blocked', data => handleBlocked(data))

        return () => {
            socket.off('looby_chat_message', addMessageToChat)
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
        pushMessagesToChat(data.chat, data)
        setChatMessages(prev => [...prev, data])
    }

    const addSelfMessage = (message) => {
        if (message[0] === '/') {
            checkCommands(message)
            return;
        }

        if (message.length > 0) {
            socket.emit('lobbyMessage', {
                chat: props.roomId,
                type: 'user',
                user_id: userInfo.id,
                user_name: userInfo.name,
                user_picture: userInfo.picture,
                message: message,
                createdAt: new Date()
            })

            setCurrentType('')
            inputRef.current.focus()
        }
    }

    const checkCommands = (message) => {
        const command = message.split('/')[1]
        console.log(command)

        if (command === 'clear') {
            removeChat(props.roomId)
            setChatMessages(getChatsData(props.roomId))
        }

        setCurrentType('')
        inputRef.current.focus()
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
                        {chatMessages.map((data, index) => {
                            return (
                                data.type === 'system' ? <SystemMessages key={index} data={data} /> : <Messages key={index} data={data} />
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
        </div>
    )
}

export default LobbyChat


const Messages = (props) => {
    return (
        <div className='lobby-chat-messages-div'>
            <Avatar alt={props.data.user_name} src={props.data.user_picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${props.data.user_picture}` : portraitPlaceholder} sx={{ width: '35px', height: '35px', marginRight: '10px' }} />
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <p className='lobby-chat-message-name'>{props.data.user_name}</p>
                    <p className='lobby-chat-message-time'>{moment(props.data.createdAt).format('DD-MMM-YYYY HH:mm')}</p>
                </div>
                <p className='lobby-chat-message-message'>{props.data.message}</p>
            </div>
        </div>
    )
}

const SystemMessages = ({ data }) => {
    return (
        <div className='system-messages-div'>
            <p className='system-message-name'>System Message</p>
            <p className='system-message-time'>{moment(data.createdAt).format('DD-MMM-YYYY HH:mm')}</p>
            <p className='system-message-message'>{data.message}</p>
        </div>
    )
}