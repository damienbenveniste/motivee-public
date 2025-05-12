import BaseAPI from 'api/baseAPI'


export class InviteeAPI {

    static getCustomers({
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: 'administration/invitees',
            customerId: null,
            onSuccess,
            onFailure
        })
    }

    static getGuests({
        customerId,
        page,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'get',
            path: `administration/private_invitees/?page=${page}`,
            object: { email: true },
            customerId,
            onSuccess,
            onFailure
        })

    }

    static getDomains({
        customerId,
        page,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'get',
            path: `administration/private_invitees/?page=${page}`,
            object: { domain: true },
            customerId,
            onSuccess,
            onFailure
        })

    }

    static addDomains({
        domainList,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'create',
            path: 'administration/private_invitees/',
            object: { domainList },
            customerId,
            onSuccess,
            onFailure
        })
    }

    static updateAccessLevel({
        inviteeId,
        isAdmin,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'patch',
            path: `administration/private_invitees/${inviteeId}/`,
            object: { is_admin: isAdmin },
            customerId,
            onSuccess,
            onFailure
        })
    }

    static delete({
        inviteeId,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'delete',
            path: `administration/private_invitees/${inviteeId}/`,
            customerId,
            onSuccess,
            onFailure
        })
    }

    static addGuests({
        emailList,
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'create',
            path: 'administration/private_invitees/',
            object: { emailList },
            customerId,
            onSuccess,
            onFailure
        })

    }
}