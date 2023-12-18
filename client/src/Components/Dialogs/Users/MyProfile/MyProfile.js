import React, { useState, useCallback } from 'react'
import DialogPrefab from '../../DialogPrefab'
import { useDropzone } from 'react-dropzone'
import { useUserInfo } from '../../../../Hooks/useUser'
import useGlobalSnackbar from '../../../../Hooks/useGlobalSnackbar'
import Button from '../../../Buttons/Button'
import { getEntity } from '../../../../API/requests'
import CustomTooltip from '../../../Misc/CustomTooltip'
import { Delete } from '@mui/icons-material'
import axios from 'axios'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import { Tabs, Tab } from '@mui/material'

import PortraitPlaceholder from '../../../../Assets/placeholders/portrait.jpg'

import './MyProfile.css'

function MyProfile(props) {
    const [tab, setTab] = useState(0)
    const [showSideView, setShowSideView] = useState(false)

    const { userInfo, setUserInfo } = useUserInfo()
    const { showSnackbar } = useGlobalSnackbar()

    const refresh = () => {
        getEntity({ entity: 'users', id: userInfo.id }).then(res => {
            setUserInfo({ ...res.data, token: userInfo.token })
        }, err => {
            console.log(err)
        })
    }

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            if (fileRejections[0].errors[0].code === 'file-too-large') {
                showSnackbar({ message: 'Image size too big, limit is 1mb', variant: "error" })
            }
            if (fileRejections[0].errors[0].code === 'file-invalid-type') {
                showSnackbar({ message: 'Incorrect image format', variant: "error" })
            }
            return;
        }

        handleUploadImage(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1000000,
        multiple: false,
        noDragEventsBubbling: true,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    })

    const handleRemoveImage = () => {

        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/remove-picture/${userInfo.id}`, {}, {
            headers: {
                key: JSON.parse(sessionStorage.getItem('token'))?.token,
                'requesting-user': sessionStorage.getItem('id')
            }
        }).then(res => {
            setUserInfo({ ...userInfo, picture: null })
            showSnackbar({ message: res.data, variant: 'success' })
        }, err => {
            console.log(err)
            showSnackbar({ message: 'Error while uploading image, click on view form more info', description: err.response ? err.response : 'Could not comunicante with the server', variant: 'error' })
        })
    }

    const handleUploadImage = (file) => {

        let formData = new FormData();
        formData.append('picture', file)

        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/change-picture/${userInfo.id}`, formData, {
            headers: {
                key: JSON.parse(sessionStorage.getItem('token'))?.token,
                'requesting-user': sessionStorage.getItem('id'),
                'accept': 'application/json',
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }).then(res => {
            setUserInfo({ ...userInfo, picture: `${res.data.picture}?updatedAt=${new Date().toISOString()}` }) //make sure image refreshes while having the same name
            showSnackbar({ message: res.data.message, variant: 'success' })
        }, err => {
            console.log(err)
            showSnackbar({ message: 'Error while uploading image, click on view form more info', description: err.response ? err.response : 'Could not comunicante with the server', variant: 'error' })
        })
    }


    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            maxWidth={showSideView ? 'md' : 'xs'}
        >
            <div className='my-profile-main-div'>
                <div className='my-profile-info-div'>
                    <div className={`my-profile-image-div${isDragActive ? ' dragging' : ''}`}>
                        <input {...getInputProps({})} />
                        <img
                            alt={userInfo.name}
                            src={userInfo.picture ? `${process.env.REACT_APP_SERVER_URL}/resources/images/users/${userInfo.picture}` : PortraitPlaceholder}
                            className='my-profile-portrait-image'
                            {...getRootProps()}
                        />
                        <p className='my-profile-image-upload-info'>Click or drag to upload picture</p>
                        {userInfo.picture &&
                            <CustomTooltip title='Remover Imagem'>
                                <Delete htmlColor='white' className='remove-picture-btn' onClick={handleRemoveImage} />
                            </CustomTooltip>
                        }
                    </div>
                    <p className='user-profile-name'>{userInfo.name}</p>
                    <div className='my-profile-badges'>
                        {/* TODO: put badges of the user here? */}
                    </div>
                    <Button onClick={() => setShowSideView(!showSideView)} label={showSideView ? 'Close Edit' : 'Edit Profile'} />
                </div>
                <div className={`my-profile-edit-div${showSideView ? ' show' : ' hide'}`}>
                    <Tabs
                        sx={{ '& .MuiTabs-indicator': { backgroundColor: 'var(--light-yellow)' }, '& button': { color: 'var(--light-yellow)', fontFamily: 'xerox', fontSize: '16px' } }}
                        variant="fullWidth"
                        value={tab}
                        onChange={(e, value) => setTab(value)}
                        textColor='inherit'
                        centered
                    >
                        <Tab label='Edit Info' />
                        <Tab label='Change Password' />
                    </Tabs>
                    <div style={{ flex: '1 1' }}>
                        <TabPanel value={tab} index={0}>
                            <EditProfile user={userInfo} refresh={refresh} />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <ChangePassword user={userInfo} />
                        </TabPanel>
                    </div>
                </div>
            </div>
        </DialogPrefab>
    )
}

export default MyProfile

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ display: 'flex', justifyContent: 'center' }}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}