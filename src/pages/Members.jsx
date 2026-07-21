import { useState } from "react";

import MemberHeader from "../components/members/MemberHeader";
import MemberSearch from "../components/members/MemberSearch";
import MemberTable from "../components/members/MemberTable";

function Members() {

  const [members] = useState([
    {
      id: 1,
      name: "Tesfaye",
      plan: "Premium",
      phone: "0911223344",
      status: "Active",
    },
    {
      id: 2,
      name: "Abel",
      plan: "Basic",
      phone: "0912334455",
      status: "Active",
    },
    {
      id: 3,
      name: "John",
      plan: "VIP",
      phone: "0913445566",
      status: "Expired",
    },
  ]);

  const handleAddMember = () => {
    console.log("Add Member");
  };

  return (
    <>
      <MemberHeader onAddMember={handleAddMember} />

      <MemberSearch />

      <MemberTable members={members} />
    </>
  );
}

export default Members;