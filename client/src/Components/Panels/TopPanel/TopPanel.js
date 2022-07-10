import React, { useEffect, useState, useContext } from 'react'
import { useUserInfo } from '../../../Hooks/useUser'
import { Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import useToken from '../../../Hooks/useToken'
import useGlobalSnackbar from '../../../Hooks/useGlobalSnackbar'
import ErrorDialog from '../../Dialogs/ErrorDialog'

import { ExitToApp as LogoutIcon, PersonOutlined as ProfileIcon, Settings as SettingsIcon } from '@mui/icons-material'

import { SocketContext } from '../../../Context/socket/socket'

// import Logo from '../../assets/logos/simple_logo.png'
import './TopPanel.css'

const errorDialogInfo = {
    status: 404,
    statusText: 'Desconectado do servidor',
    data: 'Foi desconectado do servidor, Irá ser reencaminhado para a pagina do login em 5 segundo, ou poderá clicar em ok para fazer o logout',
}

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        transform: 'translateY(20px) !important',
        color: 'var(--dark-blue)',
        '& li:hover': {
            backgroundColor: 'rgb(0,0,0,10%)',

        }
    }
}))


function TopPanel() {
    const { userInfo } = useUserInfo()

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()
    const { setToken } = useToken()
    const { triggerSnackbar } = useGlobalSnackbar()
    const [showErrorDialog, setShowErrorDialog] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)

    const socket = useContext(SocketContext)

    let timer;

    useEffect(() => {
        if (userInfo.id) {
            socket.on('connect_error', (args) => onConnectionError(args))
            socket.on('server_message_warning', (data) => displayServerMessage(data))
            socket.on('user_logged', (data) => displayUserLogged(data))
        }

        return () => {
            socket.off('connect_error', onConnectionError)
            socket.off('server_message_warning', displayServerMessage)
            socket.off('user_logged', displayUserLogged)
        }
    }, [userInfo])



    const logoutUser = () => {
        clearTimeout(timer)
        setToken(null)
        socket.disconnect()
        navigate('/login')
    }

    const onConnectionError = (args) => {
        if (timer) return; //previne a criação de múltiplos timeouts

        timer = setTimeout(() => {
            logoutUser(false)
        }, 5000)
        setShowErrorDialog(true)
    }

    const displayUserLogged = (message) => {
        triggerSnackbar(message, '', 'info', { vertical: 'bottom', horizontal: 'left' })
    }

    const displayServerMessage = (message) => {
        triggerSnackbar(message, '', "error")
        logoutUser()
    }

    return (
        <>
            <div className='top-bar-main-div'>
                {/* <img alt='lugar' src={Logo} height='60%' width='auto' style={{ filter: 'invert(1)' }} /> */}
                <div className='top-panel-user-display' onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar alt={userInfo.name} src={userInfo.picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${userInfo.picture}` : null} sx={{ width: '30px', height: '30px', margin: '5px 10px 5px 5px' }} />
                    <p>{userInfo.name}</p>
                </div>
            </div>
            <UserMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} logout={logoutUser} openProfile={() => setOpenProfile(true)} openSettings={() => setOpenSettings(true)} />
            <ErrorDialog open={showErrorDialog} close={() => setShowErrorDialog(false)} info={errorDialogInfo} ocb={logoutUser} />
        </>
    )
}

export default TopPanel

const UserMenu = (props) => {

    return (
        <StyledMenu
            id='profile-menu'
            anchorEl={props.anchorEl}
            open={Boolean(props.anchorEl)}
            onClose={() => props.setAnchorEl(null)}
        >
            <MenuItem onClick={() => { props.setAnchorEl(null); props.openProfile() }}>
                <ListItemIcon >
                    <ProfileIcon htmlColor='var(--dark-blue)' />
                </ListItemIcon>
                Perfil
            </MenuItem>
            <MenuItem onClick={() => { props.setAnchorEl(null); props.openSettings() }}>
                <ListItemIcon >
                    <SettingsIcon htmlColor='var(--dark-blue)' />
                </ListItemIcon>
                Preferências
            </MenuItem>
            <MenuItem onClick={props.logout}>
                <ListItemIcon>
                    <LogoutIcon htmlColor='var(--dark-blue)' />
                </ListItemIcon>
                Log Out
            </MenuItem>
        </StyledMenu>
    )
}