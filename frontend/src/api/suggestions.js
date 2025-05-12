import BaseAPI from 'api/baseAPI'


export class SuggestionAPI {

    static createSuggestion({
        content,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'create',
            path: 'login/suggestions/',
            object: { content },
            customerId,
            onSuccess,
            onFailure
        })

    }

}