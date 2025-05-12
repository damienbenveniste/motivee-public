import ReactApexChart from "react-apexcharts"
import {useRef} from 'react'
import Chart from "react-apexcharts";
import { CircularProgress } from "@mui/material";


export default function DonutChart({ data }) {

    const ref = useRef()
    if (data.length === 0) return

    const labels = ['Agreed', "Disagreed"]

    const options = {
        chart: {
            id: "basic-donut"
        },
        dataLabels: {
            formatter: function (val, series) {
              return `${labels[series.seriesIndex]} ${val.toFixed(1)}%`
            }
        },
        labels: labels,
        // responsive: [{
        //     breakpoint: 480,
        // }],
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Votes',
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
        height={350}
        width={350}
        options={options}
        series={data}
        type="donut" /> : <CircularProgress/>
}
