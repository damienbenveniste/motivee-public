
import {useEffect, useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import { UserAPI } from 'api/users'
import { useParams } from 'react-router-dom'


export default function useIsAdmin() {
    const [user, loading, error] = useAuthState(Auth.getAuth())
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const {customerId} = useParams()

    useEffect(() => {
        if (!user && loading) return
        if (!user && !loading) {
            setIsLoading(false)
            return
        }
        UserAPI.getUser({
            username: user.uid,
            customerId,
            onSuccess: res => {
                setIsAdmin(res.data?.is_admin)
                setIsLoading(false)
            },
            onFailure: () => setIsLoading(false)
        })
    }, [user, loading, customerId])

    return [isAdmin, isLoading]

}

