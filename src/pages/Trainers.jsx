import { useState } from "react";

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
    setShowModal(false);
    setSelectedTrainer(null);
  };

  // ==========================
  // Save Trainer
  // ==========================

 const handleSaveTrainer = (trainerData) => {
  if (selectedTrainer) {
    updateTrainer(selectedTrainer.id, trainerData);
  } else {
    addTrainer(trainerData);
  }

  handleCloseModal();
};

  // ==========================
  // Delete Trainer
  // ==========================

  const handleDeleteTrainer = (id) => {
    const trainer = trainers.find((t) => t.id === id);

    setTrainerToDelete(trainer);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTrainer = () => {
  deleteTrainer(trainerToDelete.id);

  setTrainerToDelete(null);
  setShowDeleteDialog(false);
};

  const cancelDeleteTrainer = () => {
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
  };

  // ==========================
  // Filter Trainers
  // ==========================

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(search.toLowerCase()) ||
      trainer.phone.includes(search) ||
      trainer.email.toLowerCase().includes(search.toLowerCase());

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

  return (
    <>
      <TrainerHeader onAddTrainer={handleAddTrainer} />

      <TrainerStats trainers={trainers} />

      <TrainerFilter
        search={search}
        setSearch={setSearch}
        specialization={specialization}
        setSpecialization={setSpecialization}
        status={status}
        setStatus={setStatus}
        total={filteredTrainers.length}
        onReset={handleResetFilters}
      />

      <TrainerTable
        trainers={filteredTrainers}
        onView={handleViewTrainer}
        onEdit={handleEditTrainer}
        onDelete={handleDeleteTrainer}
      />

      {/* Add / Edit Trainer */}

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
        />
      </Modal>

      {/* Trainer Profile */}

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

      {/* Delete Dialog */}

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
      />
    </>
  );
}

export default Trainer;