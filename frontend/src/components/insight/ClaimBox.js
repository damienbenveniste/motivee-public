
import { useState, useEffect } from 'react'
import { Paper, Typography, Stack } from '@mui/material'
import VerticalBarChart from 'components/visualizations/VerticalBarChart'
import String from 'utils/strings'


function convertPValue(pvalue) {
    return -Math.abs(-pvalue) + 1
}


export default function ClaimBox({ claim, index }) {

    const [color, setColor] = useState('green')
    const [text, setText] = useState('')

    useEffect(() => {
        if (!claim) return

        if (claim.pvalue <= -0.95) {
            setColor('green')
        } else if (claim.pvalue <= -0.9) {
            setColor('orange')
        } else {
            setColor('red')
        }

        if (claim.pvalue <= -0.95) {
            setText('Clear Positive Consensus')
        } else if (claim.pvalue >= 0.95) {
            setText('Clear Negative Consensus')
        } else if (claim.pvalue <= -0.90) {
            setText('Potential Positive Consensus')
        } else if (claim.pvalue >= 0.90) {
            setText('Potential Negative Consensus')
        } else {
            setText('Not clear Consensus')
        }

    }, [claim])


    const badgeStyle = {
        color: 'yellow',
        backgroundColor: '#686868',
        width: 40,
        height: 40,
        borderRadius: '50%',
        marginBottom: -20,
        textAlign: 'center',
        zIndex: 500,
        paddingTop: '7px',
    }

    return <Stack
        sx={{ width: '100%' }}
        alignItems='center'>
        <div style={badgeStyle}>
            <Typography>
                {index}
            </Typography>
        </div>
        <Paper
            elevation={0}
            sx={{
                pt: 3, pl: 3, pr: 3, pb: 3,
                borderRadius: 5,
                width: '100%',
                boxShadow: '#919EAB',
            }}
        >
            <Stack
                spacing={1}
                sx={{ width: '100%' }}
            >
                <Typography variant='subtitle2' sx={{ overflow: 'hidden' }}>
                    {String.getLinks(claim?.text)}
                </Typography>
                <Stack
                    direction='row'
                    spacing={1}
                    justifyContent="space-between"
                    alignItems='center'
                    sx={{ width: '100%', display: 'flex' }}>
                    <VerticalBarChart claim={claim} style={{flex: '1 1 auto'}}/>
                    <Typography color={color} variant='caption' align='right' sx={{width: 100}}>
                        {text} <br/>
                        p-value = {convertPValue(claim?.pvalue).toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    </Stack>
}