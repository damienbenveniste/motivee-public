import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';


const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function NavBar() {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(true )
    }, [])
    
    return <Drawer
        PaperProps={{
            sx: {
                width: drawerWidth,
                borderRightStyle: 'dashed',
            },
        }}
        sx={{
            boxSizing: 'border-box',
            overflowX: 'hidden',
            width: drawerWidth,
            flexShrink: 0,
        }}
        variant="persistent"
        anchor="left"
        open={open}
    >
        <DrawerHeader />
    </Drawer>
}