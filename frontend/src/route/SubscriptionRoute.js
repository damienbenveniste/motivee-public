import { Navigate, useParams, useLocation, useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import useIsAdmin from 'hooks/useIsAdmin'
import useShouldUpgrade from 'hooks/useShouldUpgrade'
import URL from 'route/url'


export default function SubscriptionRoute({ children }) {
    const [isAdmin, adminLoading] = useIsAdmin()
    const [shouldUpgrade, upgradeLoading] = useShouldUpgrade()
    const { customerId } = useParams()
    let location = useLocation()

    const whitelistPaths = [
        URL.billingAdmin(customerId),
        URL.workspaceAdmin(customerId),
        URL.payment(customerId)
    ]

    if (whitelistPaths.includes(location.pathname)) {
        return children
    }

    var toPath = null

    if (adminLoading || upgradeLoading) {
        return children
    } else if (shouldUpgrade && isAdmin) {
        toPath = URL.billingAdmin(customerId)
    } else if (shouldUpgrade && !isAdmin) {
        toPath = URL.upgrade(customerId)
    }

    if (toPath && location.pathname !== toPath) {
        return <Navigate to={toPath} state={{ upgrade: true }} replace={true}/>
    }

    return children
}