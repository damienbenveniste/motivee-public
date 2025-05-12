import { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import { Box, Stack, AppBar, Toolbar, Tabs, Tab } from '@mui/material'
import { HEADER } from './constants'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SubjectIcon from '@mui/icons-material/Subject'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import WorkSpaceSelect from 'components/workspace/WorspaceSelect'
import URL from 'route/url'
import AccountMenu from 'components/menu/AccountMenu'
import HowToButton from './buttons/HowToButton'


function cssStyles(theme) {
    return {
        bgBlur: (props) => {
            const color = props?.color || theme?.palette.background.default || '#000000';

            const blur = props?.blur || 6;
            const opacity = props?.opacity || 0.8;

            return {
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`, // Fix on Mobile
                backgroundColor: alpha(color, opacity),
            };
        }
    }
}


const RootStyle = styled(AppBar)(({ theme }) => ({
    ...cssStyles(theme).bgBlur(),
    boxShadow: 'none',
    color: 'inherit',
    zIndex: theme.zIndex.drawer + 1,
    height: HEADER.MOBILE_HEIGHT,
    transition: theme.transitions.create(['width', 'height'], {
        duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('lg')]: {
        height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
        width: '100%',
    },
}))

function getInitValue() {
    const val = window.location.pathname.split('/')[1]
    if (val === 'conversations') return 0
    if (val === 'feed') return 1
    return false
}


export default function MainHeader() {

    const [value, setValue] = useState(getInitValue())
    const location = useLocation()
    const navigate = useNavigate()
    const { customerId } = useParams()

    useEffect(() => {
        if (location.pathname.includes('feed')) {
            setValue(1)
        } else if (location.pathname.includes('conversations')) {
            setValue(0)
        } else {
            setValue(false)
        }
    }, [location])


    const handleChange = (event, newValue) => {
        setValue(newValue)
        switch (newValue) {
            case 0:
                navigate(URL.conversation(customerId))
                break
            case 1:
                navigate(URL.feed(customerId))
                break
        }
    }
    return (
        <RootStyle>
            <Toolbar
                sx={{
                    minHeight: '100% !important',
                    px: { lg: 5 },
                }}
            >
                {/* <img src={logo} alt='landing' style={{  width: 200 }} /> */}
                <WorkSpaceSelect />
                <Box sx={{ flexGrow: 1 }} />
                <Tabs
                    value={value}
                    onChange={handleChange}
                    selectionFollowsFocus={true}
                    aria-label="icon label tabs example">
                    <Tab icon={<HomeRoundedIcon />} label='Home' />
                    <Tab icon={<SubjectIcon />} label='Feed' />
                </Tabs>
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                    <HowToButton/>
                    <AccountMenu />
                    {/* <LogoutButton />
                    <ProfileButton />
                    <AdminButton/> */}
                </Stack>
            </Toolbar>
        </RootStyle>
    )
}