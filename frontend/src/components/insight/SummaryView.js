
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
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const titles = {
    PRO: 'Supports',
    CON: 'Concerns',
    ANS: 'Answer'
}


const colors = {
    PRO: 'success',
    CON: 'error',
    ANS: 'primary'
}


const icons = {
    PRO: <ThumbUpAltIcon />,
    CON: <ThumbDownAltIcon />,
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


export default function SummaryView({ type, claim = null }) {

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [enoughData, setEnoughData] = useState(true)

    const title = titles[type]
    const color = colors[type]
    const icon = icons[type]

    const { conversationId, tag, customerId } = useParams()

    useEffect(() => {
        setLoading(true)
        SummaryAPI.getSummary({
            conversationId,
            claimId: claim?.id,
            tag,
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
    }, [conversationId, tag])

    return (
        <RootStyle
            sx={{
                color: palette[color].darker,
                bgcolor: palette[color].lighter,
            }}
        >
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
            <Stack direction='row' alignItems='center' justifyContent='center'>
                <Typography variant="h5">
                    <b>{title}</b>
                </Typography>
                <SummaryInformation />
            </Stack>
            {loading ? <CircularProgress /> : (
                enoughData ? <Typography variant="body1" sx={{ opacity: 0.72 }} align='justify'>
                    {String.getLinks(summary?.text)}
                </Typography> : <FallBackUI />
            )}
            {enoughData && !loading && <Stack>
                <Divider light={true} sx={{ background: palette[color].light }} variant='middle' />
                <Typography
                    variant="caption" align='center'
                    sx={{ mb: 0.75, color: palette[color].darker }}>
                    This Summary was generated using
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                }}>
                    <Stack justifyContent='center'>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{ mb: 0.75, color: palette[color].darker }}>
                            Claims
                        </Typography>
                        <Typography variant="subtitle1">
                            {summary?.claims_number}
                        </Typography>
                    </Stack>

                    <Stack justifyContent='center'>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{ mb: 0.75, color: palette[color].darker }}>
                            Positive Consensus
                        </Typography>
                        <Typography variant="subtitle1">
                            {summary?.pct_pos_consensus.toFixed(1)} %
                        </Typography>
                    </Stack>

                    <Stack justifyContent='center'>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{ mb: 0.75, color: palette[color].darker }}>
                            Negative Consensus
                        </Typography>
                        <Typography variant="subtitle1">
                            {summary?.pct_neg_consensus.toFixed(1)} %
                        </Typography>
                    </Stack>
                    <Stack justifyContent='center'>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{ mb: 0.75, color: palette[color].darker }}>
                            Other
                        </Typography>
                        <Typography variant="subtitle1">
                            {(100 - summary?.pct_neg_consensus - summary?.pct_pos_consensus).toFixed(1)} %
                        </Typography>
                    </Stack>
                </Box>
            </Stack>}
        </RootStyle >
    );
}
