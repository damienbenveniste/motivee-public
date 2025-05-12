import { Outlet } from 'react-router-dom'
// @mui
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

import { HEADER } from 'components/header/constants'
import MainHeader from 'components/header/MainHeader'
import ErrorBoundary from 'components/errors/ErrorBoundary'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import URL from 'route/url'


const MainStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  // paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  minHeight: 0,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    // paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: '100%',
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    })
  },
}))

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here 
  // is better than directly setting `value + 1`
}


export default function DashboardLayout() {

  const { customerId } = useParams()

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
        height: '100%',
        overflow: 'auto'
      }}
    >
      <MainHeader />

      <MainStyle >
        <ErrorBoundary>
          <Outlet key={customerId} />
        </ErrorBoundary>
      </MainStyle>
    </Box>
  )
}