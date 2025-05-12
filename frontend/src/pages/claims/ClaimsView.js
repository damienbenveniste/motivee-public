import React, { useState, useEffect } from 'react'
import {
    useParams,
    useOutletContext,
    useNavigate
} from "react-router-dom";
import {
    Stack,
    Box,
    CircularProgress,
    Grid
} from '@mui/material'
import { ClaimAPI } from 'api/claims'
import ClaimsTraverseView from 'pages/claims/claim-tree/ClaimsTraverseView'
import ConversationSurveyForm from 'components/conversations/ConversationSurveyForm'
import SimpleWheelView from 'pages/wheelView/SimpleWheelView'
import URL from 'route/url'
import useUser from 'hooks/useUser'
import DeleteConversationButton from 'components/views/buttons/DeleteConversationButton'
import EditConversationButton from 'components/views/buttons/EditConversationButton'
import LatestClaimsView from './claim-tree/LatestClaimsView'
import ReactedClaimsView from './claim-tree/ReactedClaimsView'
import RankingView from './claim-tree/RankingView'
import SocketConnection from 'api/webSocketConnection'


export class ClaimsView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            claims: [],
            currentConversation: null,
            claimsLoading: false,
            claimDict: {},
            parentDict: {},
            canDelete: false,
        }

        this.modifyClaim = this.modifyClaim.bind(this)
        this.addClaim = this.addClaim.bind(this)
        this.deleteClaim = this.deleteClaim.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.onMessageSent = this.onMessageSent.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.setCanDelete = this.setCanDelete.bind(this)

        this.wsConnection = new SocketConnection()
        this.wsConnection.setMessageReceivedCallback(this.onMessageReceived)
    }

    componentDidMount() {
        const { conversationId, conversation, customerId } = this.props
        this.wsConnection.connect('conversation', conversationId)
        this.setState({ claimsLoading: true })
        ClaimAPI.getTreeClaims({
            conversationId: conversationId,
            customerId,
            onSuccess: (res) => {
                this.setState({
                    claims: res.data.results,
                    claimsLoading: false
                })
            },
            onFailure: (res) => {
                this.setState({ claimsLoading: false })
            }
        })
        if (conversation) {
            this.setState({ currentConversation: conversation })
        }
    }

    componentWillUnmount() {
        this.wsConnection.close()
    }

    componentDidUpdate(prevProps, prevState) {
        const { conversation, user } = this.props
        const { currentConversation, claims } = this.state

        if (prevState.currentConversation !== currentConversation || prevProps.user !== user) {
            this.setCanDelete()
        }
        if (prevProps.conversation !== conversation) {
            if (conversation) {
                this.setState({ currentConversation: conversation })
            }
        }
        if (prevState.claims !== claims && claims.length !== 0) {
            const newClaimsDict = {}
            const newParentDict = {}
            const dfs = (claims, parent) => {

                for (let claim of claims) {
                    newClaimsDict[claim.id] = claim
                    newParentDict[claim.id] = parent
                    dfs(claim.children, claim)
                }
            }
            dfs(claims, null)
            this.setState({
                claimDict: newClaimsDict,
                parentDict: newParentDict
            })
        }
    }

    setCanDelete() {
        const { currentConversation } = this.state
        const { user } = this.props
        if (!currentConversation || !user) return

        const claim_number = currentConversation?.claim_number
        const votes = currentConversation?.votes
        const author = currentConversation?.author
        if (claim_number === 0 && votes === 0 && author === user.id) {
            this.setState({ canDelete: true })
        } else {
            this.setState({ canDelete: false })
        }
    }

    modifyClaim(modifiedClaim) {
        const newClaims = [...this.state.claims]

        const dfs = (rootClaims) => {
            const index = rootClaims.map(cl => cl.id).indexOf(modifiedClaim.id)
            if (index !== -1) {
                rootClaims[index] = modifiedClaim
                return
            }

            for (let cl of rootClaims) {
                dfs(cl.children)
            }
        }

        dfs(newClaims)
        this.setState({ claims: newClaims })
    }

    addClaim(newClaim, parent) {

        const newCurrentConversation = {
            ...this.state.currentConversation,
            claim_number: this.state.currentConversation?.claim_number + 1
        }

        const newClaims = [...this.state.claims]
        if (!parent) {
            newClaims.unshift(newClaim)
            this.setState({
                claims: newClaims,
                currentConversation: newCurrentConversation
            })
            return
        }

        const dfs = (rootClaims) => {
            for (var i = 0; i < rootClaims.length; i++) {
                if (rootClaims[i].id === parent.id) {
                    rootClaims[i].children.unshift(newClaim)
                    return
                } else {
                    dfs(rootClaims[i].children)
                }
            }
        }

        dfs(newClaims)
        this.setState({
            claims: newClaims,
            currentConversation: newCurrentConversation
        })
    }

    deleteClaim(claim) {
        const newClaims = [...this.state.claims]

        const dfs = (rootClaims) => {
            const index = rootClaims.map(cl => cl.id).indexOf(claim.id)
            if (index !== -1) {
                rootClaims.splice(index, 1)
                return
            }

            for (let cl of rootClaims) {
                dfs(cl.children)
            }
        }

        dfs(newClaims)
        const newCurrentConversation = {
            ...this.state.currentConversation,
            claim_number: this.state.currentConversation?.claim_number - 1
        }
        console.log('delete')
        this.setState({
            claims: newClaims,
            currentConversation: newCurrentConversation
        })

        const { navigate, conversationId, customerId } = this.props

        if (this.state.parentDict[claim.id]) {
            navigate(
                URL.conversation(
                    customerId,
                    conversationId,
                    this.state.parentDict[claim.id].id
                )
            )
        } else {
            navigate(URL.conversation(customerId, conversationId))
        }
    }

    onMessageReceived(bundle) {
        const [type, data] = bundle
        console.log(type, data)
        switch (type) {
            case 'CREATE':
                const [newClaim, parent] = data
                this.addClaim(newClaim, parent)
                break
            case 'UPDATE':
                const [modifiedClaim] = data
                this.modifyClaim(modifiedClaim)
                break
            case 'DELETE':
                const [claim] = data
                this.deleteClaim(claim)
                break
        }
    }

    onMessageSent(type, data) {
        const bundle = [type, data]
        this.wsConnection.sendMessage(bundle)
    }

    onClick(topClaim) {
        const { navigate, conversationId, customerId  } = this.props
        if (topClaim) {
            navigate(URL.conversation(customerId, conversationId, topClaim.id))
        } else {
            navigate(URL.conversation(customerId, conversationId))
        }
    }

    onDelete() {
        const { navigate, customerId  } = this.props
        navigate(URL.conversation(customerId))
    }

    onEdit(newConversation) {
        this.setState({ currentConversation: newConversation })
    }

    render() {

        const {
            currentConversation,
            claims,
            claimDict,
            parentDict,
            claimsLoading,
            canDelete
        } = this.state
        const { conversation, user } = this.props

        return <Grid container spacing={1} sx={{ flex: 1, height: '100%' }}>
            <Grid item xs={3} sx={{ height: '100%' }}>
                <Stack spacing={2} alignItems='center' sx={{
                    overflow: 'auto',
                    display: { lg: 'flex' },
                    height: '100%',
                    minHeight: { lg: 1 }
                }}>
                    <SimpleWheelView
                        onClick={this.onClick}
                        conversation={currentConversation}
                        data={claims}
                    />
                    {canDelete && <Stack direction='row' spacing={1} sx={{ display: 'flex' }}>
                        <DeleteConversationButton
                            sx={{ flex: 1 }}
                            onDelete={this.onDelete}
                            conversation={currentConversation}
                            iconButton={false} />
                        <EditConversationButton
                            sx={{ flex: 1 }}
                            conversation={currentConversation}
                            onEdit={this.onEdit} />
                    </Stack>}
                    {conversation && !conversation?.open_ended && <ConversationSurveyForm
                        conversation={currentConversation}
                        onVote={this.onEdit} />}
                </Stack>
            </Grid>
            <Grid item xs={6} sx={{ height: '100%' }}>
                <Stack spacing={1} sx={{ height: '100%' }}>
                    <Box sx={{ overflow: 'auto', height: '85%' }}>
                        {claimsLoading ? <CircularProgress /> : <ClaimsTraverseView
                            claimDict={claimDict}
                            parentDict={parentDict}
                            onMessageSent={this.onMessageSent}
                            conversation={currentConversation}
                            claims={claims}
                        />}
                    </Box>
                    <RankingView
                        sx={{ height: '15%', borderRadius: 5, width: '100%' }}
                        claims={Object.values(claimDict)}
                        user={user} />
                </Stack>
            </Grid>
            <Grid item xs={3} sx={{ height: '100%' }}>
                <Stack
                    spacing={2}
                    sx={{ height: '100%' }}>
                    <LatestClaimsView
                        claims={Object.values(claimDict)}
                        parentDict={parentDict}
                        conversation={conversation}
                        onClick={this.onClick} />
                    <ReactedClaimsView
                        claims={Object.values(claimDict)}
                        parentDict={parentDict}
                        conversation={conversation}
                        user={user}
                        onClick={this.onClick} />
                </Stack>
            </Grid>
        </Grid>

    }
}


export default function ClaimsViewContext() {
    const { conversation } = useOutletContext()
    const [user, isLoading] = useUser()
    const { conversationId, customerId } = useParams()
    const navigate = useNavigate()

    return <ClaimsView
        conversation={conversation}
        conversationId={conversationId}
        customerId={customerId}
        user={user}
        navigate={navigate} />
}