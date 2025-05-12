import BaseAPI from 'api/baseAPI'


export class ConversationAPI {

    static createConversation({
        title,
        question,
        open_ended,
        tags,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {


        const conversation = { title, question, open_ended, tags }
        BaseAPI.call({
            type: 'create',
            path: 'conversations/conversations/',
            object: conversation,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static updateConversation({
        conversation,
        title,
        question,
        open_ended,
        tags,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        const conversationParams = { title, question, open_ended, tags }
        BaseAPI.call({
            type: 'patch',
            path: `conversations/conversations/${conversation.id}/`,
            object: conversationParams,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static deleteConversation({
        conversation,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'delete', 
            path: `conversations/conversations/${conversation.id}/`, 
            object: null,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getConversation({
        conversationId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `conversations/conversations/${conversationId}`,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getAllConversation({
        searchText,
        page,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `conversations/conversations/?page=${page}`,
            object: { searchText },
            customerId,
            onSuccess,
            onFailure
        })

    }

    static getStats({
        conversationId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: `stats/conversations/${conversationId}`,
            customerId,
            onSuccess,
            onFailure
        })
    }
}