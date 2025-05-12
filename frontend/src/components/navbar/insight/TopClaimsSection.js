import {
  List,
  Box,
  ListItemText,
} from '@mui/material'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import URL from 'route/url'
import {
  ListSubheaderStyle,
  ListItemStyle,
  DotIcon,
  getActive
} from './base'


export default function TopClaimsSection({ conversation, ...other }) {

  const { pathname } = useLocation()
  const {customerId} = useParams()
  const overallPath = URL.insightTopClaim(customerId, conversation?.id)

  return (
    <Box {...other}>
      <List disablePadding sx={{ px: 2 }}>
        <ListSubheaderStyle>
          Top Claims
        </ListSubheaderStyle>
        <ListItemStyle 
        component={NavLink} 
        to={overallPath} 
        activeRoot={getActive(overallPath, pathname)} >
            <DotIcon />
            <ListItemText primary='Overall' disableTypography />
        </ListItemStyle>
        {conversation?.tags.map((tag) => {

          const path = URL.insightTopClaim(customerId, conversation?.id, tag)
          const active = getActive(path, pathname)

          return <ListItemStyle key={tag} component={NavLink} to={path} activeRoot={active} >
            <DotIcon />
            <ListItemText primary={tag} disableTypography />
          </ListItemStyle>
        })}

      </List>
    </Box>
  )
}