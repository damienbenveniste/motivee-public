import BaseAPI from 'api/baseAPI'


export class CustomerAPI {

    static createCustomer({
        name,
        emailList,
        domainList,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'create',
            path: 'administration/customers/',
            object: { name, emailList, domainList },
            customerId: null,
            onSuccess,
            onFailure
        })
    }

    static delete({
        customerId,
        onSuccess = () => { return null },
        onFailure = () => { return null },
    }) {

        BaseAPI.call({
            type: 'delete',
            path: `administration/private_customers/${customerId}/`,
            customerId,
            onSuccess,
            onFailure
        })
    }


}