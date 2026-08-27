import { useState } from "react";

import Button from "../common/Button";
import SelectField from "../common/SelectField";

function AttendanceForm({
  members,
  attendance,
  onSave,
}) {
  const [memberId, setMemberId] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // ==========================
    // Validate Member
    // ==========================

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    const selectedMember =
      members.find(
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

    // ==========================
    // Current Date & Time
    // ==========================

    const now = new Date();

    const date =
      now.toISOString().split("T")[0];

    const time =
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    // ==========================
    // Duplicate Check-In
    // ==========================

    const alreadyCheckedIn =
      attendance.some(
        (record) =>
          record.memberId ===
            selectedMember.id &&
          record.date === date &&
          record.checkIn
      );

    if (alreadyCheckedIn) {
      setError(
        `${selectedMember.name} has already checked in today.`
      );

      return;
    }

    // ==========================
    // Create Attendance
    // ==========================

    const attendanceData = {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      date,
      checkIn: time,
      checkOut: "",
      status: "Present",
    };

    onSave(attendanceData);
  };

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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
        >
          Confirm Check In
        </Button>
      </div>
    </form>
  );
}

export default AttendanceForm;