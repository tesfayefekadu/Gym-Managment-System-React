import Table from "../common/Table";
import PaymentRow from "./PaymentRow";

function PaymentTable({
  payments,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "member",
      label: "Member",
    },
    {
      key: "plan",
      label: "Plan",
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "paymentDate",
      label: "Payment Date",
    },
    {
      key: "method",
      label: "Method",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  return (
    <Table
      columns={columns}
      data={payments}
      renderRow={(payment) => (
        <PaymentRow
          key={payment.id}
          payment={payment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}

export default PaymentTable;