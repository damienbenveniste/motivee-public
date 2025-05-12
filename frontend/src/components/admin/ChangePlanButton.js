
import { useState } from 'react'
import { Button } from "@mui/material"
import PricingPlanModal from 'pages/pricing/PricingPlanModal'


export default function ChangePlanButton() {

    const [open, setOpen] = useState(false)

    const onClick = () => setOpen(true)
    const onClose = () => setOpen(false) 


    return <>
        <Button onClick={onClick}>
            Click
        </Button>
        {open && <PricingPlanModal open={open} onClose={onClose}/>}
    </>

}