import axios from 'axios'
import { Auth } from 'components/login/firebaseAuth'


const defaultErrorMessage = 'Oops something went wrong!'


export default class BaseAPI {

    static getBaseAPI() {

        switch (window.location.hostname) {
            case 'insight.getmotivee.com':
                return 'https://api.insight.getmotivee.com/'
            case 'staging.insight.getmotivee.com':
                return 'https://api.staging.insight.getmotivee.com/'
            case 'localhost':
                return 'http://localhost:8000/'
        }
    }

    static getBaseWSAPI() {
        switch (window.location.hostname) {
            case 'insight.getmotivee.com':
                return 'wss://api.insight.getmotivee.com'
            case 'staging.insight.getmotivee.com':
                return 'wss://api.staging.insight.getmotivee.com'
            case 'localhost':
                return 'ws://127.0.0.1:8000'
        }
    }

    static call({
        type,
        path,
        object = null,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const fullPath = BaseAPI.getBaseAPI() + path

        switch (type) {
            case 'create':
                Auth.AuthAPICall(token => {
                    axios.post(fullPath,
                        object,
                        {
                            headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                        }
                    ).then(
                        onSuccess,
                        (err) => onFailure(defaultErrorMessage)
                    )
                })
                break
            case 'get':
                Auth.AuthAPICall(token => {
                    const params = object ? {
                        headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                        params: object,
                    } : {
                        headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                    }
                    axios.get(fullPath, params).then(onSuccess, onFailure)
                })
                break
            case 'put':
                Auth.AuthAPICall(token => {
                    axios.put(fullPath, object,
                        {
                            headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                        }
                    ).then(onSuccess, onFailure)
                })
                break
            case 'patch':

                const obj = object ? (
                    Object.fromEntries(Object.entries(object).filter(([_, v]) => v !== null))
                ) : null

                Auth.AuthAPICall(token => {
                    axios.patch(fullPath, obj,
                        {
                            headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                        }
                    ).then(onSuccess, onFailure)
                })
                break
            case 'delete':
                Auth.AuthAPICall(token => {
                    axios.delete(fullPath,
                        {
                            headers: { 'Authorization': `Bearer ${token} ${customerId}` },
                        }
                    ).then(onSuccess, onFailure)
                })
                break
            default:
                throw new TypeError('Wrong call api type')

        }

    }
}