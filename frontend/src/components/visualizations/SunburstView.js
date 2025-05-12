import { useEffect, useRef, useState } from "react";
import { Stack, Popper, ClickAwayListener } from "@mui/material";
import Plot from 'react-plotly.js';
import OverlayClaimView from 'components/conversations/OverlayClaimView'


function getColor(type, opacity) {

    switch (type) {
        case 'CON':
            return `rgba(250, 27, 27, ${opacity})`
        case 'PRO':
            return `rgba(12, 204, 18, ${opacity})`
        case 'CURRENT':
            return `rgba(252, 186, 3, ${opacity})`
        default:
            return `rgba(5, 227, 227, ${opacity})`
    }
}

const typeDict = {}
const claimDict = {}


export default function SunburstView({ data, onClick, width = 500, currentClaimId = null }) {

    const [colors, setColors] = useState([])
    const [parents, setParents] = useState([])
    const [labels, setLabels] = useState([])
    const [ids, setIds] = useState([])
    const [claim, setClaim] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [level, setLevel] = useState('')
    const ref = useRef()
    const stackRef = useRef(null)

    const compare = (a, b) => {
        if (a.type > b.type) {
            return 1
        } else if (a.type < b.type) {
            return -1
        } else {
            return a.id - b.id
        }
    }

    useEffect(() => {
        const newParents = []
        const newIds = []
        const newLabels = []

        const dfs = (root, parent = null) => {
            newLabels.push(root?.text)
            newIds.push(root?.id?.toString())
            newParents.push(parent ? parent?.id?.toString() : '')
            typeDict[root.id] = root?.type
            claimDict[root.id] = root

            if ('children' in root) {
                for (let node of root?.children.sort(compare)) {
                    dfs(node, root)
                }
            }
        }
        dfs(data)
        setParents(newParents)
        setIds(newIds)
        setLabels(newLabels)
    }, [data])

    useEffect(() => {
        const newColors = ids.map(id => {
            if (id === currentClaimId || (id === 'root' && !(currentClaimId in typeDict))) {
                return getColor('CURRENT', 1)
            } else {
                return getColor(typeDict[id], 1)
            }
        })
        setColors(newColors)
    }, [currentClaimId, ids])


    const chartData = [{
        type: "sunburst",
        ids: ids,
        labels: labels,
        level: level,
        parents: parents,
        leaf: { opacity: 1 },
        sort: false,
        textinfo: 'none',
        hoverinfo: 'none',
        marker: {
            line: { 
                width: 2,
                // color:colors
            },
            colors: colors,
        },
    }]

    var layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        height: ref.current?.offsetWidth,
        width: ref.current?.offsetWidth,
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        }
    }

    const handlePopoverOpen = (event) => {
        if (open || !ref || event.points[0].id === 'root') return
        setAnchorEl(ref.current)
    }

    const handlePopoverClose = () => {
        const newColors = ids.map(id => {
            if (id === currentClaimId || (id === 'root' && !(currentClaimId in typeDict))) {
                return getColor('CURRENT', 1)
            } else {
                return getColor(typeDict[id], 1)
            }
        })
        setColors(newColors)
        setClaim(null)
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    return <Stack sx={{ width: width }} ref={stackRef}>
        <Plot
            data={chartData}
            layout={layout}
            with={width}
            useResizeHandler={true}
            style={{ borderRadius: 20, overflow: 'hidden' }}
            config={{ displayModeBar: false }}
            onSunburstClick={(e) => {
                if (e?.points[0]?.id === 'root') {
                    onClick(null)
                } else {
                    onClick(claimDict[e?.points[0]?.id])
                }
                if (e.event.detail === 2) {
                    if (e?.points[0]?.id === level) {
                        setLevel('')
                    } else {
                        setLevel(e?.points[0]?.id)
                    }
                    
                }
                return false
            }}
            onHover={(e) => {
                handlePopoverOpen(e)
                e.points.map(d => {
                    const newColors = ids.map(id => {
                        if (id === currentClaimId || (id === 'root' && !(currentClaimId in typeDict))) {
                            if (id === d.id) {
                                return getColor('CURRENT', 1)
                            } else {
                                return getColor('CURRENT', 0.3)
                            }
                        } else if (id === d.id) {
                            return getColor(typeDict[id], 1)
                        } else {
                            return getColor(typeDict[id], 0.3)
                        }
                    })
                    setColors(newColors)
                    setClaim(claimDict[d.id])
                })
            }}
            onUnhover={(e) => {
                if (e.event?.toElement?.__data__ !== 0 &&
                    e.event?.toElement?.__data__?.data?.id !== 'root') return
                handlePopoverClose()
            }}
        />
        <div ref={ref} />
        <ClickAwayListener onClickAway={handlePopoverClose} >
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement='bottom'
                sx={{ zIndex: 2000 }}>
                <OverlayClaimView claim={claim} width={ref.current?.offsetWidth} />
            </Popper>
        </ClickAwayListener>
    </Stack>
}
