import { useEffect, useState } from "react";

import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentStats from "../components/payments/PaymentStats";
import PaymentFilter from "../components/payments/PaymentFilter";
import PaymentTable from "../components/payments/PaymentTable";
import PaymentForm from "../components/payments/PaymentForm";

import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

import usePayments from "../hooks/usePayments";
import { getMembers } from "../services/memberService";
import { getMembershipPlans } from "../services/membershipPlanService";

function Payments() {
  // =====================================================
  // PAYMENTS API
  // =====================================================

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    addPayment,
    updatePayment,
    deletePayment,
  } = usePayments();

  // =====================================================
  // MEMBERS
  // =====================================================

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] =
    useState(true);

  // =====================================================
  // MEMBERSHIP PLANS
  // =====================================================

  const [membershipPlans, setMembershipPlans] =
    useState([]);

  const [plansLoading, setPlansLoading] =
    useState(true);

  // =====================================================
  // PAGE ERROR
  // =====================================================

  const [pageError, setPageError] =
    useState("");

  // =====================================================
  // SEARCH / FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [method, setMethod] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  // =====================================================
  // DELETE
  // =====================================================

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [paymentToDelete, setPaymentToDelete] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =====================================================
  // SAVE LOADING
  // =====================================================

  const [saveLoading, setSaveLoading] =
    useState(false);

  // =====================================================
  // LOAD MEMBERS
  // =====================================================

  const loadMembers = async () => {
    try {
      setMembersLoading(true);
      setPageError("");

      const data = await getMembers();

      setMembers(data || []);
    } catch (error) {
      console.error(
        "Failed to load members:",
        error
      );

      setPageError(
        error.message ||
          "Failed to load members."
      );
    } finally {
      setMembersLoading(false);
    }
  };

  // =====================================================
  // LOAD MEMBERSHIP PLANS
  // =====================================================

 const loadMembershipPlans = async () => {
  try {
    setPlansLoading(true);

    const data = await getMembershipPlans();

    setMembershipPlans(data || []);
  } catch (error) {
    console.error(
      "Failed to load membership plans:",
      error
    );

    setPageError(
      error.message ||
        "Failed to load membership plans."
    );
  } finally {
    setPlansLoading(false);
  }
};

  // =====================================================
  // LOAD PAGE DATA
  // =====================================================

  useEffect(() => {
    loadMembers();
    loadMembershipPlans();
  }, []);

  // =====================================================
  // CONVERT API PAYMENT → UI PAYMENT
  // =====================================================

  const paymentsForUI = payments.map(
    (payment) => {
      // -----------------------------------------------
      // Find the member
      // -----------------------------------------------

      const member = members.find(
        (item) =>
          Number(item.id) ===
          Number(payment.member_id)
      );

      // -----------------------------------------------
      // Determine the member's current plan
      //
      // Payments table does not contain plan_id.
      // Therefore plan information is derived from
      // the member's current membership plan.
      // -----------------------------------------------

      const memberPlanId =
        member?.plan_id ??
        member?.membership_plan_id ??
        "";

      const selectedPlan =
        membershipPlans.find(
          (plan) =>
            Number(plan.id) ===
            Number(memberPlanId)
        );

      return {
        id: payment.id,

        memberId:
          payment.member_id,

        memberName:
          payment.member_name ||
          member?.name ||
          "",

        memberPhone:
          payment.member_phone ||
          member?.phone ||
          "",

        planId:
          selectedPlan?.id ||
          memberPlanId ||
          "",

        plan:
          selectedPlan?.name ||
          member?.membership_plan ||
          "",

        amount:
          Number(payment.amount) || 0,

        paymentDate:
          payment.payment_date || "",

        method:
          payment.payment_method || "",

        status:
          payment.status || "",

        reference:
          payment.reference_number || "",

        notes:
          payment.notes || "",
      };
    }
  );

  // =====================================================
  // ADD PAYMENT
  // =====================================================

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setPageError("");
    setShowModal(true);
  };

  // =====================================================
  // EDIT PAYMENT
  // =====================================================

  const handleEditPayment = (
    payment
  ) => {
    setSelectedPayment(payment);
    setPageError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saveLoading) return;

    setShowModal(false);
    setSelectedPayment(null);
  };

  // =====================================================
  // SAVE PAYMENT
  // CREATE / UPDATE
  // =====================================================

  const handleSavePayment = async (
    paymentData
  ) => {
    try {
      setSaveLoading(true);
      setPageError("");

      // -----------------------------------------------
      // UPDATE
      // -----------------------------------------------

      if (selectedPayment) {
        await updatePayment(
          selectedPayment.id,
          paymentData
        );
      }

      // -----------------------------------------------
      // CREATE
      // -----------------------------------------------

      else {
        await addPayment(paymentData);
      }

      // -----------------------------------------------
      // CLOSE MODAL
      // -----------------------------------------------

      setShowModal(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error(
        "Failed to save payment:",
        error
      );

      setPageError(
        error.message ||
          "Failed to save payment."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  const handleDeletePayment = (id) => {
    const payment =
      paymentsForUI.find(
        (item) =>
          item.id === id
      );

    if (!payment) return;

    setPaymentToDelete(payment);
    setShowDeleteDialog(true);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDeletePayment =
    async () => {
      if (!paymentToDelete) {
        return;
      }

      try {
        setDeleteLoading(true);
        setPageError("");

        await deletePayment(
          paymentToDelete.id
        );

        setPaymentToDelete(null);
        setShowDeleteDialog(false);
      } catch (error) {
        console.error(
          "Failed to delete payment:",
          error
        );

        setPageError(
          error.message ||
            "Failed to delete payment."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  // =====================================================
  // CANCEL DELETE
  // =====================================================

  const cancelDeletePayment = () => {
    if (deleteLoading) return;

    setPaymentToDelete(null);
    setShowDeleteDialog(false);
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    setSearch("");
    setMethod("All");
    setStatus("All");
    setCurrentPage(1);
  };

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments =
    paymentsForUI.filter(
      (payment) => {
        const searchValue =
          search.toLowerCase();

        const memberName =
          payment.memberName
            ?.toLowerCase() || "";

        const memberPhone =
          payment.memberPhone
            ?.toLowerCase() || "";

        const reference =
          payment.reference
            ?.toLowerCase() || "";

        const matchesSearch =
          memberName.includes(
            searchValue
          ) ||
          memberPhone.includes(
            searchValue
          ) ||
          reference.includes(
            searchValue
          );

        const matchesMethod =
          method === "All" ||
          payment.method === method;

        const matchesStatus =
          status === "All" ||
          payment.status === status;

        return (
          matchesSearch &&
          matchesMethod &&
          matchesStatus
        );
      }
    );

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredPayments.length /
        itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedPayments =
    filteredPayments.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (
    page
  ) => {
    setCurrentPage(page);
  };

  // =====================================================
  // LOADING
  // =====================================================

  const pageLoading =
    paymentsLoading ||
    membersLoading ||
    plansLoading;

  if (pageLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600 text-lg">
            Loading payments...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (
    paymentsError &&
    payments.length === 0
  ) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Failed to load payments
          </h2>

          <p className="text-red-600 mt-2">
            {paymentsError}
          </p>

          <button
            onClick={() => {
              window.location.reload();
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <PaymentHeader
        onAddPayment={
          handleAddPayment
        }
      />

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {pageError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-red-700">
            {pageError}
          </p>
        </div>
      )}

      {/* ==========================================
          STATISTICS
      ========================================== */}

      <PaymentStats
        payments={paymentsForUI}
      />

      {/* ==========================================
          FILTER
      ========================================== */}

      <PaymentFilter
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        method={method}
        setMethod={(value) => {
          setMethod(value);
          setCurrentPage(1);
        }}
        status={status}
        setStatus={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        total={
          filteredPayments.length
        }
        onReset={
          handleResetFilters
        }
      />

      {/* ==========================================
          TABLE
      ========================================== */}

      <PaymentTable
        payments={
          paginatedPayments
        }
        onEdit={
          handleEditPayment
        }
        onDelete={
          handleDeletePayment
        }
      />

      {/* ==========================================
          PAGINATION
      ========================================== */}

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onPageChange={
            handlePageChange
          }
        />
      </div>

      {/* ==========================================
          PAYMENT MODAL
      ========================================== */}

      <Modal
        isOpen={showModal}
        title={
          selectedPayment
            ? "Edit Payment"
            : "Add Payment"
        }
        onClose={
          handleCloseModal
        }
      >
        <PaymentForm
          onSave={
            handleSavePayment
          }
          initialData={
            selectedPayment
          }
          members={members}
          membershipPlans={
            membershipPlans
          }
          loading={
            saveLoading
          }
        />
      </Modal>

      {/* ==========================================
          DELETE DIALOG
      ========================================== */}

      <ConfirmDialog
        isOpen={
          showDeleteDialog
        }
        title="Delete Payment"
        message={
          paymentToDelete
            ? `Are you sure you want to delete payment "${paymentToDelete.reference || paymentToDelete.id}" for ${paymentToDelete.memberName}?`
            : ""
        }
        onConfirm={
          confirmDeletePayment
        }
        onCancel={
          cancelDeletePayment
        }
      />

    </div>
  );
}

export default Payments;