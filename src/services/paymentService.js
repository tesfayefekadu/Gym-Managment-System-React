import API_URL, { handleResponse } from "./api";

// GET ALL PAYMENTS
export const getPayments = async () => {
  const response = await fetch(`${API_URL}/payments`);
  return await handleResponse(response);
};

// GET PAYMENT BY ID
export const getPaymentById = async (id) => {
  const response = await fetch(`${API_URL}/payments/${id}`);
  return await handleResponse(response);
};

// CREATE PAYMENT
export const createPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  return await handleResponse(response);
};

// UPDATE PAYMENT
export const updatePayment = async (id, paymentData) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  return await handleResponse(response);
};

// DELETE PAYMENT
export const deletePayment = async (id) => {
  const response = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
  });

  return await handleResponse(response);
};