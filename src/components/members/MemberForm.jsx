import { useEffect, useState } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function MemberForm({
  onSave,
  initialData,
  members = [],
}) {
  // =====================================================
  // EMPTY FORM
  // =====================================================

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


  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] =
    useState(emptyMember);


  // =====================================================
  // ERROR STATE
  // =====================================================

  const [errors, setErrors] =
    useState({});


  // =====================================================
  // SUBMITTING STATE
  // =====================================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // =====================================================
  // POPULATE FORM FOR EDIT
  // =====================================================

  useEffect(() => {

    if (initialData) {

      setFormData({
        name:
          initialData.name || "",

        gender:
          initialData.gender || "Male",

        phone:
          initialData.phone || "",

        email:
          initialData.email || "",

        date_of_birth:
          initialData.date_of_birth || "",

        plan_id:
          initialData.plan_id !== null &&
          initialData.plan_id !== undefined
            ? String(initialData.plan_id)
            : "",

        status:
          initialData.status || "Active",

        join_date:
          initialData.join_date || "",
      });

    } else {

      setFormData({
        ...emptyMember,
      });

    }

    setErrors({});

  }, [initialData]);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    // Clear only the changed field error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

  };


  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {

    const newErrors = {};


    // ===================================================
    // NAME
    // ===================================================

    const name =
      formData.name.trim();


    if (!name) {

      newErrors.name =
        "Member name is required";

    } else if (
      name.length < 2
    ) {

      newErrors.name =
        "Member name must contain at least 2 characters";

    }


    // ===================================================
    // GENDER
    // ===================================================

    if (
      !["Male", "Female"].includes(
        formData.gender
      )
    ) {

      newErrors.gender =
        "Please select a valid gender";

    }


    // ===================================================
    // PHONE
    // ===================================================

    const phone =
      formData.phone.trim();


    if (!phone) {

      newErrors.phone =
        "Phone number is required";

    } else if (
      !/^[0-9]{10}$/.test(phone)
    ) {

      newErrors.phone =
        "Phone number must contain exactly 10 digits";

    }


    // ===================================================
    // EMAIL
    // ===================================================

    const email =
      formData.email.trim();


    if (email) {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailRegex.test(email)
      ) {

        newErrors.email =
          "Enter a valid email address";

      }

    }


    // ===================================================
    // DATE OF BIRTH
    // ===================================================

    if (
      formData.date_of_birth
    ) {

      const dateOfBirth =
        new Date(
          formData.date_of_birth
        );


      if (
        isNaN(
          dateOfBirth.getTime()
        )
      ) {

        newErrors.date_of_birth =
          "Enter a valid date of birth";

      } else if (
        dateOfBirth > new Date()
      ) {

        newErrors.date_of_birth =
          "Date of birth cannot be in the future";

      }

    }


    // ===================================================
    // MEMBERSHIP PLAN
    // ===================================================

    if (!formData.plan_id) {

      newErrors.plan_id =
        "Membership plan is required";

    } else if (
      Number.isNaN(
        Number(formData.plan_id)
      )
    ) {

      newErrors.plan_id =
        "Please select a valid membership plan";

    }


    // ===================================================
    // STATUS
    // ===================================================

    if (
      ![
        "Active",
        "Inactive",
        "Expired",
      ].includes(
        formData.status
      )
    ) {

      newErrors.status =
        "Please select a valid status";

    }


    // ===================================================
    // JOIN DATE
    // ===================================================

    if (!formData.join_date) {

      newErrors.join_date =
        "Join date is required";

    } else {

      const joinDate =
        new Date(
          formData.join_date
        );


      if (
        isNaN(
          joinDate.getTime()
        )
      ) {

        newErrors.join_date =
          "Enter a valid join date";

      }

    }


    // ===================================================
    // DATE RELATIONSHIP
    // ===================================================

    if (
      formData.date_of_birth &&
      formData.join_date
    ) {

      const dateOfBirth =
        new Date(
          formData.date_of_birth
        );

      const joinDate =
        new Date(
          formData.join_date
        );


      if (
        dateOfBirth > joinDate
      ) {

        newErrors.date_of_birth =
          "Date of birth cannot be after join date";

      }

    }


    // ===================================================
    // DUPLICATE PHONE
    // ===================================================

    const duplicatePhone =
      members.some((member) => {

        // Don't compare member with itself
        if (
          initialData &&
          member.id === initialData.id
        ) {
          return false;
        }


        return (
          member.phone?.trim() === phone
        );

      });


    if (
      phone &&
      duplicatePhone
    ) {

      newErrors.phone =
        "Another member already uses this phone number";

    }


    // ===================================================
    // DUPLICATE EMAIL
    // =====================================================

    if (email) {

      const duplicateEmail =
        members.some((member) => {

          // Don't compare member with itself
          if (
            initialData &&
            member.id === initialData.id
          ) {
            return false;
          }


          return (
            member.email &&
            member.email
              .trim()
              .toLowerCase() ===
              email.toLowerCase()
          );

        });


      if (
        duplicateEmail
      ) {

        newErrors.email =
          "Another member already uses this email";

      }

    }


    // ===================================================
    // SET ERRORS
    // ===================================================

    setErrors(newErrors);


    return (
      Object.keys(
        newErrors
      ).length === 0
    );

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // Stop if validation fails
    if (!validateForm()) {
      return;
    }


    try {

      setIsSubmitting(true);


      // =================================================
      // PREPARE DATA FOR BACKEND
      // =================================================

      const memberData = {

        name:
          formData.name.trim(),

        gender:
          formData.gender,

        phone:
          formData.phone.trim(),

        email:
          formData.email.trim() ||
          null,

        date_of_birth:
          formData.date_of_birth ||
          null,

        plan_id:
          Number(
            formData.plan_id
          ),

        status:
          formData.status,

        join_date:
          formData.join_date,

      };


      console.log(
        "Submitting member:",
        memberData
      );


      // =================================================
      // SAVE
      // =================================================

      await onSave(
        memberData
      );


    } catch (error) {

      console.error(
        "Member form error:",
        error
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >

      {/* =================================================
          NAME
          ================================================= */}

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


      {/* =================================================
          GENDER
          ================================================= */}

      <div>

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

        {errors.gender && (
          <p className="mt-1 text-sm text-red-500">
            {errors.gender}
          </p>
        )}

      </div>


      {/* =================================================
          PHONE
          ================================================= */}

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


      {/* =================================================
          EMAIL
          ================================================= */}

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


      {/* =================================================
          DATE OF BIRTH
          ================================================= */}

      <div>

        <InputField
          label="Date of Birth"
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        {errors.date_of_birth && (
          <p className="mt-1 text-sm text-red-500">
            {errors.date_of_birth}
          </p>
        )}

      </div>


      {/* =================================================
          MEMBERSHIP PLAN
          ================================================= */}

      <div>

        <SelectField
          label="Membership Plan"
          name="plan_id"
          value={formData.plan_id}
          onChange={handleChange}
          options={[
            {
              value: "",
              label:
                "Select Membership Plan",
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


      {/* =================================================
          STATUS
          ================================================= */}

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
            {
              value: "Expired",
              label: "Expired",
            },
          ]}
        />

        {errors.status && (
          <p className="mt-1 text-sm text-red-500">
            {errors.status}
          </p>
        )}

      </div>


      {/* =================================================
          JOIN DATE
          ================================================= */}

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


      {/* =================================================
          SUBMIT BUTTON
          ================================================= */}

      <div className="flex justify-end md:col-span-2">

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >

          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Member"
              : "Save Member"}

        </Button>

      </div>

    </form>
  );
}

export default MemberForm;