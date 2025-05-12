import { useState } from 'react'
import {
    Fab,
    Popover,
    TextField,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import ButtonWithAlert from 'components/views/ButtonWithAlert'
import { SuggestionAPI } from 'api/suggestions'
import { useParams } from 'react-router-dom';

const fabStyle = {
    position: 'absolute',
    bottom: 20,
    right: 20,
}

export default function SuggestionButton() {

    const [anchorEl, setAnchorEl] = useState(null)
    const [content, setContent] = useState('')
    const {customerId} = useParams()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null)
        setContent('')
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const disabled = (content === '')

    return <>
        <Fab
            sx={fabStyle}
            color='secondary'
            onClick={handleClick}
        >
            <ContactSupportIcon />
        </Fab>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: -10,
                horizontal: 0,
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <Paper sx={{ padding: 5, width: 400 }}>
                <Stack alignItems='center' spacing={2}>
                    <Typography variant='h6'>
                        Write a Suggestion
                    </Typography>
                    <TextField
                    value={content}
                        multiline
                        placeholder="Write a Suggestion"
                        label="Write a Suggestion"
                        rows={7}
                        sx={{ width: '100%' }}
                        onChange={(e) => setContent(e.target.value)} />

                    <ButtonWithAlert
                        variant='contained'
                        sx={{ width: '100%' }}
                        disabled={disabled}
                        apiCall={SuggestionAPI.createSuggestion}
                        apiArgs={{content, customerId}}
                        onSuccess={() => setTimeout(handleClose, 1000)}
                        successMessage='Thank you for your Suggestion!'
                    >
                        Submit
                    </ButtonWithAlert>
                </Stack>
            </Paper>
        </Popover>
    </>
}