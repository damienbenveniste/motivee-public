import { Typography, Stack } from '@mui/material'
// import EditableTextView from "components/views/EditableTextView"

function Row({ title, text = null, ...props }) {

    const finalText = text ? text : '-'.repeat(10)
    const color = text ? 'primary' : 'lightgray'

    return <Stack
        direction='row'
        justifyContent="center"
        alignItems="center"
        spacing={6}>
        <Typography {...props} align='right'>
            {title}
        </Typography>
        <Typography {...props} align='left' color={color}>
            {finalText}
        </Typography>
    </Stack>
}


export default function ProfileInformation() {

    return <Stack
        spacing={4}
        justifyContent="center"
        alignItems="center">
        <Row
            variant='h5'
            sx={{ width: 200 }}
            title='Job Title'
        />
        <Row
            variant='h5'
            sx={{ width: 200 }}
            title='Level'
        />
    </Stack>


}