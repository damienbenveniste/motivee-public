import { styled, alpha } from '@mui/material/styles'
import {
    Box,
    Stack,
    AppBar,
    Toolbar,
    Tabs,
    Tab
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'

import { HEADER } from './constants'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SubjectIcon from '@mui/icons-material/Subject';
import useIsAdmin from 'hooks/useIsAdmin'
import WorkSpaceSelect from 'components/workspace/WorspaceSelect'
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
    height: HEADER.MOBILE_HEIGHT,
    // zIndex: theme.zIndex.appBar + 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'height'], {
        duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('lg')]: {
        height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
        width: '100%',
    },
}))


export default function ConversationHeader({ value, setValue }) {

    const navigate = useNavigate()
    const { conversationId, customerId } = useParams()
    const [isAdmin, isLoading] = useIsAdmin()

    const handleChange = (event, newValue) => {
        setValue(newValue)
        switch (newValue) {
            case 0:
                navigate(URL.conversation(customerId))
                break
            case 1:
                navigate(URL.feed(customerId))
                break
            case 2:
                navigate(URL.conversation(customerId, conversationId))
                break
            case 3:
                navigate(URL.insightOverview(customerId, conversationId))
                break
            default:
                setValue(false)
        }
    }

    return (
        <RootStyle >
            <Toolbar
                sx={{
                    minHeight: '100% !important',
                    px: { lg: 5 },
                }}
            >
                <WorkSpaceSelect />
                <Box sx={{ flexGrow: 1 }} />
                <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
                    <Tab icon={<HomeRoundedIcon />} label='Home' />
                    <Tab icon={<SubjectIcon />} label='Feed' />
                    <Tab icon={<RemoveRedEyeIcon />} label='Conversation' />
                    {isAdmin && <Tab icon={<AnalyticsIcon />} label='Insight' />}
                </Tabs>
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                    <HowToButton />
                    <AccountMenu />
                </Stack>
            </Toolbar>
        </RootStyle>
    )
}