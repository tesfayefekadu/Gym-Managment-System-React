import { useState, useEffect } from "react";

// ==========================
// Components
// ==========================
import Pagination from "../components/members/Pagination";
import MemberHeader from "../components/members/MemberHeader";
import MemberFilter from "../components/members/MemberFilter";
import MemberTable from "../components/members/MemberTable";
import MemberModal from "../components/members/MemberModal";
import MemberForm from "../components/members/MemberForm";
import DeleteModal from "../components/members/DeleteModal";

// ==========================
// API Service
// ==========================
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/memberService";


function Members() {

  // =====================================================
  // Member Data State
  // =====================================================
  const [members, setMembers] = useState([]);

  // =====================================================
  // Loading & Error State
  // =====================================================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // Modal States
  // =====================================================
  const [showModal, setShowModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedMember, setSelectedMember] =
    useState(null);


  // =====================================================
  // Filter States
  // =====================================================
  const [searchTerm, setSearchTerm] =
    useState("");

  const [planFilter, setPlanFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");


  // =====================================================
  // Pagination State
  // =====================================================
  const [currentPage, setCurrentPage] =
    useState(1);

  const membersPerPage = 5;


  // =====================================================
  // LOAD MEMBERS FROM BACKEND
  // =====================================================
  const loadMembers = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getMembers();

      console.log(
        "Members loaded:",
        data
      );

      setMembers(data);

    } catch (error) {

      console.error(
        "Failed to load members:",
        error
      );

      setError(
        error.message ||
        "Failed to load members"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD MEMBERS WHEN PAGE OPENS
  // =====================================================
  useEffect(() => {

    loadMembers();

  }, []);


  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================
  useEffect(() => {

    setCurrentPage(1);

  }, [
    searchTerm,
    planFilter,
    statusFilter,
  ]);


  // =====================================================
  // ADD MEMBER
  // =====================================================
  const handleAddMember = () => {

    setSelectedMember(null);

    setShowModal(true);

  };


  // =====================================================
  // EDIT MEMBER
  // =====================================================
  const handleEditMember = (member) => {

    console.log(
      "Editing member:",
      member
    );

    setSelectedMember(member);

    setShowModal(true);

  };


  // =====================================================
  // DELETE MEMBER
  // =====================================================
  const handleDeleteMember = (member) => {

    setSelectedMember(member);

    setShowDeleteModal(true);

  };


  // =====================================================
  // CLOSE MEMBER FORM
  // =====================================================
  const handleCloseModal = () => {

    setShowModal(false);

    setSelectedMember(null);

  };


  // =====================================================
  // SAVE MEMBER
  // CREATE OR UPDATE
  // =====================================================
  const handleSaveMember = async (
    memberData
  ) => {

    try {

      setError("");

      console.log(
        "Saving member:",
        memberData
      );


      // ==========================================
      // UPDATE EXISTING MEMBER
      // ==========================================
      if (selectedMember) {

        await updateMember(
          selectedMember.id,
          memberData
        );

      }

      // ==========================================
      // CREATE NEW MEMBER
      // ==========================================
      else {

        await createMember(
          memberData
        );

      }


      // ==========================================
      // IMPORTANT
      // Reload data from PostgreSQL
      // ==========================================
      await loadMembers();


      // ==========================================
      // Close modal
      // ==========================================
      setShowModal(false);

      setSelectedMember(null);


    } catch (error) {

      console.error(
        "Failed to save member:",
        error
      );

      setError(
        error.message ||
        "Failed to save member"
      );

    }

  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================
  const confirmDelete = async () => {

    if (!selectedMember) {
      return;
    }

    try {

      setError("");


      await deleteMember(
        selectedMember.id
      );


      // ==========================================
      // Reload members after delete
      // ==========================================
      await loadMembers();


      setShowDeleteModal(false);

      setSelectedMember(null);


    } catch (error) {

      console.error(
        "Failed to delete member:",
        error
      );

      setError(
        error.message ||
        "Failed to delete member"
      );

    }

  };


  // =====================================================
  // CANCEL DELETE
  // =====================================================
  const cancelDelete = () => {

    setShowDeleteModal(false);

    setSelectedMember(null);

  };


  // =====================================================
  // FILTER MEMBERS
  // =====================================================
  const filteredMembers =
    members.filter((member) => {

      // ------------------------------------------
      // Search
      // ------------------------------------------
      const search =
        searchTerm.toLowerCase();

      const memberName =
        member.name?.toLowerCase() || "";

      const memberPhone =
        member.phone?.toLowerCase() || "";

      const memberEmail =
        member.email?.toLowerCase() || "";


      const matchesSearch =
        memberName.includes(search) ||
        memberPhone.includes(search) ||
        memberEmail.includes(search);


      // ------------------------------------------
      // Membership Plan
      // ------------------------------------------
      const memberPlan =
        member.membership_plan || "";


      const matchesPlan =
        planFilter === "All" ||
        memberPlan === planFilter;


      // ------------------------------------------
      // Status
      // ------------------------------------------
      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;


      return (
        matchesSearch &&
        matchesPlan &&
        matchesStatus
      );

    });


  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages =
    Math.ceil(
      filteredMembers.length /
      membersPerPage
    );


  const indexOfLastMember =
    currentPage *
    membersPerPage;


  const indexOfFirstMember =
    indexOfLastMember -
    membersPerPage;


  const currentMembers =
    filteredMembers.slice(
      indexOfFirstMember,
      indexOfLastMember
    );


  // =====================================================
  // RESET FILTERS
  // =====================================================
  const handleResetFilters = () => {

    setSearchTerm("");

    setPlanFilter("All");

    setStatusFilter("All");

    setCurrentPage(1);

  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================
  if (loading) {

    return (
      <div className="p-6">

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <p className="text-gray-600 text-lg">
            Loading members...
          </p>

        </div>

      </div>
    );

  }


  // =====================================================
  // ERROR SCREEN
  // =====================================================
  if (error && members.length === 0) {

    return (
      <div className="p-6">

        <div className="bg-red-50 border border-red-300 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-red-700">
            Failed to load members
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <button
            onClick={loadMembers}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }


  // =====================================================
  // PAGE
  // =====================================================
  return (
    <div className="space-y-6">

      {/* ==========================================
          Header
          ========================================== */}
      <MemberHeader
        onAddMember={
          handleAddMember
        }
      />


      {/* ==========================================
          Error Message
          ========================================== */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError("")
            }
            className="font-bold"
          >
            ×
          </button>

        </div>
      )}


      {/* ==========================================
          Filters
          ========================================== */}
      <MemberFilter

        searchTerm={
          searchTerm
        }

        onSearch={
          setSearchTerm
        }

        planFilter={
          planFilter
        }

        onPlanChange={
          setPlanFilter
        }

        statusFilter={
          statusFilter
        }

        onStatusChange={
          setStatusFilter
        }

        totalMembers={
          `${filteredMembers.length} of ${members.length}`
        }

        onReset={
          handleResetFilters
        }

      />


      {/* ==========================================
          Member Table
          ========================================== */}
      <MemberTable

        members={
          currentMembers
        }

        onEdit={
          handleEditMember
        }

        onDelete={
          handleDeleteMember
        }

      />


      {/* ==========================================
          Pagination
          ========================================== */}
      {totalPages > 1 && (

        <Pagination

          currentPage={
            currentPage
          }

          totalPages={
            totalPages
          }

          onPageChange={
            setCurrentPage
          }

        />

      )}


      {/* ==========================================
          ADD / EDIT MODAL
          ========================================== */}
      {showModal && (

        <MemberModal

          title={
            selectedMember
              ? "Edit Member"
              : "Add New Member"
          }

          onClose={
            handleCloseModal
          }

        >

          <MemberForm

            onSave={
              handleSaveMember
            }

            initialData={
              selectedMember
            }

            members={
              members
            }

          />

        </MemberModal>

      )}


      {/* ==========================================
          DELETE MODAL
          ========================================== */}
      {showDeleteModal && (

        <DeleteModal

          member={
            selectedMember
          }

          onCancel={
            cancelDelete
          }

          onConfirm={
            confirmDelete
          }

        />

      )}

    </div>
  );
}


export default Members;