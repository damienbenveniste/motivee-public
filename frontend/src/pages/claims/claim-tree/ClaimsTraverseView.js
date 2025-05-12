
import { useState, useEffect } from 'react'
import { Stack, IconButton, Slide } from '@mui/material'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import TopClaimView from 'pages/claims/claim-tree/TopClaimView'
import MultipleClaimsView from 'pages/claims/claim-tree/MultipleClaimsView'
import { useParams, useNavigate } from 'react-router-dom'
import useUser from 'hooks/useUser'
import URL from 'route/url'


const slideTime = 250


export default function ClaimsTraverseView({
    conversation,
    claims,
    claimDict,
    parentDict,
    ...restProps
}) {

    const [curentClaims, setCurrentClaims] = useState([])
    const [currentTopClaim, setCurrentTopClaim] = useState(null)
    const [openEnded, setOpenEnded] = useState(false)
    const [randomKey, setRandomKey] = useState(Math.random())
    const [direction, setDirection] = useState('up')
    const [slideIn, setSlideIn] = useState(true)
    const [user, loading] = useUser()
    const { conversationId, claimId, customerId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!conversation) return
        if (!(claimId in claimDict)) {
            setCurrentTopClaim(null)
            setCurrentClaims(claims)
            setOpenEnded(conversation.open_ended)
        } else {
            setCurrentTopClaim(claimDict[claimId])
            setCurrentClaims(claimDict[claimId].children)
            setOpenEnded(false)
        }
    }, [claimId, claimDict, conversation, claims])

    const slideUp = () => {
        setDirection('down')
        setSlideIn(false)
        setTimeout(() => {
            setRandomKey(Math.random())
            setDirection('up')
            setSlideIn(true)
        }, slideTime / 2)
    }
    
    const slideDown = () => {
        setDirection('up')
        setSlideIn(false)
        setTimeout(() => {
            setRandomKey(Math.random())
            setDirection('down')
            setSlideIn(true)
        }, slideTime / 2)
    }

    const onDescentClick = (claim) => {
        slideUp()
        navigate(URL.conversation(customerId, conversationId,  claim.id))
        setOpenEnded(false)
    }

    const onAscentClick = () => {
        if (!currentTopClaim) return
        slideDown()
        if (parentDict[currentTopClaim.id]) {
            navigate(URL.conversation(customerId, conversationId, parentDict[currentTopClaim.id].id))
        } else {
            navigate(URL.conversation(customerId, conversationId))
        }
    }

    return <Slide
        key={randomKey}
        direction={direction}
        in={slideIn}
        mountOnEnter
        timeout={slideTime}
        unmountOnExit>
        <Stack spacing={1} alignItems='center'>
            {currentTopClaim && <IconButton
                onClick={onAscentClick}
                color='primary'
                disabled={!Boolean(currentTopClaim)}>
                <ArrowCircleUpIcon sx={{ fontSize: 40 }} />
            </IconButton>}
            {currentTopClaim && <TopClaimView
                {...restProps}
                conversation={conversation}
                user={user}
                claim={currentTopClaim} />}
            <MultipleClaimsView
                {...restProps}
                claims={curentClaims}
                user={user}
                onDescentClick={onDescentClick}
                conversation={conversation}
                topClaim={currentTopClaim}
                openEnded={openEnded} />
        </Stack >
    </Slide>
}