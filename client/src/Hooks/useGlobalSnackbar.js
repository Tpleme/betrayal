import { Button } from "@mui/material";
import { useSnackbar } from 'notistack';

export default function useGlobalSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const Actions = ({ snackbarKey, description }) => {
        return (
            <>
                {description.length > 0 &&
                    <Button onClick={() => alert(description)} color='inherit' size='small'>View</Button>
                }
                <Button onClick={() => closeSnackbar(snackbarKey)} color='inherit' size='small'>Dismiss</Button>
            </>
        )
    }

    const triggerSnackbar = (
        message = '',
        description = '',
        type = 'default',
        position = { vertical: 'bottom', horizontal: 'center' },
        persist = type === 'error' ? true : false,
        autoHideDuration = 5000,
        customComponent = null,
    ) => {
        enqueueSnackbar(message, {
            variant: type,
            anchorOrigin: { horizontal: position.horizontal, vertical: position.vertical },
            persist,
            autoHideDuration,
            content: customComponent ? (key, message) => customComponent : null,
            action: (key) => <Actions snackbarKey={key} description={description} />
        });
    }

    return {
        triggerSnackbar
    }
}