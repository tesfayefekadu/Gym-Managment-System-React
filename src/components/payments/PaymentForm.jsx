import { useEffect, useState } from "react";

import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function PaymentForm({
  onSave,
  initialData,
  members,
  membershipPlans,
}) {
  const emptyPayment = {
    memberId: "",
    memberName: "",
    planId: "",
    plan: "",
    amount: "",
    paymentDate: "",
    method: "Cash",
    status: "Paid",
    reference: "",
  };

  const [formData, setFormData] =
    useState(emptyPayment);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        memberId: initialData.memberId || "",
        memberName: initialData.memberName || "",
        planId: initialData.planId || "",
        plan: initialData.plan || "",
        amount: initialData.amount || "",
        paymentDate:
          initialData.paymentDate || "",
        method:
          initialData.method || "Cash",
        status:
          initialData.status || "Paid",
        reference:
          initialData.reference || "",
      });
    } else {
      setFormData(emptyPayment);
    }

    setErrors({});
  }, [initialData]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

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

  // =====================================================
  // MEMBER
  // =====================================================

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

  // =====================================================
  // PLAN
  // =====================================================

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
        selectedPlan?.price || "",
    }));

    setErrors((previous) => ({
      ...previous,
      planId: "",
      amount: "",
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

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

    if (!formData.amount) {
      newErrors.amount =
        "Amount is required.";
    } else if (
      Number(formData.amount) <= 0
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
      formData.reference.length < 3
    ) {
      newErrors.reference =
        "Reference must contain at least 3 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    onSave({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
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

      <div>
        <SelectField
          label="Payment Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            {
              value: "Paid",
              label: "Paid",
            },
            {
              value: "Pending",
              label: "Pending",
            },
            {
              value: "Cancelled",
              label: "Cancelled",
            },
          ]}
        />

        {errors.status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.status}
          </p>
        )}
      </div>

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

      <div className="md:col-span-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
        >
          {initialData
            ? "Update Payment"
            : "Save Payment"}
        </Button>
      </div>
    </form>
  );
}

export default PaymentForm;