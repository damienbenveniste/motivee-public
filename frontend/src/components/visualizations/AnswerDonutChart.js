import ReactApexChart from "react-apexcharts"
import {useRef} from 'react'
import Chart from "react-apexcharts";
import { CircularProgress } from "@mui/material";

const colorDict = {
    'Positive Consensus': '#0ccc13', 
    'Indeterminate': '#ff9e17', 
    'Negative Consensus': '#fa1b1b',
}


export default function AnswerDonutChart({ data, labels }) {

    const ref = useRef()

    if (data.length === 0) return

    const options = {
        chart: {
            id: "basic-donut"
        },
        labels: labels,
        // responsive: [{
        //     breakpoint: 480,
        // }],
        legend: {
            show: true,
            position: 'bottom'
            // fontSize: "60px"
        },
        colors: labels.map(l => colorDict[l]),
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Answers',
                            fontSize: '30px',
                        },
                        value: {
                            show: true,
                            fontSize: '30px'
                        }
                    }
                }
            }
        }
    }

    return ref ? <Chart
        ref={ref}
        height={400}
        width={400}
        options={options}
        series={data}
        type="donut" /> : <CircularProgress/>
}
