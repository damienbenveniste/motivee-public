import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Button, Typography, Box, Stack, Link } from '@mui/material'
import { Icon } from '@iconify/react'
import BusinessButton from 'components/pricing/BusinessButton'
import TeamButton from 'components/pricing/TeamButton'
import Label from 'components/pricing/Label';


function Iconify({ icon, sx, ...other }) {
    return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}

const RootStyle = styled(Card)(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 30,
    padding: theme.spacing(3),
    [theme.breakpoints.up(414)]: {
        padding: theme.spacing(5),
    },
}));

// ----------------------------------------------------------------------

PricingPlanCard.propTypes = {
    index: PropTypes.number,
    card: PropTypes.object,
}


export default function PricingPlanCard({ card, index, elevation, currentPlanIndex }) {
    const { subscription, icon, price, captions, lists, labelAction, description } = card

    const currentPlan = currentPlanIndex === index
    const currentElevation = currentPlan ? 10 : elevation

    var actionButton = null
    switch (index) {
        case 0:
            actionButton = null
            break
        case 1:
            actionButton = <TeamButton
                currentPlan={currentPlan}
                fullWidth
                size="large"
                variant="contained"
                sx={{ borderRadius: 5 }} />
            break
        case 2:
            actionButton = <BusinessButton
                fullWidth
                size="large"
                variant="contained"
                sx={{ borderRadius: 5 }} />
    }

    return (
        <RootStyle
            elevation={currentElevation}
            sx={currentPlan && { border: `3px solid #76FF00` }}>
            <Stack
                alignItems='center'
                justifyContent="space-between"
                sx={{ height: '100%' }}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {subscription}
                </Typography>
                {currentPlan && (
                    <Label
                        color="info"
                        sx={{
                            top: 16,
                            right: 16,
                            position: 'absolute',
                        }}
                    >
                        CURRENT PLAN
                    </Label>
                )}

                {price === null ? (
                    <Link
                        href='https://calendly.com/motivee-info/intro-call'
                        target="_blank"
                        underline="hover"
                        rel="noopener noreferrer">
                        < Typography variant='h4'>
                            Contact Us
                        </Typography>
                    </Link>
                ) : (<Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
                    {index === 1 || index === 2 ? (
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                            $
                        </Typography>
                    ) : (
                        ''
                    )}
                    <Typography variant="h2" sx={{ mx: 1 }}>
                        {price === 0 ? 'Free' : price}
                    </Typography>
                    {index === 1 || index === 2 ? (
                        <Typography
                            gutterBottom
                            component="span"
                            variant="subtitle2"
                            sx={{
                                alignSelf: 'flex-end',
                                color: 'text.secondary',
                            }}
                        >
                            /mo
                        </Typography>
                    ) : (
                        ''
                    )}
                </Box>)}

                {captions.map(caption => <Typography
                    variant="caption"
                    key={caption}
                    sx={{
                        color: 'primary.main',
                    }}
                >
                    {caption}
                </Typography>)}

                <Box sx={{ height: 80, mt: 3 }}>{icon}</Box>

                <Typography align='center'>
                    {description}
                </Typography>

                <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
                    {lists.map((item) => (
                        <Stack
                            key={item.text}
                            component="li"
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ typography: 'body2', color: item.isAvailable ? 'text.primary' : 'text.disabled' }}
                        >
                            <Iconify icon={'eva:checkmark-fill'} sx={{ width: 20, height: 20 }} />
                            <Typography variant="body2">{item.text}</Typography>
                        </Stack>
                    ))}
                </Stack>

                {actionButton}
            </Stack>
        </RootStyle>
    );
}
