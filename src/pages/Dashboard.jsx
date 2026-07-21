import StatCard from "../components/dashboard/StatCard";
import RecentMembers 
from "../components/dashboard/RecentMembers";

import MembershipChart 
from "../components/dashboard/charts/MembershipChart";

import RevenueChart 
from "../components/dashboard/charts/RevenueChart";

import AttendanceChart 
from "../components/dashboard/charts/AttendanceChart";


function Dashboard() {


const cards = [
  {
    title:"Total Members",
    value:"350",
    icon:"👥"
  },

  {
    title:"Active Members",
    value:"280",
    icon:"💪"
  },

  {
    title:"Trainers",
    value:"15",
    icon:"🏋️"
  },

  {
    title:"Revenue",
    value:"120,000 ETB",
    icon:"💰"
  }
];


return (

<div>

<h1 className="
text-3xl 
font-bold 
mb-6
">
Dashboard
</h1>

<p className="
text-gray-500
mt-2
">
Welcome back! Here is today's gym summary.
</p>


<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
">


{
cards.map((card,index)=>(

<StatCard

key={index}

title={card.title}

value={card.value}

icon={card.icon}

/>

))
}


</div>
<RecentMembers />
<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
mt-8
">


<MembershipChart />

<RevenueChart />


</div>


<div className="mt-8">

<AttendanceChart />

</div>

</div>


);


}


export default Dashboard;