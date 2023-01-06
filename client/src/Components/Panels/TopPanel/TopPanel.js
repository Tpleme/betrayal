import React, { useEffect, useState, useContext } from 'react'
import { useUserInfo } from '../../../Hooks/useUser'
import { Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import useToken from '../../../Hooks/useToken'
import useGlobalSnackbar from '../../../Hooks/useGlobalSnackbar'
import ErrorDialog from '../../Dialogs/ErrorDialog'
import MyProfile from '../../Dialogs/Users/MyProfile/MyProfile'

import { ExitToApp as LogoutIcon, PersonOutlined as ProfileIcon, Settings as SettingsIcon } from '@mui/icons-material'

import { SocketContext } from '../../../Context/socket/socket'

import portraitPlaceholder from '../../../Assets/placeholders/portrait.jpg'
import Logo from '../../../Assets/logos/betrayal_logo.png'
import './TopPanel.css'

const errorDialogInfo = {
    status: 404,
    statusText: 'Desconectado do servidor',
    data: 'Foi desconectado do servidor, Irá ser reencaminhado para a pagina do login em 5 segundo, ou poderá clicar em ok para fazer o logout',
}

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        transform: 'translate(25px, 10px) !important',
        color: 'var(--light-yellow)',
        backgroundColor: 'var(--dark-green)',
        '& li': {
            fontFamily: 'xerox',
            textTransform: 'uppercase'
        },
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
            if (!socket.connected) {
                socket.auth = { uuid: userInfo.id, name: userInfo.name, token: userInfo.token }
                socket.connect();
            }

            socket.on('connect_error', (args) => onConnectionError(args))
            socket.on('server_message_warning', (data) => displayServerMessage(data))
        }

        return () => {
            socket.off('connect_error', onConnectionError)
            socket.off('server_message_warning', displayServerMessage)
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

        // timer = setTimeout(() => {
        // logoutUser(false)
        // }, 5000)
        // setShowErrorDialog(true)
    }

    const displayServerMessage = (message) => {
        triggerSnackbar(message, '', "error")
        logoutUser()
    }

    return (
        <>
            <div className='top-bar-main-div' style={window.location.pathname === '/room' ? { display: 'none' } : {}}>
                <img alt='game icon' src={Logo} className='top-bar-logo' />
                <div className='top-panel-user-display' onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar alt={userInfo.name} src={userInfo.picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${userInfo.picture}` : portraitPlaceholder} sx={{ width: '30px', height: '30px', margin: '5px 10px 5px 5px' }} />
                    <p>{userInfo.name}</p>
                </div>
            </div>
            <UserMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} logout={logoutUser} openProfile={() => setOpenProfile(true)} openSettings={() => setOpenSettings(true)} />
            <ErrorDialog open={showErrorDialog} close={() => setShowErrorDialog(false)} info={errorDialogInfo} ocb={logoutUser} />
            <MyProfile open={openProfile} close={() => setOpenProfile(false)} />
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
                    <ProfileIcon htmlColor='var(--light-yellow)' />
                </ListItemIcon>
                My Profile
            </MenuItem>
            <MenuItem onClick={() => { props.setAnchorEl(null); props.openSettings() }}>
                <ListItemIcon >
                    <SettingsIcon htmlColor='var(--light-yellow)' />
                </ListItemIcon>
                Settings
            </MenuItem>
            <MenuItem onClick={props.logout}>
                <ListItemIcon>
                    <LogoutIcon htmlColor='var(--light-yellow)' />
                </ListItemIcon>
                Log Out
            </MenuItem>
        </StyledMenu>
    )
}