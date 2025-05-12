import Modal from "components/views/Modal"
import PricingPlanView from "./PricingPlanView"

export default function PricingPlanModal({ open, onClose }) {

    return <Modal open={open} onClose={onClose} >
        <PricingPlanView sx={{padding: 5}}/>
    </Modal>

}