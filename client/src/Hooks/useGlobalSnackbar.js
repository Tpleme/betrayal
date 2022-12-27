import { Button } from "@mui/material";
import { useSnackbar } from 'notistack';
import useDialog from './useDialog'
import DefaultComponent from "../Components/CustomSnackbar/DefaultComponent";
import GameInviteSnackbar from "../Components/CustomSnackbar/GameInviteSnackbar";
import { useContext } from "react";
import { SocketContext } from "../Context/socket/socket";

export default function useGlobalSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { openErrDialog } = useDialog()
    const socket = useContext(SocketContext)

    const Actions = ({ snackbarKey, description }) => {
        return (
            <>
                {description &&
                    <Button onClick={() => { openErrDialog(description); closeSnackbar(snackbarKey) }} color='inherit' size='small'>VIEW</Button>
                }
                <Button onClick={() => closeSnackbar(snackbarKey)} color='inherit' size='small'>OK</Button>
            </>
        )
    }

    const showSnackbar = (
        data = {
            message: '',
            description: '',
            customComponent: null,
            variant: 'success',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            persist: false,
            autoHideDuration: 5000,
        }
    ) => {
        enqueueSnackbar(data.message, {
            variant: data.variant ? data.variant : 'success',
            anchorOrigin: data.anchorOrigin ? data.anchorOrigin : { vertical: 'bottom', horizontal: 'center' },
            persist: data.persist ? data.variant === 'error' ? true : data.persist : false,
            autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 5000,
            content: (key, message) => getRespectiveComponent(key, message, data.customComponent, data.variant, data.description, <Actions snackbarKey={key} description={data.description} />),
            action: (key) => <Actions snackbarKey={key} description={data.description} />
        })
    }

    const getRespectiveComponent = (key, message, customComponent, variant, description, actions) => {
        const type = variant ? variant : 'success'
        switch (customComponent) {
            case 'game-invite': return <div><GameInviteSnackbar id={key} message={message} socket={socket} /></div>
            default: return <div><DefaultComponent id={key} message={message} type={type} description={description} actions={actions} /></div>
        }
    }

    return {
        showSnackbar
    }
}