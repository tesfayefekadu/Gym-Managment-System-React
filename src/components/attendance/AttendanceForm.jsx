import { useState } from "react";

import Button from "../common/Button";
import SelectField from "../common/SelectField";

function AttendanceForm({
  members = [],
  attendance = [],
  onSave,
  loading = false,
}) {
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // GET LOCAL DATE
  // ========================================

  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ========================================
  // GET LOCAL TIME
  // ========================================

  const getLocalTime = () => {
    const now = new Date();

    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    // ======================================
    // VALIDATE MEMBER
    // ======================================

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    const selectedMember = members.find(
      (member) =>
        String(member.id) ===
        String(memberId)
    );

    if (!selectedMember) {
      setError(
        "Selected member was not found."
      );
      return;
    }

    // ======================================
    // CURRENT DATE & TIME
    // ======================================

    const date = getLocalDate();
    const time = getLocalTime();

    // ======================================
    // DUPLICATE CHECK-IN
    // ======================================

    const alreadyCheckedIn =
      attendance.some((record) => {
        const recordMemberId =
          record.member_id ??
          record.memberId;

        const recordDate =
          record.attendance_date ??
          record.date;

        const recordCheckIn =
          record.check_in ??
          record.checkIn;

        return (
          String(recordMemberId) ===
            String(selectedMember.id) &&
          recordDate === date &&
          recordCheckIn
        );
      });

    if (alreadyCheckedIn) {
      setError(
        `${selectedMember.name} has already checked in today.`
      );

      return;
    }

    // ======================================
    // CREATE ATTENDANCE DATA
    // ======================================

    const attendanceData = {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      date,
      checkIn: time,
      checkOut: "",
      status: "Present",
    };

    // ======================================
    // SEND TO PARENT
    // ======================================

    onSave(attendanceData);
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <SelectField
        label="Select Member"
        name="memberId"
        value={memberId}
        onChange={(e) => {
          setMemberId(e.target.value);
          setError("");
        }}
        options={[
          {
            value: "",
            label: "Select Member",
          },

          ...members
            .filter(
              (member) =>
                member.status === "Active"
            )
            .map((member) => ({
              value: member.id,
              label: `${member.name} - ${member.phone}`,
            })),
        ]}
      />

      {/* ==================================
          ERROR
      ================================== */}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* ==================================
          ACTION
      ================================== */}

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading
            ? "Checking In..."
            : "Confirm Check In"}
        </Button>
      </div>
    </form>
  );
}

export default AttendanceForm;