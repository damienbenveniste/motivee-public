import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material'


export default function ConversationTypeComponent({openEnded, setOpenEnded}) {

    const handleChange = (event) => {
        setOpenEnded(event.target.value)
    }

    return (
        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group"><b>Conversation Type</b></FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={openEnded}
                onChange={handleChange}
            >
                <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Yes / No Question"
                />
                <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Open-Ended Question"
                />
            </RadioGroup>
        </FormControl>
    )
}