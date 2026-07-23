import { useState, useEffect } from "react";

import Pagination from "../components/members/Pagination";
import MemberHeader from "../components/members/MemberHeader";
import MemberFilter from "../components/members/MemberFilter";
import MemberTable from "../components/members/MemberTable";
import MemberModal from "../components/members/MemberModal";
import MemberForm from "../components/members/MemberForm";
import DeleteModal from "../components/members/DeleteModal";


function Members() {

  // ==========================
  // Member Data State
  // ==========================
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


  // ==========================
  // Modal States
  // ==========================
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  // ==========================
  // Filter States
  // ==========================
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // ==========================
  // Pagination State
  // ==========================
  const [currentPage, setCurrentPage] = useState(1);

  const membersPerPage = 5;



  // Reset page when filtering
  useEffect(() => {

    setCurrentPage(1);

  }, [
    searchTerm,
    planFilter,
    statusFilter
  ]);

  // Add Member
  // ==========================
  const handleAddMember = () => {

    setSelectedMember(null);

    setShowModal(true);

  };

  // ==========================
  // Edit Member
  // ==========================
  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);

  };

  // Delete Member
  // ==========================
  const handleDeleteMember = (member) => {

    setSelectedMember(member);

    setShowDeleteModal(true);

  };



  const confirmDelete = () => {
    setMembers(
      members.filter(
        (member) =>
          member.id !== selectedMember.id
      )
    );
    setShowDeleteModal(false);
    setSelectedMember(null);
  };
  // Save Add/Edit Member
  // ==========================
  const handleSaveMember = (memberData) => {
    if (selectedMember) {
      // Update existing member
      const updatedMembers =
        members.map((member) =>
          member.id === selectedMember.id
            ? {
                ...memberData,
                id: selectedMember.id
              }
            : member
        );
      setMembers(updatedMembers);
    } else {
      // Add new member
      const newMember = {
        id:
          members.length > 0
            ? Math.max(
                ...members.map(
                  (m) => m.id
                )
              ) + 1
            : 1,

        ...memberData,
      };
      setMembers([
        ...members,
        newMember
      ]);
    }
    setShowModal(false);
    setSelectedMember(null);

  };
  // Filtering Logic
  // ==========================
  const filteredMembers =
    members.filter((member) => {
      const matchesSearch =
        member.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
        ||
        member.phone.includes(searchTerm);
      const matchesPlan =
        planFilter === "All"
        ||
        member.plan === planFilter;
      const matchesStatus =
        statusFilter === "All"
        ||
        member.status === statusFilter;
      return (
        matchesSearch &&
        matchesPlan &&
        matchesStatus
      );
    });
  // Pagination Logic
  // ==========================
  const totalPages =
    Math.ceil(
      filteredMembers.length /
      membersPerPage
    );
  const indexOfLastMember =
    currentPage * membersPerPage;
  const indexOfFirstMember =
    indexOfLastMember -
    membersPerPage;
  const currentMembers =
    filteredMembers.slice(
      indexOfFirstMember,
      indexOfLastMember
    );
  // Reset Filters
  // ==========================
  const handleResetFilters = () => {
    setSearchTerm("");
    setPlanFilter("All");
    setStatusFilter("All");
  };
  return (
    <>
      <MemberHeader
        onAddMember={handleAddMember}
      />
     <MemberFilter
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        planFilter={planFilter}
        onPlanChange={setPlanFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        totalMembers={
          `${filteredMembers.length} of ${members.length}`
        }
        onReset={handleResetFilters}
      />
      <MemberTable
        members={currentMembers}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
      />
      {
        totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )
      }
      {
        showModal && (
          <MemberModal
            title={
              selectedMember
              ? "Edit Member"
              : "Add New Member"
            }
            onClose={() => {
              setShowModal(false);
              setSelectedMember(null);
            }}
          >
            <MemberForm
              onSave={handleSaveMember}
              initialData={selectedMember}
               members={members}
            />
          </MemberModal>
        )
      }
      {
        showDeleteModal && (
          <DeleteModal
            member={selectedMember}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedMember(null);
            }}
            onConfirm={confirmDelete}
          />
        )
      }
    </>
  );
}
export default Members;