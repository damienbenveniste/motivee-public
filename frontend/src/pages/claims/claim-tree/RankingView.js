
import { useState, useEffect } from 'react'
import InactiveVoteView from "components/conversations/InactiveVoteView"
import { Stack, Typography, Paper } from '@mui/material'

export default function RankingView({ claims, user, ...props }) {

    const [usersVotes, setUsersVotes] = useState({})

    useEffect(() => {
        const votes = {}
        claims.forEach(claim => {
            if (claim.author in votes) {
                votes[claim.author][0] += claim.up_votes
                votes[claim.author][1] += claim.down_votes
            } else {
                votes[claim.author] = [claim.up_votes, claim.down_votes]
            }
        })

        const sortedVotes = Object.entries(votes)
            .filter(([, val]) => val[0] !== 0)
            .sort(([, a], [, b]) => b[0] - a[0])
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        setUsersVotes(sortedVotes)
    }, [claims])

    const upVotes = (user?.id in usersVotes) ? usersVotes[user?.id][0] : 0
    const downVotes = (user?.id in usersVotes) ? usersVotes[user?.id][1] : 0
    const rank = (
        user?.id in usersVotes
    ) ? Object.keys(usersVotes).indexOf(user?.id.toString()) + 1 : null
    const getrankText = (rank) => {
        if (!rank) return null
        var s = ["th", "st", "nd", "rd"],
            v = rank % 100;
        return rank + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    const rankText = getrankText(rank)
    const text = rankText ? `You current rank in total up votes is ${rankText}` : null

    return <Paper {...props} elevation={0} >
        <Stack
            sx={{height:'100%'}}
            justifyContent="center"
            alignItems="center">
            <Typography variant='h5'>
                Your total claim ratings
            </Typography>
            <InactiveVoteView
                upVotes={upVotes}
                downVotes={downVotes}
                iconHeight={30}
                spacing={2}
                variant='h6' />
            <Typography variant='h6'>
                {text}
            </Typography>
        </Stack>
    </Paper>
}