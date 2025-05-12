
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import CircularProgress from '@mui/material/CircularProgress'
import useUser from 'hooks/useUser'
import URL from 'route/url'


export function categoriesMissing(user, customerId) {

  if (!user || !customerId) return false

  const customer = user.customers?.filter(c => c.id === customerId).pop()
  if (!customer) return false

  const customerCategories = customer.categories
  if (user && !customerCategories) return false

  const userCategories = user.customer_categories.filter(c => c.customer === customerId).pop()
  if (user && !userCategories) return true

  for (let key of Object.keys(customerCategories)) {
    if (!(key in userCategories)) return true
  }
  return false
}


export default function GuestRoute({ children }) {
  const [user, loading, error] = useAuthState(Auth.getAuth())
  const [fullUser, isLoading] = useUser()
  const { customerId } = useParams()
  const [newCustomerId, setNewCustomerId] = useState(customerId)
  let location = useLocation()

  useEffect(() => {
    if (!fullUser || newCustomerId || fullUser?.customers?.length === 0) return
    setNewCustomerId(fullUser.customers[0].id)
  }, [fullUser])

  var toPath = URL.LOGIN

  if (loading || isLoading) {
    return <CircularProgress />
  } else if (!user) {
    toPath = URL.LOGIN
  } else if (!user.emailVerified) {
    toPath = URL.VERIFY_EMAIL
  } else if (!fullUser || fullUser?.customers?.length === 0) {
    toPath = URL.WORKSPACE
  } else if (!newCustomerId) {
    return <CircularProgress />
  } else if (categoriesMissing(fullUser, newCustomerId)) {
    toPath =  URL.questionnaire(newCustomerId)
  } else if (user && user.emailVerified && !categoriesMissing(fullUser, newCustomerId)) {
    toPath = URL.conversation(newCustomerId)
  }
  if (location.pathname !== toPath) {
    return <Navigate to={toPath} replace />
  }
  return children
}