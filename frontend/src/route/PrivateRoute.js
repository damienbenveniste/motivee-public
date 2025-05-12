
import { Navigate, useParams } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import CircularProgress from '@mui/material/CircularProgress'
import { categoriesMissing } from 'route/GuestRoute'
import useUser from 'hooks/useUser'
import URL from 'route/url'


export default function PrivateRoute({ children }) {
  const [user, loading, error] = useAuthState(Auth.getAuth())
  const [fullUser, isLoading] = useUser()
  const { customerId } = useParams()

  const newCustomerId = customerId ? customerId : fullUser?.customers[0]?.id

  if (loading || isLoading) {
    return <CircularProgress />
  } else if (!user) {
    return <Navigate to={URL.LOGIN} replace />
  } else if (user && !user.emailVerified) {
    return <Navigate to={URL.VERIFY_EMAIL} replace />
  } else if (categoriesMissing(fullUser, newCustomerId)) {
    return <Navigate to={URL.questionnaire(newCustomerId)} replace />
  }
  return children
}


