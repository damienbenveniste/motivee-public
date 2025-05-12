import { useEffect, useRef, useState } from "react";
import Plot from 'react-plotly.js'
import { 
    Stack, 
    Popper, 
    ClickAwayListener, 
    Slider,
    FormGroup,
    FormControlLabel,
    Switch
} from "@mui/material"
import jsonData from './trees/tree3.json'

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

const color_dict = {
    'QUESTION_OPEN': 'rgba(252, 186, 3, 1)',
    'QUESTION_CLOSE': 'rgba(252, 186, 3, 1)',
    'YES': 'rgba(12, 204, 18, 1)',
    'ARG_YES': 'rgba(12, 204, 18, 1)',
    'NO': 'rgba(250, 27, 27, 1)',
    'ARG_NO': 'rgba(250, 27, 27, 1)',
    'CATEGORY': 'rgba(3, 28, 252, 1)',
    'ANS': 'rgba(5, 227, 227, 1)',
}


export default function DialogWheel() {

    const [maxdepth, setMaxdepth] = useState(7)
    const [overview, setOverview] = useState(false)
    const [ids, setIds] = useState([])
    const [labels, setLabels] = useState([])
    const [parents, setParents] = useState([])
    const [values, setValues] = useState([])
    const [colors, setColors] = useState([])


    useEffect(() => {
        const newIds = []
        const newLabels = []
        const newParents = []
        const newValues = []
        const newColors = []

        const norm = (root) => {

            const queue = [[root, null, null]]
    
            while (queue.length > 0) {
    
                const [node, parent, sum] = queue.shift()
                if (parent) {
                    node.votes = node.votes * parent.votes / sum
                }
    
                if ('children' in node) {
                    const nextSum = node.children.map(c => c.votes).reduce((a, b) => a + b, 0)
                    for (let n of node.children) {
                        queue.push([n, node, nextSum])
                    }
                }
            }
        }
    
        const dfs = (root, parent = null) => {
            newLabels.push(root?.text)
            newIds.push(root?.id?.toString())
            newParents.push(parent ? parent?.id?.toString() : '')
            newColors.push(color_dict[root?.type])
            newValues.push(root.votes)
    
            if ('children' in root) {
                for (let node of root?.children) {
                    dfs(node, root)
                }
            }
        }

        // let data = Object.assign({}, jsonData)
        let data = JSON.parse(JSON.stringify(jsonData))
        console.log(data)

        // let data = {
        //     ...jsonData
        // }

        if (overview) {
            dfs(data)
        } else {
            norm(data)
            dfs(data) 
        }

        if (ids.length == 0) {
            setIds(newIds)
            setLabels(newLabels)
            setParents(newParents)
            setColors(newColors)

        }
 
        setValues(newValues)

    }, [overview])
    // // norm(jsonData)
    // dfs(jsonData)

    const chartData = [{
        type: "sunburst",
        ids: ids,
        labels: labels,
        // level: 0,
        values: values,
        parents: parents,
        leaf: { opacity: 1 },
        sort: false,
        // textinfo: 'none',
        // hoverinfo: 'none',
        maxdepth: overview ? -1 : maxdepth,
        // branchvalues: 'remainder',
        branchvalues: overview ? 'remainder' :'total',
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
        height: 600,
        width: 600,
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        }
    }

    // const handlePopoverOpen = (event) => {
    //     if (open || !ref || event.points[0].id === 'root') return
    //     setAnchorEl(ref.current)
    // }

    // const handlePopoverClose = () => {
    //     const newColors = ids.map(id => {
    //         if (id === currentClaimId || (id === 'root' && !(currentClaimId in typeDict))) {
    //             return getColor('CURRENT', 1)
    //         } else {
    //             return getColor(typeDict[id], 1)
    //         }
    //     })
    //     setColors(newColors)
    //     setClaim(null)
    //     setAnchorEl(null)
    // }

    // const open = Boolean(anchorEl);
    // const id = open ? 'simple-popper' : undefined;
    return <Stack sx={{ width: 600 }} >
        <Plot
            data={chartData}
            layout={layout}
            with={600}
            useResizeHandler={true}
            style={{ borderRadius: 20, overflow: 'hidden' }}
            config={{ displayModeBar: false }}
        // onSunburstClick={(e) => {
        //     if (e?.points[0]?.id === 'root') {
        //         onClick(null)
        //     } else {
        //         onClick(claimDict[e?.points[0]?.id])
        //     }
        //     if (e.event.detail === 2) {
        //         if (e?.points[0]?.id === level) {
        //             setLevel('')
        //         } else {
        //             setLevel(e?.points[0]?.id)
        //         }

        //     }
        //     return false
        // }}
        // onHover={(e) => {
        //     handlePopoverOpen(e)
        //     e.points.map(d => {
        //         const newColors = ids.map(id => {
        //             if (id === currentClaimId || (id === 'root' && !(currentClaimId in typeDict))) {
        //                 if (id === d.id) {
        //                     return getColor('CURRENT', 1)
        //                 } else {
        //                     return getColor('CURRENT', 0.3)
        //                 }
        //             } else if (id === d.id) {
        //                 return getColor(typeDict[id], 1)
        //             } else {
        //                 return getColor(typeDict[id], 0.3)
        //             }
        //         })
        //         setColors(newColors)
        //         setClaim(claimDict[d.id])
        //     })
        // }}
        // onUnhover={(e) => {
        //     if (e.event?.toElement?.__data__ !== 0 &&
        //         e.event?.toElement?.__data__?.data?.id !== 'root') return
        //     handlePopoverClose()
        // }}
        />
        {/* <div ref={ref} /> */}
        {/* <ClickAwayListener onClickAway={handlePopoverClose} >
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement='bottom'
                sx={{ zIndex: 2000 }}>
                {/* <OverlayClaimView claim={claim} width={ref.current?.offsetWidth} /> */}
        {/* </Popper>
        </ClickAwayListener> */}
        <FormGroup>
            <FormControlLabel 
            control={<Switch defaultChecked />} 
            checked={!overview}
            onChange={e => setOverview(!e.target.checked)}
            label="Focus" />
        </FormGroup>
        <Slider value={maxdepth} onChange={(event, newValue) => setMaxdepth(newValue)} />
    </Stack>
}