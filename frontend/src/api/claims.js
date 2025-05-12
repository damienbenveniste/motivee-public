import BaseAPI from 'api/baseAPI'

export class ClaimAPI {

    static createClaim({
        text,
        parent = null,
        conversationId,
        type,
        tags,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const claim = { text, parent, conversation: conversationId, tags, type }
        BaseAPI.call({
            type: 'create',
            path: 'conversations/claims/',
            object: claim,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static updateClaim({
        claim,
        text=null,
        tags=null,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const claimParams = { text, tags }
        BaseAPI.call({
            type: 'patch',
            path: `conversations/claims/${claim.id}/`,
            object: claimParams,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getTreeClaims({
        conversationId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: 'conversations/claims/',
            object: { conversationId },
            customerId,
            onSuccess,
            onFailure
        })
    }

    static deleteClaim({
        claim,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'delete',
            path: `conversations/claims/${claim.id}/`,
            object: null,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getTopClaims({
        conversationId,
        topRelation,
        tag,
        claimId,
        root = null,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        const object = {
            conversationId,
            topRelation,
            tag,
            claimId,
            root,
        }
        BaseAPI.call({
            type: 'get',
            path: 'conversations/top-claims/',
            object: object,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getFeedClaims({
        page,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `conversations/feed-claims/?page=${page}`,
            object: {},
            customerId,
            onSuccess,
            onFailure
        })

    }
}