import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function MembershipChart() {


const data = [
  {
    month:"Jan",
    members:120
  },
  {
    month:"Feb",
    members:180
  },
  {
    month:"Mar",
    members:250
  },
  {
    month:"Apr",
    members:320
  },
  {
    month:"May",
    members:380
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
Membership Growth
</h2>


<ResponsiveContainer
width="100%"
height={300}
>

<LineChart data={data}>


<CartesianGrid strokeDasharray="3 3"/>


<XAxis dataKey="month"/>


<YAxis/>


<Tooltip/>


<Line

type="monotone"

dataKey="members"

stroke="#2563eb"

strokeWidth={3}

/>


</LineChart>


</ResponsiveContainer>


</div>

);

}

export default MembershipChart;