import BaseAPI from 'api/baseAPI'

export class VoteAPI {

    static createVote({
        claim,
        value,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const vote = { claim: claim.id,  value}
        BaseAPI.call({
            type: 'create', 
            path: 'conversations/votes/', 
            object: vote,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static deleteVote({
        vote,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'delete', 
            path: `conversations/votes/${vote.id}/`, 
            object: null,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static updateVote({
        vote,
        value,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        const newVote = { value }
        BaseAPI.call({
            type: 'patch', 
            path: `conversations/votes/${vote.id}/`, 
            object: newVote,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getVote({
        claim,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const vote = { claim: claim.id }
        BaseAPI.call({
            type: 'get', 
            path: `conversations/votes/`, 
            object: vote,
            customerId,
            onSuccess,
            onFailure
        })

    }
}