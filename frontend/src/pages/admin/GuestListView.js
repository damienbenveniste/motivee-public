import { useState, useEffect } from 'react'
import { Button, Typography } from "@mui/material"
import { InviteeAPI } from 'api/invitees'
import { DataGrid } from '@mui/x-data-grid'
import { useParams } from 'react-router-dom'
import AdminSelect from 'components/admin/AdminSelect'

const options = { year: 'numeric', month: 'short', day: 'numeric' }


export default function GuestListView() {

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [guests, setGuests] = useState([])
    const [totalResults, setTotalResults] = useState(0)
    const { customerId } = useParams()

    useEffect(() => {
        setLoading(true)
        InviteeAPI.getGuests({
            customerId,
            page,
            onSuccess: res => {
                const uniqueGuests = [...new Map(res.data.results.map(guest =>
                    [guest.id, guest])).values()
                ]
                setGuests(uniqueGuests)
                setTotalResults(res.data.count)
                setLoading(false)
            },
            onFailure: () => {
                setGuests([])
                setLoading(false)
            }
        })
    }, [page])

    const onLevelChange = (inviteeId, isAdmin, onSuccess) => {
        setLoading(true)
        InviteeAPI.updateAccessLevel({
            inviteeId,
            isAdmin,
            customerId,
            onSuccess: () => {
                setLoading(false)
                onSuccess()
            },
            onFailure: () => setLoading(false)
        })
    }

    const onDelete = (inviteeId) => {
        setLoading(true)
        InviteeAPI.delete({
            inviteeId,
            customerId,
            onSuccess: () => {
                const newGuest = guests.filter(guest => guest.id !== inviteeId)
                setTotalResults(totalResults - 1)
                setGuests(newGuest)
                setLoading(false)
            },
            onFailure: () => setLoading(false)
        })
    }

    const columns = [
        {
            field: 'email',
            headerName: 'Email',
            flex: 0.4,
        },
        {
            field: 'time_created',
            headerName: 'Time joined',
            flex: 0.3,
            valueGetter: (params) => {
                return new Date(params.row.time_created).toLocaleString('en-US', options)
            }
        },
        {
            field: 'is_admin',
            flex: 0.3,
            headerName: "Access level",
            sortable: false,
            renderCell: (params) => <AdminSelect
                onLevelChange={onLevelChange}
                onDelete={onDelete}
                params={params} />
        },

    ]

    return <>
        <Typography variant='h6'>
            Workspace guests
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                sx={{
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                    }, height: 400,
                    backgroundColor: 'white'
                }}
                rows={guests}
                columns={columns}
                loading={loading}
                pageSize={guests.length}
                page={page - 1}
                onPageChange={(newPage) => setPage(newPage + 1)}
                paginationMode="server"
                rowCount={totalResults}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    </>

}