import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import CircularProgress from '@mui/material/CircularProgress'
import URL from 'route/url'

export default function ProfileOwnerRoute({ children }) {

    const [user, loading, error] = useAuthState(Auth.getAuth())
    const { profileId, customerId } = useParams()

    if (loading) {
        return <CircularProgress />
    } else if (user.uid !== profileId) {
        return <Navigate to={URL.conversation(customerId)} replace />
    } 
    return children

}