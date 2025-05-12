import { useEffect, useState } from 'react'
import {
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    Paper
} from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import { ConversationSurveyVoteAPI } from 'api/conversationSurveyVotes'
import { useParams } from 'react-router-dom'


export default function ConversationSurveyForm({ conversation, onVote, wrap = true, ...props }) {

    const [vote, setVote] = useState(null)
    const [upVotes, setUpVotes] = useState(0)
    const [downVotes, setDownVotes] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const {customerId} = useParams()

    useEffect(() => {
        if (!conversation || !conversation.survey) return

        setUpVotes(conversation.survey.up_votes)
        setDownVotes(conversation.survey.down_votes)

        if (!vote) {
            setDisabled(true)
            ConversationSurveyVoteAPI.getVote({
                surveyId: conversation.survey.id,
                customerId,
                onSuccess: (res) => {
                    setDisabled(false)
                    if (res.data.results.length === 1) {
                        setVote(res.data.results[0])
                    }
                },
                onFailure: () => setDisabled(false)
            })
        }

    }, [conversation])

    const handleChange = event => {
        setDisabled(true)
        if (!vote) {
            ConversationSurveyVoteAPI.createVote({
                survey: conversation.survey,
                value: event.target.value,
                customerId,
                onSuccess: (res) => {
                    setVote(res.data)
                    const newConversation = {
                        ...conversation,
                        votes: conversation.votes + 1
                    }
                    if (event.target.value === '1') {
                        newConversation.survey.up_votes = upVotes + 1
                    } else {
                        newConversation.survey.down_votes = downVotes + 1
                    }
                    setDisabled(false)
                    onVote(newConversation)
                },
                onFailure: () => setDisabled(false)
            })
        } else {
            ConversationSurveyVoteAPI.updateVote({
                vote,
                value: event.target.value,
                customerId,
                onSuccess: (res) => {
                    setVote(res.data)
                    const newConversation = {
                        ...conversation
                    }
                    if (event.target.value === '1') {
                        newConversation.survey.up_votes = upVotes + 1
                        newConversation.survey.down_votes = downVotes - 1
                    } else {
                        newConversation.survey.up_votes = upVotes - 1
                        newConversation.survey.down_votes = downVotes + 1
                    }
                    onVote(newConversation)
                    setDisabled(false)
                },
                onFailure: () => setDisabled(false)
            })

        }
    }

    const onClick = (event) => {
        if (event.target.value === vote?.value.toString()) {
            setDisabled(true)
            ConversationSurveyVoteAPI.deleteVote({
                vote,
                customerId,
                onSuccess: (res) => {
                    setVote(null)
                    const newConversation = {
                        ...conversation,
                        votes: conversation.votes - 1
                    }
                    onVote(newConversation)
                    if (event.target.value === '1') {
                        newConversation.survey.up_votes = upVotes - 1
                    } else {
                        newConversation.survey.down_votes = downVotes - 1
                    }
                    setDisabled(false)
                    onVote(newConversation)
                },
                onFailure: () => setDisabled(false)
            })
        }
    }

    const core = <FormControl
        disabled={disabled}
        sx={{ display: 'flex', alignItems: 'center' }}>
        <FormLabel>Do you agree?</FormLabel>
        <RadioGroup row
            value={vote?.value || 0}
            onChange={handleChange}
        >
            <FormControlLabel value={1} labelPlacement="start" control={
                <Radio
                    sx={{ width: 30, height: 30, margin: 1 }}
                    onClick={onClick}
                    icon={<ThumbUpOffAltIcon sx={{ fontSize: 30 }} />}
                    checkedIcon={<ThumbUpAltIcon sx={{ fontSize: 30 }} />}
                />
            }
                sx={{ margin: 1 }}
                label={upVotes}
            />
            <FormControlLabel value={-1} labelPlacement="end" control={
                <Radio
                    onClick={onClick}
                    sx={{ width: 30, height: 30, margin: 1 }}
                    icon={<ThumbDownOffAltIcon sx={{ fontSize: 30 }} />}
                    checkedIcon={<ThumbDownAltIcon sx={{ fontSize: 30 }} />}
                />
            }
                sx={{ margin: 1 }}
                label={downVotes}
            />
        </RadioGroup>
    </FormControl>

    return wrap ? <Paper elevation={0} sx={{ padding: 2, pl: 5, pr: 5, borderRadius: 5 }}>
        {core}
    </Paper> : core

}