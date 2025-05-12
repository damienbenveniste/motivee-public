import { Grid, Divider, Stack, Typography } from "@mui/material"
import SummaryView from "components/insight/SummaryView"
import TopClaimsView from "components/insight/TopClaimsView"
import { styled } from '@mui/material/styles'
import { PValueInformation } from 'components/views/HelperComponent'

const GridStyled = styled(Grid)(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& [role="separator"]': {
        margin: theme.spacing(0, 2),
    },
}));

export default function FullSummaryView({ claim = null }) {

    return <Grid container sx={{ pb: 2 }}>
        <Grid item xs={5.5}>
            <Stack spacing={3} alignItems='center'>
                <SummaryView type='PRO' text='Here' claim={claim} />
                <Typography variant='h6'>
                    Top Supporting Reasons
                </Typography>
                <TopClaimsView topRelation={1} claim={claim} />
            </Stack>
        </Grid>
        <Grid item xs={1}>
            <Divider orientation="vertical" light={true} variant='middle'>
                <Stack>
                    <Typography variant='caption'>
                        Supports <br /> VS <br /> Concerns
                    </Typography>
                    <PValueInformation />
                </Stack>
            </Divider>
        </Grid>
        <Grid item xs={5.5}>
            <Stack spacing={3} alignItems='center'>
                <SummaryView type='CON' text='Here' claim={claim} />
                <Typography variant='h6'>
                    Top Concerns
                </Typography>
                <TopClaimsView topRelation={-1} claim={claim} />
            </Stack>
        </Grid>
    </Grid>

}