import BaseAPI from 'api/baseAPI'

export class TagAPI {

    static getTags({
        page,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `conversations/tags/?page=${page}`,
            customerId,
            onSuccess,
            onFailure
        })

    }

}