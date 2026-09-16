const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const handleResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};

export default API_URL;