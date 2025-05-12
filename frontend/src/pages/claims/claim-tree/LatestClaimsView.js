
import { useEffect, useState } from 'react'
import { Box, ListItem, List, Typography, Stack } from '@mui/material';
import NewClaimView from 'components/conversations/NewClaimView'


export default function LatestClaimsView({ claims, parentDict, conversation, onClick, ...props }) {

    const [orderedClaims, setOrderedClaims] = useState([])

    useEffect(() => {
        const newClaims = [...claims].sort((a, b) => {
            return Date.parse(b.time_created) - Date.parse(a.time_created)
        })
        setOrderedClaims(newClaims)
    }, [claims])


    const rows = orderedClaims.slice(0, 30).map(claim => {
        return <ListItem key={claim.id} disableGutters>
            <NewClaimView
                claim={claim}
                parent={parentDict[claim.id]}
                conversation={conversation}
                onClick={onClick} />
        </ListItem>
    })

    return <Box
        {...props}
        sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 5, padding: 1, height: '50%' }}
    >
        <Stack sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ flex: 0 }}>
                Latest Claims
            </Typography>
            <List sx={{ overflow: 'auto', flex: 1 }}>
                {rows}
            </List>
        </Stack>
    </Box>
}