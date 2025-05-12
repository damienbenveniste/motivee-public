import Modal from "components/views/Modal"
import PrivacyView from "./PrivacyView"

export default function PrivacyPage({open, onClose}) {
    return <Modal open={open} onClose={onClose}>
        <PrivacyView/>
    </Modal>
}