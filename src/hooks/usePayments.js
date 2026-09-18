import { useEffect, useState } from "react";

import {
  getPayments,
  createPayment,
  updatePayment as updatePaymentApi,
  deletePayment as deletePaymentApi,
} from "../services/paymentService";

function usePayments() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PAYMENTS
  // ========================================

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPayments();

      setPayments(data);
    } catch (error) {
      console.error(
        "Failed to fetch payments:",
        error
      );

      setError(
        error.message ||
          "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchPayments();
  }, []);

  // ========================================
  // ADD PAYMENT
  // ========================================

  const addPayment = async (paymentData) => {
    try {
      setError("");

      const newPayment =
        await createPayment(paymentData);

      setPayments((prev) => [
        newPayment,
        ...prev,
      ]);

      return newPayment;
    } catch (error) {
      console.error(
        "Failed to add payment:",
        error
      );

      setError(
        error.message ||
          "Failed to add payment"
      );

      throw error;
    }
  };

  // ========================================
  // UPDATE PAYMENT
  // ========================================

  const updatePayment = async (
    id,
    paymentData
  ) => {
    try {
      setError("");

      const updatedPayment =
        await updatePaymentApi(
          id,
          paymentData
        );

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? updatedPayment
            : payment
        )
      );

      return updatedPayment;
    } catch (error) {
      console.error(
        "Failed to update payment:",
        error
      );

      setError(
        error.message ||
          "Failed to update payment"
      );

      throw error;
    }
  };

  // ========================================
  // DELETE PAYMENT
  // ========================================

  const deletePayment = async (id) => {
    try {
      setError("");

      await deletePaymentApi(id);

      setPayments((prev) =>
        prev.filter(
          (payment) =>
            payment.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete payment:",
        error
      );

      setError(
        error.message ||
          "Failed to delete payment"
      );

      throw error;
    }
  };

  return {
    payments,
    setPayments,

    loading,
    error,

    fetchPayments,

    addPayment,
    updatePayment,
    deletePayment,
  };
}

export default usePayments;