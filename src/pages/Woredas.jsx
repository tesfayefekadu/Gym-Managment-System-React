import { useEffect, useState } from "react";

import {
  getWoredas,
  createWoreda,
  updateWoreda,
} from "../services/woredaService";

function Woredas() {
  const [woredas, setWoredas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingWoreda, setEditingWoreda] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active",
  });

  // ==============================
  // LOAD WOREDAS
  // ==============================

  const loadWoredas = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWoredas();

      setWoredas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWoredas();
  }, []);

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // OPEN CREATE FORM
  // ==============================

  const handleAdd = () => {
    setEditingWoreda(null);

    setFormData({
      name: "",
      code: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const handleEdit = (woreda) => {
    setEditingWoreda(woreda);

    setFormData({
      name: woreda.name,
      code: woreda.code,
      status: woreda.status,
    });

    setShowForm(true);
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingWoreda) {
        await updateWoreda(editingWoreda.id, formData);
      } else {
        await createWoreda({
          name: formData.name,
          code: formData.code,
        });
      }

      setShowForm(false);
      setEditingWoreda(null);

      await loadWoredas();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Woreda Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage gym Woredas and their status.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Woreda
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="p-6 text-center">
            Loading Woredas...
          </div>
        ) : woredas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No Woredas found.
          </div>
        ) : (
          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="px-6 py-4 text-left">
                  ID
                </th>

                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Code
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {woredas.map((woreda) => (
                <tr
                  key={woreda.id}
                  className="border-t"
                >

                  <td className="px-6 py-4">
                    {woreda.id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {woreda.name}
                  </td>

                  <td className="px-6 py-4">
                    {woreda.code}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        woreda.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {woreda.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <button
                      onClick={() => handleEdit(woreda)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* FORM MODAL */}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                {editingWoreda
                  ? "Edit Woreda"
                  : "Add Woreda"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 text-xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="mb-4">

                <label className="block mb-2 font-medium">
                  Woreda Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Woreda 03"
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />

              </div>

              {/* CODE */}

              <div className="mb-4">

                <label className="block mb-2 font-medium">
                  Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="W03"
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />

              </div>

              {/* STATUS */}

              {editingWoreda && (
                <div className="mb-6">

                  <label className="block mb-2 font-medium">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingWoreda
                  ? "Update Woreda"
                  : "Create Woreda"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Woredas;