import BaseAPI from 'api/baseAPI'


export class ConversationSurveyVoteAPI {

    static createVote({
        survey,
        value,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const vote = { survey: survey.id,  value}
        BaseAPI.call({
            type: 'create', 
            path: 'surveys/conversation-survey-votes/', 
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
            path: `surveys/conversation-survey-votes/${vote.id}/`, 
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
            path: `surveys/conversation-survey-votes/${vote.id}/`, 
            object: newVote,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getVote({
        surveyId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const vote = { survey: surveyId }
        BaseAPI.call({
            type: 'get', 
            path: `surveys/conversation-survey-votes/`, 
            object: vote,
            customerId,
            onSuccess,
            onFailure
        })

    }
}