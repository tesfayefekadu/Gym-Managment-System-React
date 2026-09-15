function PaymentStats({ payments = [] }) {
  // =====================================================
  // TOTAL PAYMENTS
  // =====================================================

  const totalPayments =
    payments.length;

  // =====================================================
  // COMPLETED PAYMENTS
  // =====================================================

  const completedPayments =
    payments.filter(
      (payment) =>
        payment.status === "Completed"
    ).length;

  // =====================================================
  // PENDING PAYMENTS
  // =====================================================

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status === "Pending"
    ).length;

  // =====================================================
  // TOTAL REVENUE
  // =====================================================
  //
  // Only Completed payments are counted as revenue.
  //
  // Pending, Failed, and Refunded payments
  // are not included.
  // =====================================================

  const totalRevenue =
    payments
      .filter(
        (payment) =>
          payment.status === "Completed"
      )
      .reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );

  // =====================================================
  // STATISTICS CARDS
  // =====================================================

  const cards = [
    {
      title: "Total Payments",
      value: totalPayments,
      description:
        "All transactions",
    },

    {
      title: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} ETB`,
      description:
        "Completed transactions",
    },

    {
      title: "Completed",
      value: completedPayments,
      description:
        "Completed payments",
    },

    {
      title: "Pending",
      value: pendingPayments,
      description:
        "Pending payments",
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <p className="text-gray-500 text-sm">
            {card.title}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            {card.value}
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PaymentStats;