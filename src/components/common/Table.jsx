function Table({columns, data}) {


return (

<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">


<table className="w-full text-left">


<thead className="bg-gray-100">

<tr>

{
columns.map((column,index)=>(

<th
key={index}
className="
px-6
py-4
font-semibold
text-gray-700
"
>

{column}

</th>

))
}

</tr>

</thead>



<tbody>


{
data.map((row,index)=>(


<tr
key={index}
className="
border-b
hover:bg-gray-50
"
>


{
Object.values(row).map((value,i)=>(


<td
key={i}
className="
px-6
py-4
"
>

{value}

</td>


))

}


</tr>


))
}



</tbody>



</table>


</div>

);

}


export default Table;