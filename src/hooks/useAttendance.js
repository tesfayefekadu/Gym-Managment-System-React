import { useEffect, useState } from "react";

import {
  getAttendance,
  createAttendance,
  updateAttendance as updateAttendanceApi,
  deleteAttendance as deleteAttendanceApi,
} from "../services/attendanceService";

function useAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH ATTENDANCE
  // ========================================
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAttendance();

      setAttendance(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);

      setError(
        error.message || "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {
    fetchAttendance();
  }, []);

  // ========================================
  // ADD ATTENDANCE
  // ========================================
  const addAttendance = async (attendanceData) => {
    try {
      setError("");

      const newAttendance =
        await createAttendance(attendanceData);

      setAttendance((prev) => [
        newAttendance,
        ...prev,
      ]);

      return newAttendance;
    } catch (error) {
      console.error(
        "Failed to add attendance:",
        error
      );

      setError(
        error.message || "Failed to add attendance"
      );

      throw error;
    }
  };

  // ========================================
  // UPDATE ATTENDANCE
  // ========================================
  const updateAttendance = async (
    id,
    attendanceData
  ) => {
    try {
      setError("");

      const updatedAttendance =
        await updateAttendanceApi(
          id,
          attendanceData
        );

      setAttendance((prev) =>
        prev.map((record) =>
          record.id === id
            ? updatedAttendance
            : record
        )
      );

      return updatedAttendance;
    } catch (error) {
      console.error(
        "Failed to update attendance:",
        error
      );

      setError(
        error.message ||
          "Failed to update attendance"
      );

      throw error;
    }
  };

  // ========================================
  // DELETE ATTENDANCE
  // ========================================
  const deleteAttendance = async (id) => {
    try {
      setError("");

      await deleteAttendanceApi(id);

      setAttendance((prev) =>
        prev.filter(
          (record) => record.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete attendance:",
        error
      );

      setError(
        error.message ||
          "Failed to delete attendance"
      );

      throw error;
    }
  };

  return {
    attendance,
    setAttendance,

    loading,
    error,

    fetchAttendance,

    addAttendance,
    updateAttendance,
    deleteAttendance,
  };
}

export default useAttendance;