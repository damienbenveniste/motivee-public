import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { CircularProgress, Stack } from '@mui/material'
import { ClaimAPI } from 'api/claims'
import FeedCard from 'components/feed/FeedCard'
import { useParams } from 'react-router-dom'


export default function FeedContainer({ ...restProps }) {

    const [claims, setClaims] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const {customerId} = useParams()

    const fetchData = (page) => {
        ClaimAPI.getFeedClaims({
            page: page,
            customerId,
            onSuccess: res => {
                setHasMore(res.data.total_pages > page)
                setClaims([...claims, ...res.data.results])
            },
        })
    }

    const claimCards = claims.map((claim) => {
        return <FeedCard key={claim.id} claim={claim} />
    })

    return <div style={{
        overflow: 'auto',
        height: '90vh',
        paddingRight: 10
    }}>
        <InfiniteScroll
            {...restProps}
            style={{ width: '100%' }}
            pageStart={0}
            loadMore={fetchData}
            hasMore={hasMore}
            useWindow={false}
            loader={<CircularProgress key={0} />}
        >
            <Stack spacing={2}>
                {claimCards}
            </Stack>
        </InfiniteScroll>
    </div>
    
}