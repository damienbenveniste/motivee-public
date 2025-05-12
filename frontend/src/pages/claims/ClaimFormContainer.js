import Modal from 'components/views/Modal'
import CreateClaimForm from 'pages/claims/CreateClaimForm'
import EditClaimForm from './EditClaimForm'


export default function ClaimFormContainer({ 
    conversation, 
    type, 
    parent, 
    onEdit=null,
    create=true, 
    claim=null, 
    ...restProps 
}) {

    return <Modal
        open={restProps.open}
        onClose={restProps.onClose}>
        
        {create ?<CreateClaimForm
            conversation={conversation}
            type={type}
            onClose={restProps.onClose}
            parent={parent} /> : <EditClaimForm
            claim={claim}
            onEdit={onEdit}
            conversation={conversation}
            onClose={restProps.onClose}
            />}
    </Modal>
}