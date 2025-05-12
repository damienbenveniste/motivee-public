import BaseAPI from 'api/baseAPI'

export class SummaryAPI {

    static getSummary({
        conversationId,
        claimId,
        tag,
        type,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const params = {conversation: conversationId, claim: claimId, tag, type}

        BaseAPI.call({
            type: 'get', 
            path: 'scheduling/summaries', 
            object: params,
            customerId,
            onSuccess,
            onFailure
        })
    }
}