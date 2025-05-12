
import Modal from 'components/views/Modal'
import CreateConversationForm from 'pages/finder/CreateConversationForm'
import EditConversationForm from './EditConversationForm'


export default function ConversationFormContainer({
    conversation = null,
    onEdit = null,
    create = true,
    ...props }) {

    return <Modal open={props.open} onClose={props.onClose}>
        {
            create ? <CreateConversationForm /> : <EditConversationForm
                onEdit={onEdit}
                conversation={conversation}
                onClose={props.onClose} />
        }
    </Modal>
}