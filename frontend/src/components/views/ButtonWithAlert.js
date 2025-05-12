import { useState } from 'react'
import { Button, Snackbar, Alert, CircularProgress } from '@mui/material'


function ButtonWithLoading({ children, apiCall, apiArgs, onSuccess, onFailure, ...restProps }) {

    const [loading, setLoading] = useState(false)

    return <Button
        {...restProps}
        disabled={loading || restProps.disabled}
        onClick={(event) => {
            event.stopPropagation()
            setLoading(true)
            apiCall({
                ...apiArgs,
                onSuccess: (res) => {
                    onSuccess(res)
                    setLoading(false)
                },
                onFailure: (res) => {
                    onFailure(res)
                    setLoading(false)
                },
            })
        }}>
        {loading ? <CircularProgress color='inherit' /> : children}
    </Button>
}


export default function ButtonWithAlert({
    children,
    apiCall,
    apiArgs,
    onSuccess=() => null,
    onFailure=() => null,
    successMessage,
    ...restProps
}) {

    const [state, setState] = useState({
        openSnack: false,
        severity: 'success',
        alertMessage: ''
    })
    const { openSnack, severity, alertMessage } = state

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setState({
            openSnack: false,
            severity: 'success',
            alertMessage: ''
        })
    }

    return <>
        <Snackbar
            open={openSnack}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
        <ButtonWithLoading
            {...restProps}
            apiCall={apiCall}
            apiArgs={apiArgs}
            onSuccess={(res) => {
                setState({
                    openSnack: true,
                    severity: 'success',
                    alertMessage: successMessage
                })
                onSuccess(res)
            }}
            onFailure={(message) => {
                setState({
                    openSnack: true,
                    severity: 'error',
                    alertMessage: message
                })
                onFailure(message)
            }}
        >
            {children}
        </ButtonWithLoading>
    </>
}