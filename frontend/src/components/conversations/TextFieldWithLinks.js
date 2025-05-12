import { useState, useRef, useEffect } from 'react'
import {
    IconButton,
    Typography,
    Popover,
    Paper,
    Stack,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
    Input,
    Box,
    Button
} from '@mui/material'
import AddLinkIcon from '@mui/icons-material/AddLink';
import String from 'utils/strings'


function AddLinks({ onClose, text, value, setValue, selectionStart, selectionEnd }) {

    const [urlText, setUrlText] = useState('')
    const [url, setUrl] = useState('')

    const disabled = urlText.length === 0 || url.length === 0

    useEffect(() => {
        if (!text) return
        setUrlText(text)
    }, [text])

    const onClick = (event) => {
        const linkText = `[${urlText}](${url})`
        const newValue = [value.slice(0, selectionStart), linkText, value.slice(selectionEnd)].join('')
        setValue(newValue)
        onClose()
    }

    return <Paper sx={{ padding: 3, width: '100%' }}>
        <Stack spacing={1}>
            <Typography>
                Link Text
            </Typography>
            <TextField
                value={urlText}
                onChange={event => {
                    setUrlText(event.target.value)
                }}
            />
            <Typography>
                Link
            </Typography>
            <TextField
                value={url}
                onChange={e => {
                    setUrl(e.target.value)
                }}
            />
            <Box display="flex" justifyContent="flex-end">
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={disabled}
                    onClick={onClick}>
                    Add
                </Button>
            </Box>
        </Stack>
    </Paper>
}


export default function TextFieldWithLinks({ setValue, value, label, ...props }) {
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedText, setSelectedText] = useState(null)
    const [selectionStart, setSelectionStart] = useState(null)
    const [selectionEnd, setSelectionEnd] = useState(null)
    const inputRef = useRef()

    useEffect(() => {
        if (selectionEnd === null || !selectionStart === null) return
        if (selectionEnd > selectionStart) {
            setSelectedText(value.slice(selectionStart, selectionEnd))
        } else {
            setSelectedText(null)
        }

    }, [selectionStart, selectionEnd])

    const handleClose = (event) => {
        setOpen(false)
        setAnchorEl(null)
        setSelectionStart(null)
        setSelectionEnd(null)
        setSelectedText(null)
    }

    const handleOpen = (event) => {
        if (open) return
        setOpen(true)
        setAnchorEl(inputRef.current)
    }

    const updateSelectionStart = (e) => {
        setSelectionStart(e.target.selectionStart)
        setSelectionEnd(e.target.selectionEnd)
    }

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return <Stack spacing={1}>
        <FormControl ref={inputRef}>
            <InputLabel htmlFor="component-outlined">{label}</InputLabel>
            <OutlinedInput
                {...props}
                id='component-outlined'
                value={value}
                onSelect={updateSelectionStart}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end" sx={{ width: 40}}>
                        <IconButton
                            edge="end"
                            onClick={handleOpen}
                            sx={{ backgroundColor: (theme) => theme.palette.divider }}>
                            <AddLinkIcon />
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
            />
        </FormControl>
        <Typography
            sx={{ backgroundColor: '#f7f6f2', borderRadius: 5, padding: 2 }}>
            {String.getLinks(value)}
        </Typography>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{
                style: { width: inputRef?.current?.offsetWidth },
            }}
            sx={{ zIndex: 10000 }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <AddLinks
                onClose={handleClose}
                text={selectedText}
                value={value}
                setValue={setValue}
                selectionStart={selectionStart}
                selectionEnd={selectionEnd} />
        </Popover>
    </Stack>
}