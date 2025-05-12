import { useState } from 'react'
import { Tooltip, IconButton } from '@mui/material'
import wheelImage from 'images/wheel.png'


export default function ColorWheelButton(props) {

    const [width, setWidth] = useState(50)

    const onMouseOver = () => setWidth(51)
    const onMouseOut = () => setWidth(50)

    return <Tooltip title='Explore'>
        <IconButton
            {...props}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            focusRipple
            centerRipple
            style={{ width: width, height: width }}>
            <img src={wheelImage} style={{ width: width }} />
        </IconButton>
    </Tooltip>
}