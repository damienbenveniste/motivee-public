import BaseAPI from 'api/baseAPI'
import axios from 'axios'


export class EmailAPI {

    static sendEmail({
        type,
        email,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        if (type === 'signin') {
            window.localStorage.setItem('emailForSignIn', email)
        }
        const fullPath = BaseAPI.getBaseAPI() + 'login/email/'
        axios.post(fullPath, { type, email }).then(onSuccess, onFailure)
    }
}