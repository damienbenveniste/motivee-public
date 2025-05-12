import BaseAPI from 'api/baseAPI'


export class PaymentAPI {

    static createSetupIntent({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'get',
            path: 'payment/create-setup-intent/',
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getPrice({
        customerId,
        interval,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'get',
            path: 'payment/create-price/',
            customerId,
            object: { interval },
            onSuccess,
            onFailure
        })
    }

    static getSubscriptionIntent({
        customerId,
        interval,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'get',
            path: 'payment/create-subscription-intent/',
            customerId,
            object: { interval },
            onSuccess,
            onFailure
        })
    }

    static getCurrentPlan({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'get',
            path: 'payment/current-plan/',
            customerId,
            onSuccess,
            onFailure
        })
    }

    static getSession({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'create',
            path: 'payment/session/',
            customerId,
            onSuccess,
            onFailure
        })
    }

    static cancelSubscription({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'patch',
            path: `payment/current-plan/`,
            object: { modification: 'cancel' },
            customerId,
            onSuccess,
            onFailure
        })
    }

    static renewSubscription({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'patch',
            path: `payment/current-plan/`,
            object: { modification: 'renew' },
            customerId,
            onSuccess,
            onFailure
        })
    }

    static modifySubscriptionInterval({
        customerId,
        interval,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {
        BaseAPI.call({
            type: 'patch',
            path: `payment/current-plan/`,
            object: { modification: 'inverval', interval },
            customerId,
            onSuccess,
            onFailure
        })
    }
}