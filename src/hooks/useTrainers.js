import { useState } from "react";
import { getInitialTrainers } from "../services/trainerService";

function useTrainers() {
  const [trainers, setTrainers] = useState(
    getInitialTrainers()
  );

  const addTrainer = (trainer) => {
    setTrainers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...trainer,
      },
    ]);
  };

  const updateTrainer = (id, trainerData) => {
    setTrainers((prev) =>
      prev.map((trainer) =>
        trainer.id === id
          ? { ...trainer, ...trainerData }
          : trainer
      )
    );
  };

  const deleteTrainer = (id) => {
    setTrainers((prev) =>
      prev.filter((trainer) => trainer.id !== id)
    );
  };

  return {
    trainers,
    setTrainers,
    addTrainer,
    updateTrainer,
    deleteTrainer,
  };
}

export default useTrainers;