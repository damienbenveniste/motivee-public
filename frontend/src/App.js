import { BrowserRouter } from 'react-router-dom'
import {
  CssBaseline,
  Container,
  Box
} from '@mui/material'

import Router from 'route/Router'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ErrorBoundary from 'components/errors/ErrorBoundary'
import SuggestionButton from 'components/views/SuggestionButton'


const corlorTheme = createTheme({
  palette: {
    primary: {
      main: '#0096fe'
    }
  }
})

// background: '#f8f8f8'


function App() {

  return (
    <ThemeProvider theme={corlorTheme}>
      <BrowserRouter>
        <CssBaseline />
        <Box sx={{ height: "100vh", background: '#f7fcfc', overflow: 'hidden' }}>
          <Container sx={{ height: "100%" }} maxWidth={false} disableGutters={true}>
            <Router />
            <SuggestionButton />
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider >
  )
}

export default App;
