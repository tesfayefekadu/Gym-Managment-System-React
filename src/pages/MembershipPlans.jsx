import { useEffect, useState } from "react";

import PlanHeader from "../components/plans/PlanHeader";
import PlanStats from "../components/plans/PlanStats";
import PlanTable from "../components/plans/PlanTable";
import PlanForm from "../components/plans/PlanForm";
import PlanFilter from "../components/plans/PlanFilter";
import PlanView from "../components/plans/PlanView";

import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

import useMembershipPlans from "../hooks/useMembershipPlans";
import { getCurrentUser } from "../services/authService";

function MembershipPlans() {
  const {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    loading,
    error,
  } = useMembershipPlans();

  // Logged-in user and permissions
  const user = getCurrentUser();
  const role = user?.role;

  const canManagePlans =
    role === "Admin" || role === "Manager";

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [duration, setDuration] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // API operation states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, duration]);

  // Add plan
  const handleAddPlan = () => {
    if (!canManagePlans) return;

    setSelectedPlan(null);
    setShowModal(true);
  };

  // Edit plan
  const handleEditPlan = (plan) => {
    if (!canManagePlans) return;

    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Close add/edit modal
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedPlan(null);
  };

  // Save plan
  const handleSavePlan = async (planData) => {
    if (!canManagePlans) return;

    try {
      setSaving(true);

      if (selectedPlan) {
        await updatePlan(selectedPlan.id, planData);
      } else {
        await addPlan(planData);
      }

      setShowModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Save membership plan error:", error);
    } finally {
      setSaving(false);
    }
  };

  // View plan
  const handleViewPlan = (plan) => {
    setViewPlan(plan);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setViewPlan(null);
    setShowViewModal(false);
  };

  // Delete plan
  const handleDeletePlan = (id) => {
    if (!canManagePlans) return;

    const plan = plans.find((item) => item.id === id);

    if (!plan) return;

    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDeletePlan = async () => {
    if (!canManagePlans || !planToDelete) return;

    try {
      setDeleting(true);

      await deletePlan(planToDelete.id);

      setPlanToDelete(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete membership plan error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeletePlan = () => {
    if (deleting) return;

    setPlanToDelete(null);
    setShowDeleteDialog(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setDuration("All");
    setCurrentPage(1);
  };

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    const searchTerm = search.toLowerCase().trim();
    const planName = (plan.name || "").toLowerCase();
    const description = (plan.description || "").toLowerCase();

    const matchesSearch =
      planName.includes(searchTerm) ||
      description.includes(searchTerm);

    const planDuration = `${plan.duration_months} Months`;

    const matchesStatus =
      status === "All" || plan.status === status;

    const matchesDuration =
      duration === "All" || duration === planDuration;

    return matchesSearch && matchesStatus && matchesDuration;
  });

  // Pagination
  const totalItems = filteredPlans.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedPlans = filteredPlans.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-semibold text-gray-600">
          Loading membership plans...
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <PlanHeader
        onAddPlan={handleAddPlan}
        canManagePlans={canManagePlans}
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

      {/* Plans table */}
      <PlanTable
        plans={paginatedPlans}
        onView={handleViewPlan}
        onEdit={canManagePlans ? handleEditPlan : undefined}
        onDelete={canManagePlans ? handleDeletePlan : undefined}
        canManagePlans={canManagePlans}
      />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 mb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit modal */}
      {canManagePlans && (
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
            loading={saving}
          />
        </Modal>
      )}

      {/* View modal */}
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

      {/* Delete confirmation */}
      {canManagePlans && (
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
          loading={deleting}
        />
      )}
    </div>
  );
}

export default MembershipPlans;
