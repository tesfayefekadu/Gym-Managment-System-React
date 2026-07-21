import {
PieChart,
Pie,
Cell,
Tooltip,
ResponsiveContainer
} from "recharts";


function AttendanceChart(){


const data=[

{
name:"Present",
value:280
},

{
name:"Absent",
value:70
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
font-semibold
text-gray-800
mb-6
">
Attendance Overview
</h2>


<ResponsiveContainer
width="100%"
height={300}
>


<PieChart>


<Pie

data={data}

dataKey="value"

nameKey="name"

outerRadius={100}

>

{
data.map((entry,index)=>(

<Cell
key={index}
fill={
index === 0
? "#22c55e"
: "#ef4444"
}
/>

))
}

</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>


</div>

);

}


export default AttendanceChart;