
import { Link, Button } from '@mui/material'


export default function BusinessButton({ ...props }) {

    return <Button
        {...props}
        component={Link}
        href='https://calendly.com/motivee-info/intro-call'
        target="_blank"
        hidden
        rel="noopener noreferrer">
        Choose Business plan
    </Button>
}