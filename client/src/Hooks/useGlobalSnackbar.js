import { Button } from "@mui/material";
import { useSnackbar } from 'notistack';
import useDialog from './useDialog'

export default function useGlobalSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { openErrDialog } = useDialog()

    const Actions = ({ snackbarKey, description }) => {
        return (
            <>
                {description &&
                    <Button onClick={() => { openErrDialog(description); closeSnackbar(snackbarKey) }} color='inherit' size='small'>VER</Button>
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
            persist: data.persist ? data.persist : false,
            autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 5000,
            content: (key, message) => getRespectiveComponent(key, message, data.customComponent),
            action: (key) => <Actions snackbarKey={key} description={data.description} />
        })
    }

    const getRespectiveComponent = (key, message, customComponent) => {
        switch (customComponent) {
            // case 'connection': return <div><NewConnectionsSnackbar id={key} message={message} socket={socket} /></div>
            // case 'chat': return <div><ChatMessageSnackbar id={key} data={message} /></div>
            default: return null
        }
    }

    return {
        showSnackbar
    }
}