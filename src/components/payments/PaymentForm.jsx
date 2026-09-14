import { useEffect, useState } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function PaymentForm({
  onSave,
  initialData,
  members = [],
  membershipPlans = [],
  loading = false,
}) {
  const emptyPayment = {
    memberId: "",
    memberName: "",
    planId: "",
    plan: "",
    amount: "",
    paymentDate: "",
    method: "Cash",
    status: "Completed",
    reference: "",
    notes: "",
  };

  const [formData, setFormData] =
    useState(emptyPayment);

  const [errors, setErrors] = useState({});

  // ========================================
  // LOAD INITIAL DATA
  // ========================================

  useEffect(() => {
    if (initialData) {
      setFormData({
        memberId:
          initialData.member_id ??
          initialData.memberId ??
          "",

        memberName:
          initialData.member_name ??
          initialData.memberName ??
          "",

        planId:
          initialData.plan_id ??
          initialData.planId ??
          "",

        plan:
          initialData.plan ??
          "",

        amount:
          initialData.amount ?? "",

        paymentDate:
          initialData.payment_date ??
          initialData.paymentDate ??
          "",

        method:
          initialData.payment_method ??
          initialData.method ??
          "Cash",

        status:
          initialData.status === "Paid"
            ? "Completed"
            : initialData.status ||
              "Completed",

        reference:
          initialData.reference_number ??
          initialData.reference ??
          "",

        notes:
          initialData.notes ??
          "",
      });
    } else {
      setFormData(emptyPayment);
    }

    setErrors({});
  }, [initialData]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ========================================
  // MEMBER CHANGE
  // ========================================

  const handleMemberChange = (e) => {
    const memberId = e.target.value;

    const selectedMember = members.find(
      (member) =>
        String(member.id) ===
        String(memberId)
    );

    setFormData((previous) => ({
      ...previous,
      memberId,
      memberName:
        selectedMember?.name || "",
    }));

    setErrors((previous) => ({
      ...previous,
      memberId: "",
    }));
  };

  // ========================================
  // PLAN CHANGE
  // ========================================

  const handlePlanChange = (e) => {
    const planId = e.target.value;

    const selectedPlan =
      membershipPlans.find(
        (plan) =>
          String(plan.id) ===
          String(planId)
      );

    setFormData((previous) => ({
      ...previous,
      planId,
      plan:
        selectedPlan?.name || "",
      amount:
        selectedPlan?.price ?? "",
    }));

    setErrors((previous) => ({
      ...previous,
      planId: "",
      amount: "",
    }));
  };

  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.memberId) {
      newErrors.memberId =
        "Please select a member.";
    }

    if (!formData.planId) {
      newErrors.planId =
        "Please select a membership plan.";
    }

    const amount = Number(
      formData.amount
    );

    if (
      formData.amount === "" ||
      formData.amount === null
    ) {
      newErrors.amount =
        "Amount is required.";
    } else if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      newErrors.amount =
        "Amount must be greater than 0.";
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate =
        "Payment date is required.";
    }

    if (!formData.method) {
      newErrors.method =
        "Please select a payment method.";
    }

    if (!formData.status) {
      newErrors.status =
        "Please select payment status.";
    }

    if (
      formData.reference &&
      formData.reference.trim().length < 3
    ) {
      newErrors.reference =
        "Reference must contain at least 3 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) {
      return;
    }

    // ======================================
    // API DATA
    // ======================================

    const paymentData = {
      member_id: Number(formData.memberId),

      amount: Number(formData.amount),

      payment_date:
        formData.paymentDate,

      payment_method:
        formData.method,

      status:
        formData.status,

      reference_number:
        formData.reference.trim() || null,

      notes:
        formData.notes.trim() || null,
    };

    onSave(paymentData);
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {/* ==================================
          MEMBER
      ================================== */}

      <div>
        <SelectField
          label="Member"
          name="memberId"
          value={formData.memberId}
          onChange={handleMemberChange}
          options={[
            {
              value: "",
              label: "Select Member",
            },

            ...members.map((member) => ({
              value: member.id,
              label: `${member.name} - ${member.phone}`,
            })),
          ]}
        />

        {errors.memberId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.memberId}
          </p>
        )}
      </div>

      {/* ==================================
          MEMBERSHIP PLAN
      ================================== */}

      <div>
        <SelectField
          label="Membership Plan"
          name="planId"
          value={formData.planId}
          onChange={handlePlanChange}
          options={[
            {
              value: "",
              label:
                "Select Membership Plan",
            },

            ...membershipPlans.map(
              (plan) => ({
                value: plan.id,
                label: `${plan.name} - ${Number(
                  plan.price
                ).toLocaleString()} ETB`,
              })
            ),
          ]}
        />

        {errors.planId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.planId}
          </p>
        )}
      </div>

      {/* ==================================
          AMOUNT
      ================================== */}

      <div>
        <InputField
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.amount}
          </p>
        )}
      </div>

      {/* ==================================
          PAYMENT DATE
      ================================== */}

      <div>
        <InputField
          label="Payment Date"
          type="date"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          required
        />

        {errors.paymentDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.paymentDate}
          </p>
        )}
      </div>

      {/* ==================================
          PAYMENT METHOD
      ================================== */}

      <div>
        <SelectField
          label="Payment Method"
          name="method"
          value={formData.method}
          onChange={handleChange}
          options={[
            {
              value: "Cash",
              label: "Cash",
            },
            {
              value: "Bank Transfer",
              label: "Bank Transfer",
            },
            {
              value: "Mobile Money",
              label: "Mobile Money",
            },
            {
              value: "Card",
              label: "Card",
            },
          ]}
        />

        {errors.method && (
          <p className="text-red-500 text-sm mt-1">
            {errors.method}
          </p>
        )}
      </div>

      {/* ==================================
          STATUS
      ================================== */}

      <div>
        <SelectField
          label="Payment Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            {
              value: "Completed",
              label: "Completed",
            },
            {
              value: "Pending",
              label: "Pending",
            },
            {
              value: "Failed",
              label: "Failed",
            },
            {
              value: "Refunded",
              label: "Refunded",
            },
          ]}
        />

        {errors.status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.status}
          </p>
        )}
      </div>

      {/* ==================================
          REFERENCE
      ================================== */}

      <div>
        <InputField
          label="Reference Number"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          placeholder="Optional"
        />

        {errors.reference && (
          <p className="text-red-500 text-sm mt-1">
            {errors.reference}
          </p>
        )}
      </div>

      {/* ==================================
          NOTES
      ================================== */}

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Optional notes..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ==================================
          SAVE
      ================================== */}

      <div className="md:col-span-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Payment"
            : "Save Payment"}
        </Button>
      </div>
    </form>
  );
}

export default PaymentForm;