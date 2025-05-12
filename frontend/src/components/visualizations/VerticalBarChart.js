import Chart from "react-apexcharts";

export default function VerticalBarChart({ claim, max=null, ...props }) {

    const options = {
        chart: {
            id: "basic-bar",
            toolbar: { 
                show: false,
            },
            sparkline: {
                enabled: true
              }
        },
        xaxis: {
            categories: ['votes']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        legend: { show: false },
        grid: {show: false},
    }
    const series = [
        {
            name: "Up Votes",
            data: [claim?.up_votes]
        },
        {
            name: "Down Votes",
            data: [claim?.down_votes]
        }
    ]

    if (max) {
        options['yaxis'] = {max: max}
    }

    return <Chart
        {...props}
        options={options}
        series={series}
        type="bar"
        width='100%'
        height={30}
    />


}