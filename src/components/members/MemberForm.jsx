import { useEffect, useState } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function MemberForm({
  onSave,
  initialData,
  members = [],
}) {
  const emptyMember = {
    name: "",
    gender: "Male",
    phone: "",
    email: "",
    date_of_birth: "",
    plan_id: "",
    status: "Active",
    join_date: "",
  };

  const [formData, setFormData] =
    useState(emptyMember);

  const [errors, setErrors] = useState({});

  // ==========================
  // Populate Form
  // ==========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        gender: initialData.gender || "Male",
        phone: initialData.phone || "",
        email: initialData.email || "",
        date_of_birth:
          initialData.date_of_birth || "",
        plan_id:
          initialData.plan_id
            ? String(initialData.plan_id)
            : "",
        status:
          initialData.status || "Active",
        join_date:
          initialData.join_date || "",
      });
    } else {
      setFormData(emptyMember);
    }

    setErrors({});
  }, [initialData]);

  // ==========================
  // Handle Change
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================
  // Validation
  // ==========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Member name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!formData.plan_id) {
      newErrors.plan_id =
        "Membership plan is required";
    }

    if (!formData.join_date) {
      newErrors.join_date =
        "Join date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert plan_id to number
    const memberData = {
      name: formData.name.trim(),
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      date_of_birth:
        formData.date_of_birth || null,
      plan_id: Number(formData.plan_id),
      status: formData.status,
      join_date: formData.join_date,
    };

    onSave(memberData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {/* ==========================
          Name
          ========================== */}
      <div>
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* ==========================
          Gender
          ========================== */}
      <SelectField
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        options={[
          {
            value: "Male",
            label: "Male",
          },
          {
            value: "Female",
            label: "Female",
          },
        ]}
      />

      {/* ==========================
          Phone
          ========================== */}
      <div>
        <InputField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">
            {errors.phone}
          </p>
        )}
      </div>

      {/* ==========================
          Email
          ========================== */}
      <div>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* ==========================
          Date of Birth
          ========================== */}
      <InputField
        label="Date of Birth"
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
      />

      {/* ==========================
          Membership Plan
          ========================== */}
      <div>
        <SelectField
          label="Membership Plan"
          name="plan_id"
          value={formData.plan_id}
          onChange={handleChange}
          options={[
            {
              value: "",
              label: "Select Membership Plan",
            },
            {
              value: "1",
              label: "Basic",
            },
            {
              value: "2",
              label: "Standard",
            },
            {
              value: "3",
              label: "Premium",
            },
            {
              value: "4",
              label: "VIP",
            },
          ]}
        />

        {errors.plan_id && (
          <p className="mt-1 text-sm text-red-500">
            {errors.plan_id}
          </p>
        )}
      </div>

      {/* ==========================
          Status
          ========================== */}
      <SelectField
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          {
            value: "Active",
            label: "Active",
          },
          {
            value: "Inactive",
            label: "Inactive",
          },
        ]}
      />

      {/* ==========================
          Join Date
          ========================== */}
      <div>
        <InputField
          label="Join Date"
          type="date"
          name="join_date"
          value={formData.join_date}
          onChange={handleChange}
          required
        />

        {errors.join_date && (
          <p className="mt-1 text-sm text-red-500">
            {errors.join_date}
          </p>
        )}
      </div>

      {/* ==========================
          Submit
          ========================== */}
      <div className="flex justify-end md:col-span-2">
        <Button
          type="submit"
          variant="primary"
        >
          {initialData
            ? "Update Member"
            : "Save Member"}
        </Button>
      </div>
    </form>
  );
}

export default MemberForm;