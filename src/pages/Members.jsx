import { useState, useEffect } from "react";

// =====================================================
// Components
// =====================================================

import Pagination from "../components/members/Pagination";
import MemberHeader from "../components/members/MemberHeader";
import MemberFilter from "../components/members/MemberFilter";
import MemberTable from "../components/members/MemberTable";
import MemberModal from "../components/members/MemberModal";
import MemberForm from "../components/members/MemberForm";
import DeleteModal from "../components/members/DeleteModal";

// =====================================================
// API Service
// =====================================================

import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/memberService";


function Members() {

  // =====================================================
  // Member Data
  // =====================================================

  const [members, setMembers] = useState([]);


  // =====================================================
  // Loading State
  // =====================================================

  const [loading, setLoading] = useState(true);


  // =====================================================
  // Error State
  // =====================================================

  const [error, setError] = useState("");


  // =====================================================
  // Success State
  // =====================================================

  const [successMessage, setSuccessMessage] =
    useState("");


  // =====================================================
  // Saving State
  // =====================================================

  const [saving, setSaving] =
    useState(false);


  // =====================================================
  // Modal States
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);


  // =====================================================
  // Selected Member
  // =====================================================

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
  // Pagination
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const membersPerPage = 5;


  // =====================================================
  // LOAD MEMBERS
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
  // INITIAL LOAD
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
  // CLEAR SUCCESS MESSAGE
  // =====================================================

  useEffect(() => {

    if (!successMessage) {
      return;
    }

    const timer =
      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

    return () => clearTimeout(timer);

  }, [successMessage]);


  // =====================================================
  // ADD MEMBER
  // =====================================================

  const handleAddMember = () => {

    setError("");
    setSuccessMessage("");

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

    setError("");
    setSuccessMessage("");

    setSelectedMember(member);

    setShowModal(true);

  };


  // =====================================================
  // DELETE MEMBER
  // =====================================================

  const handleDeleteMember = (member) => {

    setError("");
    setSuccessMessage("");

    setSelectedMember(member);

    setShowDeleteModal(true);

  };


  // =====================================================
  // CLOSE MEMBER MODAL
  // =====================================================

  const handleCloseModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setSelectedMember(null);

  };


  // =====================================================
  // SAVE MEMBER
  // CREATE / UPDATE
  // =====================================================

  const handleSaveMember = async (
    memberData
  ) => {

    try {

      setSaving(true);

      setError("");
      setSuccessMessage("");


      // =================================================
      // UPDATE
      // =================================================

      if (selectedMember) {

        await updateMember(
          selectedMember.id,
          memberData
        );

        setSuccessMessage(
          "Member updated successfully."
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        await createMember(
          memberData
        );

        setSuccessMessage(
          "Member created successfully."
        );

      }


      // =================================================
      // RELOAD DATA
      // =================================================

      await loadMembers();


      // =================================================
      // CLOSE MODAL
      // =================================================

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

      // Keep modal open so user can correct it

    } finally {

      setSaving(false);

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
      setSuccessMessage("");


      await deleteMember(
        selectedMember.id
      );


      // =================================================
      // RELOAD MEMBERS
      // =================================================

      await loadMembers();


      setSuccessMessage(
        "Member deleted successfully."
      );


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

      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

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


      // -----------------------------------------------
      // MEMBERSHIP PLAN
      // -----------------------------------------------

      const memberPlan =
        member.membership_plan || "";


      const matchesPlan =
        planFilter === "All" ||
        memberPlan === planFilter;


      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

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
  // INITIAL ERROR SCREEN
  // =====================================================

  if (
    error &&
    members.length === 0
  ) {

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


      {/* =================================================
          HEADER
          ================================================= */}

      <MemberHeader
        onAddMember={
          handleAddMember
        }
      />


      {/* =================================================
          SUCCESS MESSAGE
          ================================================= */}

      {successMessage && (

        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">

          <span>
            {successMessage}
          </span>

          <button
            onClick={() =>
              setSuccessMessage("")
            }
            className="font-bold text-lg"
          >
            ×
          </button>

        </div>

      )}


      {/* =================================================
          ERROR MESSAGE
          ================================================= */}

      {error && (

        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError("")
            }
            className="font-bold text-lg"
          >
            ×
          </button>

        </div>

      )}


      {/* =================================================
          FILTER
          ================================================= */}

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


      {/* =================================================
          MEMBER TABLE
          ================================================= */}

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


      {/* =================================================
          PAGINATION
          ================================================= */}

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


      {/* =================================================
          ADD / EDIT MODAL
          ================================================= */}

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


      {/* =================================================
          DELETE MODAL
          ================================================= */}

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