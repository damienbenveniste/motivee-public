import { useState, useEffect } from 'react'
import SunburstView from 'components/visualizations/SunburstView'
import TagsView from 'components/conversations/TagsView'
import { Stack, Typography } from '@mui/material'
import String from 'utils/strings'
import { useParams } from 'react-router-dom'


export default function SimpleWheelView({ data, conversation, onClick }) {

    const [treeData, setTreeData] = useState({})
    const { claimId } = useParams()

    useEffect(() => {
        setTreeData({
            id: 'root',
            type: 'ANS',
            tags: conversation?.tags,
            text: conversation?.question,
            children: data
        })
    }, [data])

    return <Stack
        justifyContent="center"
        alignItems="center"
        sx={{width: '100%'}}
        spacing={3}>
        <SunburstView
            width='100%'
            data={treeData}
            onClick={onClick}
            currentClaimId={claimId} />
        <Typography variant='h6'>
            {String.getLinks(conversation?.question)}
        </Typography>
        <TagsView tags={conversation?.tags} justifyContent="center"/>
    </Stack>
}