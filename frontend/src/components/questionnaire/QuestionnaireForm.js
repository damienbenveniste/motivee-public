import { useState, useEffect } from 'react'
import { Stack, Button } from '@mui/material'
import SelectDate from './SelectDate'
import SelectOption from './SelectOption'
import { UserAPI } from 'api/users'
import { useNavigate, useParams } from 'react-router-dom'
import URL from 'route/url'


export default function QuestionnaireForm({ user }) {

    const [state, setState] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const {customerId} = useParams()
    const customer = user.customers?.filter(c => c.id === customerId).pop()
    const customerCategories = customer?.categories
    const navigate = useNavigate()

    useEffect(() => {
        if (!customer) navigate(URL.LOGIN)
    }, [customer])

    const ready = () => {
        for (let key of Object.keys(customerCategories)) {
            if (!(key in state)) return false
        }
        return true
    }

    useEffect(() => {
        setDisabled(!ready() || loading)
    }, [state, loading])

    const onSubmit = () => {
        if (!ready()) return
        setLoading(true)
        UserAPI.updateUserCategories({
            username: user.username,
            categories: state,
            customerId,
            onSuccess: () => {
                setLoading(false)
                navigate(URL.conversation(customerId))
            },
            onFailure: () => setLoading(false)
        })
    }

    const items = Object.entries(customerCategories).map(([label, options]) => {
        if (options === 'date') {
            return <SelectDate
                key={label}
                label={label}
                state={state}
                setState={setState} />
        } else if (Array.isArray(options)) {
            return <SelectOption
                key={label}
                label={label}
                options={options}
                state={state}
                setState={setState} />
        }
    })

    return <Stack spacing={2} sx={{ width: '80%' }}>
        {items}
        <Button
            disabled={disabled}
            onClick={onSubmit}
            variant='contained'>
            Submit
        </Button>
    </Stack>

}