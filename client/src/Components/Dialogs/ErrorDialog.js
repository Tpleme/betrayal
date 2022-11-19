import { Button } from '@mui/material'
import React from 'react'
import DialogPrefab from './DialogPrefab'

function ErrorDialog(props) {

    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            title='ERRO'
            maxWidth='xs'
            error={true}
            preventOutSideClose={true}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                    <div style={{ marginBottom: '30px', textAlign: 'center', fontSize: '30px', color: 'var(--light-yellow)' }}>
                        <p>{props.info.status}</p>
                        <p>{props.info.statusText}</p>
                    </div>
                    <div style={{ fontSize: '20px', color: 'white', textAlign: 'center' }}>
                        {props.info.data ?
                            <p>{props.info.data}</p> :
                            <p>{JSON.stringify(props.info.message)}</p>
                        }
                    </div>
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                    <Button size='small' color='error' onClick={props.ocb}>
                        ok
                    </Button>
                </div>
            </div>
        </DialogPrefab>
    )
}

export default ErrorDialog