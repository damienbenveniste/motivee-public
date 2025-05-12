import BaseAPI from './baseAPI'
import { Auth } from 'components/login/firebaseAuth'


export default class SocketConnection {

    NUMBER_OF_ATTEMPTS = 10

    constructor() {
        this.activeConnection = false
        this.ws = null
        this.messageReceivedCallback = null
        this.sendMessage = this.sendMessage.bind(this)
        this.connect = this.connect.bind(this)
        this.getURL = this.getURL.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.setMessageReceivedCallback = this.setMessageReceivedCallback.bind(this)
        this.waitForConnection = this.waitForConnection.bind(this)
        this.counter = 0
        this.baseUrl = null
        this.room = null
    }

    getURL(baseUrl, room, token) {
        const baseWSAPI = BaseAPI.getBaseWSAPI()
        return `${baseWSAPI}/ws/${baseUrl}/${room}/?token=${token}`
    }

    setMessageReceivedCallback(callback) {
        this.messageReceivedCallback = callback
    }

    connect(baseUrl, room) {
        this.baseUrl = baseUrl
        this.room = room
        Auth.AuthAPICall(token => {
            const url = this.getURL(baseUrl, room, token)
            let ws = new WebSocket(url)
            ws.onopen = () => {
                this.activeConnection = true
                this.counter = 0
            }

            ws.onmessage = e => {
                this.onMessageReceived(e.data)
            }

            ws.onclose = e => {
                if (this.activeConnection) this.connect(this.baseUrl, this.room)
            }

            ws.onerror = (err) => {
                console.error('Socket encountered error: ', err, 'Closing socket')
                if (this.counter < this.NUMBER_OF_ATTEMPTS && this.activeConnection) {
                    this.counter += 1
                } else {
                    this.activeConnection = false
                    this.counter = 0
                }
                ws.close()
            }

            this.ws = ws
        })
    }

    close() {
        if (this.ws) {
            this.activeConnection = false
            this.ws.close()
        }
    }

    onMessageReceived(message) {
        const bundle = JSON.parse(message)
        this.messageReceivedCallback(bundle)
    }

    waitForConnection(callback) {
        if (!this.baseUrl || !this.room) return
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            callback()
            return
        }

        if (this.counter < this.NUMBER_OF_ATTEMPTS) {
            if (!this.ws || this.ws.readyState !== WebSocket.CONNECTING || this.ws.readyState !== WebSocket.OPEN) {
                this.connect(this.baseUrl, this.room)
                this.counter += 1
            }
            setTimeout(callback, 500)
        } else {
            this.counter = 0
        }
    }

    sendMessage(bundle) {

        const message = {
            message: bundle
        }

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.waitForConnection(() => this.sendMessage(bundle))
        } {
            this.ws.send(JSON.stringify(message))
        }
    }

}