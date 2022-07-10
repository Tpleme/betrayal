import { useModal } from 'mui-modal-provider'
import ErrorDialog from '../Components/Dialogs/ErrorDialog'
import InfoDialog from '../Components/Dialogs/InfoDialog'

export default function useDialog() {
    const { showModal } = useModal()

    const openInfoDialog = (
        info = { title: '', message: ''},
        type = 'ok',
        ycb,
        ncb = () => console.log('no ncb provided'),
        ocb = () => console.log('no ocb provided')
    ) => {
        const modal = showModal(InfoDialog, {
            close: () => modal.hide(),
            info: info,
            type: type,
            ncb: () => { modal.hide(); ncb()},
            ocb: () => { modal.hide(); ocb()},
            ycb: () => { modal.hide(); ycb()}
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