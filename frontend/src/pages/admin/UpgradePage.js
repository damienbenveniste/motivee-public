
import { Box, Typography } from "@mui/material"

export default function UpgadePage() {
    return <Box sx={
        {width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center'}}>
        <Typography variant='h5'>
            Your plan expired! 
        </Typography>
         <Typography variant='h5'>
         Contact your workspace administrator to upgrade your plan
        </Typography>     
    </Box>
}