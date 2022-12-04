import { useModal } from 'mui-modal-provider'
import ErrorDialog from '../Components/Dialogs/ErrorDialog'
import InfoDialog from '../Components/Dialogs/InfoDialog'

export default function useDialog() {
    const { showModal } = useModal()

    const openInfoDialog = ({
        title = '',
        message = '',
        type = 'ok',
        ycb,
        ncb = () => console.log('no ncb provided'),
        ocb = () => console.log('no ocb provided'),
        preventOutSideClose = false,
        preventClose = false
    }
    ) => {
        const modal = showModal(InfoDialog, {
            close: () => modal.hide(),
            title,
            message,
            type,
            ncb: () => { modal.hide(); ncb() },
            ocb: () => { modal.hide(); ocb() },
            ycb: () => { modal.hide(); ycb() },
            preventOutSideClose,
            preventClose
        })
    }

    const openErrDialog = (info, cb = () => console.log('no cb provided')) => {
        const modal = showModal(ErrorDialog, {
            info: info,
            close: () => modal.hide(),
            ocb: () => { modal.hide(); cb() }
        })
    }

    return {
        openInfoDialog,
        openErrDialog
    }
}