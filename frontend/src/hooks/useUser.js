import {useEffect, useState} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Auth } from 'components/login/firebaseAuth'
import { UserAPI } from 'api/users'
import { useParams } from 'react-router-dom'


export default function useUser() {
    const [user, loading, error] = useAuthState(Auth.getAuth())
    const [fullUser, setFullUser] = useState(null)
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
                setFullUser(res.data)
                setIsLoading(false)
            },
            onFailure: (err) => {
                setIsLoading(false)
            }
        })
    }, [user, loading, customerId])

    return [fullUser, isLoading]

}


