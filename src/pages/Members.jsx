import { useState } from "react";

import MemberHeader from "../components/members/MemberHeader";
import MemberSearch from "../components/members/MemberSearch";
import MemberTable from "../components/members/MemberTable";
import MemberModal from "../components/members/MemberModal";
import MemberForm from "../components/members/MemberForm";
import DeleteModal from "../components/members/DeleteModal";

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

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  // --------------------
  // ADD
  // --------------------

  const handleAddMember = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  // --------------------
  // EDIT
  // --------------------

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  // --------------------
  // DELETE
  // --------------------

  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedMembers = members.filter(
      (member) => member.id !== selectedMember.id
    );

    setMembers(updatedMembers);

    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  // --------------------
  // CLOSE MODALS
  // --------------------

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  // --------------------
  // SAVE
  // --------------------

  const handleSaveMember = (memberData) => {
    if (selectedMember) {
      const updatedMembers = members.map((member) =>
        member.id === selectedMember.id
          ? { ...memberData, id: selectedMember.id }
          : member
      );

      setMembers(updatedMembers);
    } else {
      const newMember = {
        id: members.length + 1,
        ...memberData,
      };

      setMembers([...members, newMember]);
    }

    setShowModal(false);
    setSelectedMember(null);
  };

  return (
    <>
      <MemberHeader onAddMember={handleAddMember} />

      <MemberSearch />

      <MemberTable
        members={members}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
      />

      {showModal && (
        <MemberModal
          title={selectedMember ? "Edit Member" : "Add New Member"}
          onClose={handleCloseModal}
        >
          <MemberForm
            onSave={handleSaveMember}
            initialData={selectedMember}
          />
        </MemberModal>
      )}

      {showDeleteModal && (
        <DeleteModal
          member={selectedMember}
          onCancel={handleCloseDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default Members;