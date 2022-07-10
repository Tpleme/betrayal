import { Button } from '@mui/material'
import React from 'react'
import DialogPrefab from './DialogPrefab'

function InfoDialog({ info, ...props }) {
    return (
        <DialogPrefab
            open={props.open}
            close={props.close}
            title={info.title}
            maxWidth='xs'
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px', whiteSpace: 'pre-wrap', letterSpacing: '1px', fontSize: '15px', lineHeight: '20px' }}>
                    <p style={{ color: 'var(--dark-beige)' }}>{info.message}</p>
                </div>
                <div style={{ alignSelf: 'flex-end' }}>
                    {props.type === "y/n" ? (
                        <>
                            <Button size='small' onClick={props.ycb}>
                                Sim
                            </Button>
                            <Button size='small' color='error' onClick={props.ncb}>
                                Não
                            </Button>
                        </>
                    ) : (
                        <Button size='small' onClick={props.ocb}>
                            ok
                        </Button>
                    )}
                </div>
            </div>
        </DialogPrefab>
    )
}

export default InfoDialog