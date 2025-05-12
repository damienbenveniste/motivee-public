
import {
    Drawer,
    Stack,
    Typography,
    Box,
    Switch,
    Divider,
    CircularProgress
} from "@mui/material"
import { Icon } from '@iconify/react'
import Label from 'components/pricing/Label'
import { styled } from '@mui/material/styles'


const RootStyle = styled('div')(({ theme }) => ({
    padding: theme.spacing(5),
    backgroundColor: theme.palette.background.neutral,
    borderRadius: Number(theme.shape.borderRadius) * 2,
}));

function Iconify({ icon, sx, ...other }) {
    return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}


export default function PaymentSummary({
    yearly,
    setYearly,
    price,
    memberNumber,
    total,
    loading,
}) {


    const size = 20
    const monthNumber = yearly ? 12 : 1
    const pricePerUser = loading ? <CircularProgress size={size} /> : Math.round(price / monthNumber)
    const billedText = yearly ? 'Yearly' : 'Monthly'
    const subText = yearly ? 'yr' : 'mo'
    const saveAmount = yearly ? Math.round(8 * monthNumber * memberNumber - total) : null
// 
    const handleChange = event => setYearly(event.target.checked)

    return <Drawer
        variant="permanent"
        open={true}
        anchor='right'
        PaperProps={{
            sx: {
                width: '25%',
                borderRightStyle: 'dashed',
                padding: 5
            },
        }}
        sx={{
            width: '25%',
            flexShrink: 0,
        }}
        ModalProps={{
            keepMounted: true, // Better open performance on mobile.
        }}
    >
        <RootStyle>
            <Stack spacing={3}>
                <Typography variant="h5" sx={{ mb: 5 }}>
                    Summary
                </Typography>

                <Stack spacing={2.5} alignItems="space-between">
                    <Stack direction="row" justifyContent="space-between" alignItems='center'>
                        <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
                            Subscription
                        </Typography>
                        <Label color="error" variant="filled">
                            TEAM
                        </Label>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems='center'>
                        <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Billed {billedText}
                        </Typography>
                        <Switch
                            onChange={handleChange}
                            checked={yearly} />
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems='center'>
                        <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Monthly Fees
                        </Typography>
                        <Typography variant="subtitle1">
                            ${pricePerUser}
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems='center'>
                        <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
                            Workspace Users
                        </Typography>
                        <Typography variant="subtitle1">
                            {memberNumber} Members
                        </Typography>
                    </Stack>

                    <Stack alignItems="flex-end">
                        <Stack direction="row" justifyContent="flex-end">
                            <Typography sx={{ color: 'text.secondary' }}>$</Typography>
                            <Typography variant="h2" sx={{ mx: 1 }}>
                                {Math.round(total)}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}>
                                /{subText}
                            </Typography>
                        </Stack>
                        {saveAmount && <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                            }}
                        >
                            You save ${saveAmount}
                        </Typography>}
                    </Stack>


                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" component="p">
                            Total Billed
                        </Typography>
                        <Typography variant="h6" component="p">
                            ${Math.round(total)}
                        </Typography>
                    </Stack>

                    <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
                </Stack>

                <Stack alignItems="center" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Iconify icon={'eva:shield-fill'} sx={{ width: 20, height: 20, color: 'primary.main' }} />
                        <Typography variant="subtitle2">Secure credit card payment</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        This is a secure 128-bit SSL encrypted payment
                    </Typography>
                </Stack>
            </Stack>
        </RootStyle>
    </Drawer>
}