import {
    Button
} from'@mui/material'
import AddIcon from '@mui/icons-material/Add';

export default function AddButton(props) {

    return <Button variant='outlined' {...props}>
        <AddIcon/>
    </Button>
}