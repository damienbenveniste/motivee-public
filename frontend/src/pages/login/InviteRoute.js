import { useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import URL from "route/url"

export default function InviteRoute() {

    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!searchParams) return

        const emailInvitee = searchParams.get('email')
        const workspaceId = searchParams.get('workspace')

        if (emailInvitee && workspaceId) {
            window.localStorage.setItem('emailForInvitee', emailInvitee)
            window.localStorage.setItem('workspaceForInvitee', workspaceId)
        }
        navigate(URL.SIGNUP)

    }, [searchParams])

    return <CircularProgress />
}