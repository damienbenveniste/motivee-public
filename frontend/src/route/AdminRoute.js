import { Navigate, useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import useIsAdmin from 'hooks/useIsAdmin'
import URL from 'route/url'



export default function AdminRoute({ children }) {
    const [isAdmin, isLoading] = useIsAdmin()
    const {customerId} = useParams()

    if (isLoading) {
        return <CircularProgress />
    } else if (!isAdmin) {
        return <Navigate to={URL.conversation(customerId)} replace />
    } 

    return children
}