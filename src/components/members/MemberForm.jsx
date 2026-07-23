import { useState, useEffect } from "react";

function MemberForm({ onSave, initialData, members }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plan: "Basic",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        phone: "",
        plan: "Basic",
        status: "Active",
      });
    }

    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone must start with 09 and contain exactly 10 digits.";
    } else {
      const duplicate = members.find(
        (member) =>
          member.phone === formData.phone &&
          member.id !== initialData?.id
      );

      if (duplicate) {
        newErrors.phone = "Phone number already exists.";
      }
    }

    // Plan
    if (!formData.plan) {
      newErrors.plan = "Select a membership plan.";
    }

    // Status
    if (!formData.status) {
      newErrors.status = "Select a status.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}

      <div>
        <label className="block font-medium mb-2">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.name
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />

        {errors.name && (
          <p className="text-red-600 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone */}

      <div>
        <label className="block font-medium mb-2">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.phone
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />

        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Plan */}

      <div>
        <label className="block font-medium mb-2">
          Membership Plan
        </label>

        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* Status */}

      <div>
        <label className="block font-medium mb-2">
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
      >
        {initialData ? "Update Member" : "Save Member"}
      </button>

    </form>
  );
}

export default MemberForm;