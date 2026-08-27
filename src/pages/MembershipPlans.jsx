import {
  useEffect,
  useState,
} from "react";

import PlanHeader from "../components/plans/PlanHeader";
import PlanStats from "../components/plans/PlanStats";
import PlanTable from "../components/plans/PlanTable";
import PlanForm from "../components/plans/PlanForm";
import PlanFilter from "../components/plans/PlanFilter";
import PlanView from "../components/plans/PlanView";

import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

function MembershipPlans() {
  // ==========================
  // Plans Data
  // ==========================

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic",
      duration: "1 Month",
      price: 1200,
      description: "Basic gym access",
      members: 25,
      status: "Active",
    },
    {
      id: 2,
      name: "Standard",
      duration: "3 Months",
      price: 3000,
      description:
        "Gym access with standard facilities",
      members: 35,
      status: "Active",
    },
    {
      id: 3,
      name: "Premium",
      duration: "6 Months",
      price: 5500,
      description:
        "Unlimited gym access",
      members: 48,
      status: "Active",
    },
    {
      id: 4,
      name: "VIP",
      duration: "12 Months",
      price: 10000,
      description:
        "Premium facilities and personal training",
      members: 15,
      status: "Inactive",
    },
  ]);

  // ==========================
  // Add / Edit Modal
  // ==========================

  const [showModal, setShowModal] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  // ==========================
  // View Modal
  // ==========================

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [viewPlan, setViewPlan] =
    useState(null);

  // ==========================
  // Delete Dialog
  // ==========================

  const [
    showDeleteDialog,
    setShowDeleteDialog,
  ] = useState(false);

  const [planToDelete, setPlanToDelete] =
    useState(null);

  // ==========================
  // Filter State
  // ==========================

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState("All");

  const [duration, setDuration] =
    useState("All");

  // ==========================
  // Pagination State
  // ==========================

  const [currentPage, setCurrentPage] =
    useState(1);

  // Change to 5 after testing
  const itemsPerPage = 2;

  // ==========================
  // Reset Page When Filters Change
  // ==========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    duration,
  ]);

  // ==========================
  // Add Plan
  // ==========================

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setShowModal(true);
  };

  // ==========================
  // Edit Plan
  // ==========================

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // ==========================
  // Close Add/Edit Modal
  // ==========================

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  // ==========================
  // Save Plan
  // ==========================

  const handleSavePlan = (planData) => {
    if (selectedPlan) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...selectedPlan,
                ...planData,
              }
            : plan
        )
      );
    } else {
      const newPlan = {
        id: Date.now(),
        ...planData,
      };

      setPlans((prev) => [
        ...prev,
        newPlan,
      ]);
    }

    handleCloseModal();
  };

  // ==========================
  // View Plan
  // ==========================

  const handleViewPlan = (plan) => {
    setViewPlan(plan);
    setShowViewModal(true);
  };

  // ==========================
  // Close View
  // ==========================

  const handleCloseView = () => {
    setViewPlan(null);
    setShowViewModal(false);
  };

  // ==========================
  // Delete Plan
  // ==========================

  const handleDeletePlan = (id) => {
    const plan = plans.find(
      (plan) => plan.id === id
    );

    if (!plan) {
      return;
    }

    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  // ==========================
  // Confirm Delete
  // ==========================

  const confirmDeletePlan = () => {
    if (!planToDelete) {
      return;
    }

    setPlans((prev) =>
      prev.filter(
        (plan) =>
          plan.id !== planToDelete.id
      )
    );

    setPlanToDelete(null);
    setShowDeleteDialog(false);
  };

  // ==========================
  // Cancel Delete
  // ==========================

  const cancelDeletePlan = () => {
    setPlanToDelete(null);
    setShowDeleteDialog(false);
  };

  // ==========================
  // Reset Filters
  // ==========================

  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setDuration("All");
    setCurrentPage(1);
  };

  // ==========================
  // Filter Plans
  // ==========================

  const filteredPlans = plans.filter((plan) => {
    const searchTerm =
      search.toLowerCase().trim();

    const matchesSearch =
      plan.name
        .toLowerCase()
        .includes(searchTerm) ||
      plan.description
        .toLowerCase()
        .includes(searchTerm);

    const matchesStatus =
      status === "All" ||
      plan.status === status;

    const matchesDuration =
      duration === "All" ||
      plan.duration === duration;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDuration
    );
  });

  // ==========================
  // Pagination Calculation
  // ==========================

  const totalItems =
    filteredPlans.length;

  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  );

  // ==========================
  // Current Page Data
  // ==========================

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedPlans =
    filteredPlans.slice(
      startIndex,
      endIndex
    );

  // ==========================
  // Keep Current Page Valid
  // ==========================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  return (
    <div>
      {/* Header */}

      <PlanHeader
        onAddPlan={handleAddPlan}
      />

      {/* Statistics */}

      <PlanStats plans={plans} />

      {/* Filters */}

      <PlanFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        duration={duration}
        setDuration={setDuration}
        total={filteredPlans.length}
        onReset={handleResetFilters}
      />

      {/* Plans Table */}

      <PlanTable
        plans={paginatedPlans}
        onView={handleViewPlan}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      {/* Pagination */}

      <div className="flex justify-center items-center gap-4 mt-6 mb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add / Edit Modal */}

      <Modal
        isOpen={showModal}
        title={
          selectedPlan
            ? "Edit Membership Plan"
            : "Add Membership Plan"
        }
        onClose={handleCloseModal}
      >
        <PlanForm
        onSave={handleSavePlan}
        initialData={selectedPlan}
        existingPlans={plans}
       />
      </Modal>

      {/* View Plan Modal */}

      <Modal
        isOpen={showViewModal}
        title="Membership Plan Details"
        onClose={handleCloseView}
      >
        <PlanView
          plan={viewPlan}
          onClose={handleCloseView}
        />
      </Modal>

      {/* Delete Confirmation */}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Membership Plan"
        message={
          planToDelete
            ? `Are you sure you want to delete "${planToDelete.name}"?`
            : ""
        }
        onConfirm={confirmDeletePlan}
        onCancel={cancelDeletePlan}
      />
    </div>
  );
}

export default MembershipPlans;