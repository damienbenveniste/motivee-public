import { useState, useEffect } from 'react'
import useUser from "hooks/useUser"
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Stack
} from '@mui/material'
import { SurveyAPI } from 'api/surveys'
import { useParams } from 'react-router-dom'


function CategoryButton({ category, isChecked, setChecked }) {

    const onClick = () => {
        if (isChecked) {
            setChecked(null)
        } else {
            setChecked(category)
        }
    }

    return <Button
        disableElevation
        onClick={onClick}
        sx={{ borderRadius: 5, minWidth: 70, textTransform: 'none', margin: 0.5 }}
        variant={isChecked ? 'contained' : 'outlined'}>
        {category}
    </Button>
}


function CategoryButtonList({ categoryList, checked, setChecked }) {

    return <Box
        sx={{ width: '100%' }} >
        {categoryList.map(category => <CategoryButton
            key={category}
            setChecked={setChecked}
            isChecked={checked === category}
            category={category} />)}
    </Box>
}


function getCategoryList(categoryList) {
    if (categoryList === 'date') {
        return ['less than 1 year', 'less than 5 year', 'more than 5 years']
    }
    return categoryList
}


export default function CategoriesButtons({ conversation, setData, setPvalue }) {
    const [user, isLoading] = useUser()
    const [category, setCategory] = useState('')
    const [categoryList, setCategoryList] = useState([])
    const [checked, setChecked] = useState(null)
    const {customerId} = useParams()
    const categories = user?.customer?.categories

    useEffect(() => {

        if (!checked || !category) {
            setData([
                conversation?.survey?.up_votes,
                conversation?.survey?.down_votes
            ])
            return
        }

        SurveyAPI.getConversationSurveyVoteCounts({
            surveyId: conversation.survey.id,
            params: {category, value: checked},
            customerId,
            onSuccess: (res) => {
                setData([
                    res.data?.up_votes,
                    res.data?.down_votes
                ])
                setPvalue(res.data?.pvalue)
            },
        })

    }, [checked, category])

    useEffect(() => {
        if (!categories) return
        setCategory(Object.keys(categories)[0])
        setCategoryList(getCategoryList(Object.values(categories)[0]))
    }, [categories])


    const categoryOptions = categories && Object.keys(categories).map(key => {
        return <MenuItem key={key} value={key}>{key}</MenuItem>
    })

    const handleChange = (event) => {
        setCategory(event.target.value)
        setChecked(null)
        setCategoryList(getCategoryList(categories[event.target.value]))
    }

    return <Stack>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Demographic</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Demographic"
                onChange={handleChange}
            >
                {categoryOptions}
            </Select>
        </FormControl>
        <CategoryButtonList
            checked={checked}
            setChecked={setChecked}
            categoryList={categoryList} />
    </Stack>



}