import Table from "../common/Table";
import Badge from "../common/Badge";


function RecentMembers(){


const members = [

{
name:"Tesfaye",
plan:"Premium",
status:<Badge status="Active"/>
},


{
name:"Abel",
plan:"Basic",
status:<Badge status="Expired"/>
},


{
name:"John",
plan:"VIP",
status:<Badge status="Active"/>
}

];



const columns=[

"Name",
"Plan",
"Status"

];



return (

<div className="mt-8">


<h2 className="
text-xl
font-bold
mb-4
">

Recent Members

</h2>


<Table

columns={columns}

data={members}

/>


</div>




);


}


export default RecentMembers;