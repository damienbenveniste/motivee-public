import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import TopClaimsSection from 'components/navbar/insight/TopClaimsSection'
import OverviewSection from './OverviewSection';

const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function NavBar({ open, conversation }) {

    return <Drawer
        PaperProps={{
            sx: {
                width: drawerWidth,
                borderRightStyle: 'dashed',
                paddingTop: 2,
            },
        }}
        sx={{
            width: drawerWidth,
            flexShrink: 0,
        }}
        variant="persistent"
        anchor="left"
        open={open}
    >
        <DrawerHeader /> 
        <OverviewSection conversation={conversation}/>
        <TopClaimsSection conversation={conversation}/>
    </Drawer>
}