import BaseClaimView from 'components/conversations/BaseClaimView'
import { Stack, Grid } from '@mui/material'
import AddClaimView from 'pages/claims/claim-tree/AddClaimView'


export default function BinaryView({
    proClaims,
    conClaims,
    onDescentClick,
    ...restProps
}) {

    return <Grid container spacing={1}>
        <Grid item xs={6}>
            <Stack spacing={1} >
                <AddClaimView type='PRO' {...restProps} />

                {proClaims.map(claim => {
                    return <BaseClaimView
                        key={claim.id}
                        claim={claim}
                        onClick={() => onDescentClick(claim)}
                        {...restProps} />
                })}
            </Stack>
        </Grid>
        <Grid item xs={6}>
            <Stack spacing={1} >
                <AddClaimView type='CON' {...restProps} />
                {conClaims.map(claim => {
                    return <BaseClaimView
                        key={claim.id}
                        onClick={() => onDescentClick(claim)}
                        claim={claim}
                        {...restProps} />
                })}
            </Stack>
        </Grid>
    </Grid>
}