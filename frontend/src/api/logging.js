import axios from 'axios'
import BaseAPI from './baseAPI'


export class LoggingAPI {
    static sendLogs({error, errorInfo}) {
        const fullPath = BaseAPI.getBaseAPI() + 'react-logging/'
        var bodyFormData = new FormData()
        bodyFormData.append('error', error)
        bodyFormData.append('error_info', errorInfo)
        axios.post(
            fullPath, 
            bodyFormData,
            {headers: {
                'content-type': 'multipart/form-data'
            }}
        )
    }
}