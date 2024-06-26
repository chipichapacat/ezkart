"use client";
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from "chart.js"
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement,CategoryScale,LinearScale, Tooltip, Legend);

interface BarGraphProps{
    data:GraphData[]
}

type GraphData = {
    day:string,
    date:string,
    totalAmount:number
}

const BarGraph:React.FC<BarGraphProps> = ({data}) => {
    // console.log(data)
    const labels = data.map((item)=>{return item.day})
    const amount = data.map((item)=>{return item.totalAmount})

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Total Amount',
                data: amount,
                backgroundColor:"rgba(75,192,192,0.6)",
                borderColor:"rgba(75,192,192,1)",
                borderWidth:1
            },
        ]
    }

    const options = {
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }

    return (
        <Bar data={chartData} options={options}></Bar>
    );
}
 
export default BarGraph;
