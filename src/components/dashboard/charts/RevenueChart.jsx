import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";


function RevenueChart(){


const data=[

{
month:"Jan",
revenue:30000
},

{
month:"Feb",
revenue:45000
},

{
month:"Mar",
revenue:60000
},

{
month:"Apr",
revenue:80000
}

];


return (

<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
mb-4
">

Revenue

</h2>


<ResponsiveContainer
width="100%"
height={300}
>


<BarChart data={data}>


<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>


<Bar

dataKey="revenue"

fill="#16a34a"

/>


</BarChart>


</ResponsiveContainer>


</div>

);

}


export default RevenueChart;