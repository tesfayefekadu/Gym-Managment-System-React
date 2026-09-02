import { useEffect, useState } from "react";

import {
  getTrainers,
  createTrainer,
  updateTrainer as updateTrainerApi,
  deleteTrainer as deleteTrainerApi,
} from "../services/trainerService";

function useTrainers() {
  const [trainers, setTrainers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // GET TRAINERS
  // ==========================

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTrainers();

      setTrainers(data);
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
      setError(error.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD ON COMPONENT MOUNT
  // ==========================

  useEffect(() => {
    fetchTrainers();
  }, []);

  // ==========================
  // ADD TRAINER
  // ==========================

  const addTrainer = async (trainerData) => {
    try {
      setError("");

      const newTrainer = await createTrainer(trainerData);

      setTrainers((prev) => [
        newTrainer,
        ...prev,
      ]);

      return newTrainer;
    } catch (error) {
      console.error("Failed to add trainer:", error);
      setError(error.message || "Failed to add trainer");

      throw error;
    }
  };

  // ==========================
  // UPDATE TRAINER
  // ==========================

  const updateTrainer = async (id, trainerData) => {
    try {
      setError("");

      const updatedTrainer = await updateTrainerApi(
        id,
        trainerData
      );

      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer.id === id
            ? updatedTrainer
            : trainer
        )
      );

      return updatedTrainer;
    } catch (error) {
      console.error("Failed to update trainer:", error);
      setError(error.message || "Failed to update trainer");

      throw error;
    }
  };

  // ==========================
  // DELETE TRAINER
  // ==========================

  const deleteTrainer = async (id) => {
    try {
      setError("");

      await deleteTrainerApi(id);

      setTrainers((prev) =>
        prev.filter(
          (trainer) => trainer.id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete trainer:", error);
      setError(error.message || "Failed to delete trainer");

      throw error;
    }
  };

  return {
    trainers,
    setTrainers,

    loading,
    error,

    fetchTrainers,

    addTrainer,
    updateTrainer,
    deleteTrainer,
  };
}

export default useTrainers;