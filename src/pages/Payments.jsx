import { useState } from "react";

import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentStats from "../components/payments/PaymentStats";
import PaymentFilter from "../components/payments/PaymentFilter";
import PaymentTable from "../components/payments/PaymentTable";
import PaymentForm from "../components/payments/PaymentForm";

import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

function Payments() {
  // =====================================================
  // MEMBERS
  // =====================================================

  const [members] = useState([
    {
      id: 1,
      name: "Tesfaye",
      phone: "0911223344",
      status: "Active",
    },
    {
      id: 2,
      name: "Abel",
      phone: "0912334455",
      status: "Active",
    },
    {
      id: 3,
      name: "John",
      phone: "0913445566",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael",
      phone: "0914556677",
      status: "Active",
    },
  ]);

  // =====================================================
  // MEMBERSHIP PLANS
  // =====================================================

  const [membershipPlans] =
    useState([
      {
        id: 1,
        name: "Basic",
        price: 1000,
        duration: 30,
        status: "Active",
      },
      {
        id: 2,
        name: "Standard",
        price: 1800,
        duration: 30,
        status: "Active",
      },
      {
        id: 3,
        name: "Premium",
        price: 2500,
        duration: 30,
        status: "Active",
      },
    ]);

  // =====================================================
  // PAYMENTS
  // =====================================================

  const [payments, setPayments] =
    useState([
      {
        id: 1,
        memberId: 1,
        memberName: "Tesfaye",
        planId: 3,
        plan: "Premium",
        amount: 2500,
        paymentDate: "2026-08-14",
        method: "Cash",
        status: "Paid",
        reference: "PAY-001",
      },
      {
        id: 2,
        memberId: 2,
        memberName: "Abel",
        planId: 2,
        plan: "Standard",
        amount: 1800,
        paymentDate: "2026-08-13",
        method: "Bank Transfer",
        status: "Paid",
        reference: "PAY-002",
      },
      {
        id: 3,
        memberId: 3,
        memberName: "John",
        planId: 1,
        plan: "Basic",
        amount: 1000,
        paymentDate: "2026-08-12",
        method: "Mobile Money",
        status: "Pending",
        reference: "PAY-003",
      },
      {
        id: 4,
        memberId: 4,
        memberName: "Michael",
        planId: 3,
        plan: "Premium",
        amount: 2500,
        paymentDate: "2026-08-10",
        method: "Card",
        status: "Paid",
        reference: "PAY-004",
      },
      {
        id: 5,
        memberId: 1,
        memberName: "Tesfaye",
        planId: 2,
        plan: "Standard",
        amount: 1800,
        paymentDate: "2026-08-08",
        method: "Cash",
        status: "Paid",
        reference: "PAY-005",
      },
      {
        id: 6,
        memberId: 2,
        memberName: "Abel",
        planId: 1,
        plan: "Basic",
        amount: 1000,
        paymentDate: "2026-08-05",
        method: "Mobile Money",
        status: "Cancelled",
        reference: "PAY-006",
      },
    ]);

  // =====================================================
  // SEARCH / FILTER STATE
  // =====================================================

  const [search, setSearch] =
    useState("");

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

  // =====================================================
  // ADD PAYMENT
  // =====================================================

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setShowModal(true);
  };

  // =====================================================
  // EDIT PAYMENT
  // =====================================================

  const handleEditPayment = (
    payment
  ) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  // =====================================================
  // SAVE PAYMENT
  // =====================================================

  const handleSavePayment = (
    paymentData
  ) => {
    if (selectedPayment) {
      setPayments((previousPayments) =>
        previousPayments.map(
          (payment) =>
            payment.id ===
            selectedPayment.id
              ? {
                  ...payment,
                  id: selectedPayment.id,
                  ...paymentData,
                }
              : payment
        )
      );
    } else {
      const newPayment = {
        id: Date.now(),
        ...paymentData,
      };

      setPayments((previousPayments) => [
        ...previousPayments,
        newPayment,
      ]);
    }

    handleCloseModal();
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeletePayment = (id) => {
    const payment = payments.find(
      (payment) =>
        payment.id === id
    );

    if (!payment) return;

    setPaymentToDelete(payment);
    setShowDeleteDialog(true);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDeletePayment = () => {
    if (!paymentToDelete) return;

    setPayments((previousPayments) =>
      previousPayments.filter(
        (payment) =>
          payment.id !==
          paymentToDelete.id
      )
    );

    setPaymentToDelete(null);
    setShowDeleteDialog(false);
  };

  // =====================================================
  // CANCEL DELETE
  // =====================================================

  const cancelDeletePayment = () => {
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
    payments.filter((payment) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        payment.memberName
          .toLowerCase()
          .includes(searchValue) ||
        payment.reference
          .toLowerCase()
          .includes(searchValue);

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
    });

  // =====================================================
  // PAGINATION CALCULATION
  // =====================================================

  const totalPages = Math.ceil(
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <PaymentHeader
        onAddPayment={
          handleAddPayment
        }
      />

      {/* =================================================
          STATISTICS
      ================================================= */}

      <PaymentStats
        payments={payments}
      />

      {/* =================================================
          FILTER
      ================================================= */}

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

      {/* =================================================
          TABLE
      ================================================= */}

      <PaymentTable
        payments={paginatedPayments}
        onEdit={handleEditPayment}
        onDelete={handleDeletePayment}
      />

      {/* =================================================
          PAGINATION
      ================================================= */}

      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={
            handlePageChange
          }
        />
      </div>

      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      <Modal
        isOpen={showModal}
        title={
          selectedPayment
            ? "Edit Payment"
            : "Add Payment"
        }
        onClose={handleCloseModal}
      >
        <PaymentForm
          onSave={handleSavePayment}
          initialData={
            selectedPayment
          }
          members={members}
          membershipPlans={
            membershipPlans
          }
        />
      </Modal>

      {/* =================================================
          DELETE DIALOG
      ================================================= */}

      <ConfirmDialog
        isOpen={
          showDeleteDialog
        }
        title="Delete Payment"
        message={
          paymentToDelete
            ? `Are you sure you want to delete payment "${paymentToDelete.reference}" for ${paymentToDelete.memberName}?`
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