import React, { useEffect, useState, useRef, useContext } from 'react'
import { Avatar } from '@mui/material'
import { Send } from '@mui/icons-material'

import { useUserInfo } from '../../Hooks/useUser'
import { SocketContext } from '../../Context/socket/socket'

import portraitPlaceholder from '../../Assets/placeholders/portrait.jpg'

import './Chat.css'

function Chat(props) {
    const [currentType, setCurrentType] = useState('')
    const [chatMessages, setChatMessages] = useState([])

    const socket = useContext(SocketContext)
    const { userInfo } = useUserInfo()
    const inputRef = useRef(null)


    useEffect(() => {
        socket.on('chat_message', (args, ...data) => addMessageToChat(args))

        return () => {
            socket.off('chat_message', addMessageToChat)
        }    
    }, [])

    useEffect(() => {
        console.log(chatMessages)
    },[chatMessages])


    const addMessageToChat = (data,) => {
        setChatMessages(prev => [...prev, data])
    }

    const addSelfMessage = (message) => {
        if (message.length > 0) {
            socket.emit('message', { chat: 'global', user_name: userInfo.name, user_picture: userInfo.picture, message: message })
            // setChatMessages(prev => [...prev, data])
            setCurrentType('')
            inputRef.current.focus()
        }
    }

    const handleInput = (e) => {
        //TODO: we have this method in case we need to restrict some characters from the chat
        setCurrentType(e.target.value)
    }

    return (
        <div className='chat-main-div'>
            <div className='chat-users'>

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
                </div>
            </div>
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