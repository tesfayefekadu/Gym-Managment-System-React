import { useState, useEffect } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import { getWoredas } from "../../services/woredaService";
import { getCurrentUser } from "../../services/authService";

function TrainerForm({ onSave, initialData }) {
  // Only Admin picks a Woreda. Managers always create trainers in
  // their own Woreda (the API takes it from their login token).
  const isAdmin = getCurrentUser()?.role === "Admin";
  const showWoredaPicker = isAdmin && !initialData;

  const emptyTrainer = {
    name: "",
    gender: "Male",
    phone: "",
    email: "",
    specialization: "Weight Training",
    experience: "",
    salary: "",
    hireDate: "",
    status: "Active",
    woreda_id: "",
  };

  const [formData, setFormData] = useState(emptyTrainer);

  const [woredas, setWoredas] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyTrainer);
    }

    setErrors({});
  }, [initialData]);

  // Load Woredas for the Admin picker
  useEffect(() => {
    if (!showWoredaPicker) return;

    const loadWoredas = async () => {
      try {
        const data = await getWoredas();
        setWoredas(data || []);
      } catch (error) {
        console.error("Failed to load woredas:", error);
        setErrors((prev) => ({
          ...prev,
          woreda_id: "Failed to load woredas.",
        }));
      }
    };

    loadWoredas();
  }, [showWoredaPicker]);

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

  const validateForm = () => {
    const newErrors = {};

    // Woreda (Admin, new trainer only)
    if (showWoredaPicker && !formData.woreda_id) {
      newErrors.woreda_id = "Please select a woreda.";
    }

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Trainer name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Trainer name must be at least 3 characters.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must be 10 digits (Example: 0912345678).";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Experience
    if (formData.experience === "") {
      newErrors.experience =
        "Experience is required.";
    } else if (Number(formData.experience) < 0) {
      newErrors.experience =
        "Experience cannot be negative.";
    }

    // Salary
    if (formData.salary === "") {
      newErrors.salary = "Salary is required.";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary =
        "Salary must be greater than zero.";
    }

    // Hire Date
    if (!formData.hireDate) {
      newErrors.hireDate =
        "Hire date is required.";
    } else {
      const selectedDate = new Date(formData.hireDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.hireDate =
          "Hire date cannot be in the future.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...formData,
      woreda_id: formData.woreda_id
        ? Number(formData.woreda_id)
        : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {showWoredaPicker && (
        <div className="md:col-span-2">
          <SelectField
            label="Woreda"
            name="woreda_id"
            required
            value={formData.woreda_id}
            onChange={handleChange}
            error={errors.woreda_id}
            options={[
              { value: "", label: "Select woreda" },
              ...woredas.map((woreda) => ({
                value: woreda.id,
                label: woreda.code
                  ? `${woreda.name} (${woreda.code})`
                  : woreda.name,
              })),
            ]}
          />
        </div>
      )}

      <div>
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <SelectField
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />

      <div>
        <InputField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <SelectField
        label="Specialization"
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        options={[
          {
            value: "Weight Training",
            label: "Weight Training",
          },
          {
            value: "Cardio",
            label: "Cardio",
          },
          {
            value: "Yoga",
            label: "Yoga",
          },
          {
            value: "CrossFit",
            label: "CrossFit",
          },
          {
            value: "Bodybuilding",
            label: "Bodybuilding",
          },
        ]}
      />

      <div>
        <InputField
          label="Experience (Years)"
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
        {errors.experience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.experience}
          </p>
        )}
      </div>

      <div>
        <InputField
          label="Salary"
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
        {errors.salary && (
          <p className="text-red-500 text-sm mt-1">
            {errors.salary}
          </p>
        )}
      </div>

      <div>
        <InputField
          label="Hire Date"
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
        />
        {errors.hireDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hireDate}
          </p>
        )}
      </div>

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

      <div className="md:col-span-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
        >
          {initialData
            ? "Update Trainer"
            : "Save Trainer"}
        </Button>
      </div>
    </form>
  );
}

export default TrainerForm;