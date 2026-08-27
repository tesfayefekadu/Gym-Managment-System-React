import { useEffect, useState } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function PlanForm({
  onSave,
  initialData,
  existingPlans = [],
}) {
  const emptyPlan = {
    name: "",
    duration: "1 Month",
    price: "",
    description: "",
    status: "Active",
  };

  const [formData, setFormData] =
    useState(emptyPlan);

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        duration: initialData.duration || "1 Month",
        price: initialData.price || "",
        description: initialData.description || "",
        status: initialData.status || "Active",
      });
    } else {
      setFormData(emptyPlan);
    }

    setErrors({});
  }, [initialData]);

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================
  // Validate Form
  // ==========================

  const validateForm = () => {
    const newErrors = {};

    // Plan Name
    const planName = formData.name.trim();

    if (!planName) {
      newErrors.name =
        "Plan name is required.";
    } else if (planName.length < 2) {
      newErrors.name =
        "Plan name must be at least 2 characters.";
    }

    // Duration
    if (!formData.duration) {
      newErrors.duration =
        "Please select a duration.";
    }

    // Price
    const price = Number(formData.price);

    if (
      formData.price === "" ||
      formData.price === null
    ) {
      newErrors.price =
        "Price is required.";
    } else if (Number.isNaN(price)) {
      newErrors.price =
        "Price must be a valid number.";
    } else if (price <= 0) {
      newErrors.price =
        "Price must be greater than 0.";
    }

    // Description
    const description =
      formData.description.trim();

    if (!description) {
      newErrors.description =
        "Description is required.";
    } else if (description.length < 5) {
      newErrors.description =
        "Description must be at least 5 characters.";
    }

    // Status
    if (!formData.status) {
      newErrors.status =
        "Please select a status.";
    }

    // Duplicate Plan Name
    const duplicatePlan =
      existingPlans.some((plan) => {
        const sameName =
          plan.name.trim().toLowerCase() ===
          planName.toLowerCase();

        // Ignore current plan while editing
        const isDifferentPlan =
          !initialData ||
          plan.id !== initialData.id;

        return (
          sameName &&
          isDifferentPlan
        );
      });

    if (duplicatePlan) {
      newErrors.name =
        "A membership plan with this name already exists.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ==========================
  // Submit Form
  // ==========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      description:
        formData.description.trim(),
      price: Number(formData.price),
    };

    onSave(cleanedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ==========================
          Form Fields
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Plan Name */}

        <div>
          <InputField
            label="Plan Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Duration */}

        <div>
          <SelectField
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            options={[
              {
                value: "1 Month",
                label: "1 Month",
              },
              {
                value: "3 Months",
                label: "3 Months",
              },
              {
                value: "6 Months",
                label: "6 Months",
              },
              {
                value: "12 Months",
                label: "12 Months",
              },
            ]}
          />

          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">
              {errors.duration}
            </p>
          )}
        </div>

        {/* Price */}

        <div>
          <InputField
            label="Price (ETB)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price}
            </p>
          )}
        </div>

        {/* Status */}

        <div>
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

          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status}
            </p>
          )}
        </div>

      </div>

      {/* ==========================
          Description
      ========================== */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
          <span className="text-red-500 ml-1">
            *
          </span>
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Enter membership plan description..."
          className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 ${
            errors.description
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      {/* ==========================
          Form Actions
      ========================== */}

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
        >
          {initialData
            ? "Update Plan"
            : "Save Plan"}
        </Button>
      </div>
    </form>
  );
}

export default PlanForm;