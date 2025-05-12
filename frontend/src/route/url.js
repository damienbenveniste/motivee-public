

export default class URL {

    static USERNAME_TEMPLATE = ':username'
    static CONVERSATION_ID_TEMPLATE = ':conversationId'
    static TAG_TEMPLATE = ':tag'
    static CLAIM_TEMPLATE = ':claimId'
    static CUSTOMER_ID = ':customerId'

    static LOGIN = '/login'
    static SIGNUP = '/signup'
    static VERIFY_EMAIL = '/verify-email'
    static WORKSPACE = '/workspace'
    static RESET_PASSWORD = '/reset-password'
    static HANDLE_VERIFY_EMAIL = '/handle-verify-email/__/auth/action'


    static questionnaire = (customerId) => `/${customerId}/questionnaire`
    static feed = (customerId) => `/${customerId}/feed`
    static profile = (customerId, profileId) => `/${customerId}/profile/${profileId}`
    static payment = (customerId) => `/${customerId}/payment`
    static admin = (customerId) => `/${customerId}/admin`
    static workspaceAdmin = (customerId) => `/${customerId}/admin/workspace`
    static billingAdmin = (customerId) => `/${customerId}/admin/billing`
    static upgrade = (customerId) => `/${customerId}/upgrade`
    static howTo = (customerId) => `/${customerId}/how-to`

    static conversation(customerId, conversationId=null, claimId=null) {
        if (!conversationId) return `/${customerId}/conversations`
        if (!claimId) return `/${customerId}/conversation/${conversationId}/null`
        return `/${customerId}/conversation/${conversationId}/${claimId}`
    }

    static insightOverview(customerId, conversationId, tag=null) {
        if (!tag) return `/${customerId}/insight/${conversationId}/overview`
        return `/${customerId}/insight/${conversationId}/overview/${tag}`
    }

    static insightTopClaim(customerId, conversationId, tag=null) {
        if (!tag) return `/${customerId}/insight/${conversationId}/top-claims`
        return `/${customerId}/insight/${conversationId}/top-claims/${tag}`
    }
}
