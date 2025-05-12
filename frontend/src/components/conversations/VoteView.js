
import { useState, useEffect } from 'react'
import {
    FormControlLabel,
    FormControl,
    RadioGroup,
    Radio
} from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import { VoteAPI } from 'api/votes'
import { useParams } from 'react-router-dom'


export default function VoteView({ claim, setVotes = null, modifyClaim }) {

    const [vote, setVote] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [value, setValue] = useState('0')
    const { customerId } = useParams()

    useEffect(() => {
        if (!claim) return 
        setDisabled(true)
        VoteAPI.getVote({
            claim,
            customerId,
            onSuccess: (res) => {
                if (res.data.results.length === 1) {
                    setVote(res.data.results[0])
                    console.log(res.data.results)
                }
                setDisabled(false)
            },
            onFailure: () => setDisabled(false)
        })
    }, [])

    useEffect(() => {
        if (setVotes) setVotes(claim.up_votes + claim.down_votes)
    }, [claim])

    useEffect(() => {
        if (!vote) {
            setValue('0')
            return
        }
        setValue(vote.value.toString())
    }, [vote])

    const handleChange = event => {
        if (!['1', '-1'].includes(event.target.value)) return
        setDisabled(true)
        if (!vote) {
            VoteAPI.createVote({
                claim,
                value: event.target.value,
                customerId,
                onSuccess: (res) => {
                    setVote(res.data)
                    const modifiedClaim = { ...claim }
                    if (event.target.value === '1') {
                        modifiedClaim.up_votes += 1
                    } else if (event.target.value === '-1') {
                        modifiedClaim.down_votes += 1
                    }
                    setDisabled(false)
                    modifyClaim('UPDATE', [modifiedClaim])
                },
                onFailure: () => setDisabled(false)
            })
        } else {
            VoteAPI.updateVote({
                vote,
                value: event.target.value,
                customerId,
                onSuccess: (res) => {
                    setVote(res.data)
                    const modifiedClaim = { ...claim }
                    if (event.target.value === '1') {
                        modifiedClaim.up_votes += 1
                        modifiedClaim.down_votes -= 1
                    } else if (event.target.value === '-1') {
                        modifiedClaim.up_votes -= 1
                        modifiedClaim.down_votes += 1
                    }
                    modifyClaim('UPDATE', [modifiedClaim])
                    setDisabled(false)
                },
                onFailure: () => setDisabled(false)
            })

        }
    }

    const onClick = (event) => {
        event.stopPropagation()
        if (!['1', '-1'].includes(event.target.value)) return
        if (!vote) return

        if (event.target.value === vote.value.toString()) {
            setDisabled(true)
            VoteAPI.deleteVote({
                vote,
                customerId,
                onSuccess: (res) => {
                    setVote(null)
                    const modifiedClaim = { ...claim }
                    if (event.target.value === '1') {
                        modifiedClaim.up_votes -= 1
                    } else if (event.target.value === '-1') {
                        modifiedClaim.down_votes -= 1
                    }
                    modifyClaim('UPDATE', [modifiedClaim])
                    setDisabled(false)
                },
                onFailure: () => setDisabled(false)
            })
        }
    }

    return <FormControl disabled={disabled}>
        <RadioGroup row
            value={value}
            onChange={handleChange}>
            <FormControlLabel value='1' control={
                <Radio
                    onClick={onClick}
                    icon={<ThumbUpOffAltIcon />}
                    checkedIcon={<ThumbUpAltIcon />}
                />
            } label={claim.up_votes} />
            <FormControlLabel value='-1' control={
                <Radio
                    onClick={onClick}
                    icon={<ThumbDownOffAltIcon />}
                    checkedIcon={<ThumbDownAltIcon />}
                />
            } label={claim.down_votes} />
        </RadioGroup>
    </FormControl>
}