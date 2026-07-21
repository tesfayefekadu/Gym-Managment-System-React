import { useState } from "react";

import MemberHeader from "../components/members/MemberHeader";
import MemberSearch from "../components/members/MemberSearch";
import MemberTable from "../components/members/MemberTable";
import MemberModal from "../components/members/MemberModal";
import MemberForm from "../components/members/MemberForm";

function Members() {
  const [members, setMembers] = useState([
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

  // Controls whether the modal is visible
  const [showModal, setShowModal] = useState(false);

  // Open modal
  const handleAddMember = () => {
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Save new member
  const handleSaveMember = (newMember) => {
    const member = {
      id: members.length + 1,
      ...newMember,
    };

    setMembers([...members, member]);

    setShowModal(false);
  };

  return (
    <>
      <MemberHeader onAddMember={handleAddMember} />

      <MemberSearch />

      <MemberTable members={members} />

      {showModal && (
        <MemberModal onClose={handleCloseModal}>
          <MemberForm onSave={handleSaveMember} />
        </MemberModal>
      )}
    </>
  );
}

export default Members;