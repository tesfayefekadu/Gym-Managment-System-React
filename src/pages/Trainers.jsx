import { useState } from "react";
import Pagination from "../components/common/Pagination";
import TrainerHeader from "../components/trainers/TrainerHeader";
import TrainerStats from "../components/trainers/TrainerStats";
import TrainerTable from "../components/trainers/TrainerTable";
import TrainerForm from "../components/trainers/TrainerForm";
import TrainerFilter from "../components/trainers/TrainerFilter";
import TrainerProfile from "../components/trainers/TrainerProfile";
import useTrainers from "../hooks/useTrainers";

import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Trainer() {
  const {
    trainers,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    loading,
    error,
  } = useTrainers();

  // ==========================
  // Modal States
  // ==========================

  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================
  // Filter States
  // ==========================

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [status, setStatus] = useState("All");

  // ==========================
  // Add Trainer
  // ==========================

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setShowModal(true);
  };

  // ==========================
  // View Trainer
  // ==========================

  const handleViewTrainer = (trainer) => {
    setSelectedProfile(trainer);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setSelectedProfile(null);
    setShowProfileModal(false);
  };

  // ==========================
  // Edit Trainer
  // ==========================

  const handleEditTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedTrainer(null);
  };

  // ==========================
  // Save Trainer
  // ==========================

  const handleSaveTrainer = async (trainerData) => {
    try {
      setSaving(true);

      if (selectedTrainer) {
        await updateTrainer(
          selectedTrainer.id,
          trainerData
        );
      } else {
        await addTrainer(trainerData);
      }

      // Close only after successful API request
      setShowModal(false);
      setSelectedTrainer(null);
    } catch (error) {
      console.error("Save trainer error:", error);

      // Keep modal open so user can correct the data
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Delete Trainer
  // ==========================

  const handleDeleteTrainer = (id) => {
    const trainer = trainers.find(
      (t) => t.id === id
    );

    if (!trainer) return;

    setTrainerToDelete(trainer);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTrainer = async () => {
    if (!trainerToDelete) return;

    try {
      setDeleting(true);

      await deleteTrainer(trainerToDelete.id);

      setTrainerToDelete(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete trainer error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteTrainer = () => {
    if (deleting) return;

    setTrainerToDelete(null);
    setShowDeleteDialog(false);
  };

  // ==========================
  // Reset Filters
  // ==========================

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("All");
    setStatus("All");
    setCurrentPage(1);
  };

  // ==========================
  // Filter Trainers
  // ==========================

  const filteredTrainers = trainers.filter((trainer) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      (trainer.name || "")
        .toLowerCase()
        .includes(searchValue) ||
      (trainer.phone || "")
        .toLowerCase()
        .includes(searchValue) ||
      (trainer.email || "")
        .toLowerCase()
        .includes(searchValue);

    const matchesSpecialization =
      specialization === "All" ||
      trainer.specialization === specialization;

    const matchesStatus =
      status === "All" ||
      trainer.status === status;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesStatus
    );
  });

  const [currentPage, setCurrentPage] = useState(1);

  const trainersPerPage = 10;


  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.ceil(
    filteredTrainers.length / trainersPerPage
  );

  const startIndex =
    (currentPage - 1) * trainersPerPage;

  const paginatedTrainers =
    filteredTrainers.slice(
      startIndex,
      startIndex + trainersPerPage
    );

  // ==========================
  // Loading State
  // ==========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-semibold text-gray-600">
          Loading trainers...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==========================
          Error Message
      ========================== */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* ==========================
          Header
      ========================== */}

      <TrainerHeader
        onAddTrainer={handleAddTrainer}
      />

      {/* ==========================
          Statistics
      ========================== */}

      <TrainerStats trainers={trainers} />

      {/* ==========================
          Filters
      ========================== */}

      <TrainerFilter
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        specialization={specialization}
        setSpecialization={(value) => {
          setSpecialization(value);
          setCurrentPage(1);
        }}
        status={status}
        setStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        total={filteredTrainers.length}
        onReset={handleResetFilters}
      />

      {/* ==========================
          Trainer Table
      ========================== */}

      <TrainerTable
        trainers={paginatedTrainers}
        onView={handleViewTrainer}
        onEdit={handleEditTrainer}
        onDelete={handleDeleteTrainer}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ==========================
          Add / Edit Trainer Modal
      ========================== */}

      <Modal
        isOpen={showModal}
        title={
          selectedTrainer
            ? "Edit Trainer"
            : "Add Trainer"
        }
        onClose={handleCloseModal}
      >
        <TrainerForm
          onSave={handleSaveTrainer}
          initialData={selectedTrainer}
          loading={saving}
        />
      </Modal>

      {/* ==========================
          Trainer Profile Modal
      ========================== */}

      <Modal
        isOpen={showProfileModal}
        title="Trainer Profile"
        onClose={closeProfileModal}
      >
        <TrainerProfile
          trainer={selectedProfile}
          onClose={closeProfileModal}
        />
      </Modal>

      {/* ==========================
          Delete Confirmation
      ========================== */}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Trainer"
        message={
          trainerToDelete
            ? `Are you sure you want to delete "${trainerToDelete.name}"?`
            : ""
        }
        onConfirm={confirmDeleteTrainer}
        onCancel={cancelDeleteTrainer}
        loading={deleting}
      />
    </>
  );
}

export default Trainer;