import BaseAPI from 'api/baseAPI'



export class UserAPI {

    static getUser({
        username,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `login/users/${username}/`,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static updateUserCategories({
        username,
        categories,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'patch',
            path: `login/users/${username}/`,
            object: { categories },
            customerId,
            onSuccess,
            onFailure
        })
    }

}