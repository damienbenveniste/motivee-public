
import { useSearchParams, useNavigate } from "react-router-dom"
import { Auth } from "components/login/firebaseAuth"
import URL from "route/url"

export default function HandleVerifyEmailView() {

    const [searchParams, setSearchParams] = useSearchParams()
    const actionCode = searchParams.get('oobCode')
    const mode = searchParams.get('mode')
    const navigate = useNavigate()

    switch (mode) {
        case 'verifyEmail':
            Auth.handleVerifyEmail({
                actionCode,
                onSuccess: () => {
                    navigate(URL.VERIFY_EMAIL, { replace: true })
                },
                onFailure: () => {
                    navigate(URL.VERIFY_EMAIL, { replace: true })
                }
            })
            break
        case 'signIn':
            Auth.signInWithEmailLink({
                onSuccess: () => navigate(URL.LOGIN, { replace: true }),
                onFailure: () => navigate(URL.LOGIN, { replace: true })
            })
            break
        case 'resetPassword':
            Auth.verifyPasswordResetCode({
                actionCode,
                // todo send to the right URL
                onSuccess: () => navigate(URL.RESET_PASSWORD, { state: { actionCode } }),
                onFailure: () => navigate(URL.LOGIN)
            })
            break
        default:
            navigate(URL.LOGIN, { replace: true })
    }

    return null

}