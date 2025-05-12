import Modal from "components/views/Modal"
import TermsView from "./TermsView"

export default function TermsPage({open, onClose}) {
    return <Modal open={open} onClose={onClose}>
        <TermsView/>
    </Modal>
}