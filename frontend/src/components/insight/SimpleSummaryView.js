import { useEffect, useState } from 'react'
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, CircularProgress, Stack, Divider, Box } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import palette from 'themes/palette'
import { SummaryAPI } from 'api/summary'
import { useParams } from 'react-router-dom'
import String from 'utils/strings';
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import { SummaryInformation } from 'components/views/HelperComponent';


const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(6),
    height: theme.spacing(6),
    justifyContent: 'center',
}));

const titles = {
    PRO: 'Supports',
    CON: 'Concerns',
    ANS: 'Suggested Answer'
}


const colors = {
    PRO: 'success',
    CON: 'error',
    ANS: 'primary'
}


const icons = {
    PRO: <ThumbUpAltIcon />,
    CON: <ThumbDownAltIcon />,
    ANS: <ThumbUpAltIcon />,
}


function FallBackUI() {
    return <Stack
        justifyContent="center"
        alignItems="center">
        <NewReleasesIcon
            color='disabled'
            sx={{ height: 50, width: 50 }} />
        <Typography variant='h6' color='gray'>
            Not enough data to generate a summary
        </Typography>
    </Stack>
}


export default function Summaries({ type }) {

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [enoughData, setEnoughData] = useState(true)

    const title = titles[type]
    const color = colors[type]
    const icon = icons[type]

    const { conversationId, customerId } = useParams()

    useEffect(() => {
        setLoading(true)
        SummaryAPI.getSummary({
            conversationId,
            claimId: null,
            tag: null,
            type,
            customerId,
            onSuccess: res => {
                setLoading(false)
                if (res.data.results.length === 1) {
                    setSummary(res.data.results[0])
                } else {
                    setEnoughData(false)
                }
            },
            onFailure: () => setLoading(false)
        })
    }, [conversationId])

    return (
        <RootStyle
            sx={{
                color: palette[color].darker,
                bgcolor: palette[color].lighter,
            }}
        >

            <Stack 
            spacing={2}
            direction='row' 
            alignItems='center' 
            justifyContent='flex-start'>
                <IconWrapperStyle
                    sx={{
                        color: palette[color].dark,
                        backgroundImage: `linear-gradient(135deg, ${alpha(palette[color].dark, 0)} 0%, ${alpha(
                            palette[color].dark,
                            0.24
                        )} 100%)`,
                    }}
                >
                    {icon}
                </IconWrapperStyle>
                <Typography variant="h6">
                    <b>{title}</b>
                </Typography>
            </Stack>
            {loading ? <CircularProgress /> : (
                enoughData ? <Typography variant='body1'  align='justify'>
                    {String.getLinks(summary?.text)}
                </Typography> : <FallBackUI />
            )}
        </RootStyle >
    );
}