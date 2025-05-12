import BaseClaimView from 'components/conversations/BaseClaimView'
import { Stack } from '@mui/material'
import AddClaimView from 'pages/claims/claim-tree/AddClaimView'


export default function UnaryView({
    claims,
    onDescentClick,
    ...restProps
}) {

    return <Stack spacing={1} sx={{ width: '100%' }}>
        <AddClaimView type='ANS' {...restProps} />
        {claims.map(claim => {
            return <BaseClaimView
                key={claim.id}
                onClick={() => onDescentClick(claim)}
                claim={claim}
                {...restProps} />
        })}
    </Stack>
}