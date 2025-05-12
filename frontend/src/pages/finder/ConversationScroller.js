import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { CircularProgress, Grid } from '@mui/material'
import { ConversationAPI } from 'api/conversations'
import ConversationCard from 'components/conversations/ConversationCard'
import { useParams } from 'react-router-dom'


export function ConversationScroller({ searchText, isAdmin, user, ...restProps }) {

    const [page, setPage] = useState(1)
    const [conversations, setConversations] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const { customerId } = useParams()

    const fetchData = () => {

        ConversationAPI.getAllConversation({
            searchText,
            page: page,
            customerId,
            onSuccess: res => {
                setHasMore(res.data.total_pages > page)
                setConversations([...conversations, ...res.data.results])
                setPage(page + 1)
            },
            onFailure: () => setHasMore(false)
        })
    }

    const conversationCards = <Grid container spacing={3} sx={{ width: "100%" }}>
        {conversations.map((conversation) => {

            const deleteConversation = () => {
                const newConversations = conversations.filter((item) => item.id !== conversation.id)
                setConversations(newConversations)
            }

            return <Grid item key={conversation.id} xs={12} sm={6} md={3} >
                <ConversationCard
                    conversation={conversation}
                    isAdmin={isAdmin}
                    user={user}
                    deleteConversation={deleteConversation} />
            </Grid>
        })}
    </Grid>

    return <div style={{
        overflow: 'auto',
        width: '100%',
        height: '80vh',
        padding: 2,
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
            {conversationCards}
        </InfiniteScroll>
    </div>
}