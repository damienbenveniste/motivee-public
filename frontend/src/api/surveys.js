
import BaseAPI from 'api/baseAPI'

export class SurveyAPI {

    static getConversationSurvey({
        surveyId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `surveys/conversation-surveys/${surveyId}`,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getConversationSurveyVoteCounts({
        surveyId,
        params,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `stats/conversation-surveys/${surveyId}`,
            object: params,
            customerId,
            onSuccess,
            onFailure
        })
    }

}
