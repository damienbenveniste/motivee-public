import {
    DialogContent,
    Button,
    Dialog
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'


export default function Modal({ children, ...props }) {

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md')) || props.fullScreen

    return (
        <Dialog
            onClick={(e) => e.stopPropagation()}
            open={props.open}
            onClose={props.onClose}
            fullScreen={fullScreen}
            maxWidth={false}
            PaperProps={{
                style: { borderRadius: 20 }
              }}
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <DialogContent sx={{ padding: { xs: 2, md: 5 } }}>
                <Button
                    startIcon={<CancelIcon />}
                    onClick={props.onClose}>
                    Close
                </Button>
                {children}
            </DialogContent>
        </Dialog>
    )
}

Modal.defaultProps = {
    fullScreen: false,
}