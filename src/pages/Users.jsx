import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { createManagedUser } from "../services/userService";
import useUsers from "../hooks/useUsers";
import { getWoredas } from "../services/woredaService";

function Users() {
  const currentUser = getCurrentUser();
  const { users, loading, error, reloadUsers } = useUsers();

  const isAdmin = currentUser?.role === "Admin";
  const isManager = currentUser?.role === "Manager";

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [woredaLoadError, setWoredaLoadError] = useState("");
  const [woredas, setWoredas] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: isAdmin ? "Manager" : "Staff",
    woreda_id: "",
  });

  // Load Woredas for Admin so names can be displayed in the table
  // and active Woredas can be selected when creating a Manager.
  useEffect(() => {
    if (!isAdmin) return undefined;

    let cancelled = false;

    const loadWoredas = async () => {
      try {
        setWoredaLoadError("");

        const data = await getWoredas();

        if (!cancelled) {
          setWoredas(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setWoredaLoadError(
            err.message || "Failed to load Woredas."
          );
        }
      }
    };

    loadWoredas();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  // Map Woreda IDs to names for the Admin's user table.
  const woredaNameById = useMemo(() => {
    return new Map(
      woredas.map((woreda) => [
        String(woreda.id),
        woreda.name,
      ])
    );
  }, [woredas]);

  const activeWoredas = useMemo(
    () => woredas.filter((woreda) => woreda.status === "Active"),
    [woredas]
  );

  if (!isAdmin && !isManager) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-gray-500">
          You are not allowed to manage users.
        </p>
      </div>
    );
  }

  const openCreateForm = () => {
    setFormError("");
    setSuccess("");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: isAdmin ? "Manager" : "Staff",
      woreda_id: "",
    });

    if (isAdmin && woredaLoadError) {
      setFormError(
        `Unable to load Woredas: ${woredaLoadError}`
      );
      return;
    }

    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) return;

    setShowForm(false);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setFormError("");
    setSuccess("");

    try {
      const name = formData.name.trim();
      const email = formData.email.trim().toLowerCase();

      if (name.length < 2) {
        throw new Error(
          "Name must contain at least 2 characters."
        );
      }

      if (formData.password.length < 8) {
        throw new Error(
          "Password must contain at least 8 characters."
        );
      }

      const payload = {
        name,
        email,
        password: formData.password,
        role: isAdmin ? "Manager" : "Staff",
      };

      if (isAdmin) {
        if (!formData.woreda_id) {
          throw new Error("Please select a Woreda.");
        }

        const selectedWoreda = activeWoredas.find(
          (woreda) =>
            String(woreda.id) === String(formData.woreda_id)
        );

        if (!selectedWoreda) {
          throw new Error(
            "Please select a valid active Woreda."
          );
        }

        payload.woreda_id = Number(formData.woreda_id);
      }

      // Managers do not send woreda_id. The backend must assign
      // their own Woreda to the Staff account.
      const result = await createManagedUser(payload);

      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: isAdmin ? "Manager" : "Staff",
        woreda_id: "",
      });

      setSuccess(
        result?.message ||
          `${payload.role} created successfully.`
      );

      await reloadUsers();
    } catch (err) {
      setFormError(
        err.message || "Failed to create user."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? "Manage Managers and Staff across all Woredas."
              : "Manage Staff within your assigned Woreda."}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700"
        >
          + Create {isAdmin ? "Manager" : "Staff"}
        </button>
      </div>

      {/* User-list errors */}
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Woreda loading errors */}
      {isAdmin && woredaLoadError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-red-700"
        >
          Failed to load Woredas: {woredaLoadError}
        </div>
      )}

      {/* Form errors outside the modal */}
      {formError && !showForm && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-red-700"
        >
          {formError}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          role="status"
          className="rounded-lg bg-green-50 p-3 text-green-700"
        >
          {success}
        </div>
      )}

      {/* Users table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>

                {isAdmin && (
                  <th className="px-5 py-4">Woreda</th>
                )}

                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    {user.role}
                  </td>

                  {isAdmin && (
                    <td className="px-5 py-4">
                      {user.woreda_id == null
                        ? "Sub-city Admin"
                        : woredaNameById.get(
                            String(user.woreda_id)
                          ) ?? `Woreda #${user.woreda_id}`}
                    </td>
                  )}

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create-user modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
            className="my-8 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="create-user-title"
                className="text-xl font-bold"
              >
                Create {isAdmin ? "Manager" : "Staff"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {formError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-1 block text-sm font-medium"
                >
                  Full name
                </label>

                <input
                  id="user-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  required
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="user-password"
                  className="mb-1 block text-sm font-medium"
                >
                  Temporary password
                </label>

                <input
                  id="user-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="At least 8 characters"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Share the temporary password securely with
                  the new user.
                </p>
              </div>

              {isAdmin && (
                <div>
                  <label
                    htmlFor="user-woreda"
                    className="mb-1 block text-sm font-medium"
                  >
                    Assign Woreda
                  </label>

                  <select
                    id="user-woreda"
                    name="woreda_id"
                    value={formData.woreda_id}
                    onChange={handleChange}
                    required
                    disabled={
                      activeWoredas.length === 0 ||
                      Boolean(woredaLoadError)
                    }
                    className="w-full rounded-lg border px-3 py-2.5 disabled:bg-gray-100"
                  >
                    <option value="">
                      Select an Active Woreda
                    </option>

                    {activeWoredas.map((woreda) => (
                      <option
                        key={woreda.id}
                        value={woreda.id}
                      >
                        {woreda.name} ({woreda.code})
                      </option>
                    ))}
                  </select>

                  {!woredaLoadError &&
                    activeWoredas.length === 0 && (
                      <p className="mt-1 text-sm text-amber-700">
                        No Active Woredas available. Create or
                        activate a Woreda first.
                      </p>
                    )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-lg border px-4 py-2.5 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (isAdmin &&
                      (activeWoredas.length === 0 ||
                        Boolean(woredaLoadError)))
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating..."
                    : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;