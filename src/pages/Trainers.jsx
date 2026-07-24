import { useState } from "react";

import TrainerHeader from "../components/trainers/TrainerHeader";
import TrainerTable from "../components/trainers/TrainerTable";
import TrainerModal from "../components/trainers/TrainerModal";
import TrainerForm from "../components/trainers/TrainerForm";

function Trainer() {
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: "Abel Bekele",
      gender: "Male",
      phone: "0911223344",
      email: "abel@gmail.com",
      specialization: "Weight Training",
      experience: 5,
      salary: 15000,
      hireDate: "2025-01-10",
      status: "Active",
    },
    {
      id: 2,
      name: "John Mark",
      gender: "Male",
      phone: "0912334455",
      email: "john@gmail.com",
      specialization: "Cardio",
      experience: 3,
      salary: 12000,
      hireDate: "2025-03-15",
      status: "Active",
    },
    {
      id: 3,
      name: "Samuel Tesfaye",
      gender: "Male",
      phone: "0913445566",
      email: "samuel@gmail.com",
      specialization: "Yoga",
      experience: 7,
      salary: 18000,
      hireDate: "2024-08-01",
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  // Open Add Trainer Modal
  const handleAddTrainer = () => {
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Save Trainer
  const handleSaveTrainer = (trainerData) => {
    const newTrainer = {
      id: trainers.length + 1,
      ...trainerData,
    };

    setTrainers([...trainers, newTrainer]);

    setShowModal(false);
  };

  return (
    <>
      <TrainerHeader onAddTrainer={handleAddTrainer} />

      <TrainerTable trainers={trainers} />

      {showModal && (
        <TrainerModal
          title="Add New Trainer"
          onClose={handleCloseModal}
        >
          <TrainerForm onSave={handleSaveTrainer} />
        </TrainerModal>
      )}
    </>
  );
}

export default Trainer;